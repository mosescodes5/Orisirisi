import type { Metadata } from "next";
import { getBlogPosts, getFeaturedPost, getBlogCategories } from "@/lib/blog";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes from Taiwo on sourcing, styling, care and life in Lagos — the stories behind the Orísirísi assortment.",
};

export default async function BlogPage() {
  const [posts, featured, categories] = await Promise.all([
    getBlogPosts(),
    getFeaturedPost(),
    getBlogCategories(),
  ]);
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <div className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <p className="eyebrow">The Journal</p>
          <h1 className="mt-2.5 font-display text-[34px] font-medium sm:text-[46px]">Stories from Orísirísi</h1>
          <p className="mt-2.5 max-w-xl text-[14.5px] text-ink/60">
            Sourcing trips, styling notes, and the small decisions behind every piece in the assortment — written by Taiwo.
          </p>
        </Reveal>

        {featured && (
          <div className="mt-10">
            <Reveal>
              <FeaturedPost post={featured} />
            </Reveal>
          </div>
        )}

        <div className="mt-16">
          {posts.length === 0 ? (
            <p className="rounded-card border border-dashed border-ink/[0.14] px-6 py-14 text-center text-[14px] text-ink/50">
              No posts yet — check back soon.
            </p>
          ) : (
            <BlogIndex posts={rest} categories={categories} />
          )}
        </div>
      </div>
    </div>
  );
}
