"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
  /** How far (in px) the content eases as it scrolls. Higher = more motion. */
  intensity?: number;
}

/**
 * Wraps its children in a spring-smoothed vertical transform tied to scroll
 * progress. Previously this component called `useScroll` but discarded the
 * result, so it did nothing. Now it applies a subtle, damped parallax easing.
 */
export function SmoothScroll({
  children,
  className,
  intensity = 40,
}: SmoothScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const y = useTransform(smooth, [0, 1], [intensity, -intensity]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
