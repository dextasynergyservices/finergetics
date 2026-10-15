"use client";

import { useState } from "react";
import { AdminHeader } from "./admin-header";
import { AdminMobileNav, AdminSidebar } from "./admin-nav";
import { CommandPalette } from "./command-palette";

export function AdminShell({
  user,
  role,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  role: string;
  children: React.ReactNode;
}) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sky-50/50 flex flex-col lg:flex-row text-ink-900 selection:bg-royal-600 selection:text-white">
      {/* Desktop Left Sidebar */}
      <AdminSidebar role={role} />

      {/* Mobile Top App Bar & Persistent Bottom Tabs */}
      <AdminMobileNav user={user} role={role} />

      {/* Right Main Working Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 lg:pl-64">
        <AdminHeader
          user={user}
          role={role}
          onOpenCommand={() => setCommandOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Command Palette Jump Dialog */}
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        role={role}
      />
    </div>
  );
}
