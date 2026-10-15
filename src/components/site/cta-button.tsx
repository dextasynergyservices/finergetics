import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface BaseButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  withArrow?: boolean;
  className?: string;
}

type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
  };

export type CtaButtonProps = ButtonAsButton | ButtonAsLink;

export function CtaButton({
  children,
  variant = "primary",
  size = "md",
  withArrow = true,
  className = "",
  ...props
}: CtaButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const arrowSizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  };

  const variantClasses = {
    primary:
      "bg-royal-600 text-white hover:bg-royal-700 active:scale-95 border border-royal-600 shadow-sm",
    secondary:
      "bg-navy-950 text-white hover:bg-ink-900 active:scale-95 border border-navy-950",
    outline:
      "bg-transparent text-ink-900 border border-silver-400/40 hover:border-ink-900 hover:bg-sky-50 active:scale-95",
    white:
      "bg-white text-navy-950 hover:bg-sky-50 active:scale-95 border border-white shadow-sm",
  };

  const arrowBackground = {
    primary:
      "bg-white/20 text-white group-hover:bg-white group-hover:text-royal-700",
    secondary:
      "bg-white/20 text-white group-hover:bg-white group-hover:text-navy-950",
    outline: "bg-ink-900 text-white group-hover:bg-royal-600",
    white: "bg-navy-950 text-white group-hover:bg-royal-600",
  };

  const content = (
    <span className="flex items-center gap-3">
      <span className="font-semibold tracking-wide">{children}</span>
      {withArrow && (
        <span
          className={cn(
            "rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            arrowSizeClasses[size],
            arrowBackground[variant],
          )}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      )}
    </span>
  );

  const baseClasses = cn(
    "group inline-flex items-center justify-center font-ui rounded-full transition-all duration-300 cursor-pointer select-none",
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={baseClasses} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClasses}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
