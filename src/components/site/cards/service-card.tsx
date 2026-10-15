"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { HoverCard } from "@/components/motion/hover-card";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  slug: string;
  title: string;
  tagline?: string;
  summary: string;
  tone?: "royal" | "charcoal" | "navy" | "slate";
  index?: number;
  className?: string;
}

export function ServiceCard({
  slug,
  title,
  tagline,
  summary,
  tone = "royal",
  index,
  className = "",
}: ServiceCardProps) {
  const toneClasses = {
    royal: "bg-royal-600 text-white border-white/10 hover:border-white/30",
    charcoal: "bg-ink-900 text-white border-white/10 hover:border-white/30",
    navy: "bg-royal-700 text-white border-white/10 hover:border-white/30",
    slate: "bg-slate-600 text-white border-white/10 hover:border-white/30",
  };

  const pillHoverClasses = {
    royal: "bg-white text-royal-700 group-hover:bg-sky-100",
    charcoal: "bg-white text-ink-900 group-hover:bg-sky-100",
    navy: "bg-white text-royal-700 group-hover:bg-sky-100",
    slate: "bg-white text-slate-600 group-hover:bg-sky-100",
  };

  return (
    <HoverCard
      className={cn(
        "rounded-3xl p-6 sm:p-8 md:p-10 border flex flex-col justify-between shadow-sm min-h-[340px] sm:min-h-[380px]",
        toneClasses[tone],
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          {index !== undefined && (
            <span className="font-display text-sm tracking-wider text-sky-100/80">
              0{index + 1}
            </span>
          )}
          {tagline && (
            <span className="text-[11px] font-semibold tracking-widest uppercase text-silver-400/90 truncate max-w-[220px]">
              {tagline}
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight mb-4 group-hover:text-sky-100 transition-colors">
          {title}
        </h3>

        <p className="text-silver-400 text-sm sm:text-base leading-relaxed line-clamp-4">
          {summary}
        </p>
      </div>

      <div className="pt-8 flex items-center justify-between border-t border-white/10 mt-6">
        <Link
          href={`/services/${slug}`}
          className="text-xs font-semibold tracking-wider uppercase text-white hover:text-sky-100 transition-colors flex items-center gap-2"
        >
          <span>Explore Advisory Scope</span>
        </Link>

        <Link
          href={`/services/${slug}`}
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
            "group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-105",
            pillHoverClasses[tone],
          )}
          aria-label={`View ${title}`}
        >
          <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </div>
    </HoverCard>
  );
}
