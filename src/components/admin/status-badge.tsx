import { cn } from "@/lib/utils";

export type EntityStatus =
  | "published"
  | "draft"
  | "archived"
  | "new"
  | "contacted"
  | "qualified"
  | "closed"
  | "spam";

const STATUS_CONFIG: Record<
  EntityStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  published: {
    label: "Published",
    bg: "bg-emerald-50 border-emerald-200/80",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    bg: "bg-amber-50 border-amber-200/80",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  archived: {
    label: "Archived",
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  new: {
    label: "New",
    bg: "bg-blue-50 border-blue-200/80",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  contacted: {
    label: "Contacted",
    bg: "bg-sky-50 border-sky-200/80",
    text: "text-sky-800",
    dot: "bg-sky-500",
  },
  qualified: {
    label: "Qualified",
    bg: "bg-purple-50 border-purple-200/80",
    text: "text-purple-800",
    dot: "bg-purple-500",
  },
  closed: {
    label: "Closed",
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
  spam: {
    label: "Spam",
    bg: "bg-red-50 border-red-200/80",
    text: "text-red-800",
    dot: "bg-red-500",
  },
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  const config = STATUS_CONFIG[status as EntityStatus] || STATUS_CONFIG.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border",
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      <span>{config.label}</span>
    </span>
  );
}
