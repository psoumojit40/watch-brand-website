"use client";

import { FadeInSection } from "@/components/animations/FadeInSection";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <FadeInSection direction="left">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase text-gold">
                {product.collection}
              </p>
              <h1 className="text-4xl font-light text-cream md:text-5xl">
                {product.name}
              </h1>
            </div>

            <p className="text-2xl font-light text-gold">
              ₹{product.price.toLocaleString("en-IN")}

            </p>

            <p className="text-sm leading-relaxed text-cream/60">
              {product.description}
            </p>

            <div className="flex gap-4">
              <Button variant="primary" size="md">
                Inquire
              </Button>
              <Button variant="outline" size="md">
                Book an Appointment
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-white/10 px-3 py-1 text-[10px] tracking-wider uppercase text-cream/50"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection direction="right" delay={0.2}>
          <div className="space-y-4">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-gradient-to-br from-darkGray to-black"
              />
            ))}
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
