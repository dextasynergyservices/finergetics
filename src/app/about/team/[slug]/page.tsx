import { ArrowLeft, CheckCircle2, Mail, Phone, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo/json-ld";
import { CtaButton } from "@/components/site/cta-button";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { RichTextRenderer } from "@/components/site/rich-text-renderer";
import { getSiteSettings } from "@/server/queries/settings";
import {
  getPublishedTeamMembers,
  getTeamMemberBySlug,
} from "@/server/queries/team";

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
    </svg>
  );
}

interface TeamMemberPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const members = await getPublishedTeamMembers();
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    return {
      title: "Consultant Profile Not Found — Finergetics",
    };
  }

  const title = `${member.name}${member.credentials ? `, ${member.credentials}` : ""} — ${member.role} | Finergetics`;
  const description = `${member.name} is a ${member.role} at Finergetics Consulting Limited specializing in Oil & Gas Finance, joint venture governance, and fiscal regime economics.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/about/team/${member.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/about/team/${member.slug}`,
      type: "profile",
    },
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const [member, settings] = await Promise.all([
    getTeamMemberBySlug(slug),
    getSiteSettings(),
  ]);

  if (!member) {
    notFound();
  }

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <PersonJsonLd
        name={member.name}
        role={member.role}
        credentials={member.credentials}
        url={`https://www.finergetics.com/about/team/${member.slug}`}
        sameAs={member.linkedinUrl ? [member.linkedinUrl] : undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          { name: "About Us", url: "https://www.finergetics.com/about" },
          {
            name: member.name,
            url: `https://www.finergetics.com/about/team/${member.slug}`,
          },
        ]}
      />

      <Header />

      <main className="flex-1 pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-x-hidden max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
          {/* Breadcrumb Back Link */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-royal-600 hover:text-royal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to About Us &amp; Consultant Team</span>
          </Link>

          {/* Profile Header Box */}
          <Reveal>
            <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-silver-400/25 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Monogram Badge */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sky-50 border border-silver-400/25 flex items-center justify-center text-royal-700 font-display text-2xl sm:text-3xl shadow-sm shrink-0">
                    {initials}
                  </div>

                  <div className="space-y-1.5">
                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl uppercase tracking-tight text-navy-950">
                      {member.name}
                      {member.credentials && (
                        <span className="text-base sm:text-lg font-sans font-semibold text-slate-500 normal-case ml-2.5">
                          ({member.credentials})
                        </span>
                      )}
                    </h1>
                    <p className="text-sm sm:text-base font-bold text-royal-600">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-2xl bg-sky-50 border border-silver-400/20 text-slate-700 hover:text-royal-600 hover:bg-sky-100 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                    >
                      <LinkedInIcon className="w-4 h-4 text-royal-600" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  <CtaButton href="/book-a-call" variant="primary" size="md">
                    Consult With {member.name.split(" ")[0]}
                  </CtaButton>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 2-Column: Highlights / Credentials + Full Bio Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Sidebar: Experience Highlights & Credentials */}
            <div className="lg:col-span-5 space-y-6">
              {member.highlights && member.highlights.length > 0 && (
                <div className="bg-sky-50/60 rounded-3xl p-6 sm:p-8 border border-silver-400/20 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-royal-700">
                    <Shield className="w-4 h-4 text-royal-600" />
                    <span>Practice Specializations</span>
                  </div>

                  <div className="space-y-3">
                    {member.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-md bg-white border border-silver-400/20 text-royal-600 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-navy-950 leading-relaxed">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advisory Practice Contact Box */}
              <div className="rounded-3xl bg-navy-950 text-white p-6 sm:p-8 space-y-4 shadow-md">
                <p className="text-[11px] font-bold uppercase tracking-widest text-sky-200">
                  Direct Mandate Discussion
                </p>
                <h4 className="font-display text-xl uppercase tracking-tight text-white">
                  Schedule a Consultation
                </h4>
                <p className="text-xs text-silver-400 leading-relaxed font-body">
                  Connect directly with our Lead Consultants for confidential
                  board reviews, joint venture audits, or commercial valuations.
                </p>
                <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="flex items-center gap-2 text-silver-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-100" />
                    <span>{settings.contact.email}</span>
                  </a>
                  {settings.contact.phone1 && (
                    <a
                      href={`tel:${settings.contact.phone1}`}
                      className="flex items-center gap-2 text-silver-400 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-100" />
                      <span>{settings.contact.phone1}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Main Narrative Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-silver-400/25 space-y-6">
              <h2 className="font-display text-2xl uppercase tracking-tight text-navy-950 border-b border-silver-400/20 pb-4">
                Professional Background &amp; Advisory Experience
              </h2>

              {member.bio ? (
                <RichTextRenderer
                  content={member.bio as Record<string, unknown>}
                />
              ) : (
                <div className="text-slate-600 text-base leading-relaxed space-y-4">
                  <p>
                    {member.name} is a senior leader at Finergetics Consulting
                    Limited bringing extensive direct industry experience in
                    multinational banking, petroleum finance, and joint venture
                    commercial management.
                  </p>
                  <p>
                    Specializing in high-stakes risk control, contractual audit
                    reconciliations, and fiscal regime sensitivity analysis,
                    they advise boards, operating committees, and sovereign
                    energy entities across complex capital programs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
