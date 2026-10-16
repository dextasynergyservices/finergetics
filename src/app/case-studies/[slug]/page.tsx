import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { CtaButton } from "@/components/site/cta-button";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { RichTextRenderer } from "@/components/site/rich-text-renderer";
import {
  getCaseStudyBySlug,
  getPublishedCaseStudies,
} from "@/server/queries/case-studies";
import { getSiteSettings } from "@/server/queries/settings";

interface CaseStudyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const caseStudies = await getPublishedCaseStudies();
    if (caseStudies.length > 0) {
      return caseStudies.map((cs) => ({ slug: cs.slug }));
    }
  } catch {}

  return [
    { slug: "jv-audit-cost-recovery" },
    { slug: "fiscal-regime-evaluation" },
  ];
}

export async function generateMetadata({
  params,
}: CaseStudyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);

  if (!cs) {
    return {
      title: "Case Study Not Found — Finergetics",
    };
  }

  const title = cs.seoTitle || `${cs.title} — Case Study | Finergetics`;
  const description =
    cs.seoDescription ||
    cs.summary ||
    "Proven advisory case study from Finergetics Consulting Limited.";

  return {
    title,
    description,
    alternates: {
      canonical: `/case-studies/${cs.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/case-studies/${cs.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: CaseStudyDetailPageProps) {
  const { slug } = await params;
  const [cs, settings] = await Promise.all([
    getCaseStudyBySlug(slug),
    getSiteSettings(),
  ]);

  if (!cs) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          {
            name: "Case Studies",
            url: "https://www.finergetics.com/case-studies",
          },
          {
            name: cs.title,
            url: `https://www.finergetics.com/case-studies/${cs.slug}`,
          },
        ]}
      />

      <Header />

      <main
        id="main-content"
        className="flex-1 pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-x-hidden max-w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
          {/* Back Navigation */}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-royal-600 hover:text-royal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Case Studies</span>
          </Link>

          {/* Hero Header */}
          <Reveal>
            <div className="max-w-4xl space-y-4">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-navy-950 leading-tight">
                {cs.title}
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-body max-w-2xl">
                {cs.summary}
              </p>

              {(cs.industry || cs.clientName || cs.serviceTitle) && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  {cs.industry && <span>Sector: {cs.industry}</span>}
                  {cs.clientName && <span>• Client: {cs.clientName}</span>}
                  {cs.serviceTitle && cs.serviceSlug && (
                    <Link
                      href={`/services/${cs.serviceSlug}`}
                      className="text-royal-600 hover:underline"
                    >
                      • Practice: {cs.serviceTitle}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          {/* Quantitative Metrics Bar */}
          {cs.metrics && cs.metrics.length > 0 && (
            <Reveal delay={0.08}>
              <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-200 mb-6">
                  <BarChart3 className="w-4 h-4 text-sky-100" />
                  <span>Key Quantitative Mandate Metrics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                  {cs.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="border-l-2 border-royal-600/50 pl-4 space-y-1"
                    >
                      <span className="font-display text-3xl sm:text-5xl text-white block">
                        {metric.value}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-silver-400 font-semibold">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* 3 Pillars: The Challenge, Practical Approach, Measurable Outcome */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              {/* Challenge */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-silver-400/25 space-y-5 shadow-sm">
                <div className="flex items-center gap-3 text-royal-700">
                  <div className="w-8 h-8 rounded-xl bg-royal-50 border border-royal-600/20 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                    The Commercial &amp; Operational Challenge
                  </h2>
                </div>

                {cs.challenge ? (
                  <RichTextRenderer
                    content={cs.challenge as Record<string, unknown>}
                  />
                ) : (
                  <p className="text-slate-600 text-base leading-relaxed font-body">
                    The client faced substantial financial exposure arising from
                    disputed operator expenditure, multi-year JV ledger
                    backlogs, and ambiguity in cost-allocation protocols.
                  </p>
                )}
              </div>

              {/* Approach */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-silver-400/25 space-y-5 shadow-sm">
                <div className="flex items-center gap-3 text-royal-700">
                  <div className="w-8 h-8 rounded-xl bg-royal-50 border border-royal-600/20 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                    The Finergetics Advisory Approach
                  </h2>
                </div>

                {cs.approach ? (
                  <RichTextRenderer
                    content={cs.approach as Record<string, unknown>}
                  />
                ) : (
                  <p className="text-slate-600 text-base leading-relaxed font-body">
                    Our team executed an independent forensic ledger review,
                    cross-referencing Joint Operating Agreement provisions,
                    contractual billing terms, and international benchmark cost
                    indices.
                  </p>
                )}
              </div>

              {/* Outcome */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-silver-400/25 space-y-5 shadow-sm">
                <div className="flex items-center gap-3 text-royal-700">
                  <div className="w-8 h-8 rounded-xl bg-royal-50 border border-royal-600/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                    Measurable Result &amp; Value Delivered
                  </h2>
                </div>

                {cs.outcome ? (
                  <RichTextRenderer
                    content={cs.outcome as Record<string, unknown>}
                  />
                ) : (
                  <p className="text-slate-600 text-base leading-relaxed font-body">
                    The review achieved verified audit reconciliation,
                    recovering substantial disputed capital and establishing a
                    sustainable quarterly reporting framework for ongoing JV
                    oversight.
                  </p>
                )}
              </div>
            </div>

            {/* Sticky Sidebar CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl bg-navy-950 text-white p-6 sm:p-8 space-y-6 shadow-md">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-sky-200">
                    Confidential Review
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-white leading-tight">
                    Discuss a Similar Mandate
                  </h3>
                  <p className="text-xs text-silver-400 leading-relaxed font-body">
                    Facing complex joint venture audit challenges or fiscal
                    modeling scenarios? Speak directly with our Lead
                    Consultants.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <CtaButton
                    href="/book-a-call"
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                  >
                    Schedule a Consultation
                  </CtaButton>
                  <CtaButton
                    href={`mailto:${settings.contact.email}`}
                    variant="white"
                    size="md"
                    className="w-full justify-center"
                  >
                    Email Advisory Desk
                  </CtaButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
