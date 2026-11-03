"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { EventTypes } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  HeartHandshake,
  AlertCircle,
  Award,
  Shirt,
  Heart,
  Ban,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface SingleEventDetailsProps {
  event: EventTypes;
}

interface Attendee {
  _id?: string;
  eventId: string;
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  joinedAt?: string;
}

export default function SingleEventDetails({ event }: SingleEventDetailsProps) {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if the current logged-in user is the organizer of this event
  const isOrganizer = Boolean(
    session?.user?.email &&
      event?.organizerEmail &&
      session.user.email.trim().toLowerCase() === event.organizerEmail.trim().toLowerCase()
  );

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // Fetch attendees and check if current user joined
  useEffect(() => {
    let isMounted = true;

    async function loadAttendeeData() {
      try {
        setIsLoadingAttendees(true);
        // 1. Fetch all attendees for this event
        const res = await fetch(`${backendUrl}/joinedevents/event/${event._id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setAttendees(data);

            // Check if current user is among attendees
            if (session?.user?.email) {
              const userInAttendees = data.some(
                (item: Attendee) => item.userEmail === session.user.email
              );
              if (userInAttendees) {
                setIsJoined(true);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading attendees:", err);
      } finally {
        if (isMounted) {
          setIsLoadingAttendees(false);
        }
      }
    }

    loadAttendeeData();

    return () => {
      isMounted = false;
    };
  }, [backendUrl, event._id, session?.user?.email]);

  // Secondary check against user's joined events endpoint if session exists
  useEffect(() => {
    if (!session?.user?.email) {
      setIsJoined(false);
      return;
    }

    let isMounted = true;
    async function checkUserJoined() {
      try {
        const res = await fetch(
          `${backendUrl}/joinedevents/${encodeURIComponent(session?.user?.email || "")}`
        );
        if (res.ok) {
          const userJoinedList = await res.json();
          if (isMounted && Array.isArray(userJoinedList)) {
            const hasJoined = userJoinedList.some(
              (item: any) => item.eventId === event._id
            );
            if (hasJoined) {
              setIsJoined(true);
            }
          }
        }
      } catch (err) {
        console.error("Error checking user joined status:", err);
      }
    }

    checkUserJoined();

    return () => {
      isMounted = false;
    };
  }, [backendUrl, event._id, session?.user?.email]);

  // Handle joining the event
  const handleJoinEvent = async () => {
    // If not authenticated, redirect to login
    if (!session?.user) {
      toast.warning("Please sign in to join", {
        description: "You must have an account to register as a volunteer.",
      });
      router.push(`/login?callbackUrl=/events/${event._id}`);
      return;
    }

    // Organizers cannot join their own event
    if (isOrganizer) {
      toast.error("Organizer Restriction", {
        description: "You cannot join an event that you organized.",
      });
      return;
    }

    if (isJoined) {
      toast.info("You're already participating in this event!");
      return;
    }

    const currentCount = attendees.length;
    if (event.maxCapacity && currentCount >= event.maxCapacity) {
      toast.error("Event is full", {
        description:
          "This event has already reached its maximum volunteer capacity.",
      });
      return;
    }

    try {
      setIsJoining(true);

      const joinPayload = {
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        eventImage: event.image,
        eventCategory: event.category,
        organizerName: event.organizerName,
        organizerEmail: event.organizerEmail,
        userEmail: session.user.email,
        userName: session.user.name || "Community Volunteer",
        userAvatar: session.user.image || "",
      };

      const res = await fetch(`${backendUrl}/joinedevents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.message?.includes("already")) {
          setIsJoined(true);
          toast.info("You have already joined this event!");
          return;
        }
        throw new Error(data.message || "Failed to join event");
      }

      // Successfully joined
      setIsJoined(true);
      setAttendees((prev) => [...prev, joinPayload]);
      toast.success("Successfully Joined! 🎉", {
        description: `You are now a registered volunteer for "${event.title}".`,
      });
    } catch (err: any) {
      console.error("Error joining event:", err);
      toast.error(err.message || "Failed to join event. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  // Copy shareable link
  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  // Format date and time
  const formattedDate = (() => {
    try {
      const d = new Date(event.date);
      if (isNaN(d.getTime())) return event.date;
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return event.date;
    }
  })();

  const formattedTime = (() => {
    try {
      const d = new Date(event.date);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  })();

  const capacity = Number(event.maxCapacity) || 1;
  const joinedCount = attendees.length;
  const spotsRemaining = Math.max(0, capacity - joinedCount);
  const progressPercent = Math.min(100, Math.round((joinedCount / capacity) * 100));
  const isFull = capacity > 0 && joinedCount >= capacity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Events</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-full border-border/80 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 gap-1.5 text-xs font-medium text-foreground transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Share Event</span>
              </>
            )}
          </Button>

          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
          >
            <Sparkles className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
            {event.category || "Community"}
          </Badge>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-card shadow-lg mb-10 group">
        <div className="relative h-72 sm:h-96 md:h-[440px] w-full overflow-hidden bg-slate-900">
          <Image
            src={event.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop"}
            alt={event.title}
            fill
            priority
            unoptimized
            className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Upcoming Event
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 text-white border border-white/20 backdrop-blur-md">
              {event.category}
            </span>
          </div>

          {/* Hero Bottom Overlay Details */}
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm text-gray-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{formattedDate}</span>
              </div>
              {formattedTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{formattedTime}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Left) + Action Sticky Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Date</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Time</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {formattedTime || "Full Day"}
                </p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Volunteers</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {capacity} Required
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-emerald-600" />
              About This Event
            </h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-base space-y-4">
              {event.description}
            </div>
          </div>

          {/* Volunteer Guidelines & Expectations */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-emerald-600" />
              Volunteer Guidelines & Preparation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Arrive Early
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-normal">
                    Please arrive 15 to 20 minutes before start time for orientation and task assignment.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Dress Comfortably
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-normal">
                    Wear weather-appropriate clothing and comfortable closed-toe footwear.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Team Spirit
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-normal">
                    Be collaborative, supportive, and follow the instructions of the event lead.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Community Impact
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-normal">
                    Every hour contributed creates direct positive impact in our local communities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Volunteers Roster */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded-full bg-emerald-600" />
                  Volunteers Registered
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  People who signed up to make an impact in this event
                </p>
              </div>

              <Badge
                variant="outline"
                className="self-start sm:self-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs px-3 py-1 font-semibold"
              >
                {joinedCount} / {capacity} Joined
              </Badge>
            </div>

            {isLoadingAttendees ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span className="text-sm">Loading participants...</span>
              </div>
            ) : attendees.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl bg-muted/30 border border-dashed border-border">
                <Heart className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">
                  No volunteers registered yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Be the first to step forward and lead the change by joining this event today!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attendees.map((attendee, idx) => (
                  <div
                    key={attendee._id || `${attendee.userEmail}-${idx}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border/60 transition-colors"
                  >
                    {attendee.userAvatar ? (
                      <Image
                        src={attendee.userAvatar}
                        alt={attendee.userName || "Volunteer"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200 dark:border-emerald-800">
                        {attendee.userName?.charAt(0).toUpperCase() || "V"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {attendee.userName || "Community Volunteer"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {attendee.userEmail}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                      Joined
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column / Sticky Action Box (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Join / Status Action Box */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-md">
              {/* Capacity Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-muted-foreground">Volunteer Capacity</span>
                  <span className={isFull ? "text-rose-600 font-bold" : "text-emerald-600 dark:text-emerald-400"}>
                    {isFull
                      ? "Capacity Reached"
                      : `${spotsRemaining} spot${spotsRemaining === 1 ? "" : "s"} left`}
                  </span>
                </div>

                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFull
                        ? "bg-rose-500"
                        : "bg-linear-to-r from-emerald-500 to-teal-500"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-1.5">
                  <span>{joinedCount} registered</span>
                  <span>Goal: {capacity}</span>
                </div>
              </div>

              {/* Organizer Alert Banner */}
              {isOrganizer ? (
                <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold">You Organized This Event</h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-1">
                        As the organizer of this event, you cannot register as a volunteer for your own event. The join button below is disabled.
                      </p>
                    </div>
                  </div>
                </div>
              ) : isJoined ? (
                <div className="mb-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold">You are participating!</h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300/90 mt-1">
                        Your volunteer registration for this event is confirmed. See you on event day!
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOrganizer ? (
                  <div className="space-y-2.5">
                    <Button
                      disabled
                      className="w-full h-12 rounded-2xl bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed border border-border opacity-70 select-none shadow-none"
                      title="You are the organizer of this event and cannot join it"
                    >
                      <Ban className="w-4 h-4 mr-2 text-rose-500" />
                      Join This Event (Disabled for Organizer)
                    </Button>
                    <p className="text-xs text-center text-amber-600 dark:text-amber-400 font-medium">
                      Organizers cannot join their own event as a volunteer.
                    </p>
                    <Link
                      href="/manage-events"
                      className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                    >
                      <span>Manage this event in dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : isJoined ? (
                  <Link
                    href="/joined-events"
                    className="w-full h-12 rounded-2xl border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-sm transition-all inline-flex items-center justify-center"
                  >
                    View My Joined Events →
                  </Link>
                ) : isFull ? (
                  <Button
                    disabled
                    className="w-full h-12 rounded-2xl bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Event Capacity Full
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoinEvent}
                    disabled={isJoining}
                    className="w-full h-12 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 group"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Joining Event...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                        Join This Event
                      </>
                    )}
                  </Button>
                )}

                {!session?.user && !isOrganizer && (
                  <p className="text-[11px] text-center text-muted-foreground mt-2">
                    Already an account holder? You will be prompted to sign in when joining.
                  </p>
                )}
              </div>

              {/* Event Logistics Checklist */}
              <div className="mt-6 pt-6 border-t border-border/70 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Time</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formattedTime || "Scheduled Time"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Location</p>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {event.location}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        event.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline mt-1"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Organized by
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Organizer
                </span>
              </div>

              <div className="flex items-center gap-4">
                {event.organizerAvatar ? (
                  <Image
                    src={event.organizerAvatar}
                    alt={event.organizerName || "Organizer"}
                    width={52}
                    height={52}
                    className="rounded-2xl object-cover shrink-0 border border-border"
                    unoptimized
                  />
                ) : (
                  <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-lg shrink-0 border border-emerald-200 dark:border-emerald-800/60">
                    {event.organizerName?.charAt(0).toUpperCase() || "O"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base text-foreground truncate">
                    {event.organizerName}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {event.organizerEmail}
                  </p>
                  <a
                    href={`mailto:${event.organizerEmail}`}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline inline-block mt-1"
                  >
                    Contact organizer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
