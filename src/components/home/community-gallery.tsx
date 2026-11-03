import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { MapPin } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    location: "Dhanmondi Lake, Dhaka",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    category: "Plantation",
  },
  {
    id: 2,
    title: "Winter Clothes Distribution",
    location: "Mirpur 10, Dhaka",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
    category: "Donation",
  },
  {
    id: 3,
    title: "Hot Food Distribution",
    location: "Sadarghat, Old Dhaka",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80",
    category: "Donation",
  },
  {
    id: 4,
    title: "Neighborhood Clean-up",
    location: "Uttara Sector 7, Dhaka",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80",
    category: "Cleanup",
  },
  {
    id: 5,
    title: "Free Healthcare & Eye Camp",
    location: "Mymensingh Rural Center",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    category: "Healthcare",
  },
  {
    id: 6,
    title: "Youth Literacy & Books Drive",
    location: "Rajshahi",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    category: "Education",
  },
];

export function CommunityGallery() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Moments That Matter"
          title="Community"
          highlight="In Action"
          description="Real photos from our volunteer initiatives across Bangladesh—from planting greenery to serving hot meals and distributing winter warmth."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-border/80 bg-muted"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 text-white backdrop-blur-md border border-white/20">
                  {item.category}
                </span>
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <h4 className="font-bold text-base sm:text-lg leading-snug group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
