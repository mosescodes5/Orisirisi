"use client";

import { useEffect, useState, useActionState } from "react";
import { Check, RotateCcw, Heart, ShoppingBag } from "lucide-react";
import { updateSiteTheme } from "@/lib/admin/actions";
import { THEME_PALETTES, getPaletteById } from "@/lib/theme-palettes";

export function ThemeCustomizer({ currentPaletteId }: { currentPaletteId: string }) {
  const [selectedId, setSelectedId] = useState(currentPaletteId);
  const [state, formAction, pending] = useActionState(updateSiteTheme, null);

  const savedAccent = getPaletteById(currentPaletteId).accent;
  const previewAccent = getPaletteById(selectedId).accent;
  const isDirty = selectedId !== currentPaletteId;

  // Live-preview the selection across the whole dashboard (and storefront,
  // in another tab) immediately, without saving anything yet.
  useEffect(() => {
    document.documentElement.style.setProperty("--color-orisirisi", previewAccent);
    return () => {
      // If this component unmounts without saving, put the real color back.
      document.documentElement.style.setProperty("--color-orisirisi", savedAccent);
    };
  }, [previewAccent, savedAccent]);

  function handleRevert() {
    setSelectedId(currentPaletteId);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Swatch grid */}
      <div className="rounded-2xl border border-ink/[0.08] bg-paper p-6">
        <h2 className="font-display text-[18px] font-medium">Choose an accent</h2>
        <p className="mt-1 text-[13px] text-ink/50">Click a swatch to preview it instantly.</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEME_PALETTES.map((palette) => {
            const active = palette.id === selectedId;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => setSelectedId(palette.id)}
                className={`group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-ink/20 bg-ink/[0.03] ring-2 ring-offset-2"
                    : "border-ink/[0.08] hover:border-ink/20 hover:bg-ink/[0.02]"
                }`}
                style={active ? ({ "--tw-ring-color": palette.accent } as React.CSSProperties) : undefined}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm"
                    style={{ backgroundColor: palette.accent }}
                  >
                    {active && <Check size={16} className="text-white" strokeWidth={3} />}
                  </span>
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold">{palette.name}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-ink/50">{palette.vibe}</span>
                </span>
              </button>
            );
          })}
        </div>

        <form action={formAction} className="mt-6 flex items-center gap-3 border-t border-ink/[0.08] pt-5">
          <input type="hidden" name="paletteId" value={selectedId} />
          <button
            type="submit"
            disabled={!isDirty || pending}
            className="rounded-full bg-orisirisi px-6 py-2.5 text-[13px] font-bold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save & apply to store"}
          </button>
          {isDirty && !pending && (
            <button
              type="button"
              onClick={handleRevert}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink/50 hover:text-ink"
            >
              <RotateCcw size={13} /> Revert
            </button>
          )}
          {!isDirty && state?.ok && (
            <span className="text-[13px] font-semibold text-emerald-700">Saved — live on the site.</span>
          )}
          {state && !state.ok && <span className="text-[13px] font-semibold text-red-600">{state.error}</span>}
        </form>
      </div>

      {/* Live preview */}
      <div className="h-fit rounded-2xl border border-ink/[0.08] bg-paper p-6">
        <h2 className="font-display text-[18px] font-medium">Live preview</h2>
        <p className="mt-1 text-[13px] text-ink/50">This is a live look, not a screenshot.</p>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-ink/[0.08] p-4">
            <p className="eyebrow">Featured</p>
            <p className="mt-1 font-display text-[16px] font-medium">Beaded Waist Necklace</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-orisirisi px-4 py-2 text-[12px] font-bold text-white"
              >
                <ShoppingBag size={13} /> Add to cart
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-orisirisi"
              >
                <Heart size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-ink px-4 py-3">
            <span className="font-display text-[14px] font-semibold text-paper">
              Orísirísi<span className="text-orisirisi">.</span>
            </span>
            <span className="rounded-full bg-orisirisi px-3 py-1.5 text-[11px] font-bold text-paper">Overview</span>
          </div>

          <p className="text-[13px] leading-relaxed text-ink/70">
            An <span className="font-semibold text-orisirisi">accent-colored link</span> sits inline with body
            text like this, so you can judge legibility before saving.
          </p>
        </div>
      </div>
    </div>
  );
}
