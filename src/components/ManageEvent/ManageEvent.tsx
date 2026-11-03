import { EventTypes } from "@/types";
import SingleManageEvent from "./SingleManageEvent";
import Link from "next/link";
import { PlusCircle, CalendarX2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ManageEventsProps = {
  manageventsdata: EventTypes[];
};

export default function ManageEventGrid({
  manageventsdata,
}: ManageEventsProps) {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#F0FDF4]/60 dark:bg-background py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-emerald-100/80 dark:border-border/60 pb-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-300/40 dark:border-emerald-800/50 px-3 py-1 rounded-full">
              Organizer Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Manage Your Initiatives
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Track, update, and coordinate all community social development events you have organized.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-300/40 dark:border-emerald-800/40 px-3.5 py-1.5 rounded-full">
              {manageventsdata?.length || 0} Events Hosted
            </span>

            <Link href="/create-event">
              <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl shadow-xs text-xs sm:text-sm font-semibold px-4 h-9 gap-1.5">
                <PlusCircle className="h-4 w-4" />
                <span>Create Event</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {!manageventsdata || manageventsdata.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-dashed border-emerald-200 dark:border-border/80 bg-card/50 dark:bg-card/30 backdrop-blur-xs my-8 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <CalendarX2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl font-bold text-foreground">
                No Events Created Yet
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You haven&apos;t published any community volunteer events so far. Start your first initiative today to gather local changemakers!
              </p>
            </div>

            <Link href="/create-event" className="pt-2">
              <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl shadow-xs font-semibold px-5 h-10 gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Publish Your First Event</span>
              </Button>
            </Link>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {manageventsdata.map((singleManageEvent) => (
              <SingleManageEvent
                key={singleManageEvent._id}
                singleManageEvent={singleManageEvent}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
