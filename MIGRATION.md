# Migration Guide: Vanilla JS to React Component

This document explains the changes made to convert the floating chat widget from vanilla JavaScript to a React npm package.

## What Changed

### Old Structure (Vanilla JS)
- `floating-chat-widget.js` - Self-contained vanilla JavaScript widget
- `demo-floating-chat-widget.html` - HTML demo file
- Chinese/Japanese text throughout

### New Structure (React + TypeScript)
```
n8n-ai-chat-widget/
├── src/
│   ├── FloatingChatWidget.tsx    # Main React component
│   ├── FloatingChatWidget.css    # Component styles
│   └── index.ts                  # Package exports
├── example/
│   ├── index.html                # Demo HTML
│   └── demo.tsx                  # Demo React app
├── old_vanilla_js/               # Backup of original files
│   ├── floating-chat-widget.js
│   └── demo-floating-chat-widget.html
├── dist/                         # Built files (generated)
├── package.json                  # npm package config
├── tsconfig.json                 # TypeScript config
├── rollup.config.js              # Build config
└── README.md                     # English documentation
```

## Key Improvements

1. **React Component**: Now usable in any React application
2. **TypeScript**: Full type safety and IDE autocomplete
3. **npm Package**: Can be installed via `npm install n8n-ai-chat-widget`
4. **English Translations**: All Chinese/Japanese text converted to English
5. **Modern Build System**: Rollup for optimized bundling
6. **Better Developer Experience**: Fully typed props, better documentation

## Migration from Vanilla JS

If you were using the old vanilla JS version:

### Before (Vanilla JS)
```html
<script src="floating-chat-widget.js"></script>
<script>
  FloatingChatWidget.init({
    apiUrl: 'https://your-n8n.com/webhook/chat',
    title: 'AI Chat',
    themeColor: '#FF69B4'
  });
</script>
```

### After (React)
```tsx
import { FloatingChatWidget } from 'n8n-ai-chat-widget';
import 'n8n-ai-chat-widget/dist/FloatingChatWidget.css';

function App() {
  return (
    <FloatingChatWidget
      apiUrl="https://your-n8n.com/webhook/chat"
      title="AI Chat"
      themeColor="#FF69B4"
    />
  );
}
```

## Translation Changes

All Chinese/Japanese text has been translated to English:

| Original (Chinese) | New (English) |
|-------------------|---------------|
| 寶可夢查詢工具 | AI Chat |
| 請輸入訊息... | Type your message... |
| 請您提供寶可夢的顏色、形狀和招式技能... | Hi! How can I help you today? |
| 浮動聊天小部件 | Floating Chat Widget |

## API Compatibility

The widget maintains the same API contract with n8n:

**Request Format** (unchanged)
```json
{
  "message": "User's message",
  "sessionId": "unique-session-id"
}
```

**Response Format** (unchanged)
```json
{
  "reply": "Bot's response"
}
```
or
```json
{
  "output": "Bot's response"
}
```

## Building and Publishing

### Local Development
```bash
npm install
npm run build
```

### Testing Before Publishing
```bash
npm link
# In another project:
npm link n8n-ai-chat-widget
```

### Publishing to npm
```bash
npm run build
npm publish
```

## Backward Compatibility

The old vanilla JS version has been preserved in `old_vanilla_js/` for reference. If you need to continue using the vanilla JS version, those files are still available.
