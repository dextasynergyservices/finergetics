import { ArrowLeft, ArrowRight, CheckCircle2, Shield } from "lucide-react";
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
  getPublishedServices,
  getServiceBySlug,
} from "@/server/queries/services";
import { getSiteSettings } from "@/server/queries/settings";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const services = await getPublishedServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found — Finergetics",
    };
  }

  const title =
    service.seoTitle || `${service.title} — Finergetics Advisory Services`;
  const description =
    service.seoDescription ||
    service.summary ||
    "Specialized energy and petroleum financial advisory services from Finergetics Consulting Limited.";

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/services/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug),
    getPublishedServices(),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const otherServices = allServices.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          { name: "Services", url: "https://www.finergetics.com/services" },
          {
            name: service.title,
            url: `https://www.finergetics.com/services/${service.slug}`,
          },
        ]}
      />

      <Header />

      <main className="flex-1 pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-x-hidden max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
          {/* Back Navigation */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-royal-600 hover:text-royal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Advisory Disciplines</span>
          </Link>

          {/* Hero Header */}
          <Reveal>
            <div className="max-w-4xl space-y-4">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-navy-950 leading-tight">
                {service.title}
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-body max-w-2xl">
                {service.summary}
              </p>
            </div>
          </Reveal>

          {/* 2-Column: Scope & Narrative + Sticky Action Sidecard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-6">
            {/* Main Narrative Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-silver-400/25 space-y-8 shadow-sm">
              <h2 className="font-display text-2xl uppercase tracking-tight text-navy-950 border-b border-silver-400/20 pb-4">
                Advisory Scope &amp; Methodology
              </h2>

              {service.body ? (
                <RichTextRenderer
                  content={service.body as Record<string, unknown>}
                />
              ) : (
                <div className="text-slate-600 text-base leading-relaxed space-y-4 font-body">
                  <p>
                    In this practice area, Finergetics delivers targeted,
                    evidence-backed advisory tailored to complex joint operating
                    agreements, statutory compliance regimes, and high-capital
                    investment allocations.
                  </p>
                  <p>
                    Our experienced energy economists and chartered controllers
                    work closely with client executive teams, providing forensic
                    accounting sampling, valuation modeling, and strategic
                    negotiation guidance.
                  </p>
                </div>
              )}

              {/* Engagement Highlights Box */}
              <div className="rounded-2xl bg-sky-50/70 p-6 sm:p-8 border border-silver-400/20 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-royal-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-royal-600" />
                  <span>Tangible Mandate Deliverables</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-navy-950 font-semibold">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                    <span>Independent Diagnostic Review</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                    <span>Dynamic Scenario &amp; Sensitivity Models</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                    <span>Audit Exception Reconciliations</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />
                    <span>Board-Ready Recommendation Pack</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column: Direct Engagement */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl bg-navy-950 text-white p-6 sm:p-8 space-y-6 shadow-md">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-sky-200">
                    Direct Consultation
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-white leading-tight">
                    Discuss this Practice Area
                  </h3>
                  <p className="text-xs text-silver-400 leading-relaxed font-body">
                    Connect with our Lead Consultants to explore how this
                    discipline applies to your specific joint venture or asset.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <CtaButton
                    href="/book-a-call"
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                  >
                    Schedule an Advisory Call
                  </CtaButton>
                  <CtaButton
                    href={`mailto:${settings.contact.email}`}
                    variant="white"
                    size="md"
                    className="w-full justify-center"
                  >
                    Email Our Practice Desk
                  </CtaButton>
                </div>
              </div>

              {/* Other Services Navigation */}
              {otherServices.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-silver-400/25 space-y-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Other Core Practice Areas
                  </p>
                  <div className="space-y-2">
                    {otherServices.map((other) => (
                      <Link
                        key={other.slug}
                        href={`/services/${other.slug}`}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-sky-50 transition-colors text-xs font-bold text-navy-950"
                      >
                        <span className="group-hover:text-royal-600 transition-colors truncate max-w-[220px]">
                          {other.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-royal-600 transition-transform group-hover:translate-x-1 shrink-0" />
                      </Link>
                    ))}
                  </div>
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
