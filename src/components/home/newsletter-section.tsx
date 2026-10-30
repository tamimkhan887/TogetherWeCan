"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success("Welcome to TogetherWeCan!", {
        description: "You have successfully subscribed to our volunteer newsletter.",
      });
    }, 700);
  };

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
          {/* Subtle Decorative Pattern */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/20">
              <Sparkles className="h-3.5 w-3.5" />
              Volunteer Bulletin
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Get Notified of Upcoming Community Drives Near You
            </h2>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl mx-auto">
              Receive weekly roundups of urgent relief efforts, plantation schedules,
              and volunteer opportunities directly in your inbox. No spam, unsubscribe anytime.
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center gap-3 text-emerald-100 max-w-md mx-auto">
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                <span className="text-sm font-medium">
                  You are all set! Check your inbox for our latest volunteer updates.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-200/60" />
                  <Input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-400 focus-visible:border-white shadow-inner"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-6 rounded-xl bg-white text-emerald-900 font-bold hover:bg-emerald-50 shadow-lg shrink-0 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Subscribing..."
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="h-4 w-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <p className="text-xs text-emerald-200/70 pt-2">
              Join over 4,500 compassionate citizens across Dhaka, Chattogram, and beyond.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
