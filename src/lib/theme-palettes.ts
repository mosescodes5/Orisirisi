/**
 * Brand color system.
 *
 * Three roles are independently controllable from the admin dashboard:
 *  - `primary`   → `--color-orisirisi` (buttons' hover state, links, badges, highlights)
 *  - `secondary` → `--color-secondary` (solid buttons, dark panels, active/selected states)
 *  - `text`      → `--color-ink`       (headings, body copy, muted gray text, borders)
 *
 * `text` is kept separate from `secondary` on purpose: secondary drives
 * bold brand surfaces (buttons, the admin sidebar, active filter chips) and
 * is meant to be swapped freely — including with the primary accent — while
 * `text` covers ordinary reading text and muted captions (via opacity, e.g.
 * `text-ink/60`) that should stay legible and neutral regardless of what
 * mood the brand surfaces are in.
 *
 * `paper` (white) and `mist` (gray) stay fixed and are not exposed here.
 */
export type ThemeColors = {
  primary: string;
  secondary: string;
  text: string;
};

export type ThemePalette = ThemeColors & {
  id: string;
  name: string;
  /** One line describing the mood, shown in the admin picker. */
  vibe: string;
};

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_RE.test(value);
}

export const DEFAULT_THEME: ThemeColors = { primary: "#EF430B", secondary: "#000000", text: "#000000" };

export const THEME_PALETTES: ThemePalette[] = [
  { id: "sunset-ember", name: "Sunset Ember", vibe: "Bold, energetic, the original look", primary: "#EF430B", secondary: "#000000", text: "#000000" },
  { id: "terracotta-clay", name: "Terracotta Clay", vibe: "Warm, earthy, grounded", primary: "#C1502F", secondary: "#000000", text: "#000000" },
  { id: "amber-gold", name: "Amber Gold", vibe: "Luxe, warm, jewelry-forward", primary: "#C6892E", secondary: "#000000", text: "#000000" },
  { id: "emerald-noir", name: "Emerald Noir", vibe: "Upscale, deep, sophisticated", primary: "#1F6F54", secondary: "#000000", text: "#000000" },
  { id: "royal-amethyst", name: "Royal Amethyst", vibe: "Rich, regal, statement-making", primary: "#6B3FA0", secondary: "#000000", text: "#000000" },
  { id: "rose-blush", name: "Rose Blush", vibe: "Soft, romantic, feminine", primary: "#C2456B", secondary: "#000000", text: "#000000" },
  { id: "deep-sapphire", name: "Deep Sapphire", vibe: "Trustworthy, calm, premium", primary: "#2C4E7C", secondary: "#000000", text: "#000000" },
  { id: "espresso-bronze", name: "Espresso Bronze", vibe: "Warm neutral, quietly premium", primary: "#8C5A34", secondary: "#000000", text: "#000000" },
  { id: "inverted-ember", name: "Inverted Ember", vibe: "Orange takes the buttons, black becomes the accent", primary: "#000000", secondary: "#EF430B", text: "#000000" },
];

export function sanitizeThemeColors(input: Partial<ThemeColors> | null | undefined): ThemeColors {
  const primary = input?.primary && isValidHexColor(input.primary) ? input.primary : DEFAULT_THEME.primary;
  const secondary = input?.secondary && isValidHexColor(input.secondary) ? input.secondary : DEFAULT_THEME.secondary;
  const text = input?.text && isValidHexColor(input.text) ? input.text : DEFAULT_THEME.text;
  return { primary, secondary, text };
}

/** Rough perceived brightness (0 = black, 255 = white) — used only to warn if a color picked for body text would be hard to read against white. */
export function relativeBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}
