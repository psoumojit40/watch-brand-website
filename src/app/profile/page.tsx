"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Package,
  Calendar,
  Shield,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "info";
  const { data: session, status, update } = useSession();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync search param tab
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Protect page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/profile");
    }
  }, [status, router]);

  // Fetch User Profile, Orders & Appointments
  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      Promise.all([
        fetch("/api/user/profile").then((res) => res.json()),
        fetch("/api/orders").then((res) => res.json()),
        fetch("/api/appointments").then((res) => res.json()),
      ])
        .then(([profileData, ordersData, appointmentsData]) => {
          if (profileData.user) {
            setProfile({
              name: profileData.user.name || "",
              email: profileData.user.email || "",
              phone: profileData.user.phone || "",
              address: profileData.user.address || "",
            });
          }
          if (ordersData.orders) {
            setOrders(ordersData.orders);
          }
          if (appointmentsData.appointments) {
            setAppointments(appointmentsData.appointments);
          }
        })
        .catch((err) => console.error("Error loading profile data:", err))
        .finally(() => setLoading(false));
    }
  }, [status]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (newPassword && newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to update profile." });
      } else {
        setMessage({ type: "success", text: "Account profile updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        // Update next-auth session name
        update({ name: profile.name });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 flex flex-col items-center justify-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a96e]/60 bg-[#14120e] animate-pulse">
          <span className="text-xs font-semibold text-[#e6ce96]">AP</span>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#a39474]">
          Loading Account...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Profile Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[#3d3321] bg-gradient-to-r from-[#0d0c0a] via-[#14120d] to-[#0d0c0a] p-6 sm:p-8 shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c9a96e]/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-[#c9a96e]/60 bg-[#1a1712] text-2xl font-light text-[#f3d687] shadow-[0_0_25px_rgba(201,169,110,0.2)]">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a96e]">
                  My Account
                </p>
                <h1 className="text-2xl sm:text-3xl font-light text-cream">
                  {session?.user?.name || "Welcome"}
                </h1>
                <p className="text-xs text-cream/50 mt-0.5">{session?.user?.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex overflow-x-auto border-b border-[#2e2617] pb-px scrollbar-none">
          {[
            { id: "info", label: "Account Details", icon: User },
            { id: "orders", label: `Orders (${orders.length})`, icon: Package },
            { id: "appointments", label: `Appointments (${appointments.length})`, icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isActive
                    ? "border-[#c9a96e] text-[#f3d687]"
                    : "border-transparent text-cream/50 hover:text-cream hover:border-[#3d3321]"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Toast / Feedback Banner */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 rounded-lg border p-4 text-xs ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="shrink-0 text-red-400" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* Tab Content Panels */}
        <div className="grid gap-8">
          {/* 1. Account Details Tab */}
          {activeTab === "info" && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleUpdateProfile}
              className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-6 sm:p-8 space-y-6"
            >
              <div>
                <h2 className="text-lg font-light text-cream">Personal Information</h2>
                <p className="text-xs text-cream/50">
                  Manage your official contact details and shipping information for boutique orders.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream focus:border-[#c9a96e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                    Email Address (Account ID)
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                    <input
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full rounded-lg border border-[#2e2617] bg-[#090807] py-2.5 pl-10 pr-4 text-xs text-cream/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+41 21 845 14 00"
                      className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream focus:border-[#c9a96e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                    Delivery / Residence Address
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3 text-cream/40" />
                    <textarea
                      rows={2}
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Route de France 8, 1348 Le Brassus, Switzerland"
                      className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2 pl-10 pr-4 text-xs text-cream focus:border-[#c9a96e] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#2e2617] pt-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-cream mb-1">Account Security & Password</h3>
                  <p className="text-xs text-cream/50">
                    Need to change or reset your password? Receive a 6-digit OTP verification code on your email.
                  </p>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9a96e]/60 bg-[#14120e] px-4 py-2.5 text-xs font-semibold tracking-wider text-[#f3d687] transition-all hover:border-[#f3d687] hover:bg-[#1a1712]"
                >
                  <Lock size={14} className="text-[#c9a96e]" />
                  <span>Reset Password via Email OTP</span>
                </Link>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" type="submit" disabled={saving} className="flex items-center gap-2">
                  <Save size={16} />
                  <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
                </Button>
              </div>
            </motion.form>
          )}

          {/* 2. Orders Tab */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {orders.length === 0 ? (
                <div className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-12 text-center space-y-3">
                  <Package size={36} className="mx-auto text-[#c9a96e]/40" />
                  <h3 className="text-base font-light text-cream">No Orders Placed Yet</h3>
                  <p className="text-xs text-cream/50 max-w-sm mx-auto">
                    Your collection purchases and acquired timepieces will be documented here.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-6 space-y-4 transition-all hover:border-[#c9a96e]/40"
                  >
                    <div className="flex flex-wrap items-center justify-between border-b border-[#2e2617] pb-4 gap-2">
                      <div>
                        <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#c9a96e]">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <p className="text-xs text-cream/50">
                          Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {order.status}
                        </span>
                        <span className="text-sm font-light text-[#c9a96e]">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-[#c9a96e]" />
                            <span className="font-medium text-cream">{item.product.name}</span>
                            <span className="text-cream/40">x{item.quantity}</span>
                          </div>
                          <span className="text-cream/80">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#2e2617] pt-3 text-[11px] text-cream/40 flex justify-between">
                      <span>Delivery: {order.shippingAddress || "Main Boutique Pickup"}</span>
                      <span>Payment: {order.paymentMethod}</span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* 3. Appointments Tab */}
          {activeTab === "appointments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {appointments.length === 0 ? (
                <div className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-12 text-center space-y-3">
                  <Calendar size={36} className="mx-auto text-[#c9a96e]/40" />
                  <h3 className="text-base font-light text-cream">No Boutique Consultations Booked</h3>
                  <p className="text-xs text-cream/50 max-w-sm mx-auto">
                    Book a private appointment to experience timepieces in person with our horological experts.
                  </p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="rounded-2xl border border-[#3d3321] bg-[#0d0c0a] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#c9a96e]/40"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#c9a96e]">
                        {apt.product?.name || "Horological Consultation"}
                      </span>
                      <h4 className="text-sm font-medium text-cream">{apt.boutique}</h4>
                      <p className="text-xs text-cream/60 flex items-center gap-2">
                        <Clock size={13} className="text-[#c9a96e]" />
                        <span>
                          {apt.date} &middot; {apt.timeSlot}
                        </span>
                      </p>
                    </div>

                    <span className="rounded-full bg-gold/10 border border-gold/40 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] pt-32 text-center text-cream">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
