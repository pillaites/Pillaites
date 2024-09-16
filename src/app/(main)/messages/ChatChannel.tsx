import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';

// Define the props interface for the ChatChannel component
interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
  className?: string; // Optional className for styling
}

const ChatChannel: React.FC<ChatChannelProps> = ({ open, openSidebar, className }) => {
  return (
    <div className={cn("w-full md:block", !open && "hidden", className)}>
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

// Define the props interface for the CustomChannelHeader component
interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

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
