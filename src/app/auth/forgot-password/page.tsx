"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldAlert, ArrowRight, CheckCircle2, RefreshCw, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/reset-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset code.");
      } else {
        setSuccessMessage(`Password reset code sent to ${email}`);
        setStep("reset");
        setResendCooldown(60);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otp || otp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        setSubmitting(false);
        return;
      }

      setSuccessMessage("Password reset successfully! Logging you in...");

      // Automatically sign in with the new password
      const signInRes = await signIn("credentials", {
        email,
        password: newPassword,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/auth/login?reset=true");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred while resetting your password.");
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
      const res = await fetch("/api/auth/reset-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend code.");
      } else {
        setSuccessMessage(`A new reset code was sent to ${email}`);
        setResendCooldown(60);
      }
    } catch (err) {
      setError("Failed to resend reset code.");
    } finally {
      setSendingOtp(false);
    }
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
        <h1 className="text-2xl font-light tracking-wide text-cream">Forgot Password</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#a39474]">
          {step === "email" ? "Account Password Reset" : "Verify OTP & Set New Password"}
        </p>
      </div>

      {/* Notifications */}
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

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <p className="text-xs text-cream/70 text-center mb-2">
            Enter your account email address below. We will send a 6-digit OTP code to verify your identity.
          </p>

          <div>
            <label className="block mb-1 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
              Registered Email Address
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

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2 flex items-center justify-center gap-2 py-3"
            disabled={sendingOtp}
          >
            <span>{sendingOtp ? "Sending Reset Code..." : "Send Password Reset OTP"}</span>
            {!sendingOtp && <ArrowRight size={14} />}
          </Button>
        </form>
      ) : (
        /* Step 2: Enter OTP & New Password */
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleResetPassword}
          className="space-y-4"
        >
          <div className="rounded-xl border border-[#3d3321] bg-[#14120e] p-3 text-center">
            <p className="text-[11px] text-cream/70">
              Reset code sent to <span className="text-[#f3d687] font-semibold">{email}</span>
            </p>
          </div>

          <div>
            <label className="block mb-1.5 text-center text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
              6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9a96e]" />
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-xl border border-[#c9a96e]/60 bg-[#14120e] py-2.5 pl-11 pr-4 text-center font-mono text-lg tracking-[0.3em] text-[#f3d687] focus:border-[#f3d687] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
              New Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream placeholder-cream/30 focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream placeholder-cream/30 focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 flex items-center justify-center gap-2"
              disabled={submitting || otp.length < 6}
            >
              <span>{submitting ? "Resetting Password..." : "Reset Password & Sign In"}</span>
              {!submitting && <ArrowRight size={14} />}
            </Button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-cream/50 hover:text-cream transition-colors"
              >
                ← Back to Email
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || sendingOtp}
                onClick={handleResendCode}
                className="flex items-center gap-1 text-[#c9a96e] hover:underline disabled:opacity-40 font-medium"
              >
                <RefreshCw size={11} className={sendingOtp ? "animate-spin" : ""} />
                <span>{resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : "Resend OTP"}</span>
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Footer link to Sign In */}
      <div className="mt-6 text-center border-t border-[#2e2617] pt-4">
        <p className="text-xs text-cream/60">
          Remembered your password?{" "}
          <Link href="/auth/login" className="text-[#c9a96e] hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 flex items-center justify-center section-glow">
      <Suspense fallback={<div className="text-cream text-xs">Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
