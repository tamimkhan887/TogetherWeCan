import ManageEventGrid from "@/components/ManageEvent/ManageEvent";
import { EventGridSkeleton } from "@/components/shared/loading-skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { connection } from "next/server";

async function ManageEventsData() {
  await connection();

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const emailUser = session?.user?.email;

  if (!emailUser) {
    return <ManageEventGrid manageventsdata={[]} />;
  }

  const response = await auth.api.getToken({
    headers: headersList,
  });

  const token = response?.token;

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:8000";

  try {
    const res = await fetch(
      `${backendUrl}/upcomingevents/${encodeURIComponent(emailUser)}`,
      {
        headers: {
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch manage events");
    }

    const data = await res.json();

    return <ManageEventGrid manageventsdata={data} />;
  } catch (error) {
    console.error("Error fetching manage events:", error);

    return <ManageEventGrid manageventsdata={[]} />;
  }
}

export default function ManageEvent() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <EventGridSkeleton count={6} />
        </div>
      }
    >
      <ManageEventsData />
    </Suspense>
  );
}
