"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Invalid credentials. Please verify your email and password.",
        );
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected authentication error occurred.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col justify-between p-4 sm:p-6 md:p-12 overflow-x-hidden">
      {/* Top Header Strip */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2 sm:pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-royal-600 transition-colors p-2 -ml-2 rounded-xl active:bg-sky-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Site</span>
        </Link>
      </div>

      {/* Main Login Card (Native Mobile App Form Geometry) */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-silver-400/25 shadow-lg space-y-8">
          {/* Brand Wordmark & Monogram */}
          <div className="text-center space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo-blue.png"
                alt="Finergetics Consulting Limited"
                width={201}
                height={54}
                className="h-9 sm:h-10 w-auto mx-auto object-contain transition-opacity group-hover:opacity-90"
                priority
                unoptimized
              />
            </Link>
            <div>
              <h1 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-navy-950">
                Management Portal
              </h1>
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-600 mt-1">
                Finergetics Consulting Limited
              </p>
            </div>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Authorized principal consultants and editors only. Access is
              monitored and rate-limited.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="mt-0.5 text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@finergetics.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-sky-50/70 border border-silver-400/30 text-ink-900 text-sm focus:outline-none focus:ring-2 focus:ring-royal-600/40 focus:border-royal-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-sky-50/70 border border-silver-400/30 text-ink-900 text-sm focus:outline-none focus:ring-2 focus:ring-royal-600/40 focus:border-royal-600 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-ink-900 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-4 px-6 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-[0.98] text-white font-ui font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer",
                loading && "opacity-70 cursor-not-allowed",
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-silver-400/15 flex items-center justify-center gap-2 text-[11px] text-slate-600 text-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-royal-600" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Strip */}
      <div className="w-full max-w-md mx-auto text-center pb-2 text-[11px] text-slate-400">
        © 2026 Finergetics Consulting Limited · All rights reserved.
      </div>
    </div>
  );
}
