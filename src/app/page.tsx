import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { CaseStudyCard } from "@/components/site/cards/case-study-card";
import { PostCard } from "@/components/site/cards/post-card";
import { CtaButton } from "@/components/site/cta-button";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { SectionHeading } from "@/components/site/section-heading";
import type { PageSection } from "@/lib/schemas/sections";
import { getPublishedCaseStudies } from "@/server/queries/case-studies";
import { getPageByKey } from "@/server/queries/pages";
import { getPublishedPosts } from "@/server/queries/posts";
import { getPublishedServices } from "@/server/queries/services";
import { getSiteSettings } from "@/server/queries/settings";
import { getPublishedTeamMembers } from "@/server/queries/team";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageByKey("home"),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    settings.general.defaultSeoTitle ||
    "Finergetics Consulting Limited — Risk, Performance & Value";

  const description =
    page?.seoDescription ||
    settings.general.defaultSeoDescription ||
    settings.general.brandLine ||
    "Helping businesses control risk, improve performance, and increase value. Independent energy & financial advisory for oil & gas operators, JV partners, and energy investors.";

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: settings.general.siteName || "Finergetics Consulting Limited",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const [page, services, team, caseStudies, posts, settings] =
    await Promise.all([
      getPageByKey("home"),
      getPublishedServices(),
      getPublishedTeamMembers(),
      getPublishedCaseStudies({ featuredOnly: true, limit: 2 }),
      getPublishedPosts({ limit: 2 }),
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
        address={settings.contact.address}
        sameAs={
          settings.social.linkedin ? [settings.social.linkedin] : undefined
        }
      />

      <Header />

      <main id="main-content" className="flex-1 overflow-x-hidden max-w-full">
        {/* Render CMS Sections configured in Admin (Hero, Marquee, Intro, Services, Process, Why Us, Team, FAQ, CTA) */}
        <SectionRenderer sections={sections} services={services} team={team} />

        {/* Featured Case Studies Preview (Bound to CMS) */}
        {caseStudies.length > 0 && (
          <section className="py-20 sm:py-28 lg:py-36 bg-sky-50/40 border-b border-silver-400/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <SectionHeading
                  eyebrow="• MEASURABLE OUTCOMES"
                  title="Proven Track Record in"
                  highlight="High-Stakes Assets"
                  description="Verifiable advisory engagements across joint venture audits, fiscal regime conversions, and capital control."
                />
                <CtaButton
                  href="/case-studies"
                  variant="outline"
                  size="md"
                  className="shrink-0 self-start sm:self-auto"
                >
                  View All Case Studies
                </CtaButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudies.map((cs) => {
                  const metric = cs.metrics?.[0];
                  return (
                    <CaseStudyCard
                      key={cs.slug}
                      slug={cs.slug}
                      title={cs.title}
                      clientName={cs.clientName || undefined}
                      industry={cs.industry || undefined}
                      summary={cs.summary}
                      metricValue={metric?.value}
                      metricLabel={metric?.label}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Latest Insights & Articles (Bound to CMS) */}
        {posts.length > 0 && (
          <section className="py-20 sm:py-28 lg:py-36 bg-white border-b border-silver-400/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <SectionHeading
                  eyebrow="• ADVISORY PERSPECTIVES"
                  title="Executive Insights &"
                  highlight="Energy Economics"
                  description="Thought leadership and fiscal regime commentary authored by our principal consultants."
                />
                <CtaButton
                  href="/blog"
                  variant="outline"
                  size="md"
                  className="shrink-0 self-start sm:self-auto"
                >
                  Explore All Insights
                </CtaButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    cover={post.cover}
                    categoryName={post.categoryName}
                    authorName={post.authorName}
                    readingMinutes={post.readingMinutes}
                    publishedAt={post.publishedAt}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
