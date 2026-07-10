import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { createBlogPost } from "@/lib/admin/actions";

export const metadata: Metadata = { title: "New Post — Admin" };

export default function NewBlogPostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-ink/50 hover:text-orisirisi"
      >
        <ChevronLeft size={14} /> Back to blog
      </Link>
      <h1 className="mb-8 font-display text-[30px] font-medium sm:text-[36px]">New Post</h1>

      <div className="max-w-3xl rounded-2xl border border-ink/[0.08] bg-paper p-6 sm:p-8">
        <BlogPostForm action={createBlogPost} />
      </div>
    </div>
  );
}
