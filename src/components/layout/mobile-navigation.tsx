"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useEvents } from "@/context/events-context";
import {
  Menu,
  HeartHandshake,
  Calendar,
  Home,
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  User,
  LogIn,
  UserPlus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticatedPreview, toggleAuthPreview, currentUser } = useEvents();

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Upcoming Events", href: "/events", icon: Calendar },
  ];

  const authLinks = [
    { label: "Create Event", href: "/create-event", icon: PlusCircle },
    { label: "Manage Events", href: "/manage-events", icon: FolderKanban },
    { label: "Joined Events", href: "/joined-events", icon: CheckCircle2 },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const closeSheet = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-10 w-10 rounded-xl border border-border/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 flex flex-col justify-between">
        <div className="p-6 overflow-y-auto">
          {/* Header */}
          <SheetHeader className="text-left pb-6 border-b border-border/60">
            <SheetTitle asChild>
              <Link
                href="/"
                onClick={closeSheet}
                className="flex items-center gap-2.5 group"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight tracking-tight text-foreground">
                    Together<span className="text-emerald-600 dark:text-emerald-400">WeCan</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Community Platform
                  </span>
                </div>
              </Link>
            </SheetTitle>
          </SheetHeader>

          {/* Nav Items */}
          <div className="py-6 space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-3">
                Navigation
              </span>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeSheet}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold"
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Authenticated Links if logged-in preview */}
            {isAuthenticatedPreview && (
              <div className="space-y-1 pt-2 border-t border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-3">
                  Volunteer Dashboard
                </span>
                {authLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeSheet}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold"
                          : "text-foreground/80 hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Auth Buttons if guest */}
            {!isAuthenticatedPreview && (
              <div className="pt-4 space-y-2 border-t border-border/60">
                <Link href="/login" onClick={closeSheet} className="block w-full">
                  <Button variant="outline" className="w-full justify-start gap-2 h-11">
                    <LogIn className="h-4 w-4 text-emerald-600" />
                    <span>Log In</span>
                  </Button>
                </Link>
                <Link href="/register" onClick={closeSheet} className="block w-full">
                  <Button className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700 text-white h-11">
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer info inside Drawer */}
        <div className="p-4 border-t border-border/60 bg-muted/30 space-y-3">
          {/* Auth State Preview Switcher */}
          <button
            onClick={toggleAuthPreview}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-medium">
              Demo State: {isAuthenticatedPreview ? "Volunteer (Logged in)" : "Guest"}
            </span>
            {isAuthenticatedPreview ? (
              <ToggleRight className="h-5 w-5 text-emerald-600" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground font-medium">Theme Mode</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
