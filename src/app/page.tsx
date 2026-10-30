import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { RecentUpcomingEvents } from "@/components/home/recent-upcoming-events";
import { HowItWorks } from "@/components/home/how-it-works";
import { CommunityGallery } from "@/components/home/community-gallery";
import { CtaSection } from "@/components/home/cta-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <RecentUpcomingEvents />
      <HowItWorks />
      <CommunityGallery />
      <CtaSection />
      <NewsletterSection />
    </div>
  );
}
