import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { listBlogPosts } from "@/lib/admin/queries";
import { formatBlogDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blog — Admin" };

export default async function AdminBlogPage() {
  const posts = await listBlogPosts();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">The Journal</p>
          <h1 className="mt-2 font-display text-[30px] font-medium sm:text-[36px]">Blog</h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          <Plus size={15} /> New Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-paper">
        {posts.length === 0 ? (
          <p className="px-6 py-14 text-center text-[14px] text-ink/50">No posts yet — write your first one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-ink/[0.08] text-[11px] font-bold uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3">Post</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-ink/[0.06] last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 min-w-0">
                        {p.featured && <Star size={13} className="shrink-0 fill-orisirisi text-orisirisi" />}
                        <p className="truncate font-semibold">{p.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{p.category || "—"}</td>
                    <td className="px-6 py-4 text-ink/70">
                      {p.published_at ? formatBlogDate(p.published_at) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          p.is_published ? "bg-green-600/[0.12] text-green-700" : "bg-ink/[0.06] text-ink/50"
                        }`}
                      >
                        {p.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-ink/60 transition-colors hover:text-orisirisi"
                      >
                        <Pencil size={13} /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
