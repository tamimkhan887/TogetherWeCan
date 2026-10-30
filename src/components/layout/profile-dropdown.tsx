"use client";

import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/events-context";
import {
  CalendarPlus,
  CalendarCheck2,
  FolderKanban,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export function ProfileDropdown() {
  const { currentUser, setIsAuthenticatedPreview } = useEvents();

  const handleLogout = () => {
    setIsAuthenticatedPreview(false);
    toast.info("Logged out from preview session", {
      description: "Switched to guest view mode.",
    });
  };

  if (!currentUser) return null;

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-2 pl-2 pr-2.5 h-10 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-border/60"
        >
          <Avatar className="h-7 w-7 ring-2 ring-emerald-500/40">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline-block">
            {currentUser.name}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3 bg-muted/40 rounded-t-lg">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none text-foreground">
              {currentUser.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {currentUser.email}
            </p>
            <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Verified Volunteer
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-event" className="flex items-center gap-2 cursor-pointer py-2">
            <CalendarPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Create Event</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/manage-events" className="flex items-center gap-2 cursor-pointer py-2">
            <FolderKanban className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Manage Events</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/joined-events" className="flex items-center gap-2 cursor-pointer py-2">
            <CalendarCheck2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Joined Events</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer py-2">
            <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/40 cursor-pointer py-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
