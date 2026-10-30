import React from "react";
import { Badge } from "@/components/ui/badge";
import { EventCategory } from "@/types";
import {
  Sparkles,
  TreePine,
  HeartHandshake,
  BookOpen,
  Stethoscope,
  Users,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCategoryBadgeProps {
  category: EventCategory | string;
  className?: string;
  showIcon?: boolean;
}

export function EventCategoryBadge({
  category,
  className,
  showIcon = true,
}: EventCategoryBadgeProps) {
  let badgeClasses = "";
  let Icon = Sparkles;

  switch (category) {
    case "Plantation":
      badgeClasses =
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40";
      Icon = TreePine;
      break;
    case "Cleanup":
      badgeClasses =
        "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/40";
      Icon = Sparkles;
      break;
    case "Donation":
      badgeClasses =
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40";
      Icon = HeartHandshake;
      break;
    case "Education":
      badgeClasses =
        "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/40";
      Icon = BookOpen;
      break;
    case "Healthcare":
      badgeClasses =
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40";
      Icon = Stethoscope;
      break;
    case "Community Support":
      badgeClasses =
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/40";
      Icon = Users;
      break;
    default:
      badgeClasses =
        "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700";
      Icon = Compass;
      break;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium px-2.5 py-1 text-xs rounded-full shadow-2xs backdrop-blur-xs",
        badgeClasses,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{category}</span>
    </Badge>
  );
}
