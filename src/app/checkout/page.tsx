"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total } = useCart();

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
    <div className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="font-display text-[30px] font-medium sm:text-[38px]">Checkout</h1>

        <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[1fr_340px]">
          <CheckoutForm />
          <div className="md:sticky md:top-[110px] md:self-start">
            <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
            <p className="mt-3 text-center text-xs text-mist">Complete the form to pay securely with Paystack.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
