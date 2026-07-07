import type { Metadata } from "next";
import { getCurrentPalette } from "@/lib/admin/queries";
import { ThemeCustomizer } from "@/components/admin/ThemeCustomizer";

export const metadata: Metadata = { title: "Brand Theme" };

export default async function AdminThemePage() {
  const currentPalette = await getCurrentPalette();

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Settings</p>
        <h1 className="mt-2 font-display text-[30px] font-medium sm:text-[36px]">Brand Theme</h1>
        <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-ink/60">
          Pick the accent color used across the storefront and admin — buttons, links, badges, and
          highlights. Ink, paper, and mist stay the same everywhere so everything stays legible and
          on-brand; only the accent changes.
        </p>
      </div>

      <ThemeCustomizer currentPaletteId={currentPalette.id} />
    </div>
  );
}
