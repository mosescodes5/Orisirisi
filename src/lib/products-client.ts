import { createClient } from "./supabase/client";
import { mapDbProduct } from "./product-mapper";
import type { Product } from "./types";

/** Every published product — used by the client-side search page. */
export async function fetchAllPublishedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapDbProduct);
}

/** Look up a specific set of products by id — used by the wishlist page. */
export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("is_published", true);

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapDbProduct);
}
