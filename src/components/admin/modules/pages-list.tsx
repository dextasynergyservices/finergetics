"use client";

import { CheckCircle2, Edit3, Layout } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";

export interface PageListItem {
  id: string;
  key: string;
  title: string;
  sections: unknown[];
  status: "draft" | "published" | "archived";
  updatedAt: Date;
}

interface PagesListProps {
  initialPages: PageListItem[];
}

export function PagesList({ initialPages }: PagesListProps) {
  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Pages & Section Layouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reorder page sections, toggle component visibility, and customize
            brochure copy without code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialPages.map((page) => (
          <div
            key={page.id}
            className="bg-white rounded-3xl border border-silver-400/25 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-silver-400/40 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-royal-50 text-royal-600 flex items-center justify-center">
                  <Layout className="w-5 h-5" />
                </div>
                <StatusBadge status={page.status} />
              </div>

              <div>
                <h2 className="text-base font-bold text-ink-900">
                  {page.title}
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  /{page.key === "home" ? "" : page.key}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-silver-400/15">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {Array.isArray(page.sections) ? page.sections.length : 0}{" "}
                  Configured Sections
                </span>
              </div>
            </div>

            <Link
              href={`/admin/pages/${page.key}`}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-sky-50/70 hover:bg-royal-600 hover:text-white text-royal-700 text-xs font-bold transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Sections & Copy</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
