"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { UserJoinedEvent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  HeartHandshake,
  Loader2,
  AlertCircle,
  CalendarCheck,
  UserCheck,
  ArrowRight,
} from "lucide-react";

interface JoinedEventsClientProps {
  initialEvents: UserJoinedEvent[];
  userEmail: string;
}

export default function JoinedEventsClient({
  initialEvents,
  userEmail,
}: JoinedEventsClientProps) {
  const [events, setEvents] = useState<UserJoinedEvent[]>(initialEvents);

  // Cancellation modal state
  const [deleteEvent, setDeleteEvent] = useState<UserJoinedEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Check if an event is in the future
  const isUpcoming = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) && d.getTime() >= Date.now();
    } catch {
      return true;
    }
  };

  // Split into Upcoming and Past events
  const upcomingEvents = useMemo(
    () => events.filter((e) => isUpcoming(e.eventDate)),
    [events]
  );

  const pastEvents = useMemo(
    () => events.filter((e) => !isUpcoming(e.eventDate)),
    [events]
  );

  // Handle Cancel Participation
  const handleConfirmCancel = async () => {
    if (!deleteEvent) return;

    try {
      setIsDeleting(true);
      const targetId = deleteEvent._id || deleteEvent.eventId;
      const res = await fetch(`${backendUrl}/joinedevents/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel registration");
      }

      setEvents((prev) =>
        prev.filter(
          (e) =>
            (e._id && e._id !== deleteEvent._id) ||
            (!e._id && e.eventId !== deleteEvent.eventId)
        )
      );

      toast.success("Registration cancelled", {
        description: `You have successfully cancelled your participation for "${deleteEvent.eventTitle}".`,
      });
      setDeleteEvent(null);
    } catch (err: any) {
      console.error("Error cancelling registration:", err);
      toast.error(err.message || "Failed to cancel registration. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date and time helpers
  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatEventTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  // Reusable Event Card Component
  const renderCard = (item: UserJoinedEvent, upcoming: boolean) => {
    const eventHref = `/events/${item.eventId}`;

    return (
      <div
        key={item._id || item.eventId}
        className="group flex flex-col justify-between bg-card rounded-2xl overflow-hidden border border-border hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300"
      >
        <div>
          {/* Event Image Banner */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <Image
              src={
                item.eventImage ||
                "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop"
              }
              alt={item.eventTitle || "Community Event"}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

            {/* Category Tag */}
            <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs">
              {item.eventCategory || "Community"}
            </span>

            {/* Timeline Tag */}
            <span
              className={`absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs backdrop-blur-xs ${
                upcoming
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-700/90 text-slate-200"
              }`}
            >
              {upcoming ? "Upcoming" : "Completed"}
            </span>

            {/* Registered Status Banner */}
            <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Registered
            </span>
          </div>

          {/* Card Content */}
          <div className="p-5">
            <Link href={eventHref}>
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                {item.eventTitle}
              </h3>
            </Link>

            <div className="space-y-2.5 mt-4">
              {/* Date & Time */}
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-foreground truncate">
                  {formatEventDate(item.eventDate)}
                  {formatEventTime(item.eventDate) ? ` at ${formatEventTime(item.eventDate)}` : ""}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-foreground truncate">
                  {item.eventLocation || "Location to be confirmed"}
                </span>
              </div>

              {/* Organizer */}
              {item.organizerName && (
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">
                    Organized by: <strong className="text-foreground">{item.organizerName}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 pt-0 border-t border-border/60 mt-4 flex items-center gap-2">
          <Link
            href={eventHref}
            className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {upcoming && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteEvent(item)}
              className="h-10 px-3 rounded-xl border-border/80 text-muted-foreground hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-xs"
              title="Cancel Registration"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Page Header */}
      <div className="relative rounded-3xl bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-12 overflow-hidden shadow-lg border border-emerald-700/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-4 backdrop-blur-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
            <span>Volunteer Dashboard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            My Joined Events
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Manage your volunteering commitments, view schedules, and keep track of all the community initiatives you are participating in.
          </p>

          <div className="flex items-center gap-2 text-xs text-emerald-200/80 mt-4">
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span>
              Registered as: <span className="font-semibold text-white">{userEmail}</span>
            </span>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-emerald-700/60 max-w-lg">
          <div className="bg-emerald-950/40 border border-emerald-600/30 rounded-2xl p-3 sm:p-4 backdrop-blur-xs">
            <p className="text-xs text-emerald-200 font-medium">Total Joined</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">{events.length}</p>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-600/30 rounded-2xl p-3 sm:p-4 backdrop-blur-xs">
            <p className="text-xs text-emerald-200 font-medium">Upcoming</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5">{upcomingEvents.length}</p>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-600/30 rounded-2xl p-3 sm:p-4 backdrop-blur-xs">
            <p className="text-xs text-emerald-200 font-medium">Completed</p>
            <p className="text-xl sm:text-2xl font-black text-teal-200 mt-0.5">{pastEvents.length}</p>
          </div>
        </div>
      </div>

      {/* Main View: Empty state or Upcoming & Past sections */}
      {events.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card rounded-3xl border border-dashed border-border shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/40">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            You haven't joined any events yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Browse upcoming community events to find causes you care about and register as a volunteer today!
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <span>Explore Community Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* 1. Upcoming Events Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Events scheduled for upcoming dates
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white rounded-full px-3 py-1 text-xs">
                {upcomingEvents.length} Upcoming
              </Badge>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-8 text-center bg-card rounded-2xl border border-dashed border-border">
                <p className="text-sm font-medium text-muted-foreground">
                  No upcoming events right now.
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
                >
                  <span>Explore more events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((item) => renderCard(item, true))}
              </div>
            )}
          </section>

          {/* 2. Past Events Section */}
          <section className="space-y-6 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-border flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Past Events</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Community initiatives that have completed
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                {pastEvents.length} Completed
              </Badge>
            </div>

            {pastEvents.length === 0 ? (
              <div className="p-8 text-center bg-card rounded-2xl border border-dashed border-border">
                <p className="text-sm font-medium text-muted-foreground">
                  No past events recorded yet. Completed volunteering events will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((item) => renderCard(item, false))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Confirmation Dialog for Cancelling Registration */}
      <AlertDialog
        open={Boolean(deleteEvent)}
        onOpenChange={(open) => !open && setDeleteEvent(null)}
      >
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 border border-rose-200 dark:border-rose-800/40">
              <AlertCircle className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              Cancel Registration?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to cancel your volunteer registration for{" "}
              <strong className="text-foreground font-semibold">
                "{deleteEvent?.eventTitle}"
              </strong>
              ? Your spot will be released to other volunteers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl border-border"
            >
              Keep My Spot
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isDeleting}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Registration"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
