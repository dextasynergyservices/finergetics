"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useResetOnHide } from "@/lib/hooks/use-reset-on-hide";
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

const MENU_WIDTH = 200;
const VIEWPORT_GUTTER = 8;

/**
 * Row/card action menu. The dropdown is rendered in a portal on document.body
 * with fixed positioning, so it can never be clipped by a parent with
 * `overflow: hidden/auto` (tables, cards, scroll areas). It flips upward when
 * there is not enough room below the trigger.
 */
export function TableActionMenu({
  items,
  align = "right",
  className,
}: TableActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Never come back to a page with a menu still open (Activity-preserved).
  useResetOnHide(() => setIsOpen(false));

  const visibleItems = items.filter((item) => !item.hidden);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? 0;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = align === "right" ? rect.right - MENU_WIDTH : rect.left;
    left = Math.max(
      VIEWPORT_GUTTER,
      Math.min(left, vw - MENU_WIDTH - VIEWPORT_GUTTER),
    );

    const spaceBelow = vh - rect.bottom;
    const openUp = menuHeight > 0 && spaceBelow < menuHeight + VIEWPORT_GUTTER;
    const top = openUp
      ? Math.max(VIEWPORT_GUTTER, rect.top - menuHeight - 4)
      : rect.bottom + 4;

    setPosition({ top, left });
  }, [align]);

  // Measure after the menu mounts so we can flip it if needed.
  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  if (visibleItems.length === 0) return null;

  const menu = (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
      className="fixed z-[1000] rounded-2xl bg-white border border-silver-400/30 p-1.5 shadow-xl shadow-navy-950/10 animate-in fade-in zoom-in-95 duration-150"
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
                role="menuitem"
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
              role="menuitem"
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
  );

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title="Actions"
        className={cn(
          "p-2 rounded-xl text-slate-500 hover:text-navy-950 hover:bg-sky-50 border border-transparent hover:border-silver-400/25 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-royal-600/20",
          isOpen && "bg-sky-50 text-navy-950 border-silver-400/30",
        )}
      >
        <MoreHorizontal className="w-4 h-4" />
        <span className="sr-only">Actions</span>
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}
