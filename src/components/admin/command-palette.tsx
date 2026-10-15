"use client";

import {
  Briefcase,
  FileText,
  FolderKanban,
  History,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ActionItem {
  id: string;
  label: string;
  category: "Navigation" | "Quick Create" | "System";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const ALL_ACTIONS: ActionItem[] = [
  {
    id: "dash",
    label: "Dashboard",
    category: "Navigation",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "pages",
    label: "Pages & Sections",
    category: "Navigation",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    id: "services",
    label: "Services",
    category: "Navigation",
    href: "/admin/services",
    icon: Briefcase,
  },
  {
    id: "team",
    label: "Team Members",
    category: "Navigation",
    href: "/admin/team",
    icon: Users,
  },
  {
    id: "case",
    label: "Case Studies",
    category: "Navigation",
    href: "/admin/case-studies",
    icon: FolderKanban,
  },
  {
    id: "posts",
    label: "Blog & Insights",
    category: "Navigation",
    href: "/admin/posts",
    icon: Newspaper,
  },
  {
    id: "leads",
    label: "Leads & Enquiries",
    category: "Navigation",
    href: "/admin/leads",
    icon: Inbox,
  },
  {
    id: "media",
    label: "Media Library",
    category: "Navigation",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    id: "settings",
    label: "Site Settings",
    category: "System",
    href: "/admin/settings",
    icon: Settings,
    adminOnly: true,
  },
  {
    id: "users",
    label: "User Management",
    category: "System",
    href: "/admin/users",
    icon: ShieldCheck,
    adminOnly: true,
  },
  {
    id: "audit",
    label: "Audit Log",
    category: "System",
    href: "/admin/audit",
    icon: History,
    adminOnly: true,
  },
  // Quick Actions
  {
    id: "new-service",
    label: "Create New Service",
    category: "Quick Create",
    href: "/admin/services/new",
    icon: Plus,
  },
  {
    id: "new-post",
    label: "Write New Blog Post",
    category: "Quick Create",
    href: "/admin/posts/new",
    icon: Plus,
  },
  {
    id: "new-case",
    label: "Add Case Study",
    category: "Quick Create",
    href: "/admin/case-studies/new",
    icon: Plus,
  },
  {
    id: "new-team",
    label: "Add Team Consultant",
    category: "Quick Create",
    href: "/admin/team/new",
    icon: Plus,
  },
];

export function CommandPalette({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const filtered = ALL_ACTIONS.filter((item) => {
    if (item.adminOnly && role !== "admin") return false;
    return item.label.toLowerCase().includes(search.toLowerCase());
  });

  const categories = ["Navigation", "Quick Create", "System"] as const;

  const handleSelect = (href: string) => {
    onOpenChange(false);
    setSearch("");
    router.push(href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onOpenChange(false);
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-3xl border border-silver-400/25 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-silver-400/20 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search sections..."
            className="w-full text-sm font-medium text-ink-900 focus:outline-none placeholder:text-slate-400 bg-transparent"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-ink-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or navigation items found.
            </div>
          ) : (
            categories.map((category) => {
              const items = filtered.filter((i) => i.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="space-y-1">
                  <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {category}
                  </p>
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-sky-50 group-hover:bg-royal-600 group-hover:text-white flex items-center justify-center text-royal-700 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-ink-900 group-hover:text-royal-600 transition-colors flex-1">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Shortcut Footer */}
        <div className="px-4 py-2.5 bg-sky-50/70 border-t border-silver-400/20 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with arrows or click to select</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-silver-400/30 text-[10px] font-mono">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
}
