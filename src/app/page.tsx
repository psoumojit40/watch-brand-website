import { HeroSection } from "@/components/sections/HeroSection";
import { CollectionShowcase } from "@/components/sections/CollectionShowcase";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <hr className="divider-gold" />
      <CollectionShowcase showCta />
      <hr className="divider-gold" />
      <FeaturedProducts />
      <hr className="divider-gold" />
      <TimelineSection />
      <hr className="divider-gold" />
      <ContactSection />
    </>
  );
}


