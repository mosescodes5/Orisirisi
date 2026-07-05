import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AdminOrder, AdminOrderWithItems } from "@/lib/admin/types";

export type CustomerProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

/** The signed-in customer, or null if nobody's signed in. Works for any role. */
export async function getCurrentCustomer(): Promise<CustomerProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", user.id)
    .single();

  return (data as CustomerProfile) ?? { id: user.id, email: user.email ?? "", full_name: null };
}

/** Orders belonging to the signed-in customer (matched by email via RLS). */
export async function getMyOrders(): Promise<AdminOrder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("*").order("placed_at", { ascending: false });
  if (error) {
    console.error("[customer] getMyOrders failed:", error.message);
    return [];
  }
  return (data ?? []) as AdminOrder[];
}

/** A single order + items, only returned if it belongs to the signed-in customer (enforced by RLS). */
export async function getMyOrderByReference(reference: string): Promise<AdminOrderWithItems | null> {
  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("reference", reference).maybeSingle();
  if (!order) return null;

  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", order.id);
  return { ...order, items: items ?? [] } as AdminOrderWithItems;
}
