"use client";

import React, { useState } from "react";
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
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  CalendarCheck,
  Clock,
  MapPin,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ManageEventsPage() {
  const { events, deleteEvent, currentUser } = useEvents();

  // Filter events created by the current user (usr-001) or newly added ones
  // For demo purpose, we show events where createdBy matches currentUser.id or all if fewer
  const myEvents = events.filter((e) => e.createdBy === (currentUser?.id || "usr-001"));

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Statistics
  const totalCreated = myEvents.length;
  const upcomingCount = myEvents.filter((e) => e.status !== "completed").length;
  const completedCount = myEvents.filter((e) => e.status === "completed").length;

  const handleDeletePrompt = (event: Event) => {
    setDeleteTarget(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteEvent(deleteTarget.id);
      toast.success("Event Deleted", {
        description: `"${deleteTarget.title}" has been successfully removed.`,
      });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        badge="Organizer Workspace"
        title="Manage Your Initiatives"
        description="Track, edit, and coordinate all community social development events you have organized."
      >
        <Link href="/create-event">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Create New Event</span>
          </Button>
        </Link>
      </PageHeader>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatsCard
            title="Total Events Created"
            value={totalCreated}
            icon={FolderKanban}
            description="All community initiatives hosted"
          />
          <StatsCard
            title="Upcoming Events"
            value={upcomingCount}
            icon={Calendar}
            description="Active registration open"
            trend="Active"
            trendPositive
          />
          <StatsCard
            title="Completed Events"
            value={completedCount}
            icon={CalendarCheck}
            description="Successfully concluded drives"
          />
        </div>

        {/* Content Section */}
        {myEvents.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No events created yet"
            description="You haven't published any community volunteer events so far. Start your first initiative today!"
            actionText="Create an Event"
            actionHref="/create-event"
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Your Published Events
                </h2>
                <p className="text-xs text-muted-foreground">
                  Showing {myEvents.length} events organized by you
                </p>
              </div>
            </div>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Volunteers</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {myEvents.map((evt) => (
                    <tr
                      key={evt.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 rounded-xl overflow-hidden shrink-0 border border-border/70 bg-muted">
                            <Image
                              src={evt.image}
                              alt={evt.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors max-w-xs truncate block">
                            {evt.title}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <EventCategoryBadge category={evt.category} />
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-muted-foreground text-xs max-w-[180px] truncate">
                        {evt.location}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs font-medium text-foreground whitespace-nowrap">
                        {formatDate(evt.date)}
                      </td>

                      {/* Volunteers */}
                      <td className="py-4 px-4 text-xs text-foreground whitespace-nowrap font-medium">
                        {evt.participantCount} {evt.maxCapacity ? `/ ${evt.maxCapacity}` : ""}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge
                          variant={evt.status === "completed" ? "secondary" : "success"}
                          className="text-[11px] font-semibold capitalize"
                        >
                          {evt.status || "Upcoming"}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/events/${evt.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:text-emerald-600"
                              title="View Event Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/edit-event/${evt.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:text-blue-600"
                              title="Edit Event"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePrompt(evt)}
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Visible only on mobile/tablet) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {myEvents.map((evt) => (
                <Card
                  key={evt.id}
                  className="rounded-2xl border border-border/80 bg-card overflow-hidden"
                >
                  <div className="relative aspect-[16/9] w-full bg-muted">
                    <Image
                      src={evt.image}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <EventCategoryBadge category={evt.category} />
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-base line-clamp-1">{evt.title}</h3>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{formatDate(evt.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <Badge
                        variant={evt.status === "completed" ? "secondary" : "success"}
                        className="text-[10px]"
                      >
                        {evt.status || "Upcoming"}
                      </Badge>

                      <div className="flex items-center gap-1">
                        <Link href={`/events/${evt.id}`}>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/edit-event/${evt.id}`}>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePrompt(evt)}
                          className="h-8 px-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Community Initiative?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone and will remove the event for all registered volunteers.`}
        confirmText="Delete Event"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
