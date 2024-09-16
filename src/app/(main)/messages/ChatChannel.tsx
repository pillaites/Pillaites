import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

// Props interface for the ChatChannel component
interface ChatChannelProps {
  open: boolean; // Determines if the channel is visible
  openSidebar: () => void; // Function to open the sidebar
}

// Functional component definition
const ChatChannel: React.FC<ChatChannelProps> = ({ open, openSidebar }) => {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

// Props interface for the CustomChannelHeader component
interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void; // Function to open the sidebar
}

// Functional component definition for the custom channel header
const CustomChannelHeader: React.FC<CustomChannelHeaderProps> = ({
  openSidebar,
  ...props
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
};

export default ChatChannel;
