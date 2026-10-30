"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useEvents } from "@/context/events-context";

export function HeroSection() {
  const { events } = useEvents();

  const stats = [
    {
      label: "Events Organized",
      value: `${events.length}+`,
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
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-border/60 bg-gradient-to-b from-emerald-50/60 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Together For A Better Tomorrow</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Small Actions. <br className="hidden sm:inline" />
              Big Changes. <br className="hidden sm:inline" />
              <span className="text-emerald-600 dark:text-emerald-400">
                Stronger Communities.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover meaningful opportunities, connect with passionate volunteers,
              and make a positive impact in your community across Bangladesh.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 rounded-xl px-7 h-12 text-base font-semibold group"
                >
                  Explore Events
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/create-event" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl px-7 h-12 text-base font-semibold border-border hover:bg-secondary"
                >
                  Create an Event
                </Button>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Free Volunteer Platform</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Local Causes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Card */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-card bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80"
                  alt="Volunteers distributing relief and food"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Active Drive
                  </p>
                  <p className="text-sm font-bold truncate">
                    Food & Relief Outreach • Old Dhaka
                  </p>
                </div>
              </div>

              {/* Floating Overlap Card: Quick Stat */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-card border border-border/80 p-4 rounded-2xl shadow-xl flex items-center gap-3.5 backdrop-blur-md">
                <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Volunteers Joined</p>
                  <p className="text-lg font-extrabold text-foreground">+250 this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Impact Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-16 sm:pt-20">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card border border-border/70 p-6 rounded-2xl shadow-xs flex items-center gap-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
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
