import { NextRequest, NextResponse } from "next/server";
import { verifyAndPersistOrder } from "@/lib/order-persistence";
import type { ShippingDetails } from "@/lib/types";

type VerifyPaymentBody = {
  reference: string;
  shipping: ShippingDetails;
  items: { productId: string; qty: number; size?: string | null }[];
};

export async function POST(request: NextRequest) {
  let body: VerifyPaymentBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
  }

  const { reference, shipping, items } = body ?? {};

  if (!reference || typeof reference !== "string") {
    return NextResponse.json({ success: false, error: "Missing payment reference." }, { status: 400 });
  }

  // Shipping/items are passed as a fallback only — verifyAndPersistOrder
  // prefers what's stored in the Paystack transaction's own metadata, since
  // that's the same data the webhook relies on independently of this call.
  const result = await verifyAndPersistOrder(reference, { shipping, items });

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true, order: result.order });
}
