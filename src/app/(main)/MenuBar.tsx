"use client";

import { useState } from "react";
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

  const [selectedIcon, setSelectedIcon] = useState<string>("");

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${selectedIcon === 'home' ? 'text-blue-500' : ''}`}
        title="Home"
        asChild
        onClick={() => setSelectedIcon('home')}
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${selectedIcon === 'news' ? 'text-blue-500' : ''}`}
        title="News"
        asChild
        onClick={() => setSelectedIcon('news')}
      >
        <Link href="/news">
          <Newspaper />
          <span className="hidden lg:inline">News</span>
        </Link>
      </Button>

      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
        className={`flex items-center justify-start gap-3 ${selectedIcon === 'notifications' ? 'text-blue-500' : ''}`}
        onClick={() => setSelectedIcon('notifications')}
      />

      <Button
        variant="ghost"
        className={`flex items-center justify-start gap-3 ${selectedIcon === 'bookmarks' ? 'text-blue-500' : ''}`}
        title="Saved"
        asChild
        onClick={() => setSelectedIcon('bookmarks')}
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Saved</span>
        </Link>
      </Button>

      <MessagesButton
        initialState={{ unreadCount: unreadMessagesCount }}
        className={`flex items-center justify-start gap-3 ${selectedIcon === 'messages' ? 'text-blue-500' : ''}`}
        onClick={() => setSelectedIcon('messages')}
      />
    </div>
  );
}
