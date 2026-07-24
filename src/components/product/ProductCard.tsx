"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className={cn("group block", className)}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden border border-white/5 bg-black/40 backdrop-blur-sm"
      >
        <div className="aspect-[4/5] bg-gradient-to-b from-darkGray to-black p-6">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-xs tracking-[0.2em] uppercase text-cream/40">
                {product.collection}
              </span>
              {product.isNew && (
                <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-gold">
                  New
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-light text-cream">{product.name}</h3>
              <p className="mt-1 text-xs text-cream/40">{product.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gold">
                  ₹{product.price.toLocaleString("en-IN")}

                </span>
                <span className="text-xs text-cream/30 opacity-0 transition-opacity group-hover:opacity-100">
                  View <ArrowRight size={12} className="inline" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
