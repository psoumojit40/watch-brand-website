"use client";

import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

export function GlassPanel({ children, className, intensity = "medium" }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-xl border",
        intensity === "light" && "bg-white/5 border-white/10",
        intensity === "medium" && "bg-white/[0.07] border-white/[0.12]",
        intensity === "heavy" && "bg-black/60 border-gold/20",
        className
      )}
    >
      {children}
    </div>
  );
}
