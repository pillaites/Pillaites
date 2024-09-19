import { useState } from "react";
import ChatSidebar from "./ChatSidebar"; // Adjust import according to your file structure
import ChatChannel from "./ChatChannel"; // Adjust import according to your file structure

export default function Chat() {
  const [activeView, setActiveView] = useState<"sidebar" | "chat">("sidebar");

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar view */}
      <div className={`flex-1 ${activeView === "sidebar" ? "block" : "hidden"}`}>
        <ChatSidebar 
          isVisible={activeView === "sidebar"} 
          onSelectChannel={() => setActiveView("chat")} 
        />
      </div>

      {/* Chat view */}
      <div className={`flex-1 ${activeView === "chat" ? "block" : "hidden"}`}>
        <ChatChannel onOpenSidebar={() => setActiveView("sidebar")} />
      </div>
    </div>
  );
}
