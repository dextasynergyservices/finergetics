import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";
import { CaseStudiesFilter } from "@/components/site/case-studies-filter";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { PageSection } from "@/lib/schemas/sections";
import { getPublishedCaseStudies } from "@/server/queries/case-studies";
import { getPageByKey } from "@/server/queries/pages";
import { getSiteSettings } from "@/server/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageByKey("case-studies"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    `Case Studies & Track Record — ${settings.general.siteName || "Finergetics Consulting Limited"}`;

  const description =
    page?.seoDescription ||
    "Proven engagements in JV audit reconciliation, fiscal regime economic modeling, and financial risk control.";

  return {
    title,
    description,
    alternates: {
      canonical: "/case-studies",
    },
    openGraph: {
      title,
      description,
      url: "/case-studies",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function CaseStudiesPage() {
  const [page, caseStudies, settings] = await Promise.all([
    getPageByKey("case-studies"),
    getPublishedCaseStudies(),
    getSiteSettings(),
  ]);

  const sections = (page?.sections as PageSection[]) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <OrganizationJsonLd
        name={settings.general.siteName}
        url="https://www.finergetics.com"
        email={settings.contact.email}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          {
            name: "Case Studies",
            url: "https://www.finergetics.com/case-studies",
          },
        ]}
      />

      <Header />

      <main className="flex-1 overflow-x-hidden max-w-full">
        {/* Render CMS Sections configured in Admin (Hero, etc.) */}
        <SectionRenderer sections={sections} />

        {/* Filterable Case Studies Grid */}
        <section className="py-12 sm:py-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <CaseStudiesFilter caseStudies={caseStudies} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
