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
  isVisible: boolean;
  onOpenSidebar: () => void;
}

const ChatChannel: React.FC<ChatChannelProps> = ({ isVisible, onOpenSidebar }) => {
  return (
    <div className={cn("h-full w-full", isVisible ? "block" : "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader onOpenSidebar={onOpenSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

interface CustomChannelHeaderProps {
  onOpenSidebar: () => void;
}

const CustomChannelHeader: React.FC<CustomChannelHeaderProps> = ({ onOpenSidebar }) => {
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
};

export default ChatChannel;
