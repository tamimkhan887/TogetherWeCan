"use client";

import React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventGrid } from "@/components/events/event-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEvents } from "@/context/events-context";

export function RecentUpcomingEvents() {
  const { events } = useEvents();

  // Show top 6 events
  const upcomingEvents = events.slice(0, 6);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            badge="Take Action"
            title="Recent & Upcoming"
            highlight="Community Events"
            description="Explore the latest social initiatives organized by dedicated community champions and reserve your spot to help."
            align="left"
            className="mb-0"
          />

          <Link href="/events" className="shrink-0 hidden md:block">
            <Button
              variant="outline"
              className="border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl px-5 h-11"
            >
              <span>View All Events ({events.length})</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* 6 Event Cards Grid */}
        <EventGrid events={upcomingEvents} />

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/events">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11">
              View All Events ({events.length})
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
