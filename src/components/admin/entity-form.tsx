"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EntityFormProps {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  statusBadge?: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function EntityForm({
  title,
  subtitle,
  backHref,
  backLabel = "Back to List",
  statusBadge,
  onSubmit,
  loading = false,
  submitLabel = "Save Changes",
  children,
  className = "",
}: EntityFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-8", className)}>
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-silver-400/20 pb-6">
        <div className="space-y-1">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-royal-600 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-ink-900">
              {title}
            </h1>
            {statusBadge}
          </div>
          {subtitle && <p className="text-xs text-slate-600">{subtitle}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="px-4 py-2.5 rounded-2xl border border-silver-400/30 text-xs font-semibold text-slate-700 hover:bg-sky-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer",
              loading && "opacity-60 cursor-not-allowed",
            )}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{submitLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">{children}</div>
    </form>
  );
}
