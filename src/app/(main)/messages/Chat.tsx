'use client';

import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Chat as StreamChatComponent } from 'stream-chat-react';
import ChatChannel from './ChatChannel';
import ChatSidebar from './ChatSidebar';
import useInitializeChatClient from './useInitializeChatClient';

const Chat: React.FC = () => {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debugging - check if chatClient is being initialized
  console.log("Chat Client:", chatClient);

  // Fallback theme if not properly resolved
  const theme = resolvedTheme === 'dark' ? 'str-chat__theme-dark' : 'str-chat__theme-light';

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full h-screen bg-card shadow-sm overflow-hidden">
      <div className="absolute inset-0 flex">
        {chatClient ? (
          <StreamChatComponent
            client={chatClient}
            theme={theme}
          >
            <ChatSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              className="lg:w-1/4 w-3/4"
            />
            <ChatChannel
              open={!sidebarOpen}
              openSidebar={() => setSidebarOpen(true)}
              className={`flex-1 ${sidebarOpen ? 'lg:w-3/4' : 'lg:w-1/4'}`}
            />
          </StreamChatComponent>
        ) : (
          <div>Loading chat...</div>
        )}
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
