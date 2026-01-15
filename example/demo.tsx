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
      streaming={true} // Enable SSE streaming responses
      nagDelay={5000} // Show nag after 5 seconds
      nagMessage="Need help?" // Optional tooltip message
      suggestedPrompts={[
        "Help Tracking a Shipment",
        "Joining the Carrier Network",
        "Learning More About RPM's Vehicle Services",
        "Quality & Claims",
        "Billing & Finance",
      ]}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Demo />);
