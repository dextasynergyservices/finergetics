import { ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HoverCard } from "@/components/motion/hover-card";
import type { ImageRef } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";

export interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  cover?: ImageRef | { publicId: string; alt?: string } | null;
  categoryName?: string | null;
  authorName?: string | null;
  readingMinutes?: number | null;
  publishedAt?: Date | string | null;
  className?: string;
  featured?: boolean;
}

export function PostCard({
  slug,
  title,
  excerpt,
  cover,
  categoryName,
  authorName,
  readingMinutes,
  publishedAt,
  className = "",
  featured = false,
}: PostCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <HoverCard
      className={cn(
        "rounded-3xl p-5 sm:p-6 md:p-8 bg-white border border-silver-400/25 flex flex-col justify-between shadow-sm hover:border-royal-600/40 transition-all group",
        featured && "md:col-span-2 bg-sky-50/60",
        className,
      )}
    >
      <div>
        {/* Cover Image Frame with Premium Editorial Fallback */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-sky-50 border border-silver-400/20 group/img">
          {cover?.publicId ? (
            <Image
              src={cover.publicId}
              alt={cover.alt || title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br from-navy-950 via-royal-900 to-royal-800 text-white relative overflow-hidden">
              {/* Subtle decorative grid/line pattern */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white">
                  {categoryName || "Energy Economics"}
                </span>
                <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                  Finergetics Insights
                </span>
              </div>
              <div className="relative z-10">
                <p className="font-display uppercase tracking-tight text-base sm:text-lg text-white/95 line-clamp-2 leading-tight">
                  {title}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Category & Read Time */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {categoryName && (
            <span className="px-3 py-1 rounded-full bg-sky-100/70 text-royal-800 text-xs font-bold uppercase tracking-wider">
              {categoryName}
            </span>
          )}
          {readingMinutes && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingMinutes} min read</span>
            </span>
          )}
        </div>

        <h3
          className={cn(
            "font-display uppercase tracking-tight text-ink-900 group-hover:text-royal-600 transition-colors mb-3 leading-snug",
            featured
              ? "text-2xl sm:text-3xl lg:text-4xl"
              : "text-xl sm:text-2xl",
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "text-slate-600 text-sm sm:text-base leading-relaxed mb-6",
            featured ? "line-clamp-4 max-w-3xl" : "line-clamp-3",
          )}
        >
          {excerpt}
        </p>
      </div>

      <div className="pt-6 border-t border-silver-400/15 flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {authorName && (
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-royal-600" />
              <span>{authorName}</span>
            </span>
          )}
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>

        <Link
          href={`/blog/${slug}`}
          className="w-10 h-10 rounded-full bg-sky-50 text-ink-900 group-hover:bg-royal-600 group-hover:text-white flex items-center justify-center transition-all duration-300"
          aria-label={`Read article: ${title}`}
        >
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </div>
    </HoverCard>
  );
}
