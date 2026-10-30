"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventCategoryBadge } from "./event-category-badge";
import { Calendar, MapPin, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useEvents } from "@/context/events-context";

interface EventCardProps {
  event: Event;
  priority?: boolean;
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const { isJoined } = useEvents();
  const joined = isJoined(event.id);
  const [imgError, setImgError] = useState(false);

  // Fallback image if unsplash link fails
  const imageSrc = imgError
    ? "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80"
    : event.image;

  return (
    <Card className="group overflow-hidden border border-border/70 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-card rounded-2xl">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge on Top-Left */}
        <div className="absolute top-3 left-3 z-10">
          <EventCategoryBadge category={event.category} />
        </div>

        {/* Joined Status Badge on Top-Right */}
        {joined && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Joined
            </span>
          </div>
        )}

        {/* Date on Image Bottom */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <Calendar className="h-3.5 w-3.5 text-emerald-300" />
          <span>{formatDate(event.date)}</span>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          <Link href={`/events/${event.id}`}>
            <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {event.title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Organizer & Action Bar */}
        <div className="pt-3.5 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
              <AvatarImage src={event.organizerAvatar} alt={event.organizerName} />
              <AvatarFallback className="text-[10px]">
                {event.organizerName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {event.organizerName}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Users className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {event.participantCount} {event.participantCount === 1 ? "volunteer" : "volunteers"}
                </span>
              </div>
            </div>
          </div>

          <Link href={`/events/${event.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-medium hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-600 group/btn transition-all duration-200"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
