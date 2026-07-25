"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { timelineEvents } from "@/data/timeline";

export function FullTimelineView() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="mx-auto max-w-5xl px-6">
      <SectionTitle title="Our Timeline" subtitle="A legacy of innovation since 1875" />

      <div className="relative mt-12">
        {/* Background line: centered on dot at 20px on mobile (left-5), 50% on desktop */}
        <div className="absolute left-5 top-0 bottom-0 w-px -translate-x-1/2 bg-gold/20 md:left-1/2" />

        {/* Animated scroll progress line: centered on dot at 20px on mobile (left-5), 50% on desktop */}
        <motion.div
          className="absolute left-5 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-gold via-[#f3d687] to-gold md:left-1/2 shadow-[0_0_12px_rgba(201,169,110,0.6)]"
          style={{ height: lineHeight }}
        />

        <div className="space-y-12 sm:space-y-20">
          {timelineEvents.map((event, i) => (
            <FadeInSection
              key={event.year}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 0.1}
            >
              {/* Container: pl-14 on mobile so text doesn't overlap the left dot & line */}
              <div
                className={`relative flex flex-col pl-14 md:pl-0 md:flex-row md:items-start md:gap-6 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Text Content */}
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <span className="inline-block rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-gold">
                    {event.category}
                  </span>
                  <div className="mt-2 flex flex-col">
                    <span className="text-3xl sm:text-5xl font-light text-gold/40">
                      {event.year}
                    </span>
                    <h3 className="mt-1 text-xl sm:text-2xl font-light text-cream">
                      {event.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-cream/60">
                    {event.description}
                  </p>
                </div>

                {/* Milestone Dot Marker: Absolute left-0 (0..40px, center at 20px) on mobile, relative on desktop */}
                <div className="absolute left-0 top-1 z-10 md:relative md:left-auto md:top-auto md:flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-black shadow-[0_0_15px_rgba(201,169,110,0.4)]">
                    <div className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(229,193,88,0.8)]" />
                  </div>
                </div>

                {/* Desktop Spacer / Year Badge */}
                <div className="hidden flex-1 md:block">
                  <div className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    <span className="text-6xl font-light text-gold/15 select-none">
                      {event.year}
                    </span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}
