"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Product360Viewer } from "@/components/product/Product360Viewer";
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
    <div className="border border-white/10 bg-black/40 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button onClick={prev} className="px-2 text-cream/50 hover:text-gold">‹</button>
        <span className="text-xs tracking-[0.2em] uppercase text-cream/70">
          {MONTHS[month]} {year}
        </span>
        <button onClick={next} className="px-2 text-cream/50 hover:text-gold">›</button>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAYS.map((d) => (
          <span key={d} className="text-[10px] tracking-wider text-cream/30">{d}</span>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 text-center">
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
              key={i}
              disabled={isPast}
              onClick={() => onChange(date)}
              className={[
                "mx-auto my-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors",
                isPast ? "cursor-not-allowed text-cream/20" : "hover:bg-gold/20 text-cream/70",
                isSelected ? "bg-gold text-black font-medium" : "",
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

// ─── Time slots ───────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export default function AppointmentPage({ params }: Props) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", boutique: "", time: "", notes: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls =
    "w-full border border-white/10 bg-black px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none transition-colors";

  const labelCls = "mb-2 block text-[10px] tracking-[0.2em] uppercase text-cream/40";

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase text-gold">
          {product.collection}
        </p>
        <h1 className="mb-12 text-3xl font-light text-cream">
          Book an Appointment
        </h1>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* ── Left: form ── */}
          <div>
            {submitted ? (
              <div className="border border-gold/30 bg-black/40 p-10 text-center">
                <div className="mx-auto mb-6 h-px w-16 bg-gold/60" />
                <p className="text-lg font-light text-cream">Appointment Requested</p>
                <p className="mt-2 text-sm text-cream/50">
                  Our team will confirm your appointment within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input required value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 00000 00000" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email</label>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Preferred Date</label>
                  <Calendar selected={selectedDate} onChange={setSelectedDate} />
                  {selectedDate && (
                    <p className="mt-2 text-xs text-gold/70">
                      Selected: {selectedDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Preferred Time</label>
                  <select required value={form.time} onChange={set("time")} className={inputCls + " cursor-pointer"}>
                    <option value="" disabled className="bg-black text-cream/50">Select a time slot</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t} className="bg-black text-cream">{t}</option>
                    ))}
                  </select>

                </div>

                <div>
                  <label className={labelCls}>Boutique Location</label>
                  <select required value={form.boutique} onChange={set("boutique")} className={inputCls + " cursor-pointer"}>
                    <option value="" disabled className="bg-black text-cream/50">Select a boutique</option>
                    {BOUTIQUES.map((b) => (
                      <option key={b} value={b} className="bg-black text-cream">{b}</option>
                    ))}
                  </select>

                </div>

                <div>
                  <label className={labelCls}>Notes (optional)</label>
                  <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Any special requests or questions…" className={inputCls + " resize-none"} />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                  Confirm Appointment
                </Button>
              </form>
            )}
          </div>

          {/* ── Right: watch + info ── */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Product360Viewer className="rounded-sm" />
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-gold">
                {product.collection}
              </p>
              <h2 className="mt-1 text-2xl font-light text-cream">{product.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">{product.shortDescription}</p>
              <p className="mt-4 text-2xl font-light text-gold">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
