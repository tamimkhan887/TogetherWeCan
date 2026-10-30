"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEvents } from "@/context/events-context";
import { PageHeader } from "@/components/shared/page-header";
import { EventFilters } from "@/components/events/event-filters";
import { EventGrid } from "@/components/events/event-grid";
import { EventGridSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { ArrowDown, Sparkles } from "lucide-react";

function EventsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const { events } = useEvents();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc" | "popular">("date-asc");
  const [visibleCount, setVisibleCount] = useState(9);

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Only upcoming events
        const isUpcoming = evt.status !== "completed" && evt.status !== "cancelled";
        if (!isUpcoming) return false;

        // Title/Keyword Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesTitle = evt.title.toLowerCase().includes(q);
          const matchesDesc = evt.description.toLowerCase().includes(q);
          const matchesOrg = evt.organizerName.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesOrg) return false;
        }

        // Location filter
        if (locationFilter.trim()) {
          const loc = locationFilter.toLowerCase();
          if (!evt.location.toLowerCase().includes(loc)) return false;
        }

        // Category filter
        if (category !== "All" && evt.category !== category) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-asc") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "date-desc") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "popular") {
          return b.participantCount - a.participantCount;
        }
        return 0;
      });
  }, [events, search, locationFilter, category, sortBy]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleReset = () => {
    setSearch("");
    setLocationFilter("");
    setCategory("All");
    setSortBy("date-asc");
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search & Filters */}
      <EventFilters
        search={search}
        setSearch={setSearch}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleReset}
        totalResults={filteredEvents.length}
      />

      {/* Grid of Events */}
      <EventGrid
        events={displayedEvents}
        emptyTitle="No matching events found"
        emptyDescription="We couldn't find any volunteer drives matching your search criteria. Try removing filters or searching a broader city area."
        emptyActionText="Reset All Filters"
        onEmptyAction={handleReset}
      />

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-8 text-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            className="rounded-xl px-8 border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            <span>Load More Opportunities</span>
            <ArrowDown className="h-4 w-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Showing {displayedEvents.length} of {filteredEvents.length} events
          </p>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen pb-16">
      <PageHeader
        badge="Community Discovery"
        title="Discover Opportunities to Make a Difference"
        description="Explore social development drives, winter relief campaigns, and environmental actions across Bangladesh. Filter by cause and location to find your calling."
      />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-12">
            <EventGridSkeleton count={6} />
          </div>
        }
      >
        <EventsContent />
      </Suspense>
    </div>
  );
}
