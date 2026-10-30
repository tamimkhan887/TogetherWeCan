"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { EventCategoryBadge } from "@/components/events/event-category-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/context/events-context";
import { Event } from "@/types";
import {
  Calendar,
  CalendarCheck2,
  Clock,
  MapPin,
  ArrowRight,
  Compass,
  XCircle,
  Award,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function JoinedEventsPage() {
  const { joinedEvents, events, leaveEvent, currentUser } = useEvents();

  const [leaveTarget, setLeaveTarget] = useState<Event | null>(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  // Populate full event objects for each joined entry
  const fullJoinedList = useMemo(() => {
    return joinedEvents
      .map((j) => {
        const found = events.find((e) => e.id === j.eventId);
        return {
          ...j,
          event: found,
        };
      })
      .filter((j): j is typeof j & { event: Event } => Boolean(j.event))
      .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());
  }, [joinedEvents, events]);

  const totalJoined = fullJoinedList.length;
  const upcomingCount = fullJoinedList.filter(
    (item) => item.event.status !== "completed"
  ).length;
  const completedCount = fullJoinedList.filter(
    (item) => item.event.status === "completed"
  ).length;
  const estimatedHours = totalJoined * 4; // 4 hours average per social work event

  const handleLeavePrompt = (event: Event) => {
    setLeaveTarget(event);
    setLeaveDialogOpen(true);
  };

  const confirmLeave = () => {
    if (leaveTarget) {
      leaveEvent(leaveTarget.id);
      toast.info("Registration Cancelled", {
        description: `You have successfully stepped down from "${leaveTarget.title}".`,
      });
      setLeaveTarget(null);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        badge="Volunteer Schedule"
        title="Your Registered Initiatives"
        description="Review all upcoming community service events you have joined to support across Bangladesh."
      >
        <Link href="/events">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm gap-2">
            <Compass className="h-4 w-4" />
            <span>Discover More Events</span>
          </Button>
        </Link>
      </PageHeader>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Events Joined"
            value={totalJoined}
            icon={CalendarCheck2}
            description="Causes you support"
          />
          <StatsCard
            title="Upcoming Drives"
            value={upcomingCount}
            icon={Calendar}
            description="Scheduled on your calendar"
            trend="Active"
            trendPositive
          />
          <StatsCard
            title="Completed Drives"
            value={completedCount}
            icon={Award}
            description="Attended successfully"
          />
          <StatsCard
            title="Volunteer Impact"
            value={`${estimatedHours} hrs`}
            icon={Clock}
            description="Estimated community service"
          />
        </div>

        {/* Content Section */}
        {fullJoinedList.length === 0 ? (
          <EmptyState
            icon={CalendarCheck2}
            title="No joined events yet"
            description="You haven't signed up for any volunteer initiatives. Explore upcoming drives and join fellow volunteers in making an impact."
            actionText="Explore Events"
            actionHref="/events"
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Events on Your Roster
                </h2>
                <p className="text-xs text-muted-foreground">
                  Showing {fullJoinedList.length} registered events sorted by date
                </p>
              </div>
            </div>

            {/* List / Cards of Joined Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fullJoinedList.map(({ event, status, joinedAt }) => (
                <Card
                  key={event.id}
                  className="group rounded-2xl border border-border/80 bg-card overflow-hidden hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <EventCategoryBadge category={event.category} />
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="success"
                          className="font-bold text-[11px] shadow-sm bg-emerald-600 text-white border-0"
                        >
                          Confirmed
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-3">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-medium text-foreground">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 pt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-5 pt-0 border-t border-border/60 mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleLeavePrompt(event)}
                      className="text-xs text-muted-foreground hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Leave</span>
                    </button>

                    <Link href={`/events/${event.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-semibold hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Leaving Event */}
      <ConfirmationDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        title="Cancel Volunteer Registration?"
        description={`Are you sure you want to withdraw from "${leaveTarget?.title}"? You can re-register anytime if spots remain.`}
        confirmText="Confirm Withdrawal"
        destructive
        onConfirm={confirmLeave}
      />
    </div>
  );
}
