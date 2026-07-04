"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { placeholderImage } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex gap-4 border-b border-ink/[0.08] py-6 first:pt-0 sm:gap-6">
      <Link href={`/product/${item.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ink/[0.04] sm:h-28 sm:w-24">
        <Image src={placeholderImage(item.image, 300, 375)} alt={item.name} fill className="object-cover" />
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
              aria-label="Decrease quantity"
              onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
              className="flex h-9 w-9 items-center justify-center"
            >
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
            <button
              aria-label="Increase quantity"
              onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
              className="flex h-9 w-9 items-center justify-center"
            >
              <Plus size={13} />
            </button>
          </div>
          <span className="text-sm font-bold">{formatNaira(item.price * item.qty)}</span>
        </div>
      </div>
    </div>
  );
}
