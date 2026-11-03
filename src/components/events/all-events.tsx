import { EventTypes } from "@/types";
import SingleEvent from "@/components/events/SingleEvent";

type AllUpcomingEventsProps = {
  upcomingeventsdata: EventTypes[];
};

export default function AllUpcomingEvents({
  upcomingeventsdata,
}: AllUpcomingEventsProps) {
  if (!upcomingeventsdata || upcomingeventsdata.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🌱</div>
        <h2 className="text-2xl font-bold text-green-900 dark:text-emerald-300">
          No Upcoming Events
        </h2>
        <p className="text-gray-500 dark:text-muted-foreground mt-2">
          Stay tuned! New volunteering opportunities are coming soon.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-[#F0FDF4] dark:bg-background py-10 sm:py-14 min-h-[calc(100vh-5rem)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <span className="text-sm font-semibold tracking-wider uppercase text-green-600 dark:text-emerald-400">
              Make a Difference
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-950 dark:text-foreground mt-2">
              Explore Upcoming Events
            </h2>

            <p className="text-gray-600 dark:text-muted-foreground mt-2 text-sm sm:text-base">
              Join hands with your community and create positive change.
            </p>
          </div>

          <div className="text-sm font-medium text-green-800 bg-green-100 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-800/40 px-4 py-2 rounded-full w-fit">
            {upcomingeventsdata.length} Events Available
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {upcomingeventsdata.map((event) => (
            <SingleEvent key={event._id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
