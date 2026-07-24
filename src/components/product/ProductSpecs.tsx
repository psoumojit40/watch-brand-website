"use client";

import { Product } from "@/types/product";

interface ProductSpecsProps {
  product: Product;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = [
    { label: "Movement", value: product.movement },
    { label: "Case Material", value: product.case_material },
    { label: "Case Diameter", value: product.case_diameter },
    { label: "Water Resistance", value: product.water_resistance },
    { label: "Power Reserve", value: product.power_reserve },
  ];

  return (
    <div className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h3 className="mb-8 text-xs font-medium tracking-[0.3em] uppercase text-gold">
          Technical Specifications
        </h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec) => (
            <div key={spec.label} className="border-b border-white/5 pb-4">
              <p className="mb-1 text-xs tracking-[0.2em] uppercase text-cream/40">
                {spec.label}
              </p>
              <p className="text-sm text-cream/80">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
