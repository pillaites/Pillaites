import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home, Newspaper } from "lucide-react";
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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 group"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home className="group-hover:text-yellow-500 group-active:text-yellow-600" />
          <span className="hidden lg:inline group-hover:text-yellow-500 group-active:text-yellow-600">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 group"
        title="News"
        asChild
      >
        <Link href="/news">
          <Newspaper className="group-hover:text-yellow-500 group-active:text-yellow-600" />
          <span className="hidden lg:inline group-hover:text-yellow-500 group-active:text-yellow-600">News</span>
        </Link>
      </Button>
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 group"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark className="group-hover:text-yellow-500 group-active:text-yellow-600" />
          <span className="hidden lg:inline group-hover:text-yellow-500 group-active:text-yellow-600">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
