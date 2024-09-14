import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home, Calendar, Vote } from "lucide-react"; // Updated icons for all buttons
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      {/* Home Button */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {/* Bookmarks Button */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>

      {/* Calendar Button */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Calendar"
        asChild
      >
        <Link href="/calendar">
          <Calendar />
          <span className="hidden lg:inline">Calendar</span>
        </Link>
      </Button>

      {/* Voting Button */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Voting"
        asChild
      >
        <Link href="/voting">
          <Vote />
          <span className="hidden lg:inline">Voting</span>
        </Link>
      </Button>

      {/* Notifications Button */}
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />

      {/* Messages Button */}
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
    </div>
  );
}
