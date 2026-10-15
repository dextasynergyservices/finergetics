import { NextResponse } from "next/server";
import {
  getPageByKey,
  getPublishedCaseStudies,
  getPublishedPostCategories,
  getPublishedPosts,
  getPublishedServices,
  getPublishedTeamMembers,
  getSiteSettings,
} from "@/server/queries";

export async function GET() {
  try {
    const [settings, services, team, caseStudies, posts, categories, homePage] =
      await Promise.all([
        getSiteSettings(),
        getPublishedServices(),
        getPublishedTeamMembers(),
        getPublishedCaseStudies(),
        getPublishedPosts(),
        getPublishedPostCategories(),
        getPageByKey("home"),
      ]);

    return NextResponse.json({
      status: "ok",
      data: {
        siteName: settings.general.siteName,
        counts: {
          services: services.length,
          teamMembers: team.length,
          caseStudies: caseStudies.length,
          posts: posts.length,
          categories: categories.length,
          homeSections: homePage?.sections ? homePage.sections.length : 0,
        },
        services: services.map((s) => ({ slug: s.slug, title: s.title })),
        team: team.map((t) => ({
          slug: t.slug,
          name: t.name,
          role: t.role,
        })),
        caseStudies: caseStudies.map((c) => ({
          slug: c.slug,
          title: c.title,
        })),
        posts: posts.map((p) => ({ slug: p.slug, title: p.title })),
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        error:
          err instanceof Error
            ? err.message
            : "Failed to load public test queries",
      },
      { status: 500 },
    );
  }
}
