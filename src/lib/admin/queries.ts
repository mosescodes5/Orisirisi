import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AdminBlogPost, AdminOrder, AdminOrderWithItems, AdminProduct, AdminProfile } from "./types";
import { sanitizeThemeColors, type ThemeColors } from "@/lib/theme-palettes";

/** The signed-in admin/staff user's profile, or null if not signed in / not staff. */
export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!data || (data.role !== "admin" && data.role !== "staff")) return null;
  return data as AdminProfile;
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: orderCount }, { data: orders }, { count: pendingCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total, status"),
      supabase.from("orders").select("*", { count: "exact", head: true }).in("status", ["pending", "paid", "processing"]),
    ]);

  const revenue = (orders ?? [])
    .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  return {
    productCount: productCount ?? 0,
    orderCount: orderCount ?? 0,
    pendingCount: pendingCount ?? 0,
    revenue,
  };
}

export async function listProducts(opts?: { search?: string }): Promise<AdminProduct[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (opts?.search) {
    query = query.ilike("name", `%${opts.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProduct[];
}

export async function getProduct(id: string): Promise<AdminProduct | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return (data as AdminProduct) ?? null;
}

export async function listBlogPosts(): Promise<AdminBlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminBlogPost[];
}

export async function getBlogPostAdmin(id: string): Promise<AdminBlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  return (data as AdminBlogPost) ?? null;
}

export async function listOrders(opts?: { status?: string }): Promise<AdminOrder[]> {
  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("placed_at", { ascending: false });

  if (opts?.status) {
    query = query.eq("status", opts.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminOrder[];
}

export async function getOrder(id: string): Promise<AdminOrderWithItems | null> {
  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) return null;

  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", id);
  return { ...(order as AdminOrder), items: items ?? [] };
}

/** The primary/secondary/text brand colors currently applied to the storefront. */
export async function getCurrentTheme(): Promise<ThemeColors> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["theme_primary", "theme_secondary", "theme_text"]);

  const row = (key: string) => data?.find((r) => r.key === key)?.value as string | undefined;
  return sanitizeThemeColors({ primary: row("theme_primary"), secondary: row("theme_secondary"), text: row("theme_text") });
}

export async function getRecentOrders(limit = 5): Promise<AdminOrder[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as AdminOrder[];
}
