"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ShieldAlert, ArrowRight, CheckCircle2, RefreshCw, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend Cooldown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send verification code.");
      } else {
        setSuccessMessage(`Verification code sent to ${email}`);
        setStep("otp");
        setResendCooldown(60);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otp || otp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setSubmitting(false);
        return;
      }

      // Automatically sign in upon successful registration & verification
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/auth/login?registered=true");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred during account verification.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setSuccessMessage("");
    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend code.");
      } else {
        setSuccessMessage(`A new verification code was sent to ${email}`);
        setResendCooldown(60);
      }
    } catch (err) {
      setError("Failed to resend verification code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOAuthSignIn = (provider: "google") => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#3d3321] bg-[#0d0c0a]/90 p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-[#c9a96e]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#c9a96e]/10 blur-3xl" />

      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a96e]/60 bg-[#14120e] shadow-[0_0_20px_rgba(201,169,110,0.2)]">
          <span className="text-sm font-semibold tracking-wider text-[#e6ce96]">AP</span>
        </div>
        <h1 className="text-2xl font-light tracking-wide text-cream">Create New Account</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#a39474]">
          {step === "details" ? "Sign Up to Continue" : "Verify Your Email Address"}
        </p>
      </div>

      {/* Global Notifications */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
        >
          <ShieldAlert size={16} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
        >
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {step === "details" ? (
        <>
          {/* OAuth Option */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 px-4 text-xs font-semibold tracking-wider text-cream transition-all hover:border-[#c9a96e] hover:bg-[#1a1712]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Quick Register with Gmail</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-[#2e2617]" />
            <span className="absolute bg-[#0d0c0a] px-3 text-[10px] uppercase tracking-widest text-[#a39474]">
              Or Register with Email
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label className="block mb-1 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream placeholder-cream/30 focus:border-[#c9a96e] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream placeholder-cream/30 focus:border-[#c9a96e] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream placeholder-cream/30 focus:border-[#c9a96e] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream placeholder-cream/30 focus:border-[#c9a96e] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3"
              disabled={sendingOtp}
            >
              <span>{sendingOtp ? "Sending Verification Code..." : "Send Verification Code"}</span>
              {!sendingOtp && <ArrowRight size={14} />}
            </Button>
          </form>
        </>
      ) : (
        /* Step 2: 6-Digit OTP Verification Form */
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleVerifyAndRegister}
          className="space-y-6"
        >
          <div className="rounded-xl border border-[#3d3321] bg-[#14120e] p-4 text-center space-y-1">
            <p className="text-xs text-cream/70">
              We sent a 6-digit verification code to
            </p>
            <p className="text-xs font-semibold text-[#f3d687]">{email}</p>
          </div>

          <div>
            <label className="block mb-2 text-center text-[10px] uppercase tracking-[0.25em] text-[#a39474]">
              Enter 6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a96e]" />
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-xl border border-[#c9a96e]/60 bg-[#14120e] py-3.5 pl-12 pr-4 text-center font-mono text-xl tracking-[0.4em] text-[#f3d687] focus:border-[#f3d687] focus:outline-none shadow-[0_0_20px_rgba(201,169,110,0.15)]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 flex items-center justify-center gap-2"
              disabled={submitting || otp.length < 6}
            >
              <span>{submitting ? "Verifying Account..." : "Verify & Complete Registration"}</span>
              {!submitting && <ArrowRight size={14} />}
            </Button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="text-cream/50 hover:text-cream transition-colors"
              >
                ← Back to Details
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || sendingOtp}
                onClick={handleResendCode}
                className="flex items-center gap-1.5 text-[#c9a96e] hover:underline disabled:opacity-40 disabled:no-underline font-medium"
              >
                <RefreshCw size={12} className={sendingOtp ? "animate-spin" : ""} />
                <span>
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : "Resend Verification Code"}
                </span>
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Footer */}
      <div className="mt-6 text-center border-t border-[#2e2617] pt-4">
        <p className="text-xs text-cream/60">
          Already have an account?{" "}
          <Link
            href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="text-[#c9a96e] hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 flex items-center justify-center section-glow">
      <Suspense fallback={<div className="text-cream text-xs">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
