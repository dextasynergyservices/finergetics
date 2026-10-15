import {
  CheckCircle2,
  Clock,
  FileCheck,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { ConsultationForm } from "@/components/site/consultation-form";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { HeroSection, PageSection } from "@/lib/schemas/sections";
import { getPageByKey } from "@/server/queries/pages";
import { getSiteSettings } from "@/server/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageByKey("contact"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    page?.title ||
    "Book an Advisory Discussion — Finergetics Consulting Limited";
  const description =
    page?.seoDescription ||
    "Schedule an executive consultation with Finergetics Advisory Partners. Independent advisory for oil & gas operators, JV partners, energy investors, and infrastructure institutions.";

  return {
    title,
    description,
    alternates: {
      canonical: "/book-a-call",
    },
    openGraph: {
      title,
      description,
      url: "/book-a-call",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function BookCallPage() {
  const page = await getPageByKey("contact");

  const sections = (page?.sections as PageSection[]) || [];
  const heroSection = sections.find(
    (s): s is HeroSection => s.type === "hero" && s.enabled,
  );
  const otherSections = sections.filter((s) => s.type !== "hero" && s.enabled);

  const headline =
    heroSection?.data?.headline ||
    "Let's Discuss Your Commercial & Fiscal Objectives";
  const highlightedText = heroSection?.data?.highlightedText;
  const subheadline =
    heroSection?.data?.subheadline ||
    "Connect directly with our senior energy economists and financial controllers. Whether navigating joint venture audits, PIA fiscal transitions, or asset valuations, we deliver independent clarity.";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header bound to CMS */}
          <div className="max-w-3xl mb-10 space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold font-sans text-navy-950 tracking-tight leading-tight">
              {headline}{" "}
              {highlightedText && (
                <span className="text-royal-600 block sm:inline font-extrabold">
                  {highlightedText}
                </span>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {subheadline}
            </p>
          </div>

          {/* 2-Column Layout: Form & Side Context */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <ConsultationForm />
            </div>

            {/* Context & Direct Contacts Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Pillar Badges */}
              <div className="rounded-3xl bg-white border border-silver-400/30 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-royal-600" />
                  <span>The Finergetics Engagement Model</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-royal-50 border border-royal-600/20 text-royal-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-950">
                        Senior Principal Leadership
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Every consultation is led by senior partners with 20+
                        years in multinational E&amp;P finance and commercial
                        negotiations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-royal-50 border border-royal-600/20 text-royal-600 flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-950">
                        Instant Confirmation &amp; Tracking
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        You will receive an automated confirmation email with
                        advisory next steps immediately upon submitting your
                        details.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-royal-50 border border-royal-600/20 text-royal-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-950">
                        24-Hour Advisory Turnaround
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Our advisory desk reviews submissions daily and responds
                        promptly to establish scope and confidential NDA
                        protocols.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Channels Card */}
              <div className="rounded-3xl bg-navy-950 text-white p-6 sm:p-8 space-y-5 shadow-lg">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-sky-200">
                    Direct Advisory Desk
                  </p>
                  <h4 className="text-lg font-bold text-white mt-1">
                    Prefer direct communication?
                  </h4>
                  <p className="text-xs text-silver-400 mt-1 leading-relaxed">
                    Reach our practice leadership directly for time-sensitive
                    board or transaction matters.
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                  <a
                    href="mailto:info@finergetics.com"
                    className="flex items-center gap-3 text-silver-400 hover:text-white transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-royal-600 flex items-center justify-center text-white transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono">info@finergetics.com</span>
                  </a>

                  <a
                    href="tel:+2348033246377"
                    className="flex items-center gap-3 text-silver-400 hover:text-white transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-royal-600 flex items-center justify-center text-white transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono">+234 803 324 6377</span>
                  </a>

                  <div className="flex items-center gap-3 text-silver-400">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span>Victoria Island, Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamically configured sections from CMS (e.g. FAQ) */}
          {otherSections.length > 0 && (
            <div className="mt-16 pt-8 border-t border-silver-400/20">
              <SectionRenderer sections={otherSections} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
