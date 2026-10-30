import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartHandshake, ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-emerald-600 dark:bg-emerald-700 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl">
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-emerald-950/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 text-white border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
              <span>Make An Immediate Impact</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Be the Reason Someone Smiles Today.
            </h2>

            <p className="text-base sm:text-lg text-emerald-50 leading-relaxed max-w-2xl mx-auto">
              Whether you have two hours to spare on a Friday morning or want to launch
              a full neighborhood initiative, your participation changes everything.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl px-8 h-12 shadow-lg group"
                >
                  <HeartHandshake className="h-5 w-5 mr-2 text-emerald-600" />
                  <span>Join Our Community</span>
                  <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 rounded-xl px-7 h-12 font-semibold"
                >
                  Discover Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
