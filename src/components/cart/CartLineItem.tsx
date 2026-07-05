"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, Heart, Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { resolveCartImage } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

export function CartLineItem({ item, showSaveForLater = false }: { item: CartItem; showSaveForLater?: boolean }) {
  const { updateQty, removeItem, saveForLater } = useCart();
  // Local text buffer so the person can freely clear/retype the number
  // without the field snapping back to a clamped value on every keystroke.
  const [qtyText, setQtyText] = useState(String(item.qty));
  const [lastSyncedQty, setLastSyncedQty] = useState(item.qty);

  // Keep the typed buffer in sync when quantity changes from elsewhere (e.g.
  // the +/- buttons) — adjusted during render per React's guidance, not in an effect.
  if (item.qty !== lastSyncedQty) {
    setLastSyncedQty(item.qty);
    setQtyText(String(item.qty));
  }

  function commitQty(raw: string) {
    const parsed = parseInt(raw, 10);
    const next = Number.isFinite(parsed) ? Math.max(1, parsed) : item.qty;
    setQtyText(String(next));
    if (next !== item.qty) updateQty(item.productId, item.size, next);
  }

  return (
    <div className="flex gap-4 border-b border-ink/[0.08] py-6 first:pt-0 sm:gap-6">
      <Link href={`/product/${item.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ink/[0.04] sm:h-28 sm:w-24">
        <Image src={resolveCartImage(item.image, 300, 375)} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/product/${item.slug}`} className="text-[14.5px] font-semibold hover:text-orisirisi">
              {item.name}
            </Link>
            {item.size && <p className="mt-1 text-xs text-mist">Size: {item.size}</p>}
          </div>
          <button
            aria-label="Remove item"
            onClick={() => removeItem(item.productId, item.size)}
            className="text-mist transition-colors hover:text-orisirisi"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border-[1.5px] border-ink/[0.14]">
            <button
              aria-label={item.qty === 1 ? "Remove item" : "Decrease quantity"}
              onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
              className="flex h-9 w-9 items-center justify-center transition-colors hover:text-orisirisi"
            >
              {item.qty === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
            </button>
            <input
              type="text"
              inputMode="numeric"
              aria-label="Quantity"
              value={qtyText}
              onChange={(e) => {
                // Allow only digits while typing; commit/clamp on blur or Enter.
                const v = e.target.value.replace(/[^\d]/g, "");
                setQtyText(v);
              }}
              onBlur={() => commitQty(qtyText)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-9 bg-transparent text-center text-sm font-bold tabular-nums outline-none"
            />
            <button
              aria-label="Increase quantity"
              onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
              className="flex h-9 w-9 items-center justify-center transition-colors hover:text-orisirisi"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {showSaveForLater && (
              <button
                onClick={() => saveForLater(item.productId, item.size)}
                className="hidden items-center gap-1.5 text-xs font-semibold text-ink/50 transition-colors hover:text-orisirisi sm:flex"
              >
                <Heart size={13} /> Save for later
              </button>
            )}
            <span className="text-sm font-bold">{formatNaira(item.price * item.qty)}</span>
          </div>
        </div>

        {showSaveForLater && (
          <button
            onClick={() => saveForLater(item.productId, item.size)}
            className="mt-3 flex items-center gap-1.5 self-start text-xs font-semibold text-ink/50 transition-colors hover:text-orisirisi sm:hidden"
          >
            <Heart size={13} /> Save for later
          </button>
        )}
      </div>
    </div>
  );
}
