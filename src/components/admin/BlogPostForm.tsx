"use client";

import { useState, useActionState } from "react";
import { AlertCircle, Save, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { ActionResult } from "@/lib/admin/actions";
import type { AdminBlogPost, BlogContentBlock } from "@/lib/admin/types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogPostForm({
  post,
  action,
}: {
  post?: AdminBlogPost;
  action: (prevState: ActionResult | null, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [blocks, setBlocks] = useState<BlogContentBlock[]>(
    post?.content && post.content.length > 0 ? post.content : [{ type: "paragraph", text: "" }]
  );

  function handleTitleChange(title: string) {
    if (!slugTouched) setSlug(slugify(title));
  }

  function updateBlock(index: number, patch: Partial<BlogContentBlock>) {
    setBlocks((bs) => bs.map((b, i) => (i === index ? ({ ...b, ...patch } as BlogContentBlock) : b)));
  }

  function addBlock(type: BlogContentBlock["type"]) {
    setBlocks((bs) => [...bs, { type, text: "" }]);
  }

  function removeBlock(index: number) {
    setBlocks((bs) => (bs.length > 1 ? bs.filter((_, i) => i !== index) : bs));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((bs) => {
      const target = index + direction;
      if (target < 0 || target >= bs.length) return bs;
      const next = [...bs];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="content" value={JSON.stringify(blocks)} />
      <input type="hidden" name="was_published" value={post?.is_published ? "on" : ""} />

      {state && !state.ok && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-600/[0.08] px-4 py-3 text-[13px] text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={post?.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="input-field h-12 w-full"
            placeholder="How I Source Every Piece in the Assortment"
          />
        </Field>

        <Field label="Slug" hint="Lowercase, hyphenated — this becomes the URL.">
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className="input-field h-12 w-full"
            placeholder="how-i-source-the-assortment"
          />
        </Field>

        <Field label="Category">
          <input
            name="category"
            defaultValue={post?.category}
            className="input-field h-12 w-full"
            placeholder="Behind the Brand"
          />
        </Field>

        <Field label="Tags" hint="Comma-separated.">
          <input
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            className="input-field h-12 w-full"
            placeholder="sourcing, lagos, jewelry"
          />
        </Field>

        <Field label="Cover image" hint="Image URL, or a placeholder seed like orisirisi-blog-sourcing.">
          <input
            name="cover_image"
            defaultValue={post?.cover_image}
            className="input-field h-12 w-full"
            placeholder="orisirisi-blog-sourcing"
          />
        </Field>
      </div>

      <Field label="Excerpt" hint="Shown on the blog index and in link previews.">
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          className="input-field w-full resize-none"
          placeholder="People ask why Orísirísi carries such a mix — here's the honest answer…"
        />
      </Field>

      <div className="rounded-xl border border-ink/[0.08] p-4 sm:p-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-ink/60">Author</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input name="author_name" defaultValue={post?.author_name ?? "Taiwo"} className="input-field h-11 w-full" />
          </Field>
          <Field label="Role">
            <input
              name="author_role"
              defaultValue={post?.author_role ?? "Founder, Orísirísi"}
              className="input-field h-11 w-full"
            />
          </Field>
          <Field label="Avatar" hint="Image URL or placeholder seed.">
            <input name="author_avatar" defaultValue={post?.author_avatar} className="input-field h-11 w-full" />
          </Field>
          <Field label="Short bio">
            <input name="author_bio" defaultValue={post?.author_bio} className="input-field h-11 w-full" />
          </Field>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink/60">Content</h3>
          <div className="flex gap-2">
            <AddBlockButton label="+ Paragraph" onClick={() => addBlock("paragraph")} />
            <AddBlockButton label="+ Heading" onClick={() => addBlock("heading")} />
            <AddBlockButton label="+ Quote" onClick={() => addBlock("quote")} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {blocks.map((block, i) => (
            <div key={i} className="rounded-xl border border-ink/[0.08] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink/40">{block.type}</span>
                <div className="flex items-center gap-1">
                  <IconButton onClick={() => moveBlock(i, -1)} disabled={i === 0} label="Move up">
                    <ChevronUp size={14} />
                  </IconButton>
                  <IconButton onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} label="Move down">
                    <ChevronDown size={14} />
                  </IconButton>
                  <IconButton onClick={() => removeBlock(i)} disabled={blocks.length === 1} label="Remove block">
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </div>
              <textarea
                value={block.text}
                onChange={(e) => updateBlock(i, { text: e.target.value })}
                rows={block.type === "paragraph" ? 3 : 2}
                className="input-field w-full resize-none"
                placeholder={
                  block.type === "heading" ? "Section heading…" : block.type === "quote" ? "A quoted line…" : "Paragraph text…"
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2.5 text-[13.5px] font-medium">
          <input type="checkbox" name="featured" defaultChecked={post?.featured} className="h-4 w-4 accent-orisirisi" />
          Feature at the top of the journal
        </label>
        <label className="flex items-center gap-2.5 text-[13.5px] font-medium">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post?.is_published ?? false}
            className="h-4 w-4 accent-orisirisi"
          />
          Published (visible on the site)
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:opacity-60"
        >
          <Save size={15} />
          {pending ? "Saving…" : post ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-ink/60">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-ink/40">{hint}</span>}
    </label>
  );
}

function AddBlockButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-ink/15 px-3 py-1.5 text-[11.5px] font-bold text-ink/60 transition-colors hover:border-orisirisi hover:text-orisirisi"
    >
      {label}
    </button>
  );
}

function IconButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
