import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminProviders } from "@/app/admin/providers";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireRole } from "@/server/auth/guard";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin Console — Finergetics Consulting Limited",
  robots: {
    index: false,
    follow: false,
  },
};

async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { user, role } = await requireRole("editor");
  return (
    <AdminShell user={user} role={role}>
      {children}
    </AdminShell>
  );
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-sky-50/50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-royal-600 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold text-slate-500">
                Loading Admin Console...
              </p>
            </div>
          </div>
        }
      >
        <AuthenticatedShell>{children}</AuthenticatedShell>
      </Suspense>
    </AdminProviders>
  );
}
