"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { timelineEvents } from "@/data/timeline";
import { ROUTES } from "@/lib/constants";


export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const milestones = timelineEvents.filter((e) => e.category === "icon" || e.category === "milestone").slice(0, 4);

  return (
    <section
      ref={ref}
      id="timeline"
      className="section-glow relative scroll-mt-20 overflow-hidden bg-black py-24 md:py-32"
    >


      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          title="Our Timeline"
          subtitle="A legacy of innovation"
        />

        <div className="relative">
          {/* Vertical background line */}
          <div className="absolute left-4 top-0 bottom-0 w-px -translate-x-1/2 bg-gold/20 md:left-1/2" />

          {/* Animated scroll progress line */}
          <motion.div
            className="absolute left-4 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-gold via-[#f3d687] to-gold md:left-1/2 shadow-[0_0_12px_rgba(201,169,110,0.6)]"
            style={{
              height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
            }}
          />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((event, i) => (
              <FadeInSection
                key={event.year}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 0.15}
              >
                {/* Mobile: Left-aligned with dot over left line. Desktop: Alternating left/right */}
                <div
                  className={`relative flex flex-col pl-12 md:pl-0 md:flex-row md:items-start md:gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Text Content */}
                  <div
                    className={`flex-1 ${
                      i % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl font-light text-gold/30">
                      {event.year}
                    </span>
                    <h3 className="mt-1 sm:mt-2 text-lg sm:text-xl font-light text-cream">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-cream/50">
                      {event.description}
                    </p>
                  </div>

                  {/* Milestone Dot Marker */}
                  <div className="absolute left-0 top-1 z-10 md:relative md:left-auto md:top-auto md:flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-black shadow-[0_0_15px_rgba(201,169,110,0.3)] md:h-10 md:w-10">
                      <div className="h-2 w-2 rounded-full bg-gold" />
                    </div>
                  </div>

                  {/* Desktop Spacer for Alternating Balance */}
                  <div className="hidden flex-1 md:block" />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>

        <FadeInSection className="mt-16 flex justify-start pl-12 sm:justify-center sm:pl-0">
          <Link href={ROUTES.timeline} className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              View Full Timeline
            </Button>
          </Link>
        </FadeInSection>
      </div>
    </section>

  );
}
