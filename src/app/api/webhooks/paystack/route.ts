import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";
import { verifyAndPersistOrder } from "@/lib/order-persistence";

// Paystack retries webhooks that don't respond 200 quickly, so this handler
// stays fast and defers any heavy lifting to verifyAndPersistOrder, which is
// itself idempotent — safe to call again for a reference already saved.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    console.error("[paystack-webhook] Invalid signature — rejecting.");
    return NextResponse.json({ received: false, error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ received: false, error: "Malformed payload" }, { status: 400 });
  }

  // Only charge.success actually needs persisting. Acknowledge everything
  // else with 200 so Paystack doesn't keep retrying events we don't use.
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true, ignored: event.event ?? "unknown" });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ received: false, error: "Missing reference in payload" }, { status: 400 });
  }

  try {
    const result = await verifyAndPersistOrder(reference);
    if (!result.success) {
      // Log loudly but still return 200 — a 4xx/5xx here just makes Paystack
      // retry the same webhook, which won't fix a real data problem (e.g. a
      // deleted product) and just adds noise. Manual follow-up is required
      // either way once this is logged.
      console.error(`[paystack-webhook] Failed to persist order for ${reference}: ${result.error}`);
    } else if (!result.alreadyExisted) {
      console.log(`[paystack-webhook] Order ${reference} persisted via webhook.`);
    }
  } catch (err) {
    console.error(`[paystack-webhook] Unexpected error persisting ${reference}:`, err);
  }

  return NextResponse.json({ received: true });
}
