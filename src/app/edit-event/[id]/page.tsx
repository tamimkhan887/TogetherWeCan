"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EventForm } from "@/components/forms/event-form";
import { EventFormData } from "@/lib/validations";
import { useEvents } from "@/context/events-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

function EditEventContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { getEventById, updateEvent } = useEvents();
  const [isLoading, setIsLoading] = useState(false);

  const event = getEventById(eventId);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold">Event Not Found</h2>
        <p className="text-muted-foreground">
          The event you are attempting to edit does not exist or has been deleted.
        </p>
        <Link href="/manage-events">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
            Back to Manage Events
          </Button>
        </Link>
      </div>
    );
  }

  const handleUpdateSubmit = (data: EventFormData) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      updateEvent(event.id, {
        title: data.title,
        description: data.description,
        category: data.category,
        image: data.image,
        location: data.location,
        date: data.date,
        maxCapacity: data.maxCapacity,
      });

      toast.success("Changes Saved Successfully!", {
        description: `"${data.title}" has been updated with your latest modifications.`,
      });

      router.push("/manage-events");
    }, 700);
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader
        badge="Editor Mode"
        title={`Edit "${event.title}"`}
        description="Update your event's details, date, location, or volunteer guidelines."
      >
        <Link href="/manage-events">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </PageHeader>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <EventForm
          initialValues={{
            title: event.title,
            description: event.description,
            category: event.category,
            image: event.image,
            location: event.location,
            date: event.date,
            maxCapacity: event.maxCapacity,
          }}
          onSubmit={handleUpdateSubmit}
          isLoading={isLoading}
          submitButtonText="Save Changes"
          cancelHref="/manage-events"
        />
      </div>
    </div>
  );
}

export default function EditEventPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
          Loading event details...
        </div>
      }
    >
      <EditEventContent />
    </Suspense>
  );
}
