import { sendEmail, emailTemplates, ADMIN_EMAIL, isEmailConfigured } from "./email";
import { formatNaira } from "./format";
import type { CompletedOrder } from "./types";

export async function sendOrderEmails(order: CompletedOrder) {
  if (!isEmailConfigured()) {
    return { skipped: true as const };
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

  const customerEmailPromise = sendEmail({
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

  const adminEmailPromise = ADMIN_EMAIL
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

  const [customerResult, adminResult] = await Promise.all([customerEmailPromise, adminEmailPromise]);
  return { skipped: false as const, customerResult, adminResult };
}
