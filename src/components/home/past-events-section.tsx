"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventTypes } from "@/types";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  History,
} from "lucide-react";

export function PastEventsSection() {
  const [pastEvents, setPastEvents] = useState<EventTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    async function loadPastEvents() {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendUrl}/pastevents`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setPastEvents(data.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error fetching past events for home:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPastEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/30 dark:bg-card/20 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          badge="Community Impact & Legacy"
          title="Past Completed"
          highlight="Events"
          description="Celebrate the difference our dedicated volunteers made across communities. Here are some of our completed initiatives."
          align="center"
        />

        {/* Loading State: Responsive 3-Column Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs animate-pulse"
              >
                <div className="h-52 bg-muted w-full" />
                <div className="p-5 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded-full" />
                    <div className="h-4 w-24 bg-muted rounded-full" />
                  </div>
                  <div className="h-5 w-4/5 bg-muted rounded-md" />
                  <div className="h-4 w-full bg-muted rounded-md" />
                  <div className="h-4 w-2/3 bg-muted rounded-md" />
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <div className="h-8 w-24 bg-muted rounded-md" />
                    <div className="h-8 w-28 bg-muted rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : pastEvents.length === 0 ? (
          /* Empty State Fallback */
          <div className="text-center py-12 px-4 rounded-3xl bg-card border border-dashed border-border max-w-xl mx-auto">
            <History className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">
              No Past Events Recorded Yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Our community is actively organizing new initiatives. Check out upcoming events and be part of our next milestone!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Responsive 3-Column Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pastEvents.map((event) => {
              const eventHref = `/events/${event._id}`;

              return (
                <div
                  key={event._id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border/80 hover:border-emerald-600/50 shadow-xs hover:shadow-xl dark:hover:border-emerald-700/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Event Thumbnail */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop"
                      }
                      alt={event.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-emerald-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm backdrop-blur-xs">
                      {event.category || "Community"}
                    </span>

                    {/* Completed Badge */}
                    <span className="absolute top-4 right-4 bg-black/60 text-slate-200 border border-white/20 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Completed
                    </span>

                    {/* Volunteer Impact Count */}
                    <span className="absolute bottom-3 right-4 bg-white/95 dark:bg-slate-900/90 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                      👥 {event.maxCapacity || 30}+ Volunteers
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={eventHref}>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Date & Location */}
                      <div className="space-y-2.5 mt-4 pt-4 border-t border-border/60">
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-foreground">
                            {formatDate(event.date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-foreground truncate">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer & Action */}
                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {event.organizerAvatar ? (
                          <Image
                            src={event.organizerAvatar}
                            alt={event.organizerName || "Organizer"}
                            width={32}
                            height={32}
                            className="rounded-full object-cover shrink-0 border border-border"
                            unoptimized
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-200 dark:border-emerald-800">
                            {event.organizerName?.charAt(0).toUpperCase() || "O"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground">Organized by</p>
                          <p className="text-xs font-semibold text-foreground truncate">
                            {event.organizerName || "Community Lead"}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={eventHref}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors shrink-0"
                      >
                        <span>View Recap</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Events Link Button */}
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Discover Upcoming Initiatives</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

