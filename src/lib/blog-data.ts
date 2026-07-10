import "server-only";
import { createAnonClient } from "@/lib/supabase/server";
import type { BlogPost } from "./types";

type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  author_bio: string;
  content: BlogPost["content"];
  tags: string[] | null;
  reading_time: number;
  featured: boolean;
  published_at: string | null;
};

function mapRow(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    coverImage: row.cover_image,
    author: {
      name: row.author_name,
      role: row.author_role,
      avatar: row.author_avatar,
      bio: row.author_bio,
    },
    publishedAt: row.published_at ?? new Date().toISOString(),
    readingTime: row.reading_time,
    featured: row.featured,
    content: row.content ?? [],
    tags: row.tags ?? [],
  };
}

const SELECT_COLUMNS =
  "slug, title, excerpt, category, cover_image, author_name, author_role, author_avatar, author_bio, content, tags, reading_time, featured, published_at";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT_COLUMNS)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getBlogPosts failed:", error.message);
    return [];
  }
  return (data ?? []).map((row) => mapRow(row as BlogPostRow));
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(SELECT_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  return data ? mapRow(data as BlogPostRow) : null;
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

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  return Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
}
