'use client';

import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Chat as StreamChat } from 'stream-chat-react';
import ChatChannel from './ChatChannel';
import ChatSidebar from './ChatSidebar';
import useInitializeChatClient from './useInitializeChatClient';

const Chat: React.FC = () => {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full h-screen bg-card shadow-sm overflow-hidden">
      <div className="absolute inset-0 flex">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === 'dark'
              ? 'str-chat__theme-dark'
              : 'str-chat__theme-light'
          }
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            className="lg:w-1/4 w-3/4" // Adjust width for mobile vs. larger screens
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
            className={`flex-1 ${sidebarOpen ? 'lg:w-3/4' : 'lg:w-1/4'}`} // Adjust width based on sidebar state
          />
        </StreamChat>
      </div>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full lg:hidden"
      >
        {sidebarOpen ? 'Close' : 'Open'} Sidebar
      </button>
    </main>
  );
};

export default Chat;
