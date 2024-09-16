"use client";

import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon, Calendar, Vote, Info, Beer } from "lucide-react"; // Added info and beer icons
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Profile */}
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        {/* Calendar */}
        <Link href="/calendar">
          <DropdownMenuItem>
            <Calendar className="mr-2 size-4" />
            Calendar
          </DropdownMenuItem>
        </Link>

        {/* Voting */}
        <Link href="/voting">
          <DropdownMenuItem>
            <Vote className="mr-2 size-4" />
            Voting
          </DropdownMenuItem>
        </Link>

        {/* About */}
        <Link href="/about">
          <DropdownMenuItem>
            <Info className="mr-2 size-4" />
            About
          </DropdownMenuItem>
        </Link>

        {/* Women */}
        <Link href="/women">
          <DropdownMenuItem>
            <Beer className="mr-2 size-4" />
            Women
          </DropdownMenuItem>
        </Link>

        {/* Theme Selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 size-4" />
              System Default
              {theme === "system" && <Check className="ms-2 size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 size-4" />
              Light
              {theme === "light" && <Check className="ms-2 size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 size-4" />
              Dark
              {theme === "dark" && <Check className="ms-2 size-4" />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
