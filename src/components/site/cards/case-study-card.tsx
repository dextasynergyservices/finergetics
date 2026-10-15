import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { HoverCard } from "@/components/motion/hover-card";
import { cn } from "@/lib/utils";

export interface CaseStudyCardProps {
  slug: string;
  title: string;
  clientName?: string;
  industry?: string;
  summary: string;
  metricLabel?: string;
  metricValue?: string;
  className?: string;
}

export function CaseStudyCard({
  slug,
  title,
  clientName,
  industry,
  summary,
  metricLabel,
  metricValue,
  className = "",
}: CaseStudyCardProps) {
  return (
    <HoverCard
      className={cn(
        "rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-silver-400/25 flex flex-col justify-between shadow-sm hover:border-royal-600/40 transition-all",
        className,
      )}
    >
      <div>
        {/* Industry & Client Metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {industry && (
            <span className="px-3 py-1 rounded-full bg-sky-50 text-slate-600 border border-silver-400/20 text-xs font-semibold uppercase tracking-wider">
              {industry}
            </span>
          )}
          {clientName && (
            <span className="text-xs text-slate-600 font-medium">
              {clientName}
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl uppercase tracking-tight text-ink-900 group-hover:text-royal-600 transition-colors mb-3 leading-snug">
          {title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">{summary}</p>

        {metricValue && (
          <div className="rounded-2xl bg-sky-50 p-4 border border-silver-400/20 mb-4">
            <span className="block font-display text-2xl text-royal-700 tracking-tight">
              {metricValue}
            </span>
            {metricLabel && (
              <span className="text-xs text-slate-600 uppercase font-semibold tracking-wider">
                {metricLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 flex items-center justify-between border-t border-silver-400/15 mt-4">
        <Link
          href={`/case-studies/${slug}`}
          className="text-xs font-bold uppercase tracking-wider text-royal-600 hover:text-royal-700 transition-colors flex items-center gap-2"
        >
          <span>Read Case Study</span>
        </Link>
        <Link
          href={`/case-studies/${slug}`}
          className="w-10 h-10 rounded-full bg-sky-50 text-ink-900 group-hover:bg-royal-600 group-hover:text-white flex items-center justify-center transition-all duration-300"
          aria-label={`Read case study: ${title}`}
        >
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </div>
    </HoverCard>
  );
}
