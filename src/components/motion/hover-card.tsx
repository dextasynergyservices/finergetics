"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoverCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  lift?: boolean;
}

export function HoverCard({
  children,
  className = "",
  lift = true,
  ...props
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={lift ? { y: -4 } : {}}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden transition-colors duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
