"use client"; // Ensure this component is treated as a client component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Home, Newspaper } from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";

// Assuming `validateRequest` is a server-side function used elsewhere correctly
import { validateRequest } from "@/auth";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  // Note: For client-side data fetching, consider using SWR or React Query
  // Instead of directly using server-side functions in client components

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
        className={`flex items-center justify-start gap-3 ${selectedIcon === 'messages' ? 'text-blue-500' : ''}`}
        onClick={() => setSelectedIcon('messages')}
      />
    </div>
  );
}
