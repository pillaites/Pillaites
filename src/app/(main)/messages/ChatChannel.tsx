import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

interface ChatChannelProps {
  onOpenSidebar: () => void;
}

export default function ChatChannel({ onOpenSidebar }: ChatChannelProps) {
  return (
    <div className="h-full w-full">
      <Channel>
        <Window>
          <CustomChannelHeader onOpenSidebar={onOpenSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

interface CustomChannelHeaderProps {
  onOpenSidebar: () => void;
}

function CustomChannelHeader({ onOpenSidebar }: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-2 bg-card border-b">
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={onOpenSidebar} 
        className="md:hidden"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <ChannelHeader />
    </div>
  );
}
