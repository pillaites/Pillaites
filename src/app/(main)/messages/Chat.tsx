"use client";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Chat as StreamChat } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import useInitializeChatClient from "./useInitializeChatClient";

export default function Chat() {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [activeView, setActiveView] = useState<"sidebar" | "chat">("sidebar");

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-card shadow-sm">
      <StreamChat
        client={chatClient}
        theme={
          resolvedTheme === "dark"
            ? "str-chat__theme-dark"
            : "str-chat__theme-light"
        }
      >
        <div className="flex h-full">
          <ChatSidebar
            isVisible={activeView === "sidebar"}
            onSelectChannel={() => setActiveView("chat")}
          />
          <ChatChannel
            isVisible={activeView === "chat"}
            onOpenSidebar={() => setActiveView("sidebar")}
          />
        </div>
      </StreamChat>
    </main>
  );
}
