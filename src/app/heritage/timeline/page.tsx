import { Metadata } from "next";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { timelineEvents } from "@/data/timeline";

export const metadata: Metadata = {
  title: "Timeline | Audemars Piguet",
  description: "Explore the history of Audemars Piguet through key milestones since 1875.",
};

export default function TimelinePage() {
  return (
    <div className="pt-24">
      <section className="bg-black py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle title="Our Timeline" subtitle="A legacy of innovation since 1875" />

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gold/20 md:left-1/2 md:-translate-x-px" />

            <div className="space-y-20">
              {timelineEvents.map((event, i) => (
                <FadeInSection
                  key={event.year}
                  direction={i % 2 === 0 ? "left" : "right"}
                  delay={i * 0.1}
                >
                  <div
                    className={`relative flex items-start gap-6 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <span className="inline-block rounded-full border border-gold/20 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-gold">
                        {event.category}
                      </span>
                      <h3 className="mt-4 text-2xl font-light text-cream">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/50">
                        {event.description}
                      </p>
                    </div>

                    <div className="relative z-10 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-black">
                        <div className="h-2 w-2 rounded-full bg-gold" />
                      </div>
                    </div>

                    <div className="hidden flex-1 md:block">
                      <span className="text-6xl font-light text-gold/10">
                        {event.year}
                      </span>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
