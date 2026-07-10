"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentAdminProfile } from "./queries";
import type { OrderStatus } from "./types";
import { isValidHexColor } from "@/lib/theme-palettes";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function signInAdmin(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  const profile = await getCurrentAdminProfile();
  if (!profile) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account doesn't have admin access." };
  }

  redirect(next);
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireAdmin() {
  const profile = await getCurrentAdminProfile();
  if (!profile) throw new Error("Not authorized.");
  return profile;
}

/** Products */

export async function createProduct(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = createServiceRoleClient();

  const payload = productPayloadFromForm(formData);
  const { error } = await db.from("products").insert(payload);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const db = createServiceRoleClient();

  const payload = productPayloadFromForm(formData);
  const { error } = await db.from("products").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const db = createServiceRoleClient();
  await db.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

function productPayloadFromForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    category: String(formData.get("category") ?? "Household"),
    subcategory: String(formData.get("subcategory") ?? ""),
    price: Number(formData.get("price") ?? 0),
    compare_at_price: formData.get("compare_at_price")
      ? Number(formData.get("compare_at_price"))
      : null,
    image: String(formData.get("image") ?? ""),
    description: String(formData.get("description") ?? ""),
    is_new: formData.get("is_new") === "on",
    is_published: formData.get("is_published") === "on",
    stock: Number(formData.get("stock") ?? 0),
  };
}

/** Blog */

export async function createBlogPost(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = createServiceRoleClient();

  const payload = blogPostPayloadFromForm(formData);
  const { error } = await db.from("blog_posts").insert(payload);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const db = createServiceRoleClient();

  const payload = blogPostPayloadFromForm(formData);
  const { error } = await db.from("blog_posts").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const db = createServiceRoleClient();
  await db.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

function blogPostPayloadFromForm(formData: FormData) {
  const isPublished = formData.get("is_published") === "on";
  const wasAlreadyPublished = formData.get("was_published") === "on";

  const content = JSON.parse(String(formData.get("content") ?? "[]"));
  const wordCount = content.reduce(
    (sum: number, block: { text?: string }) => sum + (block.text?.split(/\s+/).filter(Boolean).length ?? 0),
    0
  );

  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    category: String(formData.get("category") ?? ""),
    cover_image: String(formData.get("cover_image") ?? ""),
    author_name: String(formData.get("author_name") ?? "Taiwo"),
    author_role: String(formData.get("author_role") ?? "Founder, Orísirísi"),
    author_avatar: String(formData.get("author_avatar") ?? ""),
    author_bio: String(formData.get("author_bio") ?? ""),
    content,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    reading_time: Math.max(1, Math.round(wordCount / 200)),
    featured: formData.get("featured") === "on",
    is_published: isPublished,
    // Set published_at the first time a post goes live; keep the original
    // date on subsequent edits so it doesn't jump to "today" every save.
    ...(isPublished && !wasAlreadyPublished ? { published_at: new Date().toISOString() } : {}),
  };
}

/** Orders */

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  const db = createServiceRoleClient();
  const { error } = await db.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

/** Brand theme */

export async function updateSiteTheme(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const primary = String(formData.get("primary") ?? "");
  const secondary = String(formData.get("secondary") ?? "");
  const text = String(formData.get("text") ?? "");

  if (!isValidHexColor(primary) || !isValidHexColor(secondary) || !isValidHexColor(text)) {
    return { ok: false, error: "Colors must be valid hex codes, e.g. #EF430B." };
  }

  const db = createServiceRoleClient();
  const now = new Date().toISOString();
  const { error } = await db.from("site_settings").upsert([
    { key: "theme_primary", value: primary, updated_at: now },
    { key: "theme_secondary", value: secondary, updated_at: now },
    { key: "theme_text", value: text, updated_at: now },
  ]);

  if (error) return { ok: false, error: error.message };

  // All three colors are read in the root layout, so every route
  // (storefront and admin) needs to re-render with the new values.
  revalidatePath("/", "layout");
  return { ok: true };
}
