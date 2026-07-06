"use client";

import { useActionState } from "react";
import { AlertCircle, Save } from "lucide-react";
import type { ActionResult } from "@/lib/admin/actions";
import type { AdminProduct } from "@/lib/admin/types";

const CATEGORIES = ["Jewelry", "Wristwatch", "Household", "Fresh Juice"] as const;

export function ProductForm({
  product,
  action,
}: {
  product?: AdminProduct;
  action: (prevState: ActionResult | null, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state && !state.ok && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-600/[0.08] px-4 py-3 text-[13px] text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Product name">
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="input-field h-12 w-full"
            placeholder="Woven Storage Basket Set (3pc)"
          />
        </Field>

        <Field label="Slug" hint="Lowercase, hyphenated. Leave blank to auto-generate on save.">
          <input
            name="slug"
            defaultValue={product?.slug}
            className="input-field h-12 w-full"
            placeholder="woven-storage-basket-set"
          />
        </Field>

        <Field label="Category">
          <select name="category" defaultValue={product?.category ?? "Household"} className="input-field h-12 w-full">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Subcategory">
          <input
            name="subcategory"
            defaultValue={product?.subcategory}
            className="input-field h-12 w-full"
            placeholder="Storage"
          />
        </Field>

        <Field label="Price (₦)">
          <input
            type="number"
            name="price"
            required
            min={0}
            defaultValue={product?.price}
            className="input-field h-12 w-full"
            placeholder="24500"
          />
        </Field>

        <Field label="Compare-at price (₦)" hint="Optional — shows as a strikethrough discount price.">
          <input
            type="number"
            name="compare_at_price"
            min={0}
            defaultValue={product?.compare_at_price ?? undefined}
            className="input-field h-12 w-full"
            placeholder="30000"
          />
        </Field>

        <Field label="Stock quantity">
          <input
            type="number"
            name="stock"
            min={0}
            defaultValue={product?.stock ?? 0}
            className="input-field h-12 w-full"
          />
        </Field>

        <Field label="Image seed" hint="Placeholder image key (e.g. orisirisi-p1) until real photos are wired up.">
          <input
            name="image"
            defaultValue={product?.image}
            className="input-field h-12 w-full"
            placeholder="orisirisi-p1"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="input-field w-full resize-none"
          placeholder="Hand-woven baskets in three nesting sizes…"
        />
      </Field>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-2.5 text-[13.5px] font-medium">
          <input type="checkbox" name="is_new" defaultChecked={product?.is_new} className="h-4 w-4 accent-orisirisi" />
          Mark as &quot;New In&quot;
        </label>
        <label className="flex items-center gap-2.5 text-[13.5px] font-medium">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={product?.is_published ?? true}
            className="h-4 w-4 accent-orisirisi"
          />
          Published (visible in store)
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:opacity-60"
        >
          <Save size={15} />
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-ink/60">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-ink/40">{hint}</span>}
    </label>
  );
}
