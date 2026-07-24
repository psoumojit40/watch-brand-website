"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { StaggerGrid } from "@/components/animations/StaggerGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { ROUTES } from "@/lib/constants";

export function FeaturedProducts() {
  const featured = products.filter((p) => p.isNew).slice(0, 3);

  return (
    <section
      id="new-arrivals"
      className="section-navy relative scroll-mt-20 py-24 md:py-32"
    >

      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          title="New Arrivals"
          subtitle="Latest creations"
        />


        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGrid>

        <FadeInSection className="mt-12 text-center">
          <Link
            href={ROUTES.collections}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-gold transition-colors hover:text-gold/80"
          >
            View All New Arrivals <ArrowRight size={14} />
          </Link>

        </FadeInSection>

      </div>
    </section>
  );
}
