"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  acceptInvitationAction,
  validateInvitationTokenAction,
} from "@/server/actions/users";

function AcceptInvitationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setTokenValid(false);
        setErrorMessage("No invitation token found in this link.");
        setLoading(false);
        return;
      }

      try {
        const res = await validateInvitationTokenAction(token);
        if (res.valid && res.invitation) {
          setTokenValid(true);
          setInvitationData(res.invitation);
        } else {
          setTokenValid(false);
          setErrorMessage(
            res.error || "This invitation link is invalid or has expired.",
          );
        }
      } catch {
        setTokenValid(false);
        setErrorMessage(
          "Failed to verify invitation token. Please check your internet connection.",
        );
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

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
      const res = await acceptInvitationAction({
        token,
        password,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to set up account.");
        setSubmitting(false);
        return;
      }

      // Automatically sign in the user
      if (invitationData?.email) {
        await authClient.signIn.email({
          email: invitationData.email,
          password,
        });
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error activating account",
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-8 h-8 border-3 border-royal-600/30 border-t-royal-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">
          Verifying your invitation credentials...
        </p>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-ink-900">
            Invitation Expired or Invalid
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            {errorMessage ||
              "This invitation link has expired or has already been used to create an account."}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 text-white text-xs font-bold shadow-sm hover:bg-royal-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Login</span>
          </Link>
        </div>
      </div>
    );
  }

  const roleDisplay =
    invitationData?.role === "admin" ? "Administrator" : "Editor";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-royal-50 text-royal-700 border border-royal-100 text-[11px] font-bold">
          <User className="w-3.5 h-3.5" />
          <span>Team Invitation</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight">
          Welcome, {invitationData?.name}!
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          You have been designated as an <strong>{roleDisplay}</strong> for the
          Finergetics portal. Choose a secure password to complete your account
          setup.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 animate-in fade-in duration-200">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Setup Incomplete</p>
            <p className="mt-0.5 text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field (Readonly) */}
        <div className="space-y-1.5">
          <label
            htmlFor="accept-email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            Assigned Work Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="accept-email"
              type="email"
              disabled
              value={invitationData?.email || ""}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 border border-silver-400/25 text-slate-600 text-sm font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* New Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="new-password"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            Create New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-10 pr-11 py-3 rounded-2xl bg-sky-50/70 border border-silver-400/30 text-ink-900 text-sm focus:outline-none focus:ring-2 focus:ring-royal-600/40 focus:border-royal-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-ink-900 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirm-password"
            className="block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-sky-50/70 border border-silver-400/30 text-ink-900 text-sm focus:outline-none focus:ring-2 focus:ring-royal-600/40 focus:border-royal-600 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "w-full py-3.5 px-6 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2",
            submitting && "opacity-70 cursor-not-allowed",
          )}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Activating Account...</span>
            </>
          ) : (
            <span>Activate Account &amp; Access Dashboard →</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col justify-between p-4 sm:p-6 md:p-12 overflow-x-hidden">
      {/* Top Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2 sm:pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-royal-600 transition-colors p-2 -ml-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Finergetics Home</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-silver-400/25 shadow-lg space-y-6">
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo-blue.png"
                alt="Finergetics Consulting Limited"
                width={190}
                height={50}
                className="h-9 w-auto mx-auto object-contain transition-opacity group-hover:opacity-90"
                priority
                unoptimized
              />
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="p-8 text-center text-xs text-slate-500">
                Loading invitation details...
              </div>
            }
          >
            <AcceptInvitationForm />
          </Suspense>

          <div className="pt-4 border-t border-silver-400/15 flex items-center justify-center gap-2 text-[11px] text-slate-600 text-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-royal-600" />
            <span>256-Bit SSL Encrypted Verification</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-md mx-auto text-center pb-2 text-[11px] text-slate-400">
        © 2026 Finergetics Consulting Limited · All rights reserved.
      </div>
    </div>
  );
}
