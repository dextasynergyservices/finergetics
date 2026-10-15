import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl",
        className,
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase",
          isDark ? "text-sky-100" : "text-slate-600",
        )}
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            isDark ? "bg-sky-100" : "bg-royal-600",
          )}
        />
        <span>{eyebrow}</span>
      </div>

      <h2
        className={cn(
          "font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.08]",
          isDark ? "text-white" : "text-ink-900",
        )}
      >
        {title}{" "}
        {highlight && (
          <span
            className={cn(
              "font-ui font-bold italic normal-case tracking-normal",
              isDark ? "text-sky-100" : "text-royal-600",
            )}
          >
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p
          className={cn(
            "text-base sm:text-lg leading-relaxed pt-1",
            isDark ? "text-silver-400" : "text-slate-600",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
