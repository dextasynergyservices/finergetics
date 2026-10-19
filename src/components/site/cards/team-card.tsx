import Image from "next/image";
import Link from "next/link";
import { HoverCard } from "@/components/motion/hover-card";
import type { ImageRef } from "@/lib/schemas/common";
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
  photo?:
    | ImageRef
    | { publicId: string; alt?: string; width?: number; height?: number }
    | null;
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
  photo,
  highlights = [],
  bioSummary,
  linkedinUrl,
  className = "",
}: TeamCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const imgWidth = photo && "width" in photo && photo.width ? photo.width : 422;
  const imgHeight =
    photo && "height" in photo && photo.height ? photo.height : 456;

  return (
    <HoverCard
      className={cn(
        "relative rounded-3xl p-6 sm:p-7 md:p-8 bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(6,16,97,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(6,16,97,0.12)] hover:border-royal-500/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden",
        className,
      )}
    >
      <div>
        {/* Top Section: Stretched Portrait on left + Balanced Write-up on right */}
        <div className="flex flex-col sm:flex-row items-stretch gap-5 sm:gap-6 mb-2">
          {/* Executive Portrait Container — Balanced height, no harsh cutoff */}
          <div className="relative w-full sm:w-36 md:w-44 shrink-0 rounded-2xl overflow-hidden bg-slate-900 shadow-md ring-1 ring-black/10 group-hover:ring-royal-500/30 transition-all flex flex-col items-center justify-center min-h-[180px] sm:min-h-[220px]">
            {photo?.publicId ? (
              <Image
                src={photo.publicId}
                alt={photo.alt || `${name} — ${roleTitle}`}
                width={imgWidth}
                height={imgHeight}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 144px, 176px"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-royal-950 via-navy-950 to-slate-900 text-white p-6 min-h-[220px]">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white font-display text-2xl font-bold shadow-inner">
                  {initials}
                </div>
                <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-sky-200/80">
                  Principal Advisory
                </span>
              </div>
            )}
          </div>

          {/* Write-up to the right of the image */}
          <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
            <div>
              {/* Top row: Credentials badge + LinkedIn */}
              <div className="flex items-center justify-between gap-2 mb-2">
                {credentials ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-royal-50 text-royal-800 text-[11px] font-bold tracking-wide border border-royal-200/50">
                    {credentials}
                  </span>
                ) : (
                  <span />
                )}

                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A66C2] hover:bg-sky-50 border border-transparent hover:border-sky-200/60 transition-all inline-flex items-center justify-center shrink-0"
                    aria-label={`${name}'s LinkedIn profile`}
                  >
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink-950 group-hover:text-royal-600 transition-colors leading-tight">
                {name}
              </h3>

              <p className="text-sm font-semibold text-royal-700 flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-royal-600 inline-block" />
                {roleTitle}
              </p>

              {bioSummary && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mt-2">
                  {bioSummary}
                </p>
              )}
            </div>

            {/* Key Experience Highlights — Beside the image with custom checkmark bullets */}
            {highlights.length > 0 && (
              <div className="pt-2.5 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Key Experience
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 leading-snug">
                      <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-royal-50 text-royal-600 flex items-center justify-center shrink-0 border border-royal-200/60">
                        <svg
                          className="w-2 h-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="text-slate-700 font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Underneath: Only View Consultant Profile Link with refined interactive arrow */}
      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/about/team/${slug}`}
          className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-bold text-royal-700 group-hover:text-royal-600 transition-colors"
        >
          <span className="uppercase tracking-wider">
            View Consultant Profile
          </span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-royal-50 text-royal-700 border border-royal-200/50 group-hover:bg-royal-600 group-hover:text-white group-hover:border-royal-600 transition-all duration-200 transform group-hover:translate-x-1">
            →
          </span>
        </Link>
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider hidden sm:inline-block">
          Principal Advisory
        </span>
      </div>
    </HoverCard>
  );
}
