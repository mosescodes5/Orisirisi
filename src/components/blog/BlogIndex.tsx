"use client";

import { useMemo, useState } from "react";
import { Search, Newspaper } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { BlogCard } from "./BlogCard";

export function BlogIndex({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q));
    });
  }, [posts, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            onClick={() => setCategory(null)}
            className={`whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-[12.5px] font-bold transition-colors ${
              category === null ? "border-ink bg-ink text-paper" : "border-ink/[0.14] hover:border-orisirisi hover:text-orisirisi"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-[12.5px] font-bold transition-colors ${
                category === c ? "border-ink bg-ink text-paper" : "border-ink/[0.14] hover:border-orisirisi hover:text-orisirisi"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="h-11 w-full rounded-full border-[1.5px] border-ink/[0.12] bg-ink/[0.03] pl-5 pr-11 text-[13.5px] transition-colors focus:border-orisirisi focus:bg-paper focus:outline-none"
          />
          <Search size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-card border border-dashed border-ink/[0.14] px-6 py-20 text-center">
          <Newspaper size={30} strokeWidth={1.4} className="text-mist" />
          <p className="mt-4 text-[15px] font-semibold">No articles match that search.</p>
          <p className="mt-1 text-[13.5px] text-ink/60">Try a different keyword or clear the category filter.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
