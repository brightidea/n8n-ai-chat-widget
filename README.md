# n8n AI Chat Widget

A lightweight, customizable React chat widget component for n8n AI agents. Features a clean modern design, smooth animations, markdown support, and seamless n8n integration with support for real-time streaming responses.

---

## ✨ Features

- 💬 **Lightweight React Component** - Built with TypeScript, fully typed
- 🎨 **Modern Clean Design** - Beautiful orange/coral theme with white background
- 🖼️ **Flexible Icons** - Use emoji, image URLs, or custom React components
- 📱 **Responsive Design** - Works beautifully on all screen sizes
- ✨ **Smooth Animations** - Polished UI with loading indicators and streaming cursor
- 🔗 **n8n Integration** - Direct connection to n8n AI agent APIs
- 📝 **Markdown Support** - Rich text formatting in bot replies
- 🌊 **SSE Streaming** - Real-time streaming responses for faster UX
- 🎭 **Theme Options** - Clean theme mode or customizable colored theme
- 🛠️ **Highly Customizable** - Override any behavior with callbacks
- 🎯 **Zero Dependencies** - Only requires React as a peer dependency

---

## 📦 Installation

```bash
npm install n8n-ai-chat-widget
```

or

```bash
yarn add n8n-ai-chat-widget
```

**Requirements:**

- React 16.8+

---

## 🚀 Quick Start

### Basic Usage

```tsx
import { FloatingChatWidget } from "n8n-ai-chat-widget";
import "n8n-ai-chat-widget/dist/index.css";

function App() {
  return (
    <div>
      <h1>My Website</h1>
      <FloatingChatWidget
        apiUrl="https://your-n8n-instance.com/webhook/chat"
        title="AI Assistant"
        welcomeMessage="Hi! How can I help you today?"
      />
    </div>
  );
}
```

### With Custom Styling

```tsx
import { FloatingChatWidget } from "n8n-ai-chat-widget";
import "n8n-ai-chat-widget/dist/index.css";

function App() {
  return (
    <FloatingChatWidget
      apiUrl="https://your-n8n-instance.com/webhook/chat"
      position="bottom-right"
      themeColor="#4F8CFF"
      cleanTheme={true} // Use clean theme with white background
      title="Customer Support"
      placeholder="Type your message..."
      welcomeMessage="Welcome! How can we help you today?"
      bubbleIcon="🤖" // or use an image URL
      width={400}
      height={600}
      fontFamily="'Inter', sans-serif"
      debug={true}
    />
  );
}
```

### With SSE Streaming (Real-time Responses)

```tsx
import { FloatingChatWidget } from "n8n-ai-chat-widget";
import "n8n-ai-chat-widget/dist/index.css";

function App() {
  return (
    <FloatingChatWidget
      apiUrl="https://your-n8n-instance.com/webhook/chat"
      streaming={true} // Enable Server-Sent Events streaming
      title="AI Assistant"
      welcomeMessage="Hi! Ask me anything and watch the response stream in real-time!"
    />
  );
}
```

### With Custom Message Handling

```tsx
import { FloatingChatWidget } from "n8n-ai-chat-widget";
import "n8n-ai-chat-widget/dist/index.css";

function App() {
  const handleUserRequest = (text: string) => {
    console.log("User sent:", text);
    // You can add custom logic here before or instead of sending to n8n
  };

  return (
    <FloatingChatWidget
      apiUrl="https://your-n8n-instance.com/webhook/chat"
      onUserRequest={handleUserRequest}
    />
  );
}
```

---

## 🛠️ Props

| Prop             | Type                              | Default                           | Description                                                            |
| ---------------- | --------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| `apiUrl`         | `string`                          | **Required**                      | Your n8n webhook/chat endpoint URL                                     |
| `position`       | `'bottom-left' \| 'bottom-right'` | `'bottom-right'`                  | Position of the chat bubble                                            |
| `themeColor`     | `string`                          | `'#FF6B35'`                       | Primary theme color (used for bubble, buttons, and accents)            |
| `cleanTheme`     | `boolean`                         | `false`                           | Enable clean theme mode (white background, removes colored header)     |
| `bubbleIcon`     | `string \| React.ReactNode`       | `'😺'`                            | Icon for chat bubble - supports emoji, image URLs, or React components |
| `title`          | `string`                          | `'AI Chat'`                       | Header title text                                                      |
| `placeholder`    | `string`                          | `'Type your message...'`          | Input field placeholder text                                           |
| `welcomeMessage` | `string`                          | `'Hi! How can I help you today?'` | Initial greeting message from bot                                      |
| `zIndex`         | `number`                          | `9999`                            | CSS z-index for the widget                                             |
| `width`          | `number`                          | `350`                             | Widget width in pixels                                                 |
| `height`         | `number`                          | `500`                             | Widget height in pixels                                                |
| `fontFamily`     | `string`                          | `'inherit'`                       | Font family for all text                                               |
| `debug`          | `boolean`                         | `false`                           | Enable console logging for debugging                                   |
| `sessionId`      | `string`                          | auto-generated                    | Custom session ID for API tracking                                     |
| `streaming`      | `boolean`                         | `false`                           | Enable Server-Sent Events (SSE) streaming for real-time responses      |
| `onUserRequest`  | `(text: string) => void`          | `undefined`                       | Callback fired when user sends a message (overrides default API call)  |

