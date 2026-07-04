import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates, ADMIN_EMAIL, isEmailConfigured } from "@/lib/email";
import { formatNaira } from "@/lib/format";
import type { CompletedOrder } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!isEmailConfigured()) {
    // Don't block the checkout flow just because email isn't set up yet.
    return NextResponse.json({ success: false, skipped: true, reason: "Email not configured" });
  }

  try {
    const order = (await request.json()) as CompletedOrder;

    if (!order?.shipping?.email || !order?.reference) {
      return NextResponse.json({ success: false, error: "Malformed order payload" }, { status: 400 });
    }

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:6px 0;font-size:13.5px;color:#333;">
            ${item.name}${item.size ? ` (${item.size})` : ""} × ${item.qty}
          </td>
          <td style="padding:6px 0;font-size:13.5px;text-align:right;font-weight:600;">
            ${formatNaira(item.price * item.qty)}
          </td>
        </tr>`
      )
      .join("");

    const customerName = order.shipping.fullName || "there";
    const address = `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state}`;

    const customerEmail = sendEmail({
      to: order.shipping.email,
      subject: `Order confirmed — #${order.reference}`,
      html: emailTemplates.orderConfirmation({
        customerName,
        reference: order.reference,
        itemsHtml,
        subtotal: formatNaira(order.subtotal),
        deliveryFee: formatNaira(order.deliveryFee),
        total: formatNaira(order.total),
        address,
      }),
    });

    const adminEmail = ADMIN_EMAIL
      ? sendEmail({
          to: ADMIN_EMAIL,
          subject: `New order — ${formatNaira(order.total)} (#${order.reference})`,
          html: emailTemplates.orderNotificationAdmin({
            customerName,
            email: order.shipping.email,
            reference: order.reference,
            total: formatNaira(order.total),
          }),
        })
      : Promise.resolve({ success: true as const });

    const [customerResult, adminResult] = await Promise.all([customerEmail, adminEmail]);

    return NextResponse.json({ success: true, customerResult, adminResult });
  } catch (error) {
    console.error("send-order-confirmation error:", error);
    return NextResponse.json({ success: false, error: "Failed to send confirmation email" }, { status: 500 });
  }
}
