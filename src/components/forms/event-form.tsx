"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormData } from "@/lib/validations";
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
import { Image as ImageIcon, Calendar, MapPin, Users, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventFormProps {
  initialValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  cancelHref?: string;
}

const CATEGORIES: EventCategory[] = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Community Support",
  "Other",
];

const SAMPLE_IMAGES = [
  {
    label: "Winter Relief",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80",
  },
  {
    label: "Tree Plantation",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
  },
  {
    label: "City Cleanup",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1200&auto=format&fit=crop&q=80",
  },
  {
    label: "Medical Health Camp",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
  },
  {
    label: "Food Distribution",
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80",
  },
];

export function EventForm({
  initialValues,
  onSubmit,
  isLoading = false,
  submitButtonText = "Create Event",
  cancelHref = "/manage-events",
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      category: initialValues?.category || "Community Support",
      image:
        initialValues?.image ||
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
      location: initialValues?.location || "",
      date: initialValues?.date
        ? initialValues.date.substring(0, 16)
        : "2026-11-20T09:00",
      maxCapacity: initialValues?.maxCapacity || 50,
    },
  });

  const watchedImage = watch("image");
  const watchedCategory = watch("category");
  const [imageError, setImageError] = useState(false);

  // Minimum date for the datetime-local input
  const minDateString = "2026-11-01T00:00";

  const handleFormSubmit = (data: EventFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Details Section */}
      <div className="space-y-6 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Event Overview
        </h3>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Event Title <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., Winter Clothes Distribution – Mirpur 10"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Event Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={watchedCategory}
              onValueChange={(val: EventCategory) => setValue("category", val)}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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
            {errors.category && (
              <p className="text-xs text-red-500 font-medium">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Event Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Event Date & Time <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              min={minDateString}
              {...register("date")}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-xs text-red-500 font-medium">{errors.date.message}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Must be scheduled for today or a future date.
            </p>
          </div>
        </div>

        {/* Location & Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Location Details <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., Mirpur 10 Community Center, Dhaka"
              {...register("location")}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-xs text-red-500 font-medium">{errors.location.message}</p>
            )}
          </div>

          {/* Max Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Volunteer Capacity (Optional)
            </label>
            <Input
              type="number"
              placeholder="e.g., 50"
              min={1}
              {...register("maxCapacity", { valueAsNumber: true })}
              className={errors.maxCapacity ? "border-red-500" : ""}
            />
            {errors.maxCapacity && (
              <p className="text-xs text-red-500 font-medium">
                {errors.maxCapacity.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Description & Volunteer Guidelines <span className="text-red-500">*</span>
          </label>
          <Textarea
            rows={5}
            placeholder="Explain the purpose of this initiative, schedule, items volunteers should bring, and how the community will benefit..."
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">
              {errors.description.message}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground">
            Minimum 20 characters describing the initiative.
          </p>
        </div>
      </div>

      {/* Media / Image Section */}
      <div className="space-y-6 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Event Cover Image
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Thumbnail Image URL <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="https://images.unsplash.com/..."
            {...register("image")}
            onChange={(e) => {
              register("image").onChange(e);
              setImageError(false);
            }}
            className={errors.image ? "border-red-500" : ""}
          />
          {errors.image && (
            <p className="text-xs text-red-500 font-medium">{errors.image.message}</p>
          )}

          {/* Quick presets */}
          <div className="pt-2">
            <span className="text-xs text-muted-foreground mr-2 font-medium">
              Quick Presets:
            </span>
            <div className="inline-flex flex-wrap gap-2 mt-1">
              {SAMPLE_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => {
                    setValue("image", img.url, { shouldValidate: true });
                    setImageError(false);
                  }}
                  className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 transition-colors"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Image Preview */}
        {watchedImage && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Live Preview
            </span>
            <div className="relative aspect-[16/9] max-w-md rounded-xl overflow-hidden border border-border bg-muted shadow-xs">
              <Image
                src={
                  imageError
                    ? "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80"
                    : watchedImage
                }
                alt="Event preview"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
                  Could not load image URL. Using fallback.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
        <Link href={cancelHref} className="w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto px-6 h-11"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-11 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              {submitButtonText}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
