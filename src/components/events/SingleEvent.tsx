import { EventTypes } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function SingleEvent({
  event,
}: {
  event: EventTypes;
}) {
  return (
    <div className="group bg-white dark:bg-card rounded-2xl overflow-hidden border border-green-100 dark:border-border shadow-sm hover:shadow-xl dark:hover:border-emerald-700/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Event Image */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <span className="absolute top-4 left-4 bg-green-100 text-green-800 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border dark:border-emerald-800/50 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          {event.category}
        </span>

        <span className="absolute bottom-4 right-4 bg-white/95 text-green-800 dark:bg-slate-900/90 dark:text-emerald-300 dark:border dark:border-border/60 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="mr-1">👥</span>
          {event.maxCapacity} Volunteers
        </span>
      </div>

      {/* Event Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-green-950 dark:text-foreground line-clamp-1 group-hover:text-green-700 dark:group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h2>

          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2 leading-relaxed line-clamp-2 min-h-10">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-3 mt-5">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-muted-foreground">
              <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-emerald-950/60 dark:border dark:border-emerald-900/40 flex items-center justify-center shrink-0">
                <span>📅</span>
              </div>

              <div>
                <p className="text-xs text-gray-400 dark:text-muted-foreground/70">Event Date</p>
                <p className="font-medium text-gray-700 dark:text-foreground">
                  {new Date(event.date).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-muted-foreground">
              <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-emerald-950/60 dark:border dark:border-emerald-900/40 flex items-center justify-center shrink-0">
                <span>📍</span>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-muted-foreground/70">Location</p>
                <p className="font-medium text-gray-700 dark:text-foreground truncate">
                  {event.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Organizer */}
          <div className="flex items-center gap-3 border-t border-green-100 dark:border-border/60 mt-5 pt-4">
            {event.organizerAvatar ? (
              <Image
                src={event.organizerAvatar}
                alt={event.organizerName}
                width={36}
                height={36}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-emerald-950/80 dark:border dark:border-emerald-800/40 flex items-center justify-center text-green-700 dark:text-emerald-300 font-bold">
                {event.organizerName?.charAt(0) || "O"}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-muted-foreground/70">Organized by</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-foreground truncate">
                {event.organizerName}
              </p>
              <p className="text-xs text-gray-500 dark:text-muted-foreground truncate">
                {event.organizerEmail}
              </p>
            </div>
          </div>

          {/* Button */}
          <Link
            href={`/events/${event._id}`}
            className="mt-5 flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View Event Details
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