---

## 🎨 Customization Examples

### Custom Icon Options

**Using an Emoji:**

```tsx
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  bubbleIcon="🤖"
/>
```

**Using an Image URL:**

```tsx
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  bubbleIcon="https://example.com/logo.png"
/>
```

**Using a Local Image:**

```tsx
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  bubbleIcon="/images/chat-icon.png"
/>
```

**Using a Custom SVG Component:**

```tsx
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  bubbleIcon={
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  }
/>
```

### Different Positions

```tsx
// Bottom left
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  position="bottom-left"
/>

// Bottom right (default)
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  position="bottom-right"
/>
```

### Custom Color Themes

```tsx
// Default orange/coral theme (clean modern look)
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  cleanTheme={true}
  themeColor="#FF6B35"
/>

// Blue theme with clean design
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  cleanTheme={true}
  themeColor="#2563EB"
/>

// Green theme
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  cleanTheme={true}
  themeColor="#10B981"
/>

// Purple theme with colored header (cleanTheme=false)
<FloatingChatWidget
  apiUrl="https://your-n8n.com/webhook/chat"
  cleanTheme={false}
  themeColor="#8B5CF6"
/>
```

---

## 🔌 n8n API Integration

The widget expects your n8n endpoint to:

### Request Format

```json
{
  "message": "User's message text",
  "sessionId": "unique-session-id"
}
```

### Response Format (Standard)

The widget supports two response formats:

**Option 1: Using `reply` field**

```json
{
  "reply": "Bot's response text"
}
```

**Option 2: Using `output` field**

```json
{
  "output": "Bot's response text"
}
```

### Response Format (Streaming)

When `streaming={true}` is enabled, the widget expects n8n's streaming format (newline-delimited JSON):

```json
{"type": "begin", "metadata": {...}}
{"type": "item", "content": "First ", "metadata": {...}}
{"type": "item", "content": "chunk ", "metadata": {...}}
{"type": "item", "content": "of text", "metadata": {...}}
{"type": "end", "metadata": {...}}
```

**Key Points:**

- Each line is a separate JSON object
- `type: "begin"` marks the start of the stream
- `type: "item"` contains content chunks in the `content` field
- `type: "end"` marks the end of the stream
- The `metadata` field is optional and ignored by the widget

**Benefits of Streaming:**

- Real-time response display as the AI generates text
- Better user experience with immediate feedback
- Lower perceived latency
- Animated cursor shows active streaming

### Example n8n Workflow

**Standard Response:**

1. **Webhook Trigger**: Set to POST method
2. **Process Message**: Your AI logic (OpenAI, etc.)
3. **Respond to Webhook**: Return JSON with `reply` or `output` field

**Streaming Response:**

1. **Webhook Trigger**: Set to POST method
2. **AI Agent Node**: Configure with streaming enabled
3. **Response**: n8n automatically handles the streaming format with `type: "begin"`, `type: "item"`, and `type: "end"` messages

---

## 📝 Markdown Support

The widget automatically formats markdown in bot responses:

- **Bold**: `**text**` → **text**
- _Italic_: `*text*` → _text_
- Lists: `- item` → • item
- Line breaks: `\n` → new line

Example bot response:

```
**Welcome!** Here's what I can help with:
- Answer questions
- Provide information
- Assist with tasks

*How can I help you today?*
```

---

## 🧪 Development

### Building the Package

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build and watch for changes
npm run dev
```

### Testing Locally

You can test the package locally using `npm link`:

```bash
# In the widget package directory
npm link

# In your test project
npm link n8n-ai-chat-widget
```

---

## 📄 TypeScript Support

The package includes full TypeScript definitions. Import types as needed:

```tsx
import {
  FloatingChatWidget,
  FloatingChatWidgetProps,
  Message,
} from "n8n-ai-chat-widget";
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT

---

## 🐛 Issues & Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/n8n-ai-chat-widget/issues) on GitHub.

---

## 🙏 Acknowledgments

Built for the n8n community with ❤️
