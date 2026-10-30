import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 max-w-lg mx-auto",
        className
      )}
    >
      <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-xs">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <div>
          {actionHref ? (
            <Link href={actionHref}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onAction}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
