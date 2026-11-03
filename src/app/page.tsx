import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { PastEventsSection } from "@/components/home/past-events-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { CommunityGallery } from "@/components/home/community-gallery";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PastEventsSection />
      <HowItWorks />
      <CommunityGallery />
      <NewsletterSection />
    </div>
  );
}
