import "server-only";
import { createAnonClient } from "@/lib/supabase/server";
import { getPaletteById, type ThemePalette } from "@/lib/theme-palettes";

/**
 * Reads the site's current brand accent color. Safe to call from the root
 * layout (static rendering, generateStaticParams, etc.) because it uses the
 * anon client — no cookies, no auth required. Falls back to the default
 * palette if the settings table is empty or unreachable, so the site never
 * breaks because of a missing row.
 */
export async function getSiteTheme(): Promise<ThemePalette> {
  try {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "theme_palette_id")
      .maybeSingle();

    return getPaletteById(data?.value as string | undefined);
  } catch {
    return getPaletteById(undefined);
  }
}
