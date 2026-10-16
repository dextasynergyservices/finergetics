export const instant = false;

import { desc } from "drizzle-orm";
import {
  ArrowUpRight,
  Briefcase,
  ExternalLink,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  Newspaper,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/server/auth/guard";
import { db } from "@/server/db/client";
import { leads } from "@/server/db/schema";
import {
  getPublishedCaseStudies,
  getPublishedPosts,
  getPublishedServices,
  getPublishedTeamMembers,
} from "@/server/queries";

export default async function AdminDashboardPage() {
  const { user, role } = await requireRole("editor");

  const [services, team, caseStudies, posts, recentLeads] = await Promise.all([
    getPublishedServices(),
    getPublishedTeamMembers(),
    getPublishedCaseStudies(),
    getPublishedPosts(),
    role === "admin"
      ? db.select().from(leads).orderBy(desc(leads.createdAt)).limit(3)
      : Promise.resolve([]),
  ]);

  const stats = [
    {
      title: "Core Services",
      value: services.length,
      label: "4 active disciplines",
      href: "/admin/services",
      icon: Briefcase,
    },
    {
      title: "Consultant Team",
      value: team.length,
      label: "Principal practitioners",
      href: "/admin/team",
      icon: Users,
    },
    {
      title: "Case Studies",
      value: caseStudies.length,
      label: "Verifiable proof cases",
      href: "/admin/case-studies",
      icon: FolderKanban,
    },
    {
      title: "Published Insights",
      value: posts.length,
      label: "Thought leadership articles",
      href: "/admin/posts",
      icon: Newspaper,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-navy-950 text-white p-6 sm:p-10 border border-white/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-royal-600/50 border border-royal-400/30 text-sky-100 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Institutional Management Console
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white leading-tight">
            Welcome, {user.name?.split(" ")[0] || "Administrator"}
          </h1>
          <p className="text-silver-400 text-sm leading-relaxed">
            Manage public website collections, update page sections, review
            corporate enquiries, and publish strategic insights without touching
            code.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white text-xs font-bold tracking-wide transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Service</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wide transition-colors"
            >
              <span>Live Site Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-silver-400/25 shadow-xs hover:border-royal-600/40 hover:shadow-sm transition-all group block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 group-hover:bg-royal-600 group-hover:text-white flex items-center justify-center text-royal-700 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-silver-400 group-hover:text-royal-600 transition-colors" />
              </div>
              <p className="font-display text-2xl sm:text-3xl text-ink-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-1">
                {stat.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {stat.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Collections Overview */}
        <div className="lg:col-span-8 rounded-3xl bg-white p-6 sm:p-8 border border-silver-400/25 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-silver-400/20 pb-4">
            <div>
              <h2 className="font-display text-lg uppercase tracking-tight text-ink-900">
                Core Content Collections
              </h2>
              <p className="text-xs text-slate-600">
                Click any collection to inspect, edit, or reorder records
              </p>
            </div>
          </div>

          <div className="divide-y divide-silver-400/15">
            {[
              {
                title: "Our 4 Core Advisory Services",
                desc: "Financial Control, Commercial Economics, E&P Fiscal Regimes, Performance Diagnosis",
                href: "/admin/services",
                count: `${services.length} Published`,
              },
              {
                title: "Principal Consultants & Team",
                desc: "Rotimi Lawuyi (Lead) & Edidiong Eyoma (Senior Consultant) credentials and bios",
                href: "/admin/team",
                count: `${team.length} Active`,
              },
              {
                title: "Proven Case Studies",
                desc: "High-value JV dispute settlements and deepwater fiscal transition models",
                href: "/admin/case-studies",
                count: `${caseStudies.length} Cases`,
              },
              {
                title: "Energy & Financial Insights",
                desc: "Public thought leadership articles and industry commentaries",
                href: "/admin/posts",
                count: `${posts.length} Articles`,
              },
            ].map((col) => (
              <Link
                key={col.title}
                href={col.href}
                className="py-4 flex items-center justify-between hover:bg-sky-50/50 -mx-4 px-4 rounded-2xl transition-colors group"
              >
                <div>
                  <p className="text-sm font-bold text-ink-900 group-hover:text-royal-600 transition-colors">
                    {col.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{col.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-sky-50 border border-silver-400/20 text-slate-700 text-xs font-semibold">
                    {col.count}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-silver-400 group-hover:text-royal-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Management & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Shortcuts */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-silver-400/25 shadow-xs space-y-4">
            <h2 className="font-display text-lg uppercase tracking-tight text-ink-900">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/admin/posts/new"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 text-ink-900 font-semibold text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-royal-600 shadow-2xs">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">Write New Article</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Thought leadership & insights
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-silver-400 group-hover:text-royal-600 transition-colors" />
              </Link>

              <Link
                href="/admin/case-studies/new"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 text-ink-900 font-semibold text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-royal-600 shadow-2xs">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">Add Case Study</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Verifiable client proof case
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-silver-400 group-hover:text-royal-600 transition-colors" />
              </Link>

              <Link
                href="/admin/team/new"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 text-ink-900 font-semibold text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-royal-600 shadow-2xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">Add Team Member</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Consultant bio & credentials
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-silver-400 group-hover:text-royal-600 transition-colors" />
              </Link>

              <Link
                href="/admin/media"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 text-ink-900 font-semibold text-xs transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-royal-600 shadow-2xs">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">Media Library</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Upload & manage image assets
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-silver-400 group-hover:text-royal-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Inbound Enquiries Card (Admin Only) */}
          {role === "admin" && (
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-silver-400/25 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg uppercase tracking-tight text-ink-900">
                  Inbound Inquiries
                </h2>
                <Link
                  href="/admin/leads"
                  className="text-xs font-semibold text-royal-600 hover:text-royal-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>View Inbox</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {recentLeads.length === 0 ? (
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-silver-400/20 text-center space-y-2">
                  <Inbox className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-ink-900">
                    No Pending Inquiries
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Client consultation requests submitted through the website
                    will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href="/admin/leads"
                      className="p-3 rounded-xl bg-sky-50/60 hover:bg-sky-100/60 transition-colors block border border-silver-400/15"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-ink-900 truncate">
                          {lead.name}
                        </p>
                        <span className="px-2 py-0.5 rounded-full bg-royal-100 text-royal-800 text-[10px] font-bold uppercase tracking-wider">
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lead.company || lead.email}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
