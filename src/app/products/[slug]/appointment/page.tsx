"use client";

import { use, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";

// ─── Mini calendar ────────────────────────────────────────────────────────────

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function Calendar({
  selected,
  onChange,
}: {
  selected: Date | null;
  onChange: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setView(new Date(year, month - 1, 1));
  const next = () => setView(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-md border border-white/10 bg-neutral-950/80 p-4 backdrop-blur-md">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={prev} className="px-2 text-cream/50 hover:text-gold text-sm font-bold">‹</button>
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-cream/80">
          {MONTHS[month]} {year}
        </span>
        <button type="button" onClick={next} className="px-2 text-cream/50 hover:text-gold text-sm font-bold">›</button>
      </div>

      {/* Day labels */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {DAYS.map((d) => (
          <span key={d} className="text-[10px] tracking-wider uppercase text-gold/60 font-semibold">{d}</span>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 text-center gap-1">
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const date = new Date(year, month, day);
          const isPast = date < today;
          const isSelected =
            selected?.getFullYear() === year &&
            selected?.getMonth() === month &&
            selected?.getDate() === day;

          return (
            <button
              type="button"
              key={i}
              disabled={isPast}
              onClick={() => onChange(date)}
              className={[
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all duration-200",
                isPast ? "cursor-not-allowed opacity-20 text-cream" : "hover:bg-gold/20 text-cream/80",
                isSelected ? "bg-gold text-black font-semibold shadow-md shadow-gold/30" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Time slots & Boutiques ───────────────────────────────────────────────────

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const BOUTIQUES = [
  "Mumbai – Bandra Kurla Complex",
  "Delhi – The Chanakya",
  "Bengaluru – UB City",
  "Chennai – Express Avenue",
  "Hyderabad – Jubilee Hills",
];

// ─── Page Component ───────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export default function AppointmentPage({ params }: Props) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", boutique: "", time: "", notes: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      setError("Please select your preferred appointment date on the calendar.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formattedDate = selectedDate.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const appointmentDetails = `
      APPOINTMENT REQUEST DETAILS:
      Timepiece: ${product.name} (${product.collection})
      Price: ₹${product.price.toLocaleString("en-IN")}
      Boutique Location: ${form.boutique}
      Date: ${formattedDate}
      Time: ${form.time}
      Client Phone: ${form.phone}
      Special Notes: ${form.notes || "None"}
    `;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: appointmentDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to book appointment.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none transition-colors rounded-sm";

  const labelCls = "mb-2 block text-[10px] tracking-[0.2em] uppercase text-cream/50 font-medium";

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase text-gold">
          {product.collection}
        </p>
        <h1 className="mb-12 text-4xl font-light text-cream md:text-5xl">
          Book a Private Appointment
        </h1>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* ── Left Column: Booking Form ── */}
          <div>
            {submitted ? (
              <div className="border border-gold/30 bg-neutral-950/60 p-10 text-center backdrop-blur-md rounded-md shadow-2xl">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-gold" />
                <h3 className="text-2xl font-light text-cream">Appointment Requested</h3>
                <p className="mt-3 text-sm text-cream/70 leading-relaxed max-w-md mx-auto">
                  Thank you, <span className="text-gold font-medium">{form.name}</span>. We have received your booking request for the <span className="text-gold">{product.name}</span>.
                </p>
                <div className="my-6 border-y border-white/10 py-4 text-xs text-cream/60 space-y-2 text-left max-w-sm mx-auto">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-gold" /> {form.boutique}</p>
                  <p className="flex items-center gap-2"><CalendarIcon size={14} className="text-gold" /> {selectedDate?.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} at {form.time}</p>
                </div>
                <p className="text-xs text-cream/50">
                  Our private concierge will contact you within 24 hours to confirm your reservation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 border border-white/10 bg-neutral-950/40 p-8 backdrop-blur-md rounded-md">
                {error && (
                  <div className="border border-red-500/30 bg-red-950/40 p-4 text-center text-xs text-red-300 rounded">
                    {error}
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input required value={form.name} onChange={set("name")} disabled={isSubmitting} placeholder="Your full name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input required type="tel" value={form.phone} onChange={set("phone")} disabled={isSubmitting} placeholder="+91 98765 43210" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email Address</label>
                  <input required type="email" value={form.email} onChange={set("email")} disabled={isSubmitting} placeholder="you@example.com" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Preferred Date</label>
                  <Calendar selected={selectedDate} onChange={setSelectedDate} />
                  {selectedDate && (
                    <p className="mt-2 text-xs text-gold font-medium">
                      Selected Date: {selectedDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Preferred Time Slot</label>
                  <div className="relative">
                    <select required value={form.time} onChange={set("time")} disabled={isSubmitting} className={inputCls + " cursor-pointer"}>
                      <option value="" disabled className="bg-black text-cream/50">Select a time slot</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t} className="bg-black text-cream">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Boutique Location</label>
                  <select required value={form.boutique} onChange={set("boutique")} disabled={isSubmitting} className={inputCls + " cursor-pointer"}>
                    <option value="" disabled className="bg-black text-cream/50">Select a boutique</option>
                    {BOUTIQUES.map((b) => (
                      <option key={b} value={b} className="bg-black text-cream">{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Notes (optional)</label>
                  <textarea rows={3} value={form.notes} onChange={set("notes")} disabled={isSubmitting} placeholder="Any special requests or questions…" className={inputCls + " resize-none"} />
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full justify-center">
                  {isSubmitting ? "Confirming Reservation..." : "Confirm Private Appointment"}
                </Button>
              </form>
            )}
          </div>

          {/* ── Right Column: Selected Watch Showcase ── */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-square w-full overflow-hidden rounded-md border border-white/10 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-8 shadow-2xl backdrop-blur-md">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
              </div>
              {mainImage ? (
                <div className="relative h-full w-full">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
                  />
                </div>
              ) : (
                <div className="text-center text-cream/40">No photo available</div>
              )}
            </div>

            <div className="border border-white/10 bg-neutral-950/60 p-6 rounded-md backdrop-blur-md">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-gold">
                {product.collection}
              </p>
              <h2 className="mt-1 text-2xl font-light text-cream">{product.name}</h2>
              <p className="mt-2 text-xs leading-relaxed text-cream/60">{product.shortDescription}</p>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] uppercase tracking-widest text-cream/40">Reference Price</span>
                <span className="text-xl font-light text-gold">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
