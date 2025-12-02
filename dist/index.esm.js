import * as React from 'react';
import React__default, { useState, useRef, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var SvgSendIcon = function SvgSendIcon(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    fill: "none"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M13.291 1.568c.33-.136.697-.039.948.174a.9.9 0 0 1 .193.967l-4.95 12.374a.7.7 0 0 1-.174.29.87.87 0 0 1-.676.251c-.348 0-.677-.251-.793-.6L6.195 9.786.975 8.161a.92.92 0 0 1-.619-.812c-.019-.251.097-.483.271-.657a.7.7 0 0 1 .29-.174zM2.541 7.29l3.983 1.237 4.757-4.756zm4.911 2.165L8.71 13.46l3.5-8.759z"
  })));
};

const DEFAULT_CONFIG = {
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
const FloatingChatWidget = (props) => {
    const config = Object.assign(Object.assign({}, DEFAULT_CONFIG), props);
    // Generate session ID if not provided
    const [sessionId] = useState(() => config.sessionId ||
        `fcw-${Math.random().toString(36).slice(2)}${Date.now()}`);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const log = (...args) => {
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
            setTimeout(() => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 350);
        }
    }, [isOpen]);
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    };
    const addMessage = (sender, text, id, isStreaming) => {
        const newMessage = {
            sender,
            text,
            id: `msg-${Date.now()}-${Math.random()}`,
            isStreaming,
        };
        setMessages((prev) => [...prev, newMessage]);
        log("Message added:", sender, text);
        return newMessage.id;
    };
    const updateMessage = (id, text, isStreaming) => {
        setMessages((prev) => prev.map((msg) => (msg.id === id ? Object.assign(Object.assign({}, msg), { text, isStreaming }) : msg)));
    };
    const formatMarkdown = (text) => {
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
    const sendToApiStreaming = (text) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        setIsLoading(true);
        try {
            const response = yield fetch(config.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, chatInput: text, sessionId }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
            const decoder = new TextDecoder();
            if (!reader) {
                throw new Error("No response body reader available");
            }
            let messageId = null;
            let accumulatedText = "";
            let buffer = "";
            let hasStartedStreaming = false;
            while (true) {
                const { done, value } = yield reader.read();
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
                    if (!trimmedLine)
                        continue;
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
                        }
                        else if (parsed.type === "begin") {
                            log("Stream begin");
                        }
                        else if (parsed.type === "end") {
                            log("Stream end");
                            if (messageId) {
                                // Mark streaming as complete
                                updateMessage(messageId, accumulatedText, false);
                            }
                        }
                    }
                    catch (e) {
                        log("Failed to parse streaming JSON:", trimmedLine, e);
                    }
                }
            }
            if (!accumulatedText) {
                setIsLoading(false);
                addMessage("bot", "Sorry, I did not understand that.");
            }
        }
        catch (err) {
            setIsLoading(false);
            log("API streaming error:", err);
            addMessage("bot", "Error connecting to AI agent.");
        }
    });
    const sendToApi = (text) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            const response = yield fetch(config.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, chatInput: text, sessionId }),
            });
            const data = yield response.json();
            setIsLoading(false);
            let reply = "";
            if (data === null || data === void 0 ? void 0 : data.reply) {
                reply = data.reply;
            }
            else if (data === null || data === void 0 ? void 0 : data.output) {
                reply = data.output;
            }
            if (reply) {
                addMessage("bot", reply);
            }
            else {
                log("API raw response:", data);
                addMessage("bot", "Sorry, I did not understand that.");
            }
        }
        catch (err) {
            setIsLoading(false);
            log("API error:", err);
            addMessage("bot", "Error connecting to AI agent.");
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text)
            return;
        addMessage("user", text);
        setInputValue("");
        if (props.onUserRequest) {
            props.onUserRequest(text);
        }
        else {
            // Use streaming or regular API based on config
            if (config.streaming) {
                sendToApiStreaming(text);
            }
            else {
                sendToApi(text);
            }
        }
    };
    const toggleWidget = () => {
        setIsOpen((prev) => !prev);
        log("Widget toggled:", !isOpen);
    };
    const positionClass = config.position === "bottom-left" ? "left-6" : "right-6";
    // Helper to check if string is an image URL
    const isImageUrl = (str) => {
        return (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(str) ||
            str.startsWith("data:image/") ||
            str.startsWith("http"));
    };
    // Render bubble icon based on type
    const renderBubbleIcon = () => {
        if (typeof config.bubbleIcon === "string") {
            // Check if it's an image URL
            if (isImageUrl(config.bubbleIcon)) {
                return (React__default.createElement("img", { src: config.bubbleIcon, alt: "Chat", className: "fcw-bubble-icon-img" }));
            }
            // Otherwise treat as emoji or text
            return (React__default.createElement("span", { className: "flex items-center justify-center text-lg w-6 h-6 leading-none" }, config.bubbleIcon));
        }
        // React node (custom component)
        return config.bubbleIcon;
    };
    // Render title icon based on type
    const renderTitleIcon = () => {
        if (!config.titleIcon)
            return null;
        // Check if it's an image URL
        if (isImageUrl(config.titleIcon)) {
            return (React__default.createElement("img", { src: config.titleIcon, alt: config.title, className: "fcw-title-icon-img" }));
        }
        // Otherwise treat as emoji or text
        return React__default.createElement("span", { className: "fcw-title-icon-emoji" }, config.titleIcon);
    };
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("button", { onClick: toggleWidget, className: `fcw-chat-bubble ${positionClass}`, style: {
                zIndex: config.zIndex,
                backgroundColor: config.cleanTheme
                    ? "transparent"
                    : config.themeColor,
            }, "aria-label": "Toggle chat" }, renderBubbleIcon()),
        React__default.createElement("div", { className: `fcw-chat-widget ${positionClass} ${isOpen ? "fcw-open" : "fcw-closed"}`, style: {
                zIndex: config.zIndex,
                width: config.width,
                height: config.height,
                fontFamily: config.fontFamily,
            } },
            React__default.createElement("div", { className: "fcw-chat-header", style: {
                    backgroundColor: config.cleanTheme ? "inherit" : config.themeColor,
                } },
                React__default.createElement("div", { className: "fcw-header-content" }, renderTitleIcon()),
                React__default.createElement("button", { onClick: toggleWidget, className: "fcw-close-btn", "aria-label": "Close chat" },
                    React__default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                        React__default.createElement("path", { d: "M12.8536 4.85355C13.0488 4.65829 13.0488 4.34171 12.8536 4.14645C12.6583 3.95118 12.3417 3.95118 12.1464 4.14645L8 8.29289L3.85355 4.14645C3.65829 3.95118 3.34171 3.95118 3.14645 4.14645C2.95118 4.34171 2.95118 4.65829 3.14645 4.85355L7.29289 9L3.14645 13.1464C2.95118 13.3417 2.95118 13.6583 3.14645 13.8536C3.34171 14.0488 3.65829 14.0488 3.85355 13.8536L8 9.70711L12.1464 13.8536C12.3417 14.0488 12.6583 14.0488 12.8536 13.8536C13.0488 13.6583 13.0488 13.3417 12.8536 13.1464L8.70711 9L12.8536 4.85355Z", fill: "currentColor" })))),
            React__default.createElement("div", { className: "fcw-chat-messages" },
                messages.map((msg) => (React__default.createElement("div", { key: msg.id, className: `fcw-message ${msg.sender === "user" ? "fcw-message-user" : "fcw-message-bot"}` },
                    React__default.createElement("div", { className: `fcw-message-bubble ${msg.sender === "user"
                            ? "fcw-message-bubble-user"
                            : "fcw-message-bubble-bot"}${msg.isStreaming ? " fcw-streaming" : ""}`, style: msg.sender === "user" && !config.cleanTheme
                            ? { backgroundColor: config.themeColor }
                            : undefined, dangerouslySetInnerHTML: {
                            __html: formatMarkdown(msg.text) +
                                (msg.isStreaming
                                    ? '<span class="fcw-cursor">|</span>'
                                    : ""),
                        } })))),
                isLoading && (React__default.createElement("div", { className: "fcw-message fcw-message-bot" },
                    React__default.createElement("div", { className: "fcw-message-bubble fcw-message-bubble-bot" },
                        React__default.createElement("span", { className: "fcw-loading" }, "\u25CF\u25CF\u25CF")))),
                React__default.createElement("div", { ref: messagesEndRef })),
            React__default.createElement("form", { onSubmit: handleSubmit, className: "fcw-chat-input-form" },
                React__default.createElement("input", { ref: inputRef, type: "text", placeholder: config.placeholder, value: inputValue, onChange: (e) => setInputValue(e.target.value), className: "fcw-chat-input", style: { fontFamily: config.fontFamily } }),
                React__default.createElement("button", { type: "submit", disabled: isLoading || !inputValue.trim(), className: "fcw-chat-send-btn", "aria-label": "Send message" },
                    React__default.createElement(SvgSendIcon, { className: "fcw-send-icon" }))))));
};

export { FloatingChatWidget, FloatingChatWidget as default };
//# sourceMappingURL=index.esm.js.map
