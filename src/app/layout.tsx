import type { Metadata } from "next";
import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { EventsProvider } from "@/context/events-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TogetherWeCan | Community-Driven Social Development & Volunteer Events",
  description:
    "Discover meaningful local community-service events, organize grassroot initiatives, and connect with passionate volunteers across Bangladesh.",
  keywords: [
    "Volunteer Bangladesh",
    "Social Development",
    "Tree Plantation Dhaka",
    "Winter Relief",
    "Community Cleaning",
    "TogetherWeCan",
  ],
  authors: [{ name: "TogetherWeCan Foundation" }],
  openGraph: {
    title: "TogetherWeCan - Small Actions. Big Changes. Stronger Communities.",
    description:
      "Join grassroots social welfare drives, environmental initiatives, and volunteer campaigns across Bangladesh.",
    siteName: "TogetherWeCan",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-800 dark:selection:text-emerald-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <EventsProvider>
            <React.Suspense fallback={<div className="h-16 sm:h-20 border-b border-border/70" />}>
              <Navbar />
            </React.Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors closeButton />
          </EventsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
