"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink/[0.04]">
          <ShoppingBag size={30} strokeWidth={1.4} className="text-mist" />
        </div>
        <h1 className="mt-7 font-display text-[26px] font-medium sm:text-[32px]">Your bag is empty.</h1>
        <p className="mt-2.5 max-w-sm text-[14.5px] text-ink/60">
          Nothing here yet — go find something from the assortment worth taking home.
        </p>
        <Link
          href="/new-in"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          Start shopping <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="font-display text-[30px] font-medium sm:text-[38px]">Your Bag</h1>
        <p className="mt-1.5 text-[13.5px] text-ink/60">{items.length} item{items.length > 1 ? "s" : ""}</p>

        <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[1fr_340px]">
          <div>
            {items.map((item) => (
              <CartLineItem key={`${item.productId}-${item.size ?? ""}`} item={item} />
            ))}
          </div>

          <div className="md:sticky md:top-[110px] md:self-start">
            <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} ctaLabel="Checkout" ctaHref="/checkout" />
          </div>
        </div>
      </div>
    </div>
  );
}
