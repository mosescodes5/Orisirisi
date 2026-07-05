import "server-only";
import crypto from "node:crypto";

export type PaystackVerifyResult =
  | {
      verified: true;
      amountKobo: number;
      currency: string;
      paidAt: string | null;
      customerEmail: string;
      metadata: Record<string, unknown> | null;
    }
  | { verified: false; reason: string };

/**
 * Confirms with Paystack directly (server-to-server, using the secret key)
 * that a transaction reference actually succeeded, and for how much.
 * Never trust a client-reported "payment succeeded" on its own — the
 * client-side Paystack popup callback fires on the browser, which is not a
 * trustworthy place to decide "this order is paid."
 */
export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResult> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return { verified: false, reason: "PAYSTACK_SECRET_KEY is not configured on the server." };
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        cache: "no-store",
      }
    );

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.status) {
      return { verified: false, reason: json?.message ?? `Paystack verification request failed (${res.status}).` };
    }

    const data = json.data;
    if (!data || data.status !== "success") {
      return { verified: false, reason: `Transaction status was "${data?.status ?? "unknown"}", not "success".` };
    }

    return {
      verified: true,
      amountKobo: data.amount,
      currency: data.currency,
      paidAt: data.paid_at ?? null,
      customerEmail: data.customer?.email ?? "",
      metadata: data.metadata ?? null,
    };
  } catch (err) {
    return {
      verified: false,
      reason: err instanceof Error ? err.message : "Unknown error contacting Paystack.",
    };
  }
}

/**
 * Verifies the `x-paystack-signature` header on an incoming webhook request.
 * Paystack signs the raw request body with HMAC-SHA512 using your secret
 * key — this is what proves a webhook actually came from Paystack and
 * wasn't forged by a third party hitting the endpoint directly.
 */
export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || !signature) return false;

  const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    // Length mismatch, etc. — definitely not a valid signature.
    return false;
  }
}
