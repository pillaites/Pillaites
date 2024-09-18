import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

interface ChatChannelProps {
  onBackToList: () => void;
}

export default function ChatChannel({ onBackToList }: ChatChannelProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center p-2 border-b">
        <Button variant="ghost" size="icon" onClick={onBackToList} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <ChannelHeader />
      </div>
      <Channel>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}
