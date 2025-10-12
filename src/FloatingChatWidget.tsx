import React, { useState, useRef, useEffect, FormEvent } from 'react';
import './styles.css';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
  id: string;
}

export interface FloatingChatWidgetProps {
  apiUrl: string;
  position?: 'bottom-left' | 'bottom-right';
  themeColor?: string;
  bubbleIcon?: React.ReactNode;
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
  zIndex?: number;
  width?: number;
  height?: number;
  fontFamily?: string;
  debug?: boolean;
  sessionId?: string;
  onUserRequest?: (text: string) => void;
}

const DEFAULT_CONFIG: Required<Omit<FloatingChatWidgetProps, 'apiUrl' | 'onUserRequest'>> & {
  apiUrl: string;
} = {
  apiUrl: '{{your_n8n_api}}',
  position: 'bottom-right',
  themeColor: '#FF69B4',
  bubbleIcon: '😺',
  title: 'AI Chat',
  placeholder: 'Type your message...',
  welcomeMessage: 'Hi! How can I help you today?',
  zIndex: 9999,
  width: 350,
  height: 500,
  fontFamily: 'inherit',
  debug: false,
  sessionId: '',
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
 * - Streaming text effect
 */
export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = (props) => {
  const config = { ...DEFAULT_CONFIG, ...props };

  // Generate session ID if not provided
  const [sessionId] = useState(() =>
    config.sessionId || `fcw-${Math.random().toString(36).slice(2)}${Date.now()}`
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const log = (...args: any[]) => {
    if (config.debug) {
      console.log('[FloatingChatWidget]', ...args);
    }
  };

  // Add welcome message on mount
  useEffect(() => {
    if (config.welcomeMessage) {
      addMessage('bot', config.welcomeMessage);
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    const newMessage: Message = {
      sender,
      text,
      id: `msg-${Date.now()}-${Math.random()}`,
    };
    setMessages((prev) => [...prev, newMessage]);
    log('Message added:', sender, text);
  };

  const formatMarkdown = (text: string): string => {
    let html = text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.+?)\*/g, '<i>$1</i>')
      .replace(/\- (.+)/g, '<li>$1</li>');

    // Wrap list items in ul
    if (/<li>/.test(html)) {
      html = '<ul>' + html + '</ul>';
    }
    return html;
  };

  const sendToApi = async (text: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });

      const data = await response.json();
      setIsLoading(false);

      let reply = '';
      if (data?.reply) {
        reply = data.reply;
      } else if (data?.output) {
        reply = data.output;
      }

      if (reply) {
        addMessage('bot', reply);
      } else {
        log('API raw response:', data);
        addMessage('bot', 'Sorry, I did not understand that.');
      }
    } catch (err) {
      setIsLoading(false);
      log('API error:', err);
      addMessage('bot', 'Error connecting to AI agent.');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    addMessage('user', text);
    setInputValue('');

    if (props.onUserRequest) {
      props.onUserRequest(text);
    } else {
      sendToApi(text);
    }
  };

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
    log('Widget toggled:', !isOpen);
  };

  const positionClass = config.position === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={toggleWidget}
        className={`fcw-chat-bubble ${positionClass}`}
        style={{
          zIndex: config.zIndex,
          backgroundColor: config.themeColor,
        }}
        aria-label="Toggle chat"
      >
        {typeof config.bubbleIcon === 'string' ? (
          <span className="flex items-center justify-center text-lg w-6 h-6 leading-none">
            {config.bubbleIcon}
          </span>
        ) : (
          config.bubbleIcon
        )}
      </button>

      {/* Chat widget */}
      <div
        className={`fcw-chat-widget ${positionClass} ${isOpen ? 'fcw-open' : 'fcw-closed'}`}
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
          style={{ backgroundColor: config.themeColor }}
        >
          {config.title}
        </div>

        {/* Messages */}
        <div className="fcw-chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`fcw-message ${msg.sender === 'user' ? 'fcw-message-user' : 'fcw-message-bot'}`}
            >
              <div
                className={`fcw-message-bubble ${
                  msg.sender === 'user' ? 'fcw-message-bubble-user' : 'fcw-message-bubble-bot'
                }`}
                style={msg.sender === 'user' ? { backgroundColor: config.themeColor } : undefined}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
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
            style={{ color: config.themeColor }}
            aria-label="Send message"
          >
            ➤
          </button>
        </form>
      </div>
    </>
  );
};

export default FloatingChatWidget;
