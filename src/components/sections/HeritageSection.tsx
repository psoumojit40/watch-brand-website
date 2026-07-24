"use client";

import Link from "next/link";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { Button } from "@/components/ui/Button";
import { BRAND, ROUTES } from "@/lib/constants";

export function HeritageSection() {
  return (
    <section className="relative overflow-hidden bg-darkGray py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <FadeInSection direction="left">
            <div>
              <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-gold">
                Since {BRAND.founded}
              </p>
              <h2 className="mb-6 text-4xl font-light leading-tight text-cream md:text-5xl">
                Crafting <span className="text-gold">Timeless</span> Masterpieces
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-cream/60">
                From our atelier in Le Brassus to the wrists of connoisseurs worldwide, 
                every Audemars Piguet timepiece embodies a tradition of excellence that 
                spans generations. Each movement is assembled by hand, each case polished 
                to perfection, and each dial finished with an artistry that machines 
                cannot replicate.
              </p>
              <div className="flex gap-4">
                <Link href={ROUTES.heritage}>
                  <Button variant="primary" size="md">
                    Discover Heritage
                  </Button>
                </Link>
                <Link href={ROUTES.timeline}>
                  <Button variant="outline" size="md">
                    View Timeline
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection direction="right" delay={0.2}>
            <div className="relative aspect-square overflow-hidden border border-white/5 bg-black/50 backdrop-blur-sm">
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div>
                  <div className="mx-auto mb-6 h-px w-16 bg-gold/60" />
                  <p className="text-7xl font-light text-gold/20">{BRAND.founded}</p>
                  <p className="mt-2 text-xs tracking-[0.2em] uppercase text-cream/30">
                    Founded in Le Brassus
                  </p>
                  <div className="mx-auto mt-6 h-px w-16 bg-gold/60" />
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
