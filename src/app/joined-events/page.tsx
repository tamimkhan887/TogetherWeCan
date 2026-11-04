import { connection } from "next/server";
import { headers } from "next/headers";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import JoinedEventsClient from "@/components/joined-events/JoinedEventsClient";
import { EventGridSkeleton } from "@/components/shared/loading-skeleton";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

async function JoinedEventsData() {
  await connection();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const emailUser = session?.user?.email;

  if (!emailUser) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-card border border-border text-center shadow-md">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800/40">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign In Required</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Please sign in to your account to view and manage the events you have joined.
        </p>
        <Link
          href="/login?callbackUrl=/joined-events"
          className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all"
        >
          <span>Sign In to Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:8000";

  let events = [];
  try {
    const res = await fetch(
      `${backendUrl}/joinedevents/${encodeURIComponent(emailUser)}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        events = data;
      }
    }
  } catch (error) {
    console.error("Error fetching joined events:", error);
  }

  return <JoinedEventsClient initialEvents={events} userEmail={emailUser} />;
}

export default function JoinedEventsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <EventGridSkeleton count={6} />
          </div>
        }
      >
        <JoinedEventsData />
      </Suspense>
    </main>
  );
}
