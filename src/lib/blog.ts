import "server-only";
import { sanityClient, isSanityConfigured } from "./sanity/client";
import { urlForImage } from "./sanity/image";
import type { BlogPost, PortableTextContent } from "./types";

// Every field a post needs, in one projection so every query below stays
// consistent. `author` is a reference in the Sanity schema; `->` dereferences
// it inline so callers never need a second query.
const POST_PROJECTION = `{
  "slug": slug.current,
  title,
  excerpt,
  category,
  coverImage,
  "author": author->{name, role, avatar, bio},
  publishedAt,
  featured,
  content,
  tags
}`;

type RawPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: unknown;
  author?: { name: string; role: string; avatar?: unknown; bio: string };
  publishedAt: string;
  featured?: boolean;
  content: PortableTextContent;
  tags?: string[];
};

function mapPost(raw: RawPost): BlogPost {
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    category: raw.category,
    coverImage: urlForImage(raw.coverImage as never),
    author: {
      name: raw.author?.name ?? "Taiwo",
      role: raw.author?.role ?? "Founder, Orísirísi",
      avatar: urlForImage(raw.author?.avatar as never),
      bio: raw.author?.bio ?? "",
    },
    publishedAt: raw.publishedAt,
    featured: raw.featured,
    content: raw.content ?? [],
    tags: raw.tags,
    readingTime: estimateReadingTime(raw.content ?? []),
  };
}

/** ~200 words/minute, counted from the Portable Text blocks' plain text. */
function estimateReadingTime(content: PortableTextContent): number {
  const words = content.reduce((sum, block) => {
    const children = (block as { children?: { text?: string }[] }).children;
    if (!children) return sum;
    const text = children.map((c) => c.text ?? "").join(" ");
    return sum + (text.trim() ? text.trim().split(/\s+/).length : 0);
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

/** Every published post, newest first. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured()) return [];
  try {
    const raw = await sanityClient.fetch<RawPost[]>(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) ${POST_PROJECTION}`
    );
    return raw.map(mapPost);
  } catch (err) {
    console.error("[blog] getBlogPosts failed:", err);
    return [];
  }
}

/** The post marked `featured`, or the most recent one if none is marked. */
export async function getFeaturedPost(): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  if (posts.length === 0) return null;
  return posts.find((p) => p.featured) ?? posts[0];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured()) return null;
  try {
    const raw = await sanityClient.fetch<RawPost | null>(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] ${POST_PROJECTION}`,
      { slug }
    );
    return raw ? mapPost(raw) : null;
  } catch (err) {
    console.error("[blog] getBlogPostBySlug failed:", err);
    return null;
  }
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aScore = a.category === post.category ? 1 : 0;
      const bScore = b.category === post.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

/** Distinct categories in use, for the blog's filter pills. */
export async function getBlogCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  return [...new Set(posts.map((p) => p.category).filter(Boolean))];
}
