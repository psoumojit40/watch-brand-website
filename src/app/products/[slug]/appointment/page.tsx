"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, Lock, ArrowRight } from "lucide-react";
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
  const router = useRouter();
  const { data: session, status } = useSession();
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  const [form, setForm] = useState({
    boutique: BOUTIQUES[0],
    time: TIME_SLOTS[0],
    notes: "",
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

    if (status !== "authenticated") {
      router.push(`/auth/login?callbackUrl=/products/${slug}/appointment`);
      return;
    }

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

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          boutique: form.boutique,
          date: formattedDate,
          timeSlot: form.time,
          notes: form.notes,
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

        {/* Unauthenticated Login Gate Prompt */}
        {status === "unauthenticated" && (
          <div className="mb-10 rounded-2xl border border-gold/40 bg-[#12100d] p-6 text-center space-y-3 shadow-xl">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
              <Lock size={18} className="text-gold" />
            </div>
            <h2 className="text-base font-light text-cream">Login Required to Book</h2>
            <p className="text-xs text-cream/60 max-w-lg mx-auto">
              To schedule a private consultation and view timepieces at our boutiques, please sign in to your account.
            </p>
            <div className="pt-2">
              <Link href={`/auth/login?callbackUrl=/products/${slug}/appointment`}>
                <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                  <span>Sign In to Book Appointment</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-gold/30 bg-neutral-950/80 p-10 text-center shadow-2xl backdrop-blur-md space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-gold/10 text-gold">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-gold">
                Appointment Confirmed
              </p>
              <h2 className="mt-2 text-2xl font-light text-cream">
                We Look Forward to Welcoming You
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-cream/60">
                A confirmation has been sent to{" "}
                <span className="text-gold">{session?.user?.email}</span>. Our boutique concierge will be prepared for your private consultation.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-neutral-900/50 p-4 text-left text-xs space-y-2 text-cream/70">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-cream/40">Timepiece:</span>
                <span className="font-medium text-cream">{product.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-cream/40">Boutique:</span>
                <span className="font-medium text-cream">{form.boutique}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream/40">Date & Time:</span>
                <span className="font-medium text-cream">
                  {selectedDate?.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} @ {form.time}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link href="/profile?tab=appointments">
                <Button variant="primary" className="w-full">
                  View My Appointments in Profile
                </Button>
              </Link>
              <Link href={`/products/${slug}`}>
                <Button variant="outline" className="w-full">
                  Return to Timepiece Details
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            
            {/* Left Column: Watch Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-gold">
                  Private Consultation
                </p>
                <h1 className="mt-1 text-3xl font-light text-cream">
                  Schedule Your Boutique Experience
                </h1>
                <p className="mt-2 text-xs text-cream/60 leading-relaxed">
                  Experience the craftsmanship of Audemars Piguet in person. Select your preferred boutique location and date below.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-6 backdrop-blur-md space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black border border-white/5 p-4">
                  {mainImage && (
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold/80 font-medium">
                    {product.collection}
                  </p>
                  <h3 className="text-lg font-light text-cream">{product.name}</h3>
                  <p className="text-sm font-medium text-gold mt-1">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Appointment Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/10 bg-neutral-950/80 p-8 shadow-2xl backdrop-blur-md space-y-6"
              >
                <h2 className="text-base font-light tracking-wide text-cream border-b border-white/10 pb-4">
                  Consultation Details
                </h2>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                    {error}
                  </div>
                )}

                {/* Date Selection */}
                <div>
                  <label className={labelCls}>1. Select Date</label>
                  <Calendar selected={selectedDate} onChange={setSelectedDate} />
                  {selectedDate && (
                    <p className="mt-2 text-xs text-gold font-medium">
                      Selected Date: {selectedDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </div>

                {/* Time & Location Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>2. Preferred Time Slot</label>
                    <select value={form.time} onChange={set("time")} className={inputCls}>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>3. Boutique Location</label>
                    <select value={form.boutique} onChange={set("boutique")} className={inputCls}>
                      {BOUTIQUES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className={labelCls}>Special Requests / Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Let us know if you would like to view complementary timepieces or require VIP arrangements."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5"
                  disabled={isSubmitting || status === "unauthenticated"}
                >
                  {isSubmitting
                    ? "Booking Consultation..."
                    : status === "unauthenticated"
                    ? "Sign In Required to Book"
                    : "Confirm Boutique Appointment"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
