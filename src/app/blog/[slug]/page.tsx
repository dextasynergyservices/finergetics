import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { PostCard } from "@/components/site/cards/post-card";
import { CtaButton } from "@/components/site/cta-button";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { RichTextRenderer } from "@/components/site/rich-text-renderer";
import { getPostBySlug, getPublishedPosts } from "@/server/queries/posts";
import { getSiteSettings } from "@/server/queries/settings";

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found — Finergetics",
    };
  }

  const title = post.seoTitle || `${post.title} — Finergetics Insights`;
  const description =
    post.seoDescription || post.excerpt || "Finergetics Advisory Insights";

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      authors: post.authorName ? [post.authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const [post, allPosts, _settings] = await Promise.all([
    getPostBySlug(slug),
    getPublishedPosts({ limit: 3 }),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden max-w-full">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={`https://www.finergetics.com/blog/${post.slug}`}
        datePublished={post.publishedAt}
        authorName={post.authorName}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.finergetics.com" },
          { name: "Insights", url: "https://www.finergetics.com/blog" },
          {
            name: post.title,
            url: `https://www.finergetics.com/blog/${post.slug}`,
          },
        ]}
      />

      <Header />

      <main className="flex-1 pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-x-hidden max-w-full">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 space-y-10">
          {/* Back Navigation */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-royal-600 hover:text-royal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Insights</span>
          </Link>

          {/* Article Header */}
          <Reveal>
            <div className="space-y-4">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-navy-950 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                {post.categoryName && (
                  <span className="font-bold text-royal-700 uppercase tracking-wider">
                    {post.categoryName}
                  </span>
                )}
                {post.readingMinutes && (
                  <span className="flex items-center gap-1.5">
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingMinutes} min read</span>
                  </span>
                )}
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </span>
                )}
              </div>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-body border-l-4 border-royal-600 pl-4 italic max-w-2xl">
                {post.excerpt}
              </p>
            </div>
          </Reveal>

          {/* Author Badge */}
          {post.authorName && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-silver-400/20 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-royal-50 border border-royal-600/20 text-royal-700 flex items-center justify-center font-display text-sm">
                  {post.authorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  {post.authorSlug ? (
                    <Link
                      href={`/about/team/${post.authorSlug}`}
                      className="text-xs font-bold text-navy-950 hover:text-royal-600 transition-colors block"
                    >
                      {post.authorName}
                    </Link>
                  ) : (
                    <span className="text-xs font-bold text-navy-950 block">
                      {post.authorName}
                    </span>
                  )}
                  {post.authorRole && (
                    <span className="text-[11px] text-slate-500 block">
                      {post.authorRole}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Finergetics Advisory Practice
              </span>
            </div>
          )}

          {/* Article Body Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-silver-400/25 shadow-sm space-y-6">
            <RichTextRenderer content={post.body as Record<string, unknown>} />
          </div>

          {/* Author Callout Card */}
          {post.authorName && (
            <div className="rounded-3xl bg-sky-50/60 p-6 sm:p-8 border border-silver-400/20 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-royal-700">
                About the Author
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display text-xl uppercase tracking-tight text-navy-950">
                    {post.authorName}
                  </h3>
                  <p className="text-xs text-slate-600 font-body">
                    {post.authorRole || "Senior Consultant"} at Finergetics
                    Consulting Limited specializing in petroleum economics and
                    risk governance.
                  </p>
                </div>
                {post.authorSlug && (
                  <CtaButton
                    href={`/about/team/${post.authorSlug}`}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    View Consultant Profile
                  </CtaButton>
                )}
              </div>
            </div>
          )}

          {/* Pre-Footer Discussion Banner */}
          <div className="rounded-3xl bg-navy-950 text-white p-8 sm:p-12 text-center space-y-5 shadow-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
              Direct Strategic Discussion
            </span>
            <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white max-w-xl mx-auto">
              Discuss the Commercial Implications for Your Organization
            </h3>
            <p className="text-xs sm:text-sm text-silver-400 max-w-md mx-auto leading-relaxed font-body">
              Connect directly with our authors and Lead Consultants to examine
              how shifting petroleum fiscal frameworks impact your asset.
            </p>
            <div className="pt-2">
              <CtaButton href="/book-a-call" variant="primary" size="lg">
                Book an Executive Consultation
              </CtaButton>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="pt-8 space-y-8">
              <h3 className="font-display text-2xl uppercase tracking-tight text-navy-950">
                Related Advisory Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((related) => (
                  <PostCard
                    key={related.slug}
                    slug={related.slug}
                    title={related.title}
                    excerpt={related.excerpt}
                    categoryName={related.categoryName}
                    authorName={related.authorName}
                    readingMinutes={related.readingMinutes}
                    publishedAt={related.publishedAt}
                  />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
