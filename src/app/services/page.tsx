import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { PageSection } from "@/lib/schemas/sections";
import { getPageByKey } from "@/server/queries/pages";
import { getPublishedServices } from "@/server/queries/services";
import { getSiteSettings } from "@/server/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageByKey("services"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    `Core Advisory Disciplines — ${settings.general.siteName || "Finergetics Consulting Limited"}`;

  const description =
    page?.seoDescription ||
    "Explore our 4 core advisory disciplines: financial control, commercial economics, fiscal regimes, and performance improvement.";

  return {
    title,
    description,
    alternates: {
      canonical: "/services",
    },
    openGraph: {
      title,
      description,
      url: "/services",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function ServicesPage() {
  const [page, services, settings] = await Promise.all([
    getPageByKey("services"),
    getPublishedServices(),
    getSiteSettings(),
  ]);

  const sections = (page?.sections as PageSection[]) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <OrganizationJsonLd
        name={settings.general.siteName}
        url="https://www.finergetics.com"
        email={settings.contact.email}
        phone={settings.contact.phone1}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          { name: "Services", url: "https://www.finergetics.com/services" },
        ]}
      />

      <Header />

      <main className="flex-1 overflow-x-hidden max-w-full">
        {/* Render CMS Sections configured in Admin (Hero, Services Grid, Process, FAQ, CTA) */}
        <SectionRenderer sections={sections} services={services} />
      </main>

      <Footer />
    </div>
  );
}
