import { useState } from 'react';
import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home, Newspaper } from "lucide-react"; // Import Newspaper icon
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

  const [active, setActive] = useState<string>("");

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${active === 'home' ? 'text-primary' : 'text-secondary'}`}
        title="Home"
        asChild
        onClick={() => setActive('home')}
      >
        <Link href="/" passHref>
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${active === 'bookmarks' ? 'text-primary' : 'text-secondary'}`}
        title="Bookmarks"
        asChild
        onClick={() => setActive('bookmarks')}
      >
        <Link href="/bookmarks" passHref>
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>

      {/* Add News button */}
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${active === 'news' ? 'text-primary' : 'text-secondary'}`}
        title="News"
        asChild
        onClick={() => setActive('news')}
      >
        <Link href="/news" passHref>
          <Newspaper />
          <span className="hidden lg:inline">News</span>
        </Link>
      </Button>
    </div>
  );
}
