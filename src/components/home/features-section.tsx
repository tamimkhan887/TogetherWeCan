import React from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Compass,
  PlusCircle,
  Users2,
  LineChart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function FeaturesSection() {
  const features = [
    {
      title: "Discover Local Events",
      description:
        "Find verified social welfare, relief distribution, and environmental initiatives happening right in your city or neighborhood.",
      icon: Compass,
      badge: "Discovery",
      href: "/events",
      linkText: "Browse Drives",
    },
    {
      title: "Create Social Initiatives",
      description:
        "Easily organize your own community campaigns, invite local helpers, and establish transparent participant goals.",
      icon: PlusCircle,
      badge: "Organize",
      href: "/create-event",
      linkText: "Start an Event",
    },
    {
      title: "Connect With Volunteers",
      description:
        "Build long-lasting bonds with passionate citizens, student networks, and nonprofit leaders striving for positive change.",
      icon: Users2,
      badge: "Community",
      href: "/events",
      linkText: "Meet People",
    },
    {
      title: "Track Your Impact",
      description:
        "Keep a personalized record of all attended events, contributed volunteer hours, and community achievements in one dashboard.",
      icon: LineChart,
      badge: "Transparency",
      href: "/joined-events",
      linkText: "View Dashboard",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-secondary/30 dark:bg-card/20 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Platform Highlights"
          title="Designed to Power"
          highlight="Community Action"
          description="Everything you need to turn compassionate intentions into tangible, structured volunteer efforts across Bangladesh."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border border-border/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 rounded-2xl bg-card flex flex-col justify-between"
              >
                <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between gap-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-600 dark:group-hover:text-white transition-all duration-300 shadow-2xs">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 pt-2 group-hover:translate-x-1 transition-all"
                  >
                    <span>{feature.linkText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
