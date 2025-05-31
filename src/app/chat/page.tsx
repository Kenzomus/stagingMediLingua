import { ChatClient } from '@/components/chat-client';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)]"> 
      <ChatClient />
    </div>
  );
}
