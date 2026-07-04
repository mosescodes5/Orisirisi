"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { CheckoutForm, CHECKOUT_FORM_ID } from "@/components/checkout/CheckoutForm";
import { CartSummary } from "@/components/cart/CartSummary";
import { formatNaira } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total } = useCart();
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-[26px] font-medium sm:text-[32px]">Nothing to check out yet.</h1>
        <p className="mt-2.5 max-w-sm text-[14.5px] text-ink/60">Your bag is empty — add something first.</p>
        <Link
          href="/new-in"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-12 pb-28 sm:px-8 sm:py-16 lg:pb-16">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="font-display text-[30px] font-medium sm:text-[38px]">Checkout</h1>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
          <CheckoutForm onSubmittingChange={setSubmitting} />

          <div className="lg:sticky lg:top-[110px] lg:self-start">
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              ctaLabel={submitting ? "Processing…" : "Pay with Paystack"}
              ctaDisabled={submitting}
              formId={CHECKOUT_FORM_ID}
            />
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-mist">
              <ShieldCheck size={13} /> Secured by Paystack
            </p>
          </div>
        </div>
      </div>

      {/* Mobile sticky pay bar — keeps the total and CTA reachable while filling in the form. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/[0.08] bg-paper/95 px-5 py-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-mist">Total</p>
            <p className="text-base font-bold">{formatNaira(total)}</p>
          </div>
          <button
            type="submit"
            form={CHECKOUT_FORM_ID}
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Processing…
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
