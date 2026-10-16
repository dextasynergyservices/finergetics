"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/site/cards/post-card";
import type { ImageRef } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";

export interface PostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: ImageRef | { publicId: string; alt?: string } | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  readingMinutes?: number | null;
  publishedAt?: Date | string | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface BlogFilterProps {
  posts: PostItem[];
  categories: CategoryItem[];
}

const POSTS_PER_PAGE = 6;

export function BlogFilter({ posts, categories }: BlogFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return posts;
    return posts.filter((p) => p.categorySlug === selectedCategory);
  }, [posts, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
  };

  const featuredPost =
    selectedCategory === "all" && currentPage === 1 ? posts[0] : null;
  const standardPosts =
    featuredPost && paginatedPosts.length > 0
      ? paginatedPosts.slice(1)
      : paginatedPosts;

  return (
    <div className="space-y-12">
      {/* Category Filter Chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              selectedCategory === "all"
                ? "bg-navy-950 text-white shadow-sm"
                : "bg-white text-slate-600 border border-silver-400/25 hover:bg-sky-50",
            )}
          >
            All Insights ({posts.length})
          </button>

          {categories.map((cat) => {
            const count = posts.filter(
              (p) => p.categorySlug === cat.slug,
            ).length;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                  selectedCategory === cat.slug
                    ? "bg-navy-950 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-silver-400/25 hover:bg-sky-50",
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Featured Highlight Card */}
      {featuredPost && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PostCard
            key={featuredPost.slug}
            slug={featuredPost.slug}
            title={featuredPost.title}
            excerpt={featuredPost.excerpt}
            cover={featuredPost.cover}
            categoryName={featuredPost.categoryName}
            authorName={featuredPost.authorName}
            readingMinutes={featuredPost.readingMinutes}
            publishedAt={featuredPost.publishedAt}
            featured
          />
        </div>
      )}

      {/* Regular Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {standardPosts.map((post) => (
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

      {filteredPosts.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-silver-400/20 space-y-2">
          <p className="font-display text-lg uppercase text-navy-950">
            No articles found in this category
          </p>
          <p className="text-xs text-slate-500">
            Please select another topic or check back soon for new advisory
            briefings.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={cn(
                "w-10 h-10 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer",
                currentPage === page
                  ? "bg-royal-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-silver-400/25 hover:bg-sky-50",
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
