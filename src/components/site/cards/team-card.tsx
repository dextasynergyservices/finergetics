import Link from "next/link";
import { HoverCard } from "@/components/motion/hover-card";
import { cn } from "@/lib/utils";

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
    </svg>
  );
}

export interface TeamCardProps {
  slug: string;
  name: string;
  roleTitle: string;
  credentials?: string;
  highlights?: string[];
  bioSummary?: string;
  linkedinUrl?: string;
  className?: string;
}

export function TeamCard({
  slug,
  name,
  roleTitle,
  credentials,
  highlights = [],
  bioSummary,
  linkedinUrl,
  className = "",
}: TeamCardProps) {
  return (
    <HoverCard
      className={cn(
        "rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-silver-400/25 flex flex-col justify-between shadow-sm hover:border-royal-600/40 transition-all",
        className,
      )}
    >
      <div>
        {/* Header Avatar Placeholder / Monogram */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-silver-400/20 flex items-center justify-center text-royal-700 font-display text-2xl group-hover:bg-royal-600 group-hover:text-white transition-colors">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-sky-50 text-slate-600 hover:text-royal-600 hover:bg-sky-100 transition-colors"
              aria-label={`${name}'s LinkedIn profile`}
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Credentials Pill */}
        {credentials && (
          <div className="inline-block px-3 py-1 rounded-full bg-sky-100/70 text-royal-800 text-xs font-bold tracking-wide mb-3">
            {credentials}
          </div>
        )}

        <h3 className="font-display text-2xl uppercase tracking-tight text-ink-900 group-hover:text-royal-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm font-semibold text-royal-700 mt-1 mb-4">
          {roleTitle}
        </p>

        {bioSummary && (
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {bioSummary}
          </p>
        )}

        {highlights.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-silver-400/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Key Experience:
            </p>
            <ul className="space-y-1 text-xs text-slate-600">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="text-royal-600 font-bold">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-silver-400/15">
        <Link
          href={`/about/team/${slug}`}
          className="text-xs font-bold uppercase tracking-wider text-royal-600 hover:text-royal-700 transition-colors flex items-center gap-1.5"
        >
          <span>View Consultant Profile</span>
          <span>→</span>
        </Link>
      </div>
    </HoverCard>
  );
}
