import ReactDOM from 'react-dom/client';
import { FloatingChatWidget } from '../src/FloatingChatWidget';

function Demo() {
  return (
    <FloatingChatWidget
      apiUrl="{{your_n8n_api}}"
      title="AI Assistant"
      placeholder="Type your message..."
      welcomeMessage="Hi! How can I help you today? Feel free to ask me anything!"
      themeColor="#4F8CFF"
      position="bottom-right"
      fontFamily="'Segoe UI', Arial, sans-serif"
      debug={true}
      bubbleIcon="🤖"
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Demo />);
