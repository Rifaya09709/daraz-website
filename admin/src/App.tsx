// App.tsx
import { ChatNotificationProvider } from "./context/ChatNotificationContext";
import AppRoutes from "./routes/AppRoutes"; // unga existing routes file

function App() {
  return (
    <ChatNotificationProvider>
      <AppRoutes />
    </ChatNotificationProvider>
  );
}

export default App;