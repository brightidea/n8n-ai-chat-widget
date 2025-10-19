import React, { useState, useRef, useEffect, FormEvent } from "react";
// @ts-ignore
import "./styles.css";
// @ts-ignore
import SendIcon from "./send-icon.svg";

export interface Message {
  sender: "user" | "bot";
  text: string;
  id: string;
  isStreaming?: boolean;
}

export interface FloatingChatWidgetProps {
  apiUrl: string;
  position?: "bottom-left" | "bottom-right";
  cleanTheme?: boolean;
  themeColor?: string;
  bubbleIcon?: string | React.ReactNode; // Can be emoji string, image URL, or React element
  title?: string;
  titleIcon?: string; // Image URL or emoji to display alongside the title
  placeholder?: string;
  welcomeMessage?: string;
  zIndex?: number;
  width?: number;
  height?: number;
  fontFamily?: string;
  debug?: boolean;
  sessionId?: string;
  onUserRequest?: (text: string) => void;
  streaming?: boolean; // Enable SSE streaming responses
}

const DEFAULT_CONFIG: Required<
  Omit<FloatingChatWidgetProps, "apiUrl" | "onUserRequest" | "titleIcon">
> & {
  apiUrl: string;
  titleIcon?: string;
} = {
  apiUrl: "{{your_n8n_api}}",
  position: "bottom-right",
  cleanTheme: false,
  themeColor: "#FF6B35",
  bubbleIcon: "😺",
  title: "",
  titleIcon: undefined,
  placeholder: "Type your message...",
  welcomeMessage: "Hi! How can I help you today?",
  zIndex: 9999,
  width: 350,
  height: 500,
  fontFamily: "inherit",
  debug: false,
  sessionId: "",
  streaming: false,
};

/**
 * FloatingChatWidget - A lightweight, customizable React chat widget component.
 *
 * Features:
 * - Responsive design
 * - Smooth animations
 * - Easily customizable
 * - Connects to n8n AI agent API
 * - Markdown support
 * - SSE streaming support for real-time responses
 * - Streaming text cursor animation
 */
