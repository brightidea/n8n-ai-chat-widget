# Floating Chat Widget 浮動聊天小部件

## 📝 Introduction | 簡介

**Floating Chat Widget** is a pure JavaScript, dependency-free, highly customizable floating AI chat widget. Easily embeddable on any website, it connects to an n8n AI agent API. Features a cute pink theme, smooth animations, emoji/SVG bubble icon, and customizable reply logic.

**浮動聊天小部件**是一個純 JavaScript、無依賴、可高度自訂的 AI 聊天元件。可輕鬆嵌入任何網站，支援連接 n8n AI agent API，粉嫩主題、流暢動畫、可愛 icon，並可自訂回覆行為。
![image](https://github.com/user-attachments/assets/d2695e54-b47a-4fcc-b2a5-756e1c120fc1)
![image](https://github.com/user-attachments/assets/870a0013-3ad1-4760-9a64-26800b2e5003)
![image](https://github.com/user-attachments/assets/58b3938d-0b25-44ad-82a4-894bcf03c1a5)

DEMO : https://n8n-ai-chat-widget.pages.dev/demo-floating-chat-widget
---

## 🚀 Quick Start | 快速開始

1. **Include the JS file | 引入 JS 檔案**
   ```html
   <script src="floating-chat-widget.js"></script>
   ```

2. **Initialize the widget | 初始化小部件**
   ```html
   <script>
     FloatingChatWidget.init({
       themeColor: '#FF69B4',
       title: 'AI 助理',
       placeholder: '請輸入訊息...',
       welcomeMessage: '您好！有什麼可以幫您？',
       debug: true,
       position: 'bottom-right',
       fontFamily: 'Segoe UI, Noto Sans TC, Arial, sans-serif',
       // bubbleIcon: '😺', // Default is a cute cat emoji, you can use SVG/HTML
       apiUrl: {{your_n8n_api}}
     });
   </script>
   ```

3. **Demo Example | 範例**
   See `demo-floating-chat-widget.html` for a ready-to-use example.

---

## ✨ Features | 主要特性

- 💬 Pure JavaScript, no dependencies | 無依賴、輕量級
- 🎨 Cute pink theme, easily customizable | 粉嫩主題、易於自訂
- 🐱 Emoji/SVG/HTML bubble icon (default: 😺) | 可愛 icon
- 📱 Responsive design | 響應式設計
- ✨ Smooth animations, loading/streaming effect | 流暢動畫、逐字顯示
- 🔗 Connects to n8n AI agent API | API 連接
- 🛠️ Highly customizable | 高度自訂
- 📝 Supports Markdown in bot reply | 支援 Markdown
- 🧩 Custom onUserRequest callback | 可自訂 onUserRequest 攔截

---

## 🛠️ Options | 參數說明

| Option (參數)   | Description (說明)                | Default (預設)      |
|-----------------|-----------------------------------|---------------------|
| apiUrl          | n8n API endpoint                  | .../chat            |
| position        | Bubble position                   | 'bottom-right'      |
| themeColor      | Theme color                       | '#FF69B4'           |
| bubbleIcon      | Bubble icon (emoji/SVG/HTML)      | '😺'                |
| title           | Header title                      | 'AI Chat'           |
| placeholder     | Input placeholder                 | 'Type your message...'|
| welcomeMessage  | Welcome message                   | 'Hi! How can I help you today?' |
| zIndex          | z-index                           | 9999                |
| width           | Width                             | 350                 |
| height          | Height                            | 500                 |
| fontFamily      | Font family                       | 'inherit'           |
| debug           | Debug mode                        | false               |
| sessionId       | Session ID                        | auto-generated      |

---

## 🎨 Customization | 客製化建議

- Use emoji, SVG, or HTML for the icon | 可用 emoji、SVG、HTML 當作 icon
- Change color, font, welcome message  | 可自訂顏色、字型、歡迎詞
- Supports streaming/逐字顯示, loading animation
- Supports Markdown (**bold**, *italic*, - list, line break)

---

## 🔬 Advanced Usage | 進階用法

### Intercept user request | 攔截用戶訊息
```js
FloatingChatWidget.onUserRequest(function (text) {
  // Custom logic here
  setTimeout(function () {
    FloatingChatWidget.reply('這是自訂回覆：' + text);
  }, 800);
});
```

### Custom icon | 自訂 icon
```js
FloatingChatWidget.init({
  bubbleIcon: '🤖', // or SVG/HTML
});
```

### Session
- Default: auto-generated, or set manually
  ```js
  FloatingChatWidget.init({
    sessionId: 'your-session-id',
  });
  ```

---

## 📄 License | 授權

MIT

---

如需更多協助，請隨時聯絡作者或提出 issue！

If you need further help, feel free to contact the author or open an issue! 
