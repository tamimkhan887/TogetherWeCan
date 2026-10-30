import React from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Search, UserCheck, Heart, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Discover an Event",
      description:
        "Filter through causes that resonate with you—whether it's distributing warm winter blankets, planting trees, or participating in neighborhood cleanups.",
      icon: Search,
    },
    {
      step: "02",
      title: "Join the Community",
      description:
        "Register as a volunteer with one click. Get the meeting details, coordination instructions, and connect directly with the lead organizers.",
      icon: UserCheck,
    },
    {
      step: "03",
      title: "Make a Difference",
      description:
        "Show up on event day, stand in solidarity with fellow volunteers, and create a visible, heartwarming difference in real lives.",
      icon: Heart,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Simple & Transparent"
          title="How TogetherWeCan"
          highlight="Works"
          description="Getting involved in local social development is effortless. Three straightforward steps to start making an impact."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-card border border-border/80 rounded-2xl p-8 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Number Watermark */}
                <span className="text-5xl font-black text-emerald-500/10 dark:text-emerald-400/10 absolute top-4 right-6 pointer-events-none group-hover:text-emerald-500/20 transition-colors">
                  {item.step}
                </span>

                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-600 dark:group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/60 mt-6 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Step {item.step} of 03</span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
