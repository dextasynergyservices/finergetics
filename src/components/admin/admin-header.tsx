"use client";

import { ChevronRight, ExternalLink, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AdminHeader({
  user,
  role,
  onOpenCommand,
}: {
  user: { name?: string | null; email?: string | null };
  role: string;
  onOpenCommand?: () => void;
}) {
  const pathname = usePathname();

  // Generate breadcrumb items from URL
  const segments = pathname
    .replace(/^\/admin/, "")
    .split("/")
    .filter(Boolean)
    .filter((s) => s !== "dashboard");

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    ...segments.map((seg, idx) => {
      const href = `/admin/${segments.slice(0, idx + 1).join("/")}`;
      const label = seg
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { label, href };
    }),
  ];

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-silver-400/20 shrink-0 sticky top-0 z-20 shadow-xs">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <div key={crumb.href} className="flex items-center gap-2">
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-silver-400" />
              )}
              {isLast ? (
                <span className="font-bold text-ink-900">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-600 hover:text-royal-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Right Tools & Profile */}
      <div className="flex items-center gap-4">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommand}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100/70 border border-silver-400/20 text-slate-600 text-xs transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Quick jump...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono border border-silver-400/30 text-slate-500 shadow-xs">
            Ctrl+K
          </kbd>
        </button>

        {/* View Live Public Site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-600 hover:text-royal-700 transition-colors px-3 py-2 rounded-xl hover:bg-sky-50"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Role Pill */}
        <div className="h-5 w-px bg-silver-400/30" />
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-royal-50 text-royal-700 border border-royal-600/20 text-[10px] font-bold uppercase tracking-wider">
            {role}
          </span>
          <span className="text-xs font-bold text-ink-900">
            {user.name || "Admin"}
          </span>
        </div>

        {/* Header Sign Out Action */}
        <div className="h-5 w-px bg-silver-400/30" />
        <button
          type="button"
          onClick={async () => {
            await authClient.signOut();
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
          title="Sign out of Admin Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
