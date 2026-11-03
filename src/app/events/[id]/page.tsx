import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import SingleEventDetails from "@/components/events/SingleEventDetails";
import { EventTypes } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function SingleEventData({ params }: PageProps) {
  await connection();
  const { id } = await params;

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:8000";

  let event: EventTypes | null = null;
  let isError = false;

  try {
    const res = await fetch(`${backendUrl}/upcomingevents/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data._id) {
        event = data;
      }
    }
  } catch (err) {
    console.error("Failed to fetch single event details:", err);
    isError = true;
  }

  if (!event || isError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-md w-full bg-card p-8 sm:p-10 rounded-3xl border border-border shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-200 dark:border-amber-800/40">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            Event Not Found
          </h2>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            The event you are looking for may have concluded, been removed, or the link might be incorrect.
          </p>

          <Link
            href="/events"
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm inline-flex items-center justify-center gap-2 font-medium text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Other Events</span>
          </Link>
        </div>
      </div>
    );
  }

  return <SingleEventDetails event={event} />;
}

function EventDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-8">
      <div className="h-6 w-36 bg-muted rounded-lg" />
      <div className="h-72 sm:h-96 md:h-[440px] w-full bg-muted rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-muted rounded-2xl" />
            <div className="h-20 bg-muted rounded-2xl" />
            <div className="h-20 bg-muted rounded-2xl" />
          </div>
          <div className="h-48 bg-muted rounded-3xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-72 bg-muted rounded-3xl" />
          <div className="h-32 bg-muted rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function SingleEventDetailsPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<EventDetailsSkeleton />}>
        <SingleEventData params={params} />
      </Suspense>
    </main>
  );
}
