import "server-only";
import { createAnonClient } from "./supabase/server";

/**
 * Every site_settings row whose key starts with "hero_" — the admin-uploaded
 * overrides for the homepage and category hero/banner photos (see
 * src/lib/hero-images.ts for the full list of keys). Reads with the public
 * anon client since site_settings is publicly readable and every visitor's
 * page render needs this, not just the admin dashboard.
 *
 * A key missing from the returned map just means that slot is still on its
 * built-in default — callers should fall back accordingly, e.g.
 * `overrides["hero_category_jewelry"] ?? defaultSrc`.
 */
export async function getHeroImageOverrides(): Promise<Record<string, string>> {
  const supabase = createAnonClient();
  const { data } = await supabase.from("site_settings").select("key, value").like("key", "hero_%");

  const map: Record<string, string> = {};
  data?.forEach((row) => {
    map[row.key] = row.value;
  });
  return map;
}
