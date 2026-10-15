import { ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { HoverCard } from "@/components/motion/hover-card";
import { cn } from "@/lib/utils";

export interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
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
        "rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-silver-400/25 flex flex-col justify-between shadow-sm hover:border-royal-600/40 transition-all",
        featured && "md:col-span-2 bg-gradient-to-br from-white to-sky-50/50",
        className,
      )}
    >
      <div>
        {/* Category & Read Time */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
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
