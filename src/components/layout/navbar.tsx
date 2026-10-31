"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ProfileDropdown } from "./profile-dropdown";
import { MobileNavigation } from "./mobile-navigation";
import {
  HeartHandshake,
  Calendar,
  Home,
  LogIn,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function Navbar() {
  const pathname = usePathname();
  const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Upcoming Events", href: "/events", icon: Calendar },
  ];
  const { data: session } = authClient.useSession()
  const user = session?.user
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl leading-none tracking-tight text-foreground">
                Together<span className="text-emerald-600 dark:text-emerald-400">WeCan</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                Social Development
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold shadow-2xs text-nowrap"
                      : "text-foreground/80 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-nowrap"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Authenticated vs Guest Desktop UI */}

            {
              user ? <div>
                <div className="hidden sm:flex items-center gap-3">
                  <Link href="/create-event">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs text-xs font-semibold px-4 h-9"
                    >
                      + Create Event
                    </Button>
                  </Link>
                  <ProfileDropdown />
                </div>
                <div className="flex sm:hidden">
                  <Link href='/profile'>
                    <Avatar className="w-7 h-7 flex sm:hidden">
                      <AvatarImage className="rounded-2xl" src={user.image as string} alt={user.name} />
                      <AvatarFallback className="text-[16px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-2xl py-1">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              </div> : <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-medium h-9 rounded-xl px-3 hover:text-emerald-600"
                  >
                    <LogIn className="h-3.5 w-3.5 mr-1.5" />
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs text-xs font-semibold px-3.5 h-9"
                  >
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                    Register
                  </Button>
                </Link>
              </div>
            }
            {/* Mobile Navigation Drawer Trigger */}
            <div className="flex md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
