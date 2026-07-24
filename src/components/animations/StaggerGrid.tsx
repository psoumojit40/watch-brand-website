"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StaggerGridProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function StaggerGrid({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
}: StaggerGridProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div ref={ref} className={cn(className)}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
