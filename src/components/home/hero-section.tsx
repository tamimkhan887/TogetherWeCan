"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  HeartHandshake,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export function HeroSection() {
  const [eventCount, setEventCount] = useState<number | null>(null);

  useEffect(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    fetch(`${backendUrl}/upcomingevents`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setEventCount(data.length);
        }
      })
      .catch(() => setEventCount(null));
  }, []);

  const stats = [
    {
      label: "Events Organized",
      value: eventCount !== null ? `${eventCount}+` : "25+",
      icon: Calendar,
      description: "Across 8 divisions",
    },
    {
      label: "Active Volunteers",
      value: "4,800+",
      icon: Users,
      description: "Passionate citizens",
    },
    {
      label: "Communities Reached",
      value: "35+",
      icon: HeartHandshake,
      description: "Direct grassroot impact",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-border/60 bg-linear-to-b from-emerald-50/60 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Small Actions. Real Community Impact.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Unite for Good.{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Together We Can
              </span>{" "}
              Change Lives.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover and organize grassroots social development initiatives
              across Bangladesh. From winter blanket drives in northern
              districts to urban tree plantations and clean river campaigns.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 px-7 h-12 text-sm sm:text-base group"
                >
                  <span>Explore All Drives</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/create-event" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl border-border hover:bg-muted text-foreground font-semibold px-7 h-12 text-sm sm:text-base"
                >
                  <span>Host an Initiative</span>
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground border-t border-border/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Local Drives</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Platform Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Volunteer Driven</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image Card */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-border/60 group">
                <Image
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80"
                  alt="Volunteers distributing relief packages in Bangladesh"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating On-Image Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-card/90 backdrop-blur-md shadow-lg border border-white/20 dark:border-border/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Ongoing Initiative
                    </span>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1">
                      Relief Drive • Bangladesh
                    </h4>
                  </div>
                  <Link href="/events">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center">
                      Details <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Impact Counter Strip */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-emerald-500/40 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground/80 mt-0.5">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
