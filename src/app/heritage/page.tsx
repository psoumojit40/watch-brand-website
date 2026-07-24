import { Metadata } from "next";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Heritage | Audemars Piguet",
  description: "Discover the heritage of Audemars Piguet, Swiss luxury watch manufacturer since 1875.",
};

export default function HeritagePage() {
  return (
    <div className="pt-24">
      <section className="relative min-h-[60vh] bg-black py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <FadeInSection>
            <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-gold">
              Since {BRAND.founded}
            </p>
            <h1 className="mb-8 text-5xl font-light text-cream md:text-7xl">
              Our Heritage
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-cream/60">
              For over a century and a half, Audemars Piguet has remained at the
              pinnacle of Swiss watchmaking, driven by an unrelenting pursuit of
              perfection and a passion for pushing the boundaries of what is
              possible in horology.
            </p>
          </FadeInSection>
        </div>
      </section>

      <section className="bg-darkGray py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionTitle title="The Atelier" subtitle="Le Brassus, Switzerland" align="left" />

          <div className="space-y-12">
            <FadeInSection>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-light text-cream">
                    Handcrafted Excellence
                  </h3>
                  <p className="text-sm leading-relaxed text-cream/50">
                    Every Audemars Piguet timepiece begins its journey in the
                    Vallée de Joux, where our master watchmakers have honed
                    their craft for generations. Each movement is assembled,
                    decorated, and regulated entirely by hand.
                  </p>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-light text-cream">
                    Innovation Through Tradition
                  </h3>
                  <p className="text-sm leading-relaxed text-cream/50">
                    While respecting centuries of tradition, we continuously
                    innovate. From the first minute repeater wristwatch to the
                    revolutionary Royal Oak, our history is defined by
                    firsts.
                  </p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-light text-cream">
                    The Complications
                  </h3>
                  <p className="text-sm leading-relaxed text-cream/50">
                    We are known as the &ldquo;Master of Complications&rdquo; for good reason.
                    Our repertoire includes minute repeaters, perpetual calendars,
                    tourbillons, and grande sonneries — each a symphony of
                    mechanical ingenuity.
                  </p>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-light text-cream">
                    Beyond Timekeeping
                  </h3>
                  <p className="text-sm leading-relaxed text-cream/50">
                    A watch is more than an instrument. It is an expression of
                    personal style, a companion through life&apos;s moments, and a
                    legacy to pass down through generations.
                  </p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      <section className="bg-black py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeInSection>
            <div className="border border-gold/20 p-12 md:p-16">
              <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-gold">
                Our Philosophy
              </p>
              <blockquote className="text-xl font-light leading-relaxed text-cream/80 md:text-2xl">
                &ldquo;To master time, one must first master oneself.&rdquo;
              </blockquote>
              <div className="mx-auto mt-6 h-px w-12 bg-gold/60" />
              <p className="mt-6 text-xs tracking-[0.2em] uppercase text-cream/30">
                — Jules Louis Audemars, 1875
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
