"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EventForm } from "@/components/forms/event-form";
import { EventFormData } from "@/lib/validations";
import { useEvents } from "@/context/events-context";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();
  const { addEvent } = useEvents();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSubmit = (data: EventFormData) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const created = addEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        image: data.image,
        location: data.location,
        date: data.date,
        maxCapacity: data.maxCapacity,
      });

      toast.success("Event Created Successfully!", {
        description: `"${created.title}" has been published and added to your event management list.`,
      });

      router.push("/manage-events");
    }, 700);
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        badge="Community Organizer"
        title="Create a New Community Initiative"
        description="Launch a social development event in your neighborhood. Gather passionate volunteers and coordinate meaningful change."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <EventForm
          onSubmit={handleCreateSubmit}
          isLoading={isLoading}
          submitButtonText="Publish Event"
          cancelHref="/manage-events"
        />
      </div>
    </div>
  );
}
