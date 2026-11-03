import AllUpcomingEvents from "@/components/events/all-events";
import { EventGridSkeleton } from "@/components/shared/loading-skeleton";
import { Suspense } from "react";

const upcomingeventsdata = async () => {
  try {
    const res = await fetch("http://localhost:8000/upcomingevents", {
      cache: "no-store",
    });
    if (!res.ok) {
      return [];
    }
    const upcomingEvents = await res.json();
    return upcomingEvents;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
};

async function UpcomingEventsData() {
  const data = await upcomingeventsdata();

  return <AllUpcomingEvents upcomingeventsdata={data} />;
}

export default function UpcomingEvents() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <EventGridSkeleton count={6} />
        </div>
      }
    >
      <UpcomingEventsData />
    </Suspense>
  );
}
