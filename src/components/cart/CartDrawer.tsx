"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";

const ease = [0.16, 0.84, 0.44, 1] as const;

export function CartDrawer() {
  const { items, subtotal, deliveryFee, total, isDrawerOpen, closeDrawer } = useCart();

  // Lock body scroll while the drawer is open, restore on close/unmount.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isDrawerOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isDrawerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60] bg-black/50"
            aria-hidden="true"
          />

          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-[420px] flex-col bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-5">
              <h2 className="font-display text-lg font-medium">
                Your Bag {items.length > 0 && <span className="text-ink/50">({items.length})</span>}
              </h2>
              <button
                onClick={closeDrawer}
                aria-label="Close bag"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-ink/[0.06]"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/[0.04]">
                  <ShoppingBag size={26} strokeWidth={1.4} className="text-mist" />
                </div>
                <p className="mt-5 text-[14.5px] font-medium">Your bag is empty.</p>
                <p className="mt-1.5 max-w-[240px] text-[13px] text-ink/60">
                  Add something from the assortment to see it here.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
                >
                  Keep browsing
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  {items.map((item) => (
                    <CartLineItem key={`${item.productId}-${item.size ?? ""}`} item={item} />
                  ))}
                </div>

                <div className="border-t border-ink/[0.08] p-6">
                  <CartSummary
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    total={total}
                    ctaLabel="Checkout"
                    ctaHref="/checkout"
                    onCtaClick={closeDrawer}
                  />
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-ink/60 transition-colors hover:text-orisirisi"
                  >
                    View full bag <ArrowRight size={13} />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
