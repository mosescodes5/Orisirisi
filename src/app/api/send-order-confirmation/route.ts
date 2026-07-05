import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmails } from "@/lib/order-emails";
import { isEmailConfigured } from "@/lib/email";
import type { CompletedOrder } from "@/lib/types";

/**
 * Kept for backward compatibility — the checkout flow now sends order
 * confirmation emails from /api/verify-payment right after persisting the
 * order, since that's the one place that has the authoritative, verified
 * order data. This route still works standalone if anything else needs it.
 */
export async function POST(request: NextRequest) {
  if (!isEmailConfigured()) {
    return NextResponse.json({ success: false, skipped: true, reason: "Email not configured" });
  }

  try {
    const order = (await request.json()) as CompletedOrder;

    if (!order?.shipping?.email || !order?.reference) {
      return NextResponse.json({ success: false, error: "Malformed order payload" }, { status: 400 });
    }

    const result = await sendOrderEmails(order);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("send-order-confirmation error:", error);
    return NextResponse.json({ success: false, error: "Failed to send confirmation email" }, { status: 500 });
  }
}
