import "server-only";
import { createAnonClient } from "./supabase/server";
import { mapDbProduct } from "./product-mapper";
import { CATEGORY_DB_NAME } from "./data";
import type { Product } from "./types";

/** Every published product, newest first — the base query everything else filters from. */
export async function getAllPublishedProducts(): Promise<Product[]> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapDbProduct);
  } catch (err) {
    // Swallow errors here rather than crashing the whole build/page — an
    // empty shelf is a much better failure mode than a 500 or a failed build.
    console.error("[products] getAllPublishedProducts failed:", err);
    return [];
  }
}

/** Live published-product counts per category slug (household/jewelry/clothing/other), for category cards. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .eq("is_published", true);

    if (error) throw new Error(error.message);

    const counts: Record<string, number> = {};
    for (const [slug, dbName] of Object.entries(CATEGORY_DB_NAME)) {
      counts[slug] = (data ?? []).filter((row) => row.category === dbName).length;
    }
    return counts;
  } catch (err) {
    console.error("[products] getCategoryCounts failed:", err);
    return {};
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const all = await getAllPublishedProducts();
  return all.slice(0, limit);
}

export async function getNewProducts(): Promise<Product[]> {
  const all = await getAllPublishedProducts();
  return all.filter((p) => p.isNew);
}

export async function getProductsByCategory(category: Product["category"]): Promise<Product[]> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapDbProduct);
  } catch (err) {
    console.error("[products] getProductsByCategory failed:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    return data ? mapDbProduct(data) : null;
  } catch (err) {
    console.error("[products] getProductBySlug failed:", err);
    return null;
  }
}

/** Look up specific products by id, for server-side order pricing verification. */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids)
      .eq("is_published", true);

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapDbProduct);
  } catch (err) {
    console.error("[products] getProductsByIds failed:", err);
    return [];
  }
}

/** Slugs for generateStaticParams — every published product gets a static page at build time. */
export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const supabase = createAnonClient();
    const { data } = await supabase.from("products").select("slug").eq("is_published", true);
    return (data ?? []).map((r) => r.slug as string);
  } catch (err) {
    // If this fails at build time, returning [] just means product pages
    // render on-demand at request time instead of being pre-built — not a
    // hard build failure.
    console.error("[products] getAllProductSlugs failed:", err);
    return [];
  }
}
