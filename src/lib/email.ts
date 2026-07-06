import { Resend } from "resend";
import nodemailer from "nodemailer";

/*
  Transactional email — Resend is the primary sender; Gmail SMTP (via
  nodemailer) is an automatic fallback used only if Resend isn't configured
  or a send attempt through it fails. Every call site just calls sendEmail()
  and doesn't need to know which path actually delivered it.

  Required env vars (set in .env.local for dev, and in Vercel → Project →
  Settings → Environment Variables for production):

    RESEND_API_KEY     from resend.com/api-keys
    RESEND_FROM_EMAIL  e.g. "Orísirísi with Taiwo <hello@orisirisiwithtaiwo.com>"
                       — must be on a domain verified in Resend (Domains →
                       Add Domain). Until verified, Resend only delivers to
                       your own account's email address.

    SMTP_HOST          smtp.gmail.com
    SMTP_PORT          465
    SMTP_USER          your Gmail address
    SMTP_PASSWORD      a Gmail App Password (myaccount.google.com/apppasswords)
                       — requires 2-Step Verification on the account; your
                       normal Gmail password will NOT work here.

    STORE_NAME         "Orísirísi with Taiwo"        (optional, has a default)
    STORE_URL          https://orisirisiwithtaiwo.com (optional, has a default)
    ADMIN_EMAIL        where order/subscriber notifications go (defaults to SMTP_USER)

  Nothing here is hardcoded to a real mailbox/key — secrets only ever come
  from env vars.
*/

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const STORE_NAME = process.env.STORE_NAME || "Orísirísi with Taiwo";
const STORE_URL = process.env.STORE_URL || "https://orisirisiwithtaiwo.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

const resendClient = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

let cachedTransporter: nodemailer.Transporter | null = null;

function getGmailTransporter() {
  if (!SMTP_USER || !SMTP_PASSWORD) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      connectionTimeout: 20000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }
  return cachedTransporter;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, from, replyTo }: SendEmailInput) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // 1. Try Resend first, if it's configured.
  if (resendClient && RESEND_FROM_EMAIL) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: from || RESEND_FROM_EMAIL,
        to,
        subject,
        html,
        text,
        replyTo,
      });
      if (error) throw new Error(error.message);
      return { success: true as const, messageId: data?.id, via: "resend" as const };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Resend error";
      console.error("sendEmail via Resend failed, falling back to Gmail SMTP:", message);
      // fall through to Gmail below
    }
  }

  // 2. Fall back to Gmail SMTP — either Resend isn't configured, or it just failed.
  const transporter = getGmailTransporter();
  if (!transporter) {
    const reason = resendClient
      ? "Resend failed and no Gmail SMTP fallback is configured."
      : "Email is not configured — set RESEND_API_KEY or SMTP_USER/SMTP_PASSWORD.";
    console.error("sendEmail failed:", reason);
    return { success: false as const, error: reason };
  }

  try {
    const info = await transporter.sendMail({
      from: from || `"${STORE_NAME}" <${SMTP_USER}>`,
      to,
      subject,
      html,
      text,
      replyTo,
    });
    return { success: true as const, messageId: info.messageId, via: "gmail" as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Gmail SMTP error";
    console.error("sendEmail via Gmail SMTP failed:", message);
    return { success: false as const, error: message };
  }
}

export function isEmailConfigured() {
  return Boolean((resendClient && RESEND_FROM_EMAIL) || (SMTP_USER && SMTP_PASSWORD));
}

export { ADMIN_EMAIL, STORE_NAME, STORE_URL };

/* ------------------------------------------------------------------ */
/*  Branded HTML templates — orange #EF430B / black / white / #ADADAD  */
/* ------------------------------------------------------------------ */

