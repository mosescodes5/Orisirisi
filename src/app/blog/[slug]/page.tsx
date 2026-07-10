import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowRight, ChevronLeft } from "lucide-react";
import { getBlogPosts, getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { placeholderImage } from "@/lib/data";
import { formatBlogDate } from "@/lib/format";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BlogCard } from "@/components/blog/BlogCard";
import { Reveal } from "@/components/layout/Reveal";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();

  const related = await getRelatedPosts(post);
  const url = `https://www.orisirisi.com/blog/${post.slug}`;

  return (
    <article className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[720px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink/60 transition-colors hover:text-orisirisi"
        >
          <ChevronLeft size={14} /> Back to the journal
        </Link>

        <Reveal>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-orisirisi">{post.category}</p>
          <h1 className="mt-3 font-display text-[30px] font-medium leading-tight sm:text-[42px]">{post.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink/60">
            <span className="font-semibold text-ink">{post.author.name}</span>
            <span aria-hidden="true">·</span>
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {post.readingTime} min read
            </span>
          </div>
        </Reveal>

        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-card bg-ink/[0.04]">
          <Image
            src={placeholderImage(post.coverImage, 1200, 750)}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {post.content.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2 key={i} className="mt-3 font-display text-xl font-medium sm:text-2xl">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={i}
                  className="border-l-[3px] border-orisirisi py-1 pl-5 font-display text-lg italic leading-relaxed text-ink/80 sm:text-xl"
                >
                  {block.text}
                </blockquote>
              );
            }
            return (
              <p key={i} className="text-[15.5px] leading-[1.8] text-ink/75">
                {block.text}
              </p>
            );
          })}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-ink/[0.05] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-9 flex items-center justify-between border-y border-ink/[0.08] py-5">
          <ShareButtons title={post.title} url={url} />
        </div>

        <div className="mt-10">
          <AuthorCard author={post.author} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-20 max-w-[1320px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-medium sm:text-[28px]">More from the journal</h2>
            <Link
              href="/blog"
              className="hidden items-center gap-1.5 text-[13px] font-semibold text-ink/60 transition-colors hover:text-orisirisi sm:inline-flex"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
