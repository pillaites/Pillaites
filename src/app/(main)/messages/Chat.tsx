"use client";

import { useState } from "react";
import ChatSidebar from "./ChatSidebar"; // Adjust import according to your file structure
import ChatChannel from "./ChatChannel"; // Adjust import according to your file structure

export default function Chat() {
  const [activeView, setActiveView] = useState<"sidebar" | "chat">("sidebar");

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar view */}
      {activeView === "sidebar" && (
        <ChatSidebar 
          isVisible={activeView === "sidebar"} 
          onSelectChannel={() => setActiveView("chat")} 
        />
      )}

      {/* Chat view */}
      {activeView === "chat" && (
        <ChatChannel onOpenSidebar={() => setActiveView("sidebar")} />
      )}
    </div>
  );
}
