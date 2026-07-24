"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { collections } from "@/data/collections";
import { ROUTES } from "@/lib/constants";

interface CollectionShowcaseProps {
  /** Show the "Explore Collections" CTA. Off on the dedicated /collections page. */
  showCta?: boolean;
}

export function CollectionShowcase({ showCta = false }: CollectionShowcaseProps) {
  return (
    <section
      id="collections"
      className="section-glow relative scroll-mt-20 bg-black py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          title="Our Collections"
          subtitle="Discover the lines"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection, i) => (
            <FadeInSection key={collection.id} direction="up" delay={i * 0.15}>
              <Link
                href={`${ROUTES.collections}/${collection.slug}`}
                className="group relative block overflow-hidden rounded-sm border border-white/10 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(201,169,110,0.2)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                  {collection.heroImage && (
                    <Image
                      src={collection.heroImage}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="mb-2 text-xs font-medium tracking-[0.25em] uppercase text-gold">
                      Since {collection.yearIntroduced}
                    </p>
                    <h3 className="mb-2 text-2xl font-light text-cream transition-colors group-hover:text-gold">
                      {collection.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-cream/70 line-clamp-2">
                      {collection.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-gold opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                      Explore Collection <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>

        {showCta && (
          <FadeInSection className="mt-12 text-center">
            <Link href={ROUTES.collections}>
              <Button variant="outline" size="md">
                Explore Collections
              </Button>
            </Link>
          </FadeInSection>
        )}
      </div>
    </section>
  );
}
