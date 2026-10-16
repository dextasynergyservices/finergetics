"use client";

import {
  Briefcase,
  FileText,
  FolderKanban,
  History,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Pages & Sections", href: "/admin/pages", icon: FileText },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Team Members", href: "/admin/team", icon: Users },
  { label: "Case Studies", href: "/admin/case-studies", icon: FolderKanban },
  { label: "Blog & Insights", href: "/admin/posts", icon: Newspaper },
  {
    label: "Leads & Enquiries",
    href: "/admin/leads",
    icon: Inbox,
    adminOnly: true,
  },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  {
    label: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
    adminOnly: true,
  },
  {
    label: "User Access",
    href: "/admin/users",
    icon: ShieldCheck,
    adminOnly: true,
  },
  { label: "Audit Log", href: "/admin/audit", icon: History, adminOnly: true },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || role === "admin",
  );

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-navy-950 text-white flex-col z-30 border-r border-white/10 select-none py-6">
      {/* Brand Header */}
      <div className="px-6 pb-6 pt-1 border-b border-white/10 shrink-0">
        <Link href="/admin/dashboard" className="block focus:outline-none">
          <Image
            src="/logo-white.png"
            alt="Finergetics Consulting Limited"
            width={160}
            height={43}
            priority
            unoptimized
            className="h-8 w-auto object-contain"
          />
        </Link>
        <p className="text-[10px] text-sky-200/60 font-semibold uppercase tracking-wider mt-2">
          Management Portal
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1.5 overflow-y-auto flex-1 overscroll-contain">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all",
                isActive
                  ? "bg-royal-600 text-white shadow-sm"
                  : "text-silver-400 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-white" : "text-silver-400",
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function AdminMobileNav({
  user,
  role,
}: {
  user: { name?: string | null; email?: string | null };
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || role === "admin",
  );

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-navy-950 text-white border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <Image
            src="/logo-white.png"
            alt="Finergetics Consulting Limited"
            width={130}
            height={35}
            priority
            unoptimized
            className="h-7 w-auto object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl bg-white/10 active:bg-white/20 text-white transition-transform active:scale-95 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Fullscreen Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-silver-400/20 bg-navy-950 text-white flex items-center justify-between shrink-0">
            <Link
              href="/admin/dashboard"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3"
            >
              <Image
                src="/logo-white.png"
                alt="Finergetics Consulting Limited"
                width={140}
                height={38}
                priority
                unoptimized
                className="h-7 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 active:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 bg-sky-50 border-b border-silver-400/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-royal-600 text-white flex items-center justify-center font-display text-sm font-bold shadow-xs">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">
                  {user.name || "Administrator"}
                </p>
                <p className="text-xs text-slate-600">{user.email || ""}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-royal-600 text-white text-[10px] font-bold uppercase tracking-wider">
              {role}
            </span>
          </div>

          {/* Drawer Navigation List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 overscroll-contain">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    "flex items-center gap-3.5 p-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.99]",
                    isActive
                      ? "bg-royal-600 text-white shadow-xs"
                      : "text-ink-900 active:bg-sky-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : "text-royal-600",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Drawer Sign Out Footer */}
          <div className="p-4 border-t border-silver-400/20 bg-white shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={loggingOut}
              className="w-full py-3.5 px-4 rounded-2xl bg-red-50 active:bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Console</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Persistent Bottom Tab Bar (iOS/Android Native Thumb Ergonomics) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-silver-400/20 flex items-center justify-around py-2 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg">
        {[
          {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
          },
          { label: "Pages", href: "/admin/pages", icon: FileText },
          { label: "Services", href: "/admin/services", icon: Briefcase },
          { label: "Leads", href: "/admin/leads", icon: Inbox },
        ].map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/admin/dashboard" && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-90",
                isActive ? "text-royal-600 font-bold" : "text-slate-500",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* More Tab opens full drawer */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 active:scale-90 transition-all cursor-pointer"
          aria-label="More navigation options"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
}
