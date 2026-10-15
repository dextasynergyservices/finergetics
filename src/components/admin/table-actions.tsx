"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

interface TableActionMenuProps {
  items: ActionMenuItem[];
  align?: "left" | "right";
  className?: string;
}

export function TableActionMenu({
  items,
  align = "right",
  className,
}: TableActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.filter((item) => !item.hidden);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (visibleItems.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className={cn("relative inline-block text-left", className)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Actions"
        className={cn(
          "p-2 rounded-xl text-slate-500 hover:text-navy-950 hover:bg-sky-50 border border-transparent hover:border-silver-400/25 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-royal-600/20",
          isOpen && "bg-sky-50 text-navy-950 border-silver-400/30",
        )}
      >
        <MoreHorizontal className="w-4 h-4" />
        <span className="sr-only">Actions</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "absolute z-50 mt-1 min-w-[200px] rounded-2xl bg-white border border-silver-400/30 p-1.5 shadow-xl shadow-navy-950/10 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150",
            align === "right"
              ? "right-0 origin-top-right"
              : "left-0 origin-top-left",
          )}
        >
          <div className="space-y-0.5">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  {Icon && (
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        item.destructive
                          ? "text-red-500 group-hover:text-red-600"
                          : "text-slate-400 group-hover:text-royal-600",
                      )}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </>
              );

              const itemClass = cn(
                "group flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer select-none text-left",
                item.destructive
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "text-slate-700 hover:bg-sky-50 hover:text-royal-700",
                item.disabled &&
                  "opacity-40 cursor-not-allowed pointer-events-none",
              );

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={itemClass}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    setIsOpen(false);
                    item.onClick?.();
                  }}
                  className={itemClass}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
