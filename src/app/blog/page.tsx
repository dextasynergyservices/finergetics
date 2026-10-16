import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";
import { BlogFilter } from "@/components/site/blog-filter";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { PageSection } from "@/lib/schemas/sections";
import { getPageByKey } from "@/server/queries/pages";
import {
  getPublishedPostCategories,
  getPublishedPosts,
} from "@/server/queries/posts";
import { getSiteSettings } from "@/server/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageByKey("blog"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    `Energy & Financial Insights — ${settings.general.siteName || "Finergetics Consulting Limited"}`;

  const description =
    page?.seoDescription ||
    "Thought leadership, petroleum fiscal regime analysis, and joint venture governance perspectives from our Lead Consultants.";

  return {
    title,
    description,
    alternates: {
      canonical: "/blog",
      types: {
        "application/rss+xml": "/blog/rss.xml",
      },
    },
    openGraph: {
      title,
      description,
      url: "/blog",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function BlogPage() {
  const [page, posts, categories, settings] = await Promise.all([
    getPageByKey("blog"),
    getPublishedPosts(),
    getPublishedPostCategories(),
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
          { name: "Insights", url: "https://www.finergetics.com/blog" },
        ]}
      />

      <Header />

      <main id="main-content" className="flex-1 overflow-x-hidden max-w-full">
        {/* Render CMS Sections configured in Admin (Hero, etc.) */}
        <SectionRenderer sections={sections} />

        {/* Filterable Articles Grid & Pagination */}
        <section className="py-12 sm:py-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <BlogFilter posts={posts} categories={categories} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
