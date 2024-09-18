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
    <main className="relative h-screen w-screen overflow-hidden bg-card shadow-sm">
      <StreamChat
        client={chatClient}
        theme={
          resolvedTheme === "dark"
            ? "str-chat__theme-dark"
            : "str-chat__theme-light"
        }
      >
        <div className="flex flex-col h-full">
          <div className={`flex-1 ${activeView === "sidebar" ? "block" : "hidden"}`}>
            <ChatSidebar onSelectChannel={() => setActiveView("chat")} />
          </div>
          <div className={`flex-1 ${activeView === "chat" ? "block" : "hidden"}`}>
            <ChatChannel onOpenSidebar={() => setActiveView("sidebar")} />
          </div>
        </div>
      </StreamChat>
    </main>
  );
}
