"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  speed?: number; // seconds for full cycle
  pauseOnHover?: boolean;
  className?: string;
  reverse?: boolean;
}

export function Marquee({
  children,
  speed = 35,
  pauseOnHover = true,
  className = "",
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden user-select-none gap-8 w-full max-w-full",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-around gap-8 min-w-full animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-around gap-8 min-w-full animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
    </div>
  );
}
