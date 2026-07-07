import "server-only";
import { createAnonClient } from "@/lib/supabase/server";
import { sanitizeThemeColors, type ThemeColors } from "@/lib/theme-palettes";

/**
 * Reads the site's current primary/secondary brand colors. Safe to call
 * from the root layout (static rendering, generateStaticParams, etc.)
 * because it uses the anon client — no cookies, no auth required. Falls
 * back to the default colors if the settings table is empty, has an
 * invalid value, or is unreachable, so the site never breaks because of a
 * missing or bad row.
 */
export async function getSiteTheme(): Promise<ThemeColors> {
  try {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["theme_primary", "theme_secondary"]);

    const row = (key: string) => data?.find((r) => r.key === key)?.value as string | undefined;
    return sanitizeThemeColors({ primary: row("theme_primary"), secondary: row("theme_secondary") });
  } catch {
    return sanitizeThemeColors(undefined);
  }
}
