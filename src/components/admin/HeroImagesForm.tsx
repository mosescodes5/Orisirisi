"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { updateHeroImages } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/client";
import { HERO_IMAGE_SLOTS, type HeroImageSlot } from "@/lib/hero-images";

const BUCKET = "product-images";

export function HeroImagesForm({ overrides }: { overrides: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(overrides);
  const [state, formAction, pending] = useActionState(updateHeroImages, null);

  const sections = Array.from(new Set(HERO_IMAGE_SLOTS.map((s) => s.section)));

  return (
    <form action={formAction} className="space-y-10">
      {sections.map((section) => (
        <div key={section}>
          <h2 className="font-display text-[18px] font-medium">{section}</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HERO_IMAGE_SLOTS.filter((s) => s.section === section).map((slot) => (
              <HeroSlotField
                key={slot.key}
                slot={slot}
                value={values[slot.key]}
                onChange={(url) => setValues((v) => ({ ...v, [slot.key]: url }))}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 border-t border-ink/[0.08] pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orisirisi px-6 py-2.5 text-[13px] font-bold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save & apply to store"}
        </button>
        {!pending && state?.ok && (
          <span className="text-[13px] font-semibold text-emerald-700">Saved — live on the site.</span>
        )}
        {state && !state.ok && <span className="text-[13px] font-semibold text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}

function HeroSlotField({
  slot,
  value,
  onChange,
}: {
  slot: HeroImageSlot;
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOverridden = Boolean(value);
  const src = value || slot.defaultSrc;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `hero/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-paper p-4">
      <input type="hidden" name={slot.key} value={value ?? ""} />

      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-ink/[0.04]">
        <Image src={src} alt={slot.label} fill className="object-cover" />
        {isOverridden && (
          <span className="absolute left-2 top-2 rounded-full bg-orisirisi px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-paper">
            Custom
          </span>
        )}
      </div>

      <p className="mt-3 text-[13px] font-semibold">{slot.label}</p>

      <div className="mt-2 flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[12px] font-semibold text-ink/60 transition-colors hover:border-orisirisi hover:text-orisirisi">
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
          {uploading ? "Uploading…" : "Replace"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {isOverridden && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1 text-[12px] font-semibold text-ink/40 transition-colors hover:text-red-600"
          >
            <RotateCcw size={12} /> Reset to default
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-[11.5px] text-red-600">{error}</p>}
    </div>
  );
}
