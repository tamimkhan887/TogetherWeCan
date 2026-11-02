"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EventCategory } from "@/types";

import {
  Calendar,
  MapPin,
  Users,
  Check,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const CATEGORIES: EventCategory[] = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Community Support",
  "Other",
];

export default function CreateEventPage() {


  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const created = {
      title: formData.get("title") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as EventCategory,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      maxCapacity: Number(formData.get("maxCapacity")) || undefined,
      description: formData.get("description") as string,
      organizerName: session?.user.name || "",
      organizerEmail: session?.user.email || "",
      organizerAvatar: session?.user.image || "",
    };

    try {
      const res = await fetch("http://localhost:8000/upcomingevents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(created),
      });

      const data = await res.json();

      if (!res.ok || !data.insertedId) {
        throw new Error(data.message || "Failed to create event");
      }

      toast.success("Event Created Successfully!", {
        description: `"${created.title}" has been published.`,
      });

      router.push("/manage-events");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    }
  };
  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        badge="Community Organizer"
        title="Create a New Community Initiative"
        description="Launch a social development event in your neighborhood. Gather passionate volunteers and coordinate meaningful change."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <form onSubmit={handleCreateSubmit} className="space-y-8">

          <div className="space-y-6 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Event Overview
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Event Title *
              </label>
              <Input
                name="title"
                type="text"
                placeholder="Event Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Thumbnail Image URL *
              </label>
              <Input
                name="image"
                type="url"
                placeholder="https://images...."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Event Category *
                </label>

                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Event Date & Time *
                </label>

                <Input
                  name="date"
                  type="datetime-local"
                  min="2026-11-01T00:00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Location Details *
                </label>

                <Input
                  name="location"
                  placeholder="Mirpur 10 Community Center, Dhaka"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Volunteer Capacity
                </label>

                <Input
                  name="maxCapacity"
                  type="number"
                  placeholder="e.g., 50"
                  min={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Description & Volunteer Guidelines *
              </label>

              <Textarea
                name="description"
                rows={5}
                placeholder="Explain the purpose of this initiative..."
                required
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
            <Link href="/manage-events" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto px-6 h-11"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-11 shadow-md"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Publish Event
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}