export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = (
  props
) => {
  const config = { ...DEFAULT_CONFIG, ...props };

  // Generate session ID if not provided
  const [sessionId] = useState(
    () =>
      config.sessionId ||
      `fcw-${Math.random().toString(36).slice(2)}${Date.now()}`
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const log = (...args: any[]) => {
    if (config.debug) {
      console.log("[FloatingChatWidget]", ...args);
    }
  };

  // Add welcome message on mount
  useEffect(() => {
    if (config.welcomeMessage) {
      addMessage("bot", config.welcomeMessage);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (
    sender: "user" | "bot",
    text: string,
    id?: string,
    isStreaming?: boolean
  ) => {
    const newMessage: Message = {
      sender,
      text,
      id: id || `msg-${Date.now()}-${Math.random()}`,
      isStreaming,
    };
    setMessages((prev) => [...prev, newMessage]);
    log("Message added:", sender, text);
    return newMessage.id;
  };

  const updateMessage = (id: string, text: string, isStreaming?: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, text, isStreaming } : msg))
    );
  };

  const formatMarkdown = (text: string): string => {
    let html = text
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.+?)\*/g, "<i>$1</i>")
      .replace(/\- (.+)/g, "<li>$1</li>");

    // Wrap list items in ul
    if (/<li>/.test(html)) {
      html = "<ul>" + html + "</ul>";
    }
    return html;
  };

  const sendToApiStreaming = async (text: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, chatInput: text, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body reader available");
      }

      let messageId: string | null = null;
      let accumulatedText = "";
      let buffer = "";
      let hasStartedStreaming = false;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          log("Stream complete");
          if (messageId) {
            // Mark streaming as complete
            updateMessage(messageId, accumulatedText, false);
          }
          setIsLoading(false);
          break;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Split by newlines to get individual JSON objects
        const lines = buffer.split("\n");

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          try {
            const parsed = JSON.parse(trimmedLine);

            // Handle n8n streaming format
            if (parsed.type === "item" && parsed.content) {
              // First content chunk - create message and hide loading
              if (!hasStartedStreaming) {
                setIsLoading(false);
                messageId = addMessage("bot", "", undefined, true);
                hasStartedStreaming = true;
              }

              accumulatedText += parsed.content;
              if (messageId) {
                updateMessage(messageId, accumulatedText, true);
              }
              log("Streamed chunk:", parsed.content);
            } else if (parsed.type === "begin") {
              log("Stream begin");
            } else if (parsed.type === "end") {
              log("Stream end");
              if (messageId) {
                // Mark streaming as complete
                updateMessage(messageId, accumulatedText, false);
              }
            }
          } catch (e) {
            log("Failed to parse streaming JSON:", trimmedLine, e);
          }
        }
      }

      if (!accumulatedText) {
        setIsLoading(false);
        addMessage("bot", "Sorry, I did not understand that.");
      }
    } catch (err) {
      setIsLoading(false);
      log("API streaming error:", err);
      addMessage("bot", "Error connecting to AI agent.");
    }
  };

  const sendToApi = async (text: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, chatInput: text, sessionId }),
      });

      const data = await response.json();
      setIsLoading(false);

      let reply = "";
      if (data?.reply) {
        reply = data.reply;
      } else if (data?.output) {
        reply = data.output;
      }

      if (reply) {
        addMessage("bot", reply);
      } else {
        log("API raw response:", data);
        addMessage("bot", "Sorry, I did not understand that.");
      }
    } catch (err) {
      setIsLoading(false);
      log("API error:", err);
      addMessage("bot", "Error connecting to AI agent.");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    addMessage("user", text);
    setInputValue("");

    if (props.onUserRequest) {
      props.onUserRequest(text);
    } else {
      // Use streaming or regular API based on config
      if (config.streaming) {
        sendToApiStreaming(text);
      } else {
        sendToApi(text);
      }
    }
  };

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
    log("Widget toggled:", !isOpen);
  };

  const positionClass =
    config.position === "bottom-left" ? "left-6" : "right-6";

  // Helper to check if string is an image URL
  const isImageUrl = (str: string): boolean => {
    return (
      /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(str) ||
      str.startsWith("data:image/") ||
      str.startsWith("http")
    );
  };

  // Render bubble icon based on type
  const renderBubbleIcon = () => {
    if (typeof config.bubbleIcon === "string") {
      // Check if it's an image URL
      if (isImageUrl(config.bubbleIcon)) {
        return (
          <img
            src={config.bubbleIcon}
            alt="Chat"
            className="fcw-bubble-icon-img"
          />
        );
      }
      // Otherwise treat as emoji or text
      return (
        <span className="flex items-center justify-center text-lg w-6 h-6 leading-none">
          {config.bubbleIcon}
        </span>
      );
    }
    // React node (custom component)
    return config.bubbleIcon;
  };

  // Render title icon based on type
  const renderTitleIcon = () => {
    if (!config.titleIcon) return null;

    // Check if it's an image URL
    if (isImageUrl(config.titleIcon)) {
      return (
        <img
          src={config.titleIcon}
          alt={config.title}
          className="fcw-title-icon-img"
        />
      );
    }
    // Otherwise treat as emoji or text
    return <span className="fcw-title-icon-emoji">{config.titleIcon}</span>;
  };

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={toggleWidget}
        className={`fcw-chat-bubble ${positionClass}`}
        style={{
          zIndex: config.zIndex,
          backgroundColor: config.cleanTheme
            ? "transparent"
            : config.themeColor,
        }}
        aria-label="Toggle chat"
      >
        {renderBubbleIcon()}
      </button>

      {/* Chat widget */}
      <div
        className={`fcw-chat-widget ${positionClass} ${
          isOpen ? "fcw-open" : "fcw-closed"
        }`}
        style={{
          zIndex: config.zIndex,
          width: config.width,
          height: config.height,
          fontFamily: config.fontFamily,
        }}
      >
        {/* Header */}
        <div
          className="fcw-chat-header"
          style={{
            backgroundColor: config.cleanTheme ? "inherit" : config.themeColor,
          }}
        >
          <div className="fcw-header-content">
            {renderTitleIcon()}
            {/* <span className="fcw-header-title">{config.title}</span> */}
          </div>
        </div>

        {/* Messages */}
        <div className="fcw-chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`fcw-message ${
                msg.sender === "user" ? "fcw-message-user" : "fcw-message-bot"
              }`}
            >
              <div
                className={`fcw-message-bubble ${
                  msg.sender === "user"
                    ? "fcw-message-bubble-user"
                    : "fcw-message-bubble-bot"
                }${msg.isStreaming ? " fcw-streaming" : ""}`}
                style={
                  msg.sender === "user" && !config.cleanTheme
                    ? { backgroundColor: config.themeColor }
                    : undefined
                }
                dangerouslySetInnerHTML={{
                  __html:
                    formatMarkdown(msg.text) +
                    (msg.isStreaming
                      ? '<span class="fcw-cursor">|</span>'
                      : ""),
                }}
              />
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="fcw-message fcw-message-bot">
              <div className="fcw-message-bubble fcw-message-bubble-bot">
                <span className="fcw-loading">●●●</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="fcw-chat-input-form">
          <input
            ref={inputRef}
            type="text"
            placeholder={config.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="fcw-chat-input"
            style={{ fontFamily: config.fontFamily }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="fcw-chat-send-btn"
            aria-label="Send message"
          >
            <SendIcon className="fcw-send-icon" />
          </button>
        </form>
      </div>
    </>
  );
};

export default FloatingChatWidget;
