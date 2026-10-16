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
    getPageByKey("privacy"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    `Privacy Policy — ${settings.general.siteName || "Finergetics Consulting Limited"}`;

  const description =
    page?.seoDescription ||
    "Finergetics Consulting Limited privacy policy and data governance commitments.";

  return {
    title,
    description,
    alternates: {
      canonical: "/privacy",
    },
    openGraph: {
      title,
      description,
      url: "/privacy",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function PrivacyPage() {
  const [page, settings] = await Promise.all([
    getPageByKey("privacy"),
    getSiteSettings(),
  ]);

  const sections = (page?.sections as PageSection[]) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          {
            name: "Privacy Policy",
            url: "https://www.finergetics.com/privacy",
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
                1. Institutional Commitment to Privacy
              </h2>
              <p className="text-sm sm:text-base">
                Finergetics Consulting Limited (&quot;Finergetics&quot;,
                &quot;we&quot;, &quot;us&quot;) operates as an independent
                advisory firm for energy, joint venture, and infrastructure
                institutions. We treat all commercial inquiries and client data
                with strict institutional confidentiality under international
                standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                2. Information We Collect
              </h2>
              <p className="text-sm sm:text-base">
                We only collect information voluntarily provided by corporate
                representatives via our website consultation forms, email
                inquiries, or formal engagement mandates. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-slate-600">
                <li>Representative Name, Corporate Title, and Organization</li>
                <li>Work Email Address and Direct Telephone Contacts</li>
                <li>
                  Advisory Practice Interest and Commercial Scope Inquiries
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                3. Purpose of Processing
              </h2>
              <p className="text-sm sm:text-base">
                Client information is processed solely to respond to executive
                consultation requests, evaluate conflict-of-interest clearances,
                and execute advisory services requested by the client. We never
                sell, rent, or monetize client data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                4. Data Protection &amp; Confidentiality
              </h2>
              <p className="text-sm sm:text-base">
                All client submissions and correspondence are protected by
                enterprise encryption in transit and at rest. Access is strictly
                limited to authorized principal consultants bound by
                professional non-disclosure obligations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-tight text-navy-950">
                5. Contact Regarding Governance
              </h2>
              <p className="text-sm sm:text-base">
                For questions regarding this policy or your corporate data,
                contact our governance desk at{" "}
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="font-bold text-royal-600 underline"
                >
                  {settings.contact.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
