"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "@/context/events-context";
import { EventCategoryBadge } from "@/components/events/event-category-badge";
import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Share2,
  HeartHandshake,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { toast } from "sonner";

function EventDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const {
    getEventById,
    events,
    isJoined,
    joinEvent,
    leaveEvent,
    isAuthenticatedPreview,
    setIsAuthenticatedPreview,
  } = useEvents();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const event = getEventById(eventId);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold">Event Not Found</h2>
        <p className="text-muted-foreground">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link href="/events">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
            Back to All Events
          </Button>
        </Link>
      </div>
    );
  }

  const joined = isJoined(event.id);
  const capacityPercent = event.maxCapacity
    ? Math.min(100, Math.round((event.participantCount / event.maxCapacity) * 100))
    : null;

  // Related events (same category or nearby)
  const relatedEvents = events
    .filter((e) => e.id !== event.id && (e.category === event.category || e.status === "upcoming"))
    .slice(0, 3);

  const handleJoinClick = () => {
    if (!isAuthenticatedPreview) {
      setLoginModalOpen(true);
      return;
    }

    if (joined) {
      // Leave event
      leaveEvent(event.id);
      toast.info("Registration cancelled", {
        description: `You have stepped down from "${event.title}".`,
      });
      return;
    }

    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      const res = joinEvent(event.id);
      if (res.success) {
        toast.success("Successfully Joined!", {
          description: `You are confirmed as a volunteer for "${event.title}". Thank you for your support!`,
        });
      } else {
        toast.error(res.message);
      }
    }, 400);
  };

  const handleSimulateLoginAndJoin = () => {
    setIsAuthenticatedPreview(true);
    setLoginModalOpen(false);
    joinEvent(event.id);
    toast.success("Preview Volunteer Mode Enabled!", {
      description: `You joined "${event.title}" as a verified volunteer.`,
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        description: "Share this initiative with your friends and community.",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Breadcrumb & Action bar */}
      <div className="border-b border-border/60 bg-muted/20 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Events</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Event</span>
          </Button>
        </div>
      </div>

      {/* Main Event Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Event Hero Image, Content, Guidelines (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Cover Image */}
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg border border-border/70 bg-muted">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 z-10">
                <EventCategoryBadge category={event.category} className="text-sm py-1 px-3" />
              </div>
              {joined && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    You Are Registered
                  </span>
                </div>
              )}
            </div>

            {/* Title & Metadata Header */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{formatTime(event.date) || "Morning (09:00 AM)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 border-t border-border/60 pt-6">
              <h2 className="text-xl font-bold text-foreground">About This Initiative</h2>
              <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Volunteer Guidelines & Expectations */}
            <div className="space-y-4 bg-card border border-border/70 rounded-2xl p-6 shadow-xs">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Volunteer Guidelines & What to Expect
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Please arrive 15 minutes before the scheduled time for briefing and team allocation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Wear comfortable clothing and closed footwear suitable for fieldwork.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Water bottles, gloves, and necessary project supplies will be provided by the organizers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified digital volunteer certificate will be provided upon completion.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Organizer Card, Registration CTA, Capacity Progress (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Join Action Card */}
            <Card className="border border-border/80 rounded-2xl shadow-md p-6 bg-card sticky top-24">
              <CardContent className="p-0 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Event Status
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Registration Open
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">Free Entry</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                {event.maxCapacity && (
                  <div className="space-y-2 border-t border-border/60 pt-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Volunteers Enrolled</span>
                      <span className="text-foreground">
                        {event.participantCount} / {event.maxCapacity} ({capacityPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {event.maxCapacity - event.participantCount > 0
                        ? `${event.maxCapacity - event.participantCount} spots remaining`
                        : "Event capacity reached"}
                    </p>
                  </div>
                )}

                {/* Join Button */}
                <div className="space-y-3">
                  <Button
                    onClick={handleJoinClick}
                    disabled={isJoining}
                    size="lg"
                    className={`w-full h-12 rounded-xl text-base font-bold shadow-md transition-all ${
                      joined
                        ? "bg-secondary text-secondary-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 border"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isJoining ? (
                      "Processing..."
                    ) : joined ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-600" />
                        <span>Registered (Click to Leave)</span>
                      </>
                    ) : (
                      <>
                        <HeartHandshake className="h-5 w-5 mr-2" />
                        <span>Join as a Volunteer</span>
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] text-center text-muted-foreground">
                    {joined
                      ? "You are signed up for this initiative."
                      : "No fees required. 100% community-driven."}
                  </p>
                </div>

                {/* Organizer Info Box */}
                <div className="border-t border-border/60 pt-6 space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Organized By
                  </span>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-emerald-500/20">
                      <AvatarImage src={event.organizerAvatar} alt={event.organizerName} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-800">
                        {event.organizerName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        {event.organizerName}
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </h4>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {event.organizerEmail}
                      </p>
                      <span className="inline-block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Verified Community Partner
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="pt-16 sm:pt-24 border-t border-border/60 mt-16 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                More Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Other Initiatives You Might Like
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <EventCard key={rel.id} event={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Login Required Dialog (when user tries to join while in logged out preview) */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader className="text-left space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
              <LogIn className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Sign In Required to Volunteer
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              You are currently viewing TogetherWeCan in Guest Mode. Please sign in with your account to register for &quot;{event.title}&quot;.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSimulateLoginAndJoin}
              className="w-full sm:w-auto text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Quick Demo: Enable Volunteer State
            </Button>
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                Go to Sign In
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
          Loading event details...
        </div>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
