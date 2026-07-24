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
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gold/20 md:left-1/2 md:-translate-x-px" />

          <motion.div
            className="absolute left-[19px] top-0 w-px bg-gold md:left-1/2 md:-translate-x-px"
            style={{
              height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
            }}
          />

          <div className="space-y-16">
            {milestones.map((event, i) => (
              <FadeInSection
                key={event.year}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 0.15}
              >
                <div
                  className={`relative flex items-start gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <span className="text-5xl font-light text-gold/30">{event.year}</span>
                    <h3 className="mt-2 text-xl font-light text-cream">{event.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/50">
                      {event.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-black">
                      <div className="h-2 w-2 rounded-full bg-gold" />
                    </div>
                  </div>

                  <div className="hidden flex-1 md:block" />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>

        <FadeInSection className="mt-16 text-center">
          <Link href={ROUTES.timeline}>
            <Button variant="outline" size="md">
              View Full Timeline
            </Button>
          </Link>
        </FadeInSection>
      </div>
    </section>

  );
}
