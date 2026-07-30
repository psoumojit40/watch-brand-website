"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Watch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useAppStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link href={`/products/${product.slug}`} className={cn("group block", className)}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden border border-gold/20 bg-neutral-950/60 p-6 backdrop-blur-md transition-all duration-300 group-hover:border-gold/40 group-hover:shadow-[0_0_30px_rgba(201,169,110,0.15)]"
      >
        {/* Subtle Ambient Gold Glow Effect on Hover */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="flex h-full flex-col justify-between">
          {/* Header Row: Collection & Badges */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] uppercase text-gold/80 font-medium">
              {product.collection}
            </span>
            <div className="flex items-center gap-2">
              {product.isNew && (
                <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[9px] font-medium tracking-widest uppercase text-gold">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Watch Image / Visual Container */}
          <div className="relative my-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-white/[0.03] to-transparent p-4">
            {mainImage ? (
              <div className="relative h-full w-full">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-out group-hover:scale-110"
                  priority={false}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-cream/20">
                <Watch size={48} className="mb-2 stroke-1 text-gold/40" />
                <span className="text-xs uppercase tracking-widest">Timepiece</span>
              </div>
            )}
          </div>

          {/* Specs Bar */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {product.case_diameter && (
              <span className="rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[10px] text-cream/50">
                {product.case_diameter}
              </span>
            )}
            {product.case_material && (
              <span className="rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[10px] text-cream/50 truncate max-w-[130px]">
                {product.case_material}
              </span>
            )}
          </div>

          {/* Bottom Info: Title, Description & Price */}
          <div>
            <h3 className="text-lg font-light text-cream transition-colors group-hover:text-gold">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-cream/50 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-cream/30">Price</span>
                <span className="text-sm font-medium text-gold">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    useAppStore.getState().addToCart(product.id, 1);
                  }}
                  className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-all"
                >
                  + Cart
                </button>
                <span className="flex items-center gap-1 text-xs font-medium tracking-wider uppercase text-cream/60 transition-colors group-hover:text-gold">
                  Discover <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

