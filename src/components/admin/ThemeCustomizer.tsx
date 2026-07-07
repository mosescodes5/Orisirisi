"use client";

import { useEffect, useState, useActionState } from "react";
import { ArrowLeftRight, RotateCcw, Heart, ShoppingBag, AlertTriangle } from "lucide-react";
import { updateSiteTheme } from "@/lib/admin/actions";
import { THEME_PALETTES, isValidHexColor, relativeBrightness } from "@/lib/theme-palettes";

export function ThemeCustomizer({
  currentPrimary,
  currentSecondary,
}: {
  currentPrimary: string;
  currentSecondary: string;
}) {
  const [primary, setPrimary] = useState(currentPrimary);
  const [secondary, setSecondary] = useState(currentSecondary);
  const [primaryDraft, setPrimaryDraft] = useState(currentPrimary);
  const [secondaryDraft, setSecondaryDraft] = useState(currentSecondary);
  const [state, formAction, pending] = useActionState(updateSiteTheme, null);

  const isDirty = primary !== currentPrimary || secondary !== currentSecondary;
  const secondaryTooLight = relativeBrightness(secondary) > 200; // secondary is used as body-text/dark-bg color

  // Live-preview both colors across the whole dashboard (and storefront, in
  // another tab) immediately, without saving anything yet.
  useEffect(() => {
    document.documentElement.style.setProperty("--color-orisirisi", primary);
    document.documentElement.style.setProperty("--color-ink", secondary);
    return () => {
      document.documentElement.style.setProperty("--color-orisirisi", currentPrimary);
      document.documentElement.style.setProperty("--color-ink", currentSecondary);
    };
  }, [primary, secondary, currentPrimary, currentSecondary]);

  function applyPreset(p: string, s: string) {
    setPrimary(p);
    setSecondary(s);
    setPrimaryDraft(p);
    setSecondaryDraft(s);
  }

  function handleSwap() {
    applyPreset(secondary, primary);
  }

  function handleRevert() {
    applyPreset(currentPrimary, currentSecondary);
  }

  function commitDraft(role: "primary" | "secondary", draft: string) {
    const value = draft.startsWith("#") ? draft : `#${draft}`;
    if (isValidHexColor(value)) {
      if (role === "primary") setPrimary(value);
      else setSecondary(value);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-ink/[0.08] bg-paper p-6">
        {/* Primary / secondary controls */}
        <h2 className="font-display text-[18px] font-medium">Primary &amp; secondary</h2>
        <p className="mt-1 text-[13px] text-ink/50">
          Primary drives buttons and links. Secondary drives text and dark backgrounds — swap them for a
          fully inverted look.
        </p>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
          <ColorField
            label="Primary"
            hint="Buttons, links, badges"
            value={primary}
            draft={primaryDraft}
            onPick={(v) => {
              setPrimary(v);
              setPrimaryDraft(v);
            }}
            onDraftChange={(v) => setPrimaryDraft(v)}
            onDraftCommit={(v) => commitDraft("primary", v)}
          />

          <button
            type="button"
            onClick={handleSwap}
            title="Swap primary and secondary"
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-ink/15 text-ink/60 transition-colors hover:border-orisirisi hover:text-orisirisi sm:self-end"
          >
            <ArrowLeftRight size={16} />
          </button>

          <ColorField
            label="Secondary"
            hint="Text, dark backgrounds"
            value={secondary}
            draft={secondaryDraft}
            onPick={(v) => {
              setSecondary(v);
              setSecondaryDraft(v);
            }}
            onDraftChange={(v) => setSecondaryDraft(v)}
            onDraftCommit={(v) => commitDraft("secondary", v)}
          />
        </div>

        {secondaryTooLight && (
          <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-amber-700">
            <AlertTriangle size={13} /> This secondary is quite light — body text may be hard to read on a
            white background.
          </p>
        )}

        {/* Presets */}
        <div className="mt-7 border-t border-ink/[0.08] pt-6">
          <h3 className="text-[13.5px] font-semibold">Presets</h3>
          <p className="mt-1 text-[12.5px] text-ink/50">Click one to set both colors at once, then fine-tune above.</p>

          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {THEME_PALETTES.map((p) => {
              const active = p.primary === primary && p.secondary === secondary;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.primary, p.secondary)}
                  title={p.vibe}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-colors ${
                    active ? "border-ink/25 bg-ink/[0.03]" : "border-ink/[0.08] hover:border-ink/20"
                  }`}
                >
                  <span className="flex h-7 w-full overflow-hidden rounded-md">
                    <span className="w-1/2" style={{ backgroundColor: p.primary }} />
                    <span className="w-1/2" style={{ backgroundColor: p.secondary }} />
                  </span>
                  <span className="text-center text-[10.5px] font-semibold leading-tight text-ink/70">
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <form action={formAction} className="mt-6 flex items-center gap-3 border-t border-ink/[0.08] pt-5">
          <input type="hidden" name="primary" value={primary} />
          <input type="hidden" name="secondary" value={secondary} />
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
            Body text sits in <span className="font-semibold text-ink">secondary</span>, with an{" "}
            <span className="font-semibold text-orisirisi">accent link in primary</span> inline, so you can
            judge legibility before saving.
          </p>
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  hint,
  value,
  draft,
  onPick,
  onDraftChange,
  onDraftCommit,
}: {
  label: string;
  hint: string;
  value: string;
  draft: string;
  onPick: (v: string) => void;
  onDraftChange: (v: string) => void;
  onDraftCommit: (v: string) => void;
}) {
  return (
    <div className="flex-1">
      <label className="text-[12px] font-semibold uppercase tracking-wide text-ink/50">{label}</label>
      <p className="mt-0.5 text-[11.5px] text-ink/40">{hint}</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onPick(e.target.value)}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-ink/10 p-0.5"
        />
        <input
          type="text"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onBlur={(e) => onDraftCommit(e.target.value)}
          spellCheck={false}
          className="input-field w-[110px] font-mono text-[13px] uppercase"
        />
      </div>
    </div>
  );
}
