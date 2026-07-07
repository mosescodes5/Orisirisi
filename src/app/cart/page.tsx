"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { placeholderImage } from "@/lib/data";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const { items, savedItems, subtotal, deliveryFee, total, moveToCart, removeSaved } = useCart();

  if (items.length === 0 && savedItems.length === 0) {
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
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
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
        <p className="mt-1.5 text-[13.5px] text-ink/60">{items.length} item{items.length !== 1 ? "s" : ""}</p>

        <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[1fr_340px]">
          <div>
            {items.length > 0 ? (
              items.map((item) => (
                <CartLineItem key={`${item.productId}-${item.size ?? ""}`} item={item} showSaveForLater />
              ))
            ) : (
              <p className="rounded-card border border-dashed border-ink/[0.14] px-6 py-10 text-center text-[13.5px] text-ink/50">
                Your bag is empty — move something back from Saved for later, or keep browsing.
              </p>
            )}

            {savedItems.length > 0 && (
              <div className="mt-14">
                <h2 className="font-display text-xl font-medium">
                  Saved for later <span className="text-ink/40">({savedItems.length})</span>
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {savedItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.size ?? ""}`}
                      className="flex gap-4 rounded-card border border-ink/[0.08] p-4"
                    >
                      <Link href={`/product/${item.slug}`} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-ink/[0.04]">
                        <Image src={placeholderImage(item.image, 200, 250)} alt={item.name} fill className="object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/product/${item.slug}`} className="truncate text-[13.5px] font-semibold hover:text-orisirisi">
                            {item.name}
                          </Link>
                          <button
                            aria-label="Remove from saved items"
                            onClick={() => removeSaved(item.productId, item.size)}
                            className="shrink-0 text-mist transition-colors hover:text-orisirisi"
                          >
                            <X size={15} />
                          </button>
                        </div>
                        {item.size && <p className="text-xs text-mist">Size: {item.size}</p>}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold">{formatNaira(item.price)}</span>
                          <button
                            onClick={() => moveToCart(item.productId, item.size)}
                            className="rounded-full bg-ink/[0.06] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors hover:bg-secondary hover:text-paper"
                          >
                            Move to bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:sticky md:top-[110px] md:self-start">
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              ctaLabel="Checkout"
              ctaHref={items.length > 0 ? "/checkout" : undefined}
              ctaDisabled={items.length === 0}
            />
            {items.length === 0 && (
              <p className="mt-3 text-center text-xs text-mist">Move an item back from Saved for later to check out.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
