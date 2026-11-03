import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { UpcomingEventsSection } from "@/components/home/upcoming-events-section";
import { PastEventsSection } from "@/components/home/past-events-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { CommunityGallery } from "@/components/home/community-gallery";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <UpcomingEventsSection />
      <FeaturesSection />
      <HowItWorks />
      <PastEventsSection />
      <CommunityGallery />
      <NewsletterSection />
    </div>
  );
}
