"use client";

import { useState } from "react";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const EMPTY_FORM: FormState = { name: "", email: "", message: "" };

export function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet — acknowledge locally and reset the form.
    setSubmitted(true);
    setForm(EMPTY_FORM);
  };

  return (
    <section
      id="contact"
      className="section-vignette relative scroll-mt-20 overflow-hidden bg-black py-24 md:py-32"
    >


      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />

      <div className="relative mx-auto max-w-3xl px-6">
        <FadeInSection direction="up">
          <div className="text-center">
            <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-gold">
              Get in Touch
            </p>
            <h2 className="mb-6 text-4xl font-light leading-tight text-cream md:text-5xl">
              Contact <span className="text-gold">Us</span>
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-sm leading-relaxed text-cream/60">
              Whether you seek a private appointment, personalised advice, or simply
              wish to learn more about {BRAND.name.split(" ")[0]}, our team would be
              delighted to assist you.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection direction="up" delay={0.15}>
          {submitted ? (
            <div className="border border-gold/30 bg-black/40 p-10 text-center backdrop-blur-sm">
              <div className="mx-auto mb-6 h-px w-16 bg-gold/60" />
              <p className="text-lg font-light text-cream">
                Thank you for reaching out.
              </p>
              <p className="mt-2 text-sm text-cream/50">
                We have received your message and will be in touch shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs tracking-[0.2em] uppercase text-gold transition-colors hover:text-gold/70"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 border border-white/5 bg-black/40 p-8 backdrop-blur-sm md:p-10"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-cream/40"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Your name"
                    className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-cream/40"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="you@example.com"
                    className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-cream/40"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="How can we help you?"
                  className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-gold/50 focus:outline-none"
                />
              </div>

              <div className="flex justify-center pt-2">
                <Button type="submit" variant="primary" size="lg">
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </FadeInSection>
      </div>
    </section>
  );
}
