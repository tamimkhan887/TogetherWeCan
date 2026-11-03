"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full w-9 h-9 border border-border/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors ${
          className || ""
        }`}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`rounded-full w-9 h-9 border border-border/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors ${
        className || ""
      }`}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
