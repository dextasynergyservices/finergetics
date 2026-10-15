"use client";

import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning" | "primary";
  variant?: "destructive" | "danger" | "warning" | "primary";
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  tone = "danger",
  variant,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const activeTone = variant === "destructive" ? "danger" : variant || tone;
  if (!open) return null;

  const toneClasses = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    primary: "bg-royal-600 hover:bg-royal-700 text-white",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onOpenChange(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !loading) onOpenChange(false);
      }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-silver-400/25 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-ink-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-lg uppercase tracking-tight text-ink-900">
            {title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="px-4 py-2.5 rounded-xl border border-silver-400/30 text-xs font-semibold text-slate-700 hover:bg-sky-50 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer",
              toneClasses[activeTone],
              loading && "opacity-60 cursor-not-allowed",
            )}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
