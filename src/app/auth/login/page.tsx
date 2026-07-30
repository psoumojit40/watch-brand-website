"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorParam ? "Authentication failed. Please check your credentials." : "");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: "google" | "facebook") => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#3d3321] bg-[#0d0c0a]/90 p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-[#c9a96e]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#c9a96e]/10 blur-3xl" />

      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a96e]/60 bg-[#14120e] shadow-[0_0_20px_rgba(201,169,110,0.2)]">
          <span className="text-sm font-semibold tracking-wider text-[#e6ce96]">AP</span>
        </div>
        <h1 className="text-2xl font-light tracking-wide text-cream">Sign In</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#a39474]">
          Welcome Back
        </p>
      </div>

      {/* Error notification */}
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

      {/* OAuth Options */}
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
          <span>Continue with Gmail</span>
        </button>

        {/* Facebook Login (Disabled for now)
        <button
          type="button"
          onClick={() => handleOAuthSignIn("facebook")}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 px-4 text-xs font-semibold tracking-wider text-cream transition-all hover:border-[#c9a96e] hover:bg-[#1a1712]"
        >
          <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Continue with Facebook</span>
        </button>
        */}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-full border-t border-[#2e2617]" />
        <span className="absolute bg-[#0d0c0a] px-3 text-[10px] uppercase tracking-widest text-[#a39474]">
          Or Login with Email
        </span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#a39474]">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[10px] text-[#c9a96e] hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-[#3d3321] bg-[#14120e] py-2.5 pl-10 pr-4 text-xs text-cream placeholder-cream/30 focus:border-[#c9a96e] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 flex items-center justify-center gap-2 py-3"
          disabled={loading}
        >
          <span>{loading ? "Signing In..." : "Sign In"}</span>
          {!loading && <ArrowRight size={14} />}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center border-t border-[#2e2617] pt-4">
        <p className="text-xs text-cream/60">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/register${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="text-[#c9a96e] hover:underline font-semibold"
          >
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 flex items-center justify-center section-glow">
      <Suspense fallback={<div className="text-cream text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
