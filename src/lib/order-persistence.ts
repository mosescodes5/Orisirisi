import "server-only";
import { verifyPaystackTransaction } from "./paystack";
import { getProductsByIds } from "./products";
import { createServiceRoleClient } from "./supabase/server";
import { computeDeliveryFee } from "./pricing";
import { sendOrderEmails } from "./order-emails";
import { productImage } from "./data";
import type { CartItem, CompletedOrder, ShippingDetails } from "./types";

// Allow a tiny rounding tolerance (kobo) when comparing computed vs. charged amounts.
const AMOUNT_TOLERANCE_KOBO = 100;

export type PersistOrderResult =
  | { success: true; order: CompletedOrder; alreadyExisted: boolean }
  | { success: false; error: string; status: number };

type MetadataItem = { productId: string; qty: number; size?: string | null };
type OrderMetadata = { shipping?: ShippingDetails; items?: MetadataItem[] };

/**
 * Verifies a Paystack transaction and persists it as an order, if it isn't
 * already saved. This is the single source of truth for "turn a Paystack
 * reference into a saved order" — called both by the client right after
 * payment (/api/verify-payment) and by the Paystack webhook, so an order
 * gets recorded even if the customer closes their browser before the
 * client-side call completes.
 *
 * Shipping + item details are read from the transaction's own `metadata`
 * (set when the payment was initialized) rather than trusted from whichever
 * caller happens to invoke this — that's what makes the webhook path
 * self-sufficient without needing anything from the browser.
 */
export async function verifyAndPersistOrder(
  reference: string,
  fallback?: { shipping?: ShippingDetails; items?: MetadataItem[] }
): Promise<PersistOrderResult> {
  const db = createServiceRoleClient();

  // Idempotency: whichever path (client call or webhook) gets here first wins;
  // the other just returns the already-saved order.
  const { data: existingOrder } = await db.from("orders").select("*").eq("reference", reference).maybeSingle();
  if (existingOrder) {
    const { data: existingItems } = await db.from("order_items").select("*").eq("order_id", existingOrder.id);
    return {
      success: true,
      alreadyExisted: true,
      order: toCompletedOrder(existingOrder, existingItems ?? [], existingOrder.customer_name, existingOrder.customer_email, existingOrder.customer_phone, existingOrder.shipping_address, existingOrder.shipping_city, existingOrder.shipping_state),
    };
  }

  const verification = await verifyPaystackTransaction(reference);
  if (!verification.verified) {
    return { success: false, error: `Payment could not be verified: ${verification.reason}`, status: 402 };
  }

  const metadata = (verification.metadata ?? {}) as OrderMetadata;
  const shipping = metadata.shipping ?? fallback?.shipping;
  const rawItems = metadata.items ?? fallback?.items;

  if (!shipping?.email || !shipping?.fullName) {
    return { success: false, error: "Missing shipping details for this transaction.", status: 400 };
  }
  if (!rawItems || rawItems.length === 0) {
    return { success: false, error: "Missing item details for this transaction.", status: 400 };
  }

  const productIds = [...new Set(rawItems.map((i) => i.productId))];
  const products = await getProductsByIds(productIds);
  const productById = new Map(products.map((p) => [p.id, p]));

  const missing = rawItems.filter((i) => !productById.has(i.productId));
  if (missing.length > 0) {
    return { success: false, error: "One or more items in this order are no longer available.", status: 409 };
  }

  const orderItems: CartItem[] = rawItems.map((i) => {
    const product = productById.get(i.productId)!;
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: productImage(product, 300, 375),
      price: product.price,
      qty: Math.max(1, Math.floor(i.qty)),
      size: i.size ?? null,
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = computeDeliveryFee(subtotal, orderItems.length);
  const total = subtotal + deliveryFee;

  const expectedKobo = Math.round(total * 100);
  if (Math.abs(expectedKobo - verification.amountKobo) > AMOUNT_TOLERANCE_KOBO) {
    console.error(
      `[order-persistence] Amount mismatch for ${reference}: expected ₦${total} (${expectedKobo} kobo), Paystack charged ${verification.amountKobo} kobo.`
    );
    return {
      success: false,
      error: "The amount charged doesn't match the order total. This payment has been logged for manual review.",
      status: 409,
    };
  }

  const { data: insertedOrder, error: orderError } = await db
    .from("orders")
    .insert({
      reference,
      customer_email: shipping.email,
      customer_name: shipping.fullName,
      customer_phone: shipping.phone,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: "paid",
    })
    .select("*")
    .single();

  if (orderError || !insertedOrder) {
    // Unique violation on reference = the other path (client vs. webhook) beat us to it.
    if (orderError?.code === "23505") {
      const { data: raceOrder } = await db.from("orders").select("*").eq("reference", reference).single();
      if (raceOrder) {
        const { data: raceItems } = await db.from("order_items").select("*").eq("order_id", raceOrder.id);
        return {
          success: true,
          alreadyExisted: true,
          order: toCompletedOrder(raceOrder, raceItems ?? [], raceOrder.customer_name, raceOrder.customer_email, raceOrder.customer_phone, raceOrder.shipping_address, raceOrder.shipping_city, raceOrder.shipping_state),
        };
      }
    }
    console.error("[order-persistence] Failed to insert order:", orderError);
    return { success: false, error: "Payment was verified but the order could not be saved.", status: 500 };
  }

  const { error: itemsError } = await db.from("order_items").insert(
    orderItems.map((i) => ({
      order_id: insertedOrder.id,
      product_id: i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      qty: i.qty,
      size: i.size,
    }))
  );

  if (itemsError) {
    console.error("[order-persistence] Failed to insert order items:", itemsError);
  }

  const completedOrder: CompletedOrder = {
    reference,
    items: orderItems,
    subtotal,
    deliveryFee,
    total,
    shipping,
    placedAt: insertedOrder.placed_at,
  };

  sendOrderEmails(completedOrder).catch((err) =>
    console.error("[order-persistence] sendOrderEmails failed:", err)
  );

  return { success: true, order: completedOrder, alreadyExisted: false };
}

type OrderRow = { reference: string; subtotal: number; delivery_fee: number; total: number; placed_at: string };
type OrderItemRow = { product_id: string | null; name: string; image: string | null; price: number; qty: number; size: string | null };

function toCompletedOrder(
  orderRow: OrderRow,
  itemRows: OrderItemRow[],
  customerName: string,
  customerEmail: string,
  customerPhone: string | null,
  address: string | null,
  city: string | null,
  state: string | null
): CompletedOrder {
  return {
    reference: orderRow.reference,
    items: itemRows.map((r) => ({
      productId: r.product_id ?? "",
      slug: "",
      name: r.name,
      image: r.image ?? "",
      price: r.price,
      qty: r.qty,
      size: r.size,
    })),
    subtotal: orderRow.subtotal,
    deliveryFee: orderRow.delivery_fee,
    total: orderRow.total,
    shipping: {
      fullName: customerName,
      email: customerEmail,
      phone: customerPhone ?? "",
      address: address ?? "",
      city: city ?? "",
      state: state ?? "",
    },
    placedAt: orderRow.placed_at,
  };
}
