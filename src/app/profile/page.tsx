"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvents } from "@/context/events-context";
import {
  User as UserIcon,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Pencil,
  HeartHandshake,
  FolderKanban,
  CheckCircle2,
  Users,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const { currentUser, updateUserProfile, events, joinedEvents } = useEvents();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");

  // Edit form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Tanvir Ahmed",
    email: currentUser?.email || "tanvir.ahmed@example.com",
    avatar:
      currentUser?.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio:
      currentUser?.bio ||
      "Passionate community volunteer & sustainability advocate based in Dhaka.",
    phone: currentUser?.phone || "+880 1712-345678",
    location: currentUser?.location || "Dhaka, Bangladesh",
  });

  const myCreatedEvents = events.filter(
    (e) => e.createdBy === (currentUser?.id || "usr-001")
  );

  const myJoinedEvents = joinedEvents
    .map((j) => events.find((e) => e.id === j.eventId))
    .filter((e): e is typeof events[0] => Boolean(e));

  // Impact calculations
  const totalCreated = myCreatedEvents.length;
  const totalJoined = myJoinedEvents.length;
  const totalImpacted = myCreatedEvents.reduce(
    (acc, cur) => acc + cur.participantCount,
    0
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setEditModalOpen(false);
    toast.success("Profile Updated", {
      description: "Your volunteer details have been updated successfully.",
    });
  };

  const initials = (currentUser?.name || "TA")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        badge="Volunteer Identity"
        title="Volunteer Profile Dashboard"
        description="View your grassroots contributions, manage your contact details, and inspect the events you have organized or supported."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Profile Card Header */}
        <Card className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
          {/* Cover gradient strip */}
          <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 relative">
            <div className="absolute right-6 bottom-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Community Champion
              </span>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-12 mb-6">
              {/* Avatar */}
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card rounded-full shadow-lg ring-2 ring-emerald-500/20">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="text-2xl font-bold bg-emerald-100 text-emerald-800">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Edit Profile Action */}
              <Button
                onClick={() => setEditModalOpen(true)}
                variant="outline"
                className="rounded-xl border-border hover:bg-secondary gap-2 h-10 px-4 text-xs font-semibold"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Button>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
                  <span>{currentUser?.name}</span>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </h1>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Verified Volunteer Leader
                </p>
              </div>

              {currentUser?.bio && (
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {currentUser.bio}
                </p>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{currentUser?.email}</span>
                </div>
                {currentUser?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{currentUser.location}</span>
                  </div>
                )}
                {currentUser?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Member since March 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatsCard
            title="Events Created"
            value={totalCreated}
            icon={FolderKanban}
            description="Initiatives organized by you"
          />
          <StatsCard
            title="Events Joined"
            value={totalJoined}
            icon={HeartHandshake}
            description="Supported as active volunteer"
          />
          <StatsCard
            title="Volunteers Impacted"
            value={`${totalImpacted}+`}
            icon={Users}
            description="Total helpers gathered across drives"
            trend="Active"
            trendPositive
          />
        </div>

        {/* Tabs for Recently Created and Recently Joined */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border/70 pb-3">
            <button
              onClick={() => setActiveTab("created")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "created"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Recently Created Events ({myCreatedEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("joined")}
              className={`text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "joined"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Recently Joined Events ({myJoinedEvents.length})
            </button>
          </div>

          {activeTab === "created" ? (
            myCreatedEvents.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="No created events yet"
                description="You have not created any events yet. Organize your first community initiative today!"
                actionText="Create an Event"
                actionHref="/create-event"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCreatedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            )
          ) : myJoinedEvents.length === 0 ? (
            <EmptyState
              icon={HeartHandshake}
              title="No joined events yet"
              description="You have not registered for any volunteer drives yet. Explore upcoming opportunities and join one today!"
              actionText="Explore Events"
              actionHref="/events"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJoinedEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Volunteer Profile</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update your public name, contact information, and biography.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Avatar Image URL</label>
              <Input
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880 1712-345678"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Bio</label>
              <Textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="A short description of your volunteer interests..."
              />
            </div>

            <DialogFooter className="pt-4 flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
