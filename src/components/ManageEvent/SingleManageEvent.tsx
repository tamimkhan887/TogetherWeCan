"use client";

import { EventTypes } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    CalendarDays,
    Clock,
    MapPin,
    Users,
    Pencil,
    Trash2,
    Eye,
    Loader2,
    Sparkles,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type SingleManageEventsProps = {
    singleManageEvent: EventTypes;
};

const CATEGORIES = [
    "Cleanup",
    "Plantation",
    "Donation",
    "Education",
    "Healthcare",
    "Community Support",
    "Other",
];

const formatDateTimeLocal = (dateString: string) => {
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
        return "";
    }
};

export default function SingleManageEvent({
    singleManageEvent,
}: SingleManageEventsProps) {
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(
        singleManageEvent.category
    );

    const [errors, setErrors] = useState({
        title: "",
        image: "",
        category: "",
        date: "",
        location: "",
        maxCapacity: "",
        description: "",
    });

    const handleOpenEdit = () => {
        setSelectedCategory(singleManageEvent.category);
        setErrors({
            title: "",
            image: "",
            category: "",
            date: "",
            location: "",
            maxCapacity: "",
            description: "",
        });
        setEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formEntries = new FormData(form);
        const updatedEvent = Object.fromEntries(formEntries.entries()) as {
            title: string;
            image: string;
            category: string;
            date: string;
            location: string;
            maxCapacity: string;
            description: string;
        };

        const newErrors = {
            title: "",
            image: "",
            category: "",
            date: "",
            location: "",
            maxCapacity: "",
            description: "",
        };

        if (!updatedEvent.title?.trim()) {
            newErrors.title = "Event title is required.";
        }
        if (!updatedEvent.image?.trim()) {
            newErrors.image = "Cover image URL is required.";
        }
        if (!updatedEvent.category?.trim()) {
            newErrors.category = "Please select a category.";
        }
        if (!updatedEvent.date) {
            newErrors.date = "Event date & time is required.";
        }
        if (!updatedEvent.location?.trim()) {
            newErrors.location = "Event location is required.";
        }
        if (!updatedEvent.maxCapacity || Number(updatedEvent.maxCapacity) < 1) {
            newErrors.maxCapacity = "Volunteer capacity must be at least 1.";
        }
        if (!updatedEvent.description?.trim()) {
            newErrors.description = "Event description is required.";
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== "")) {
            return;
        }

        setLoading(true);

        try {
            const backendUrl =
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const response = await fetch(
                `${backendUrl}/upcomingevents/${singleManageEvent._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: updatedEvent.title,
                        image: updatedEvent.image,
                        category: updatedEvent.category,
                        date: updatedEvent.date,
                        location: updatedEvent.location,
                        maxCapacity: Number(updatedEvent.maxCapacity),
                        description: updatedEvent.description,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || data?.error || `Server responded with ${response.status}`
                );
            }

            toast.success("Event updated successfully!");
            setEditOpen(false);
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("Update event error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update event. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);

        try {
            const backendUrl =
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
            const response = await fetch(
                `${backendUrl}/upcomingevents/${singleManageEvent._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || data?.error || `Server responded with ${response.status}`
                );
            }

            toast.success("Event deleted successfully!");
            setDeleteOpen(false);
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("Delete event error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete event. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const eventDate = new Date(singleManageEvent.date);

    return (
        <>
            <div className="group flex flex-col justify-between rounded-2xl border border-emerald-100/90 dark:border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-xl dark:hover:border-emerald-700/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                {/* Event Media Header */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
                    <Image
                        src={singleManageEvent.image}
                        alt={singleManageEvent.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 rounded-full border border-emerald-200/50 dark:border-border/60 bg-white/95 dark:bg-card/95 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs backdrop-blur-xs">
                        {singleManageEvent.category}
                    </div>

                    {/* Capacity Tag */}
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/65 dark:bg-black/75 px-2.5 py-1 text-xs font-medium text-white shadow-xs backdrop-blur-xs flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-emerald-400" />
                        <span>{singleManageEvent.maxCapacity} Spots</span>
                    </div>
                </div>

                {/* Event Details Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {singleManageEvent.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 min-h-10 leading-relaxed">
                            {singleManageEvent.description}
                        </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-emerald-100/80 dark:border-border/60 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 dark:border dark:border-emerald-900/40 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                                <CalendarDays className="h-3.5 w-3.5" />
                            </div>
                            <span className="truncate font-medium text-foreground">
                                {eventDate.toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 dark:border dark:border-emerald-900/40 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                            <span className="truncate font-medium text-foreground">
                                {eventDate.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 dark:border dark:border-emerald-900/40 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                                <MapPin className="h-3.5 w-3.5" />
                            </div>
                            <span className="truncate font-medium text-foreground">
                                {singleManageEvent.location}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                        <Link
                            href={`/events/${singleManageEvent._id}`}
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl border border-border bg-background hover:bg-muted text-foreground transition-all duration-200 shadow-2xs hover:shadow-xs"
                        >
                            <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>View</span>
                        </Link>

                        <Button
                            onClick={handleOpenEdit}
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-all duration-200 shadow-2xs hover:shadow-xs h-auto cursor-pointer"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </Button>

                        <Button
                            onClick={() => setDeleteOpen(true)}
                            variant="outline"
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200 shadow-2xs hover:shadow-xs h-auto cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Event Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-2xl border-border bg-card text-card-foreground shadow-2xl p-6">
                    <DialogHeader className="space-y-1.5">
                        <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                <Sparkles className="h-4 w-4" />
                            </span>
                            <span>Edit Initiative</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                            Modify the event schedule, requirements, or location details below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        {/* Event Title */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-foreground">
                                Event Title *
                            </Label>
                            <Input
                                name="title"
                                defaultValue={singleManageEvent.title}
                                placeholder="Enter event title"
                                className="rounded-xl border-border bg-background text-foreground focus-visible:ring-emerald-500 text-sm"
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500 font-medium">{errors.title}</p>
                            )}
                        </div>

                        {/* Cover Image URL */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-foreground">
                                Cover Image URL *
                            </Label>
                            <Input
                                name="image"
                                defaultValue={singleManageEvent.image}
                                placeholder="https://images.unsplash.com/..."
                                className="rounded-xl border-border bg-background text-foreground focus-visible:ring-emerald-500 text-sm"
                            />
                            {errors.image && (
                                <p className="text-xs text-red-500 font-medium">{errors.image}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-foreground">
                                    Category *
                                </Label>
                                {/* Hidden input to ensure FormData captures category */}
                                <input
                                    type="hidden"
                                    name="category"
                                    value={selectedCategory}
                                />
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) => {
                                        if (value) {
                                            setSelectedCategory(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="rounded-xl border-border bg-background text-foreground text-sm">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border bg-card text-card-foreground">
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Volunteer Capacity */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-foreground">
                                    Volunteer Capacity *
                                </Label>
                                <Input
                                    type="number"
                                    name="maxCapacity"
                                    min="1"
                                    defaultValue={singleManageEvent.maxCapacity}
                                    placeholder="50"
                                    className="rounded-xl border-border bg-background text-foreground focus-visible:ring-emerald-500 text-sm"
                                />
                                {errors.maxCapacity && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.maxCapacity}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Event Date & Time */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-foreground">
                                Event Date & Time *
                            </Label>
                            <Input
                                type="datetime-local"
                                name="date"
                                defaultValue={formatDateTimeLocal(singleManageEvent.date)}
                                className="rounded-xl border-border bg-background text-foreground focus-visible:ring-emerald-500 text-sm"
                            />
                            {errors.date && (
                                <p className="text-xs text-red-500 font-medium">{errors.date}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-foreground">
                                Event Location *
                            </Label>
                            <Input
                                name="location"
                                defaultValue={singleManageEvent.location}
                                placeholder="Gulshan, Dhaka"
                                className="rounded-xl border-border bg-background text-foreground focus-visible:ring-emerald-500 text-sm"
                            />
                            {errors.location && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-foreground">
                                Event Description *
                            </Label>
                            <Textarea
                                name="description"
                                defaultValue={singleManageEvent.description}
                                rows={4}
                                placeholder="Provide a detailed overview of the initiative..."
                                className="rounded-xl border-border bg-background text-foreground focus-visible:ring-emerald-500 text-sm resize-none"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditOpen(false)}
                                className="rounded-xl border-border hover:bg-muted text-foreground text-xs sm:text-sm font-semibold h-9"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl shadow-xs text-xs sm:text-sm font-semibold h-9 px-4 gap-1.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Changes</span>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-2xl border-border bg-card text-card-foreground shadow-2xl p-6">
                    <AlertDialogHeader className="space-y-1.5">
                        <AlertDialogTitle className="text-lg sm:text-xl font-bold text-foreground">
                            Delete This Initiative?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Are you sure you want to remove &quot;{singleManageEvent.title}&quot;? This action cannot be undone and will permanently remove this initiative and notify signed-up participants.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="gap-2 sm:gap-0 pt-2">
                        <AlertDialogCancel className="rounded-xl border-border hover:bg-muted text-foreground font-semibold text-xs sm:text-sm h-9">
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl shadow-xs font-semibold text-xs sm:text-sm h-9 px-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <span>Delete Event</span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
