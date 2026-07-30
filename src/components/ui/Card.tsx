"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden border border-gold/15 bg-black/40 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
