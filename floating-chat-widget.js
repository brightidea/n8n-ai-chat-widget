/**
 * FloatingChatWidget - A lightweight, customizable, dependency-free floating chat widget.
 *
 * Features:
 * - Responsive design
 * - Smooth animations
 * - Easily customizable
 * - No external dependencies
 * - Connects to n8n AI agent API
 *
 * Usage:
 *   <script src="floating-chat-widget.js"></script>
 *   <script>
 *     FloatingChatWidget.init({ ...options });
 *   </script>
 *
 * @author AI
 */
(function (window, document) {
  'use strict';

  /**
   * Default configuration for the chat widget.
   * @type {Object}
   */
  const DEFAULT_CONFIG = {
    apiUrl: '{{your_n8n_api}}',
    position: 'bottom-right', // 'bottom-left' or 'bottom-right'
    themeColor: '#FF69B4',
    bubbleIcon: '<span class="fcw-emoji-bubble">😺</span>',
    title: '寶可夢查詢工具',
    placeholder: 'Type your message...',
    welcomeMessage: '請您提供寶可夢的顏色、形狀和招式技能。我會使用這些資訊來推測寶可夢，並回覆你3個最有可能的寶可夢名稱',
    zIndex: 9999,
    width: 350,
    height: 500,
    fontFamily: 'inherit',
    debug: false,
    sessionId: undefined, // 可選，若未指定則自動產生
  };

  /**
   * Utility for logging.
   * @param {...any} args
   */
  function log(...args) {
    if (FloatingChatWidget._config && FloatingChatWidget._config.debug) {
      console.log('[FloatingChatWidget]', ...args);
    }
  }

  /**
   * FloatingChatWidget main object.
   * @namespace
   */
  const FloatingChatWidget = {
    _config: {},
    _elements: {},
    _isOpen: false,
    _onUserRequest: null,

    /**
     * Initializes the chat widget.
     * @param {Object} config - Custom configuration options. 可包含 sessionId 以便於API追蹤會話。
     */
    init(config = {}) {
      this._config = { ...DEFAULT_CONFIG, ...config };
      // 若未指定 sessionId，則自動產生一個唯一ID
      if (!this._config.sessionId) {
        this._config.sessionId = 'fcw-' + Math.random().toString(36).slice(2) + Date.now();
      }
      log('Initializing with config:', this._config);
      this._createStyles();
      this._createWidget();
      this._bindEvents();
      if (this._config.welcomeMessage) {
        this._addMessage('bot', this._config.welcomeMessage);
      }
    },

    /**
     * Sets a callback for user requests.
     * @param {function(string):void} callback
     */
    onUserRequest(callback) {
      this._onUserRequest = callback;
    },

    /**
     * Programmatically send a reply from the bot.
     * @param {string} text
     */
    reply(text) {
      this._addMessage('bot', text);
    },

    /**
     * Creates and injects widget styles.
     * @private
     */
    _createStyles() {
      if (document.getElementById('floating-chat-widget-style')) return;
      const style = document.createElement('style');
      style.id = 'floating-chat-widget-style';
      style.textContent = `
        .fcw-bubble {
          position: fixed;
          ${this._config.position === 'bottom-left' ? 'left: 24px;' : 'right: 24px;'}
          bottom: 24px;
          z-index: ${this._config.zIndex};
          background: #FF69B4;
          color: #fff;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
        }
        .fcw-bubble:hover {
          box-shadow: 0 4px 24px rgba(0,0,0,0.25);
          transform: scale(1.05);
          background: #ff94c2;
        }
        .fcw-emoji-bubble {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          width: 24px;
          height: 24px;
          line-height: 1;
          margin: 0;
          padding: 0;
        }
        .fcw-widget {
          position: fixed;
          ${this._config.position === 'bottom-left' ? 'left: 24px;' : 'right: 24px;'}
          bottom: 90px;
          z-index: ${this._config.zIndex};
          width: ${this._config.width}px;
          max-width: 95vw;
          height: ${this._config.height}px;
          max-height: 80vh;
          background: #fff0f6;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(255,105,180,0.10);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transform: translateY(30px) scale(0.98);
          transition: opacity 0.3s, transform 0.3s;
        }
        .fcw-widget.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0) scale(1);
        }
        .fcw-header {
          background: #FF69B4;
          color: #fff;
          padding: 16px;
          font-size: 1.1rem;
          font-family: ${this._config.fontFamily};
          font-weight: bold;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          box-shadow: 0 2px 8px rgba(255,105,180,0.08);
        }
        .fcw-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #fff0f6;
          font-family: ${this._config.fontFamily};
        }
        .fcw-message {
          margin-bottom: 12px;
          display: flex;
        }
        .fcw-message.user {
          justify-content: flex-end;
        }
        .fcw-message.bot {
          justify-content: flex-start;
        }
        .fcw-bubble-text {
          background: #ffe0ef;
          color: #d72660;
          border-radius: 16px;
          padding: 10px 16px;
          max-width: 80%;
          font-size: 1rem;
          word-break: break-word;
          box-shadow: 0 1px 4px rgba(255,105,180,0.08);
        }
        .fcw-message.user .fcw-bubble-text {
          background: #FF69B4;
          color: #fff;
          box-shadow: 0 2px 8px rgba(255,105,180,0.13);
        }
        .fcw-input-row {
          display: flex;
          border-top: 1px solid #ffd1e6;
          background: #fff0f6;
        }
        .fcw-input {
          flex: 1;
          border: none;
          padding: 12px;
          font-size: 1rem;
          font-family: ${this._config.fontFamily};
          outline: none;
          background: transparent;
        }
        .fcw-input:focus {
          background: #ffe0ef;
        }
        .fcw-send-btn {
          background: none;
          border: none;
          color: #FF69B4;
          font-size: 1.5rem;
          padding: 0 16px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
          border-radius: 50%;
        }
        .fcw-send-btn:hover:not(:disabled) {
          background: #ffb3d6;
          color: #fff;
        }
        .fcw-send-btn:disabled {
          color: #ffc1e3;
          cursor: not-allowed;
        }
        .fcw-loading {
          display: inline-block;
          letter-spacing: 2px;
          animation: fcw-blink 1s infinite steps(1, end);
        }
        @keyframes fcw-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        /* CSS Bubble Icon Modern */
        .fcw-css-bubble-modern {
          display: inline-block;
          width: 22px;
          height: 18px;
          background: #fff;
          border-radius: 12px 12px 16px 16px;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.13);
          vertical-align: middle;
        }
        .fcw-css-bubble-modern::after {
          content: '';
          position: absolute;
          left: 8px;
          bottom: -7px;
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 0 0 8px 8px;
          transform: rotate(18deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }
      `;
      document.head.appendChild(style);
    },

    /**
     * Creates the widget DOM elements.
     * @private
     */
    _createWidget() {
      // Bubble
      const bubble = document.createElement('div');
      bubble.className = 'fcw-bubble';
      bubble.innerHTML = this._config.bubbleIcon;
      document.body.appendChild(bubble);
      // Widget
      const widget = document.createElement('div');
      widget.className = 'fcw-widget';
      widget.innerHTML = `
        <div class="fcw-header">${this._config.title}</div>
        <div class="fcw-messages"></div>
        <form class="fcw-input-row" autocomplete="off">
          <input class="fcw-input" type="text" placeholder="${this._config.placeholder}" />
          <button class="fcw-send-btn" type="submit">➤</button>
        </form>
      `;
      document.body.appendChild(widget);
      // Store references
      this._elements = {
        bubble,
        widget,
        messages: widget.querySelector('.fcw-messages'),
        input: widget.querySelector('.fcw-input'),
        form: widget.querySelector('.fcw-input-row'),
        sendBtn: widget.querySelector('.fcw-send-btn'),
      };
    },

    /**
     * Binds DOM events.
     * @private
     */
    _bindEvents() {
      this._elements.bubble.addEventListener('click', () => this._toggleWidget());
      this._elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this._elements.input.value.trim();
        if (!text) return;
        this._addMessage('user', text);
        this._elements.input.value = '';
        this._elements.input.focus();
        if (typeof this._onUserRequest === 'function') {
          this._onUserRequest(text);
        } else {
          this._sendToApi(text);
        }
      });
    },

    /**
     * Toggles the chat widget open/close.
     * @private
     */
    _toggleWidget() {
      this._isOpen = !this._isOpen;
      if (this._isOpen) {
        this._elements.widget.classList.add('open');
        setTimeout(() => this._elements.input.focus(), 350);
      } else {
        this._elements.widget.classList.remove('open');
      }
      log('Widget toggled:', this._isOpen);
    },

    /**
     * Adds a message to the chat.
     * @param {'user'|'bot'} sender
     * @param {string} text
     * @param {Object} [options] - { loading: boolean, streaming: boolean }
     * @private
     */
    _addMessage(sender, text, options = {}) {
      const msg = document.createElement('div');
      msg.className = `fcw-message ${sender}`;
      const bubble = document.createElement('div');
      bubble.className = 'fcw-bubble-text';
      if (options.loading) {
        bubble.innerHTML = '<span class="fcw-loading">●●●</span>';
      } else if (options.streaming) {
        bubble.innerHTML = '';
        msg.appendChild(bubble);
        this._elements.messages.appendChild(msg);
        this._elements.messages.scrollTop = this._elements.messages.scrollHeight;
        this._streamTextToBubble(bubble, text);
        log('Message added (streaming):', sender, text);
        return;
      } else {
        bubble.innerHTML = this._formatMarkdown(text);
      }
      msg.appendChild(bubble);
      this._elements.messages.appendChild(msg);
      this._elements.messages.scrollTop = this._elements.messages.scrollHeight;
      log('Message added:', sender, text);
    },

    /**
     * 將文字逐字stream到bubble
     * @param {HTMLElement} bubble
     * @param {string} text
     * @private
     */
    _streamTextToBubble(bubble, text) {
      let i = 0;
      const formatted = this._formatMarkdown(text);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formatted;
      const plain = tempDiv.textContent || tempDiv.innerText || '';
      function type() {
        if (i <= plain.length) {
          bubble.textContent = plain.slice(0, i);
          i++;
          setTimeout(type, 18);
        } else {
          bubble.innerHTML = formatted;
        }
      }
      type();
    },

    /**
     * 將簡單markdown格式轉為HTML（支援**粗體**、*斜體*、換行、列表）
     * @param {string} text
     * @returns {string}
     * @private
     */
    _formatMarkdown(text) {
      let html = text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.+?)\*/g, '<i>$1</i>')
        .replace(/\- (.+)/g, '<li>$1</li>');
      // 包裹li為ul
      if (/<li>/.test(html)) html = '<ul>' + html + '</ul>';
      return html;
    },

    /**
     * Sends user input to the n8n AI agent API.
     * @param {string} text
     * @private
     */
    _sendToApi(text) {
      // 先顯示 loading
      const loadingMsg = this._addMessage('bot', '', { loading: true });
      fetch(this._config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: this._config.sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          // 移除 loading
          const messages = this._elements.messages;
          if (messages.lastChild && messages.lastChild.querySelector('.fcw-loading')) {
            messages.removeChild(messages.lastChild);
          }
          let reply = '';
          if (data && data.reply) reply = data.reply;
          else if (data && data.output) reply = data.output;
          if (reply) {
            this._addMessage('bot', reply, { streaming: true });
          } else {
            log('API raw response:', data);
            this._addMessage('bot', 'Sorry, I did not understand that.');
          }
        })
        .catch((err) => {
          // 移除 loading
          const messages = this._elements.messages;
          if (messages.lastChild && messages.lastChild.querySelector('.fcw-loading')) {
            messages.removeChild(messages.lastChild);
          }
          log('API error:', err);
          this._addMessage('bot', 'Error connecting to AI agent.');
        });
    },
  };

  // Expose globally
  window.FloatingChatWidget = FloatingChatWidget;
})(window, document); 