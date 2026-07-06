"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, ChevronDown, Truck, RotateCcw, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

// Keyed by subcategory, not top-level category — since Clothing/Accessories
// items were folded into "Household", subcategory ("Tops", "Bags", etc.) is
// the only thing left that reliably tells us a product needs sizing.
const SIZE_OPTIONS: Record<string, string[]> = {
  Tops: ["XS", "S", "M", "L", "XL"],
};

const ease = [0.16, 0.84, 0.44, 1] as const;

export function ProductActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openDrawer } = useCart();
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);
  const sizes = SIZE_OPTIONS[product.subcategory];
  const [size, setSize] = useState(sizes?.[1] ?? null);

  function handleAdd() {
    addItem(product, qty, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    setTimeout(() => openDrawer(), 350);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-mist">{product.subcategory}</p>
      <h1 className="mt-2 font-display text-[30px] font-medium leading-tight sm:text-[38px]">{product.name}</h1>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xl font-bold">{formatNaira(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-sm font-medium text-mist line-through">{formatNaira(product.compareAtPrice)}</span>
        )}
        {product.isNew && (
          <span className="rounded-full bg-orisirisi px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-paper">
            New
          </span>
        )}
      </div>

      <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-ink/60">{product.description}</p>

      {sizes && (
        <div className="mt-7">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide">Size</p>
          <div className="flex flex-wrap gap-2.5">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-full border-[1.5px] px-3.5 text-[13px] font-semibold transition-all duration-200 ${
                  size === s
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/[0.14] hover:border-orisirisi hover:text-orisirisi"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 flex items-center gap-4">
        <div className="flex items-center rounded-full border-[1.5px] border-ink/[0.14]">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:text-orisirisi"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm font-bold tabular-nums">{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:text-orisirisi"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="relative flex-1 overflow-hidden rounded-full bg-ink py-3.5 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.25, ease }}
                className="inline-flex items-center justify-center gap-1.5"
              >
                <Check size={15} /> Added to bag
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.25, ease }}
                className="block"
              >
                Add to bag
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <motion.button
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggle(product.id)}
          whileTap={{ scale: 0.85 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink/[0.14] transition-colors hover:border-orisirisi"
        >
          <motion.span
            key={String(wished)}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
          >
            <Heart size={18} strokeWidth={1.7} className={wished ? "fill-orisirisi stroke-orisirisi" : "stroke-ink"} />
          </motion.span>
        </motion.button>
      </div>

      <div className="mt-8 flex flex-col gap-3.5 border-y border-ink/[0.08] py-6">
        <div className="flex items-start gap-3 text-[13px] text-ink/70">
          <Truck size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-orisirisi" />
          Dispatched within 48 hours — nationwide delivery.
        </div>
        <div className="flex items-start gap-3 text-[13px] text-ink/70">
          <RotateCcw size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-orisirisi" />
          Easy 7-day returns if it&apos;s not quite right.
        </div>
      </div>

      <Accordion title="Delivery & Returns">
        Orders are dispatched within 48 hours of payment and delivered nationwide in 2–5 business
        days depending on location. Items can be returned within 7 days of delivery, provided
        they&apos;re unused and in original packaging.
      </Accordion>
    </motion.div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/[0.08] py-4.5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="text-[13.5px] font-bold">{title}</span>
        <ChevronDown size={15} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{children}</p>
        </div>
      </div>
    </div>
  );
}
