import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { PageSection } from "@/lib/schemas/sections";
import { getPageByKey } from "@/server/queries/pages";
import { getSiteSettings } from "@/server/queries/settings";
import { getPublishedTeamMembers } from "@/server/queries/team";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageByKey("about"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    `About Us — ${settings.general.siteName || "Finergetics Consulting Limited"}`;

  const description =
    page?.seoDescription ||
    "Learn about Finergetics, our mission, and the experienced team of consultants advising energy and infrastructure leaders.";

  return {
    title,
    description,
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title,
      description,
      url: "/about",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const [page, team, settings] = await Promise.all([
    getPageByKey("about"),
    getPublishedTeamMembers(),
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
          { name: "About Us", url: "https://www.finergetics.com/about" },
        ]}
      />

      <Header />

      <main id="main-content" className="flex-1 overflow-x-hidden max-w-full">
        {/* Render CMS Sections configured in Admin (Hero, Intro, Values, Team, CTA) */}
        <SectionRenderer sections={sections} team={team} />
      </main>

      <Footer />
    </div>
  );
}
