/**
 * Curated brand-accent palette.
 *
 * The Orísirísi design system deliberately keeps only ONE color swappable:
 * the accent (`--color-orisirisi`). Ink, paper, and mist stay fixed so
 * contrast, accessibility, and layout polish never break when the accent
 * changes — only the "mood" of the site changes.
 *
 * To add a new option for the client to choose from in the admin dashboard,
 * add an entry here. Nothing else needs to change.
 */
export type ThemePalette = {
  id: string;
  name: string;
  /** One line describing the mood, shown in the admin picker. */
  vibe: string;
  accent: string;
};

export const THEME_PALETTES: ThemePalette[] = [
  { id: "sunset-ember", name: "Sunset Ember", vibe: "Bold, energetic, the original Orísirísi orange", accent: "#EF430B" },
  { id: "terracotta-clay", name: "Terracotta Clay", vibe: "Warm, earthy, grounded", accent: "#C1502F" },
  { id: "amber-gold", name: "Amber Gold", vibe: "Luxe, warm, jewelry-forward", accent: "#C6892E" },
  { id: "emerald-noir", name: "Emerald Noir", vibe: "Upscale, deep, sophisticated", accent: "#1F6F54" },
  { id: "royal-amethyst", name: "Royal Amethyst", vibe: "Rich, regal, statement-making", accent: "#6B3FA0" },
  { id: "rose-blush", name: "Rose Blush", vibe: "Soft, romantic, feminine", accent: "#C2456B" },
  { id: "deep-sapphire", name: "Deep Sapphire", vibe: "Trustworthy, calm, premium", accent: "#2C4E7C" },
  { id: "espresso-bronze", name: "Espresso Bronze", vibe: "Warm neutral, quietly premium", accent: "#8C5A34" },
];

export const DEFAULT_PALETTE_ID = "sunset-ember";

export function getPaletteById(id: string | null | undefined): ThemePalette {
  return THEME_PALETTES.find((p) => p.id === id) ?? THEME_PALETTES.find((p) => p.id === DEFAULT_PALETTE_ID)!;
}
