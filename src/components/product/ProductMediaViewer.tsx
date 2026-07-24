"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Product } from "@/types/product";

interface ProductMediaViewerProps {
  product: Product;
  className?: string;
}

export function ProductMediaViewer({ product, className }: ProductMediaViewerProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 50, y: 50 });
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Studio Header (Desktop Only) */}
      <div className="hidden md:flex items-center justify-end px-2">
        <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-cream/40">
          <ZoomIn size={12} className="text-gold/80" />
          Move mouse to magnify
        </span>
      </div>

      {/* Main Display Container */}
      <div className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-4 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-gold/40">
        {/* Ambient Gold Radial Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-72 w-72 rounded-full bg-gold/15 blur-3xl transition-all duration-700 group-hover:bg-gold/25 group-hover:scale-110" />
        </div>

        {/* Flipkart-Style Interactive Mouse-Tracking Zoom Box */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative flex h-full w-full cursor-crosshair items-center justify-center overflow-hidden"
        >
          {currentImage ? (
            <div
              className="relative h-full w-full transition-transform duration-150 ease-out will-change-transform"
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transform: isHovered ? "scale(1.3)" : "scale(1)",
              }}
            >
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
              />
            </div>
          ) : (
            <div className="text-center text-cream/40 text-xs tracking-widest uppercase">
              No photo available
            </div>
          )}
        </div>

        {/* Hover Hint Overlay (Desktop Only) */}
        <div
          className={`pointer-events-none hidden md:block absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[9px] font-medium tracking-widest uppercase backdrop-blur-md transition-all duration-300 ${
            isHovered ? "border-gold/40 text-gold shadow-md shadow-gold/20 opacity-100" : "text-cream/40 opacity-70"
          }`}
        >
          {isHovered ? "1.6x Magnified View" : "Hover to Inspect"}
        </div>
      </div>

      {/* Multiple Images Thumbnail Gallery (if more than 1 image exists) */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative h-16 w-16 overflow-hidden rounded-md border p-1 transition-all duration-300 ${selectedImageIndex === idx
                ? "border-gold bg-gold/10 shadow-lg shadow-gold/20"
                : "border-white/10 bg-black/40 opacity-60 hover:opacity-100"
                }`}
            >
              <Image
                src={img}
                alt={`${product.name} view ${idx + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
