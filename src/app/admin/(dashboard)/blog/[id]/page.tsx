import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { getBlogPostAdmin } from "@/lib/admin/queries";
import { updateBlogPost, deleteBlogPost } from "@/lib/admin/actions";

export const metadata: Metadata = { title: "Edit Post — Admin" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostAdmin(id);
  if (!post) return notFound();

  const updateWithId = updateBlogPost.bind(null, id);
  const deleteWithId = deleteBlogPost.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-ink/50 hover:text-orisirisi"
      >
        <ChevronLeft size={14} /> Back to blog
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[30px] font-medium sm:text-[36px]">{post.title}</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-red-600/30 px-5 py-3 text-[12.5px] font-bold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-600 hover:text-paper"
          >
            <Trash2 size={14} /> Delete
          </button>
        </form>
      </div>

      <div className="max-w-3xl rounded-2xl border border-ink/[0.08] bg-paper p-6 sm:p-8">
        <BlogPostForm post={post} action={updateWithId} />
      </div>
    </div>
  );
}
