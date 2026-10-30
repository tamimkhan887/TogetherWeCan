import React from "react";
import { Event } from "@/types";
import { EventCard } from "./event-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventGridProps {
  events: Event[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  emptyActionHref?: string;
  onEmptyAction?: () => void;
  className?: string;
}

export function EventGrid({
  events,
  emptyTitle = "No events found",
  emptyDescription = "There are no events matching your criteria at the moment. Try adjusting your search or category filters.",
  emptyActionText,
  emptyActionHref,
  onEmptyAction,
  className,
}: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={CalendarSearch}
          title={emptyTitle}
          description={emptyDescription}
          actionText={emptyActionText}
          actionHref={emptyActionHref}
          onAction={onEmptyAction}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
        className
      )}
    >
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} priority={index < 3} />
      ))}
    </div>
  );
}