const brandWrapper = (bodyHtml: string, preheader = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${STORE_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f6f6f4;font-family:Montserrat,Helvetica,Arial,sans-serif;color:#000000;">
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#000000;padding:28px 32px;text-align:center;">
              <span style="font-size:20px;letter-spacing:0.14em;text-transform:uppercase;color:#ffffff;font-weight:700;">${STORE_NAME}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#adadad;text-align:center;">
                ${STORE_NAME} · <a href="${STORE_URL}" style="color:#ef430b;text-decoration:none;">${STORE_URL.replace(/^https?:\/\//, "")}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const button = (label: string, href: string) => `
  <a href="${href}" style="display:inline-block;background:#ef430b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;padding:14px 28px;border-radius:999px;margin-top:8px;">
    ${label}
  </a>
`;

export const emailTemplates = {
  /** Sent to the customer right after a successful Paystack payment. */
  orderConfirmation: (params: {
    customerName: string;
    reference: string;
    itemsHtml: string; // pre-built <tr> rows, see route handler
    subtotal: string;
    deliveryFee: string;
    total: string;
    address: string;
  }) =>
    brandWrapper(
      `
      <h1 style="margin:0 0 4px;font-size:22px;font-weight:600;">Order confirmed!</h1>
      <p style="margin:0 0 24px;font-size:14px;color:#555;">Thank you, ${params.customerName}. We're getting your order ready.</p>
      <p style="margin:0 0 20px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#adadad;">Reference: ${params.reference}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
        ${params.itemsHtml}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13.5px;border-top:1px solid #eee;padding-top:12px;">
        <tr><td style="padding:4px 0;color:#666;">Subtotal</td><td style="padding:4px 0;text-align:right;">${params.subtotal}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Delivery</td><td style="padding:4px 0;text-align:right;">${params.deliveryFee}</td></tr>
        <tr><td style="padding:10px 0 0;font-weight:700;border-top:1px solid #eee;">Total Paid</td><td style="padding:10px 0 0;text-align:right;font-weight:700;border-top:1px solid #eee;">${params.total}</td></tr>
      </table>

      <p style="margin:20px 0 0;font-size:13px;color:#555;"><strong>Delivering to:</strong><br />${params.address}</p>
      `,
      `Your order ${params.reference} is confirmed.`
    ),

  /** Sent to the store owner whenever a new order comes in. */
  orderNotificationAdmin: (params: { customerName: string; email: string; reference: string; total: string }) =>
    brandWrapper(
      `
      <h1 style="margin:0 0 4px;font-size:20px;font-weight:600;">New order received</h1>
      <p style="margin:0 0 20px;font-size:14px;color:#555;">A customer just paid via Paystack.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13.5px;background:#f6f6f4;border-radius:10px;">
        <tr><td style="padding:10px 16px;color:#666;">Customer</td><td style="padding:10px 16px;text-align:right;font-weight:600;">${params.customerName}</td></tr>
        <tr><td style="padding:10px 16px;color:#666;">Email</td><td style="padding:10px 16px;text-align:right;">${params.email}</td></tr>
        <tr><td style="padding:10px 16px;color:#666;">Reference</td><td style="padding:10px 16px;text-align:right;">${params.reference}</td></tr>
        <tr><td style="padding:10px 16px;color:#666;">Total</td><td style="padding:10px 16px;text-align:right;font-weight:700;">${params.total}</td></tr>
      </table>
      `,
      `New order ${params.reference} — ${params.total}`
    ),

  /** Sent to a customer who subscribes via the homepage Newsletter section. */
  newsletterWelcome: () =>
    brandWrapper(
      `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;">You're on the list.</h1>
      <p style="margin:0 0 20px;font-size:14px;color:#555;">
        Thanks for subscribing to ${STORE_NAME}. New pieces land most weeks — you'll get first pick before they're gone.
      </p>
      ${button("Shop now", STORE_URL)}
      `,
      "Welcome to the assortment."
    ),

  /** Sent to the store owner when someone subscribes, so it isn't silent. */
  newsletterNotificationAdmin: (email: string) =>
    brandWrapper(
      `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;">New newsletter subscriber</h1>
      <p style="margin:0;font-size:14px;color:#555;">${email} just subscribed on the site.</p>
      `,
      `New subscriber: ${email}`
    ),

  /** Generic contact-form submission to the store owner. */
  contactNotificationAdmin: (params: { name: string; email: string; message: string }) =>
    brandWrapper(
      `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;">New message from the site</h1>
      <p style="margin:0 0 4px;font-size:13.5px;color:#666;"><strong>From:</strong> ${params.name} (${params.email})</p>
      <p style="margin:16px 0 0;font-size:14px;white-space:pre-wrap;">${params.message}</p>
      `,
      `New contact message from ${params.name}`
    ),
};
