import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { PageSection } from "@/lib/schemas/sections";
import { getPageByKey } from "@/server/queries/pages";
import { getSiteSettings } from "@/server/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageByKey("terms"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    `Terms of Engagement — ${settings.general.siteName || "Finergetics Consulting Limited"}`;

  const description =
    page?.seoDescription ||
    "Terms and conditions governing advisory engagements with Finergetics Consulting Limited.";

  return {
    title,
    description,
    alternates: {
      canonical: "/terms",
    },
    openGraph: {
      title,
      description,
      url: "/terms",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function TermsPage() {
  const [page, _settings] = await Promise.all([
    getPageByKey("terms"),
    getSiteSettings(),
  ]);

  const sections = (page?.sections as PageSection[]) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          {
            name: "Terms of Engagement",
            url: "https://www.finergetics.com/terms",
          },
        ]}
      />

      <Header />

      <main id="main-content" className="flex-1 overflow-x-hidden max-w-full">
        {/* Render CMS Sections configured in Admin (Hero, etc.) */}
        <SectionRenderer sections={sections} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-12 pb-24 space-y-10">
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-silver-400/25 shadow-sm space-y-8 font-body text-slate-700 leading-relaxed">
            <div className="border-b border-silver-400/20 pb-4">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Last Updated: October 2026
              </span>
            </div>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                1. Scope of Engagement
              </h2>
              <p className="text-sm sm:text-base">
                Finergetics Consulting Limited (&quot;Finergetics&quot;)
                provides strategic, economic, financial control, and joint
                venture advisory services. Formal client advisory engagements
                are governed by specific bilateral Engagement Letters and
                Non-Disclosure Agreements executed prior to work commencement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                2. Professional Independence
              </h2>
              <p className="text-sm sm:text-base">
                Finergetics operates as an independent consultancy. We do not
                serve as statutory external auditors or financial asset brokers.
                Our analytical findings, forensic ledgers, and economic models
                represent objective, data-driven professional evaluations
                designed to support client fiduciary decision-making.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                3. Confidentiality &amp; Proprietary Information
              </h2>
              <p className="text-sm sm:text-base">
                Both parties agree to treat all business plans, financial
                models, concession data, joint venture accounting records, and
                commercial discussions as strictly proprietary and confidential,
                adhering to international NDA standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                4. Intellectual Property
              </h2>
              <p className="text-sm sm:text-base">
                Methodologies, diagnostic algorithms, and proprietary valuation
                frameworks developed by Finergetics remain the exclusive
                intellectual property of Finergetics. Final bespoke client
                deliverables are assigned to the client upon full settlement of
                mandate fees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                5. Governing Law
              </h2>
              <p className="text-sm sm:text-base">
                Except as otherwise expressly stipulated in a bilateral
                Engagement Agreement, advisory relations are governed by the
                laws of the Federal Republic of Nigeria.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
