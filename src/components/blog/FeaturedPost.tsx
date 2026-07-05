import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { blogImage } from "@/lib/data";
import { formatBlogDate } from "@/lib/format";

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-6 overflow-hidden rounded-card border border-ink/[0.08] md:grid-cols-2 md:gap-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink/[0.04] md:aspect-auto">
        <Image
          src={blogImage(post.coverImage, 900, 700)}
          alt={post.title}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10">
        <span className="eyebrow">Featured</span>
        <div className="mt-3 flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-mist">
          <span>{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {post.readingTime} min read
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-medium leading-tight transition-colors group-hover:text-orisirisi sm:text-[32px]">
          {post.title}
        </h2>
        <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink/60">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-orisirisi">
          Read the story <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
