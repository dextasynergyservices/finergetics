"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { resetPasswordWithTokenAction } from "@/server/actions/users";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-ink-900">
            Missing Reset Token
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            No password reset token was detected in your link. Please make sure
            you clicked the full URL provided in your email.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 text-white text-xs font-bold shadow-sm hover:bg-royal-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await resetPasswordWithTokenAction({
        token,
        password,
      });

      if (!res.success) {
        setErrorMessage(
          res.error ||
            "Failed to reset password. The reset link may have expired.",
        );
        setSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error resetting password",
      );
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-ink-900">
            Password Reset Complete
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your new password has been successfully established. You can now
            sign in to the Finergetics Administration Portal.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl bg-royal-600 hover:bg-royal-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <span>Proceed to Login</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5 border-b border-silver-400/20 pb-4">
        <div className="flex items-center gap-2 text-royal-600 text-xs font-bold uppercase tracking-wider">
          <KeyRound className="w-4 h-4" />
          <span>Security Recovery</span>
        </div>
        <h2 className="text-xl font-bold text-ink-900">Choose New Password</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Create a new password for your administration account. Must be at
          least 8 characters long.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 animate-in fade-in leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* New Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="new-password"
          className="block text-xs font-bold text-slate-700"
        >
          New Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-silver-400/30 text-xs sm:text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/20 focus:border-royal-600 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-900 cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirm-password"
          className="block text-xs font-bold text-slate-700"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-silver-400/30 text-xs sm:text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/20 focus:border-royal-600 transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-4 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-[0.99] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Updating Password...</span>
          </>
        ) : (
          <span>Save New Password &amp; Login</span>
        )}
      </button>

      <div className="pt-2 text-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-royal-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-block">
          <Image
            src="/logo-blue.png"
            alt="Finergetics"
            width={160}
            height={44}
            className="h-10 w-auto mx-auto object-contain"
            priority
            unoptimized
          />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-navy-950/5 border border-silver-400/25 sm:rounded-3xl">
          <Suspense
            fallback={
              <div className="p-8 text-center text-xs text-slate-400">
                Loading password recovery...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
