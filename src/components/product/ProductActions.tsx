"use client";

import Link from "next/link";
import { ShoppingBag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";

interface ProductActionsProps {
  productId: string;
  slug: string;
}

export function ProductActions({ productId, slug }: ProductActionsProps) {
  const addToCart = useAppStore((state) => state.addToCart);

  return (
    <div className="pt-4 flex flex-wrap items-center gap-4">
      <Button
        variant="primary"
        size="lg"
        onClick={() => addToCart(productId, 1)}
        className="flex items-center gap-2"
      >
        <ShoppingBag size={18} />
        <span>Add to Cart</span>
      </Button>

      <Link href={`/products/${slug}/appointment`}>
        <Button variant="outline" size="lg" className="flex items-center gap-2 border-gold/50 text-gold hover:bg-gold/10">
          <Calendar size={18} />
          <span>Book a Private Appointment</span>
        </Button>
      </Link>
    </div>
  );
}
