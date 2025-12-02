import React from "react";
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
    bubbleIcon?: string | React.ReactNode;
    title?: string;
    titleIcon?: string;
    placeholder?: string;
    welcomeMessage?: string;
    zIndex?: number;
    width?: number;
    height?: number;
    fontFamily?: string;
    debug?: boolean;
    sessionId?: string;
    onUserRequest?: (text: string) => void;
    streaming?: boolean;
}
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
export declare const FloatingChatWidget: React.FC<FloatingChatWidgetProps>;
export default FloatingChatWidget;
