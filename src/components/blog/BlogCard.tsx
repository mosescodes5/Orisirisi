import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { placeholderImage } from "@/lib/data";
import { formatBlogDate } from "@/lib/format";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink/[0.04]">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-paper/90 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-ink">
          {post.category}
        </span>
        <Image
          src={placeholderImage(post.coverImage, 500, 375)}
          alt={post.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>
      <div className="pt-4">
        <div className="flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-mist">
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {post.readingTime} min read
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg font-medium leading-snug transition-colors group-hover:text-orisirisi">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-ink/60">{post.excerpt}</p>
      </div>
    </Link>
  );
}
