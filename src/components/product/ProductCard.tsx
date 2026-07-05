"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { productImage } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export function ProductCard({ product, listView = false }: { product: Product; listView?: boolean }) {
  const [added, setAdded] = useState(false);
  const { addItem, openDrawer } = useCart();
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.id);

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    setTimeout(() => openDrawer(), 300);
  }

  return (
    <div className={listView ? "grid grid-cols-[180px_1fr] items-center gap-6 sm:grid-cols-[220px_1fr]" : ""}>
      <div className={`group relative overflow-hidden rounded-card bg-ink/[0.04] ${listView ? "aspect-[4/4.4]" : "aspect-[4/5]"}`}>
        {product.isNew && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-orisirisi px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-paper">
            New
          </span>
        )}
        <button
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggle(product.id)}
          className="absolute right-3 top-3 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-paper/90 transition-transform hover:scale-110"
        >
          <Heart size={16} strokeWidth={1.7} className={wished ? "fill-orisirisi stroke-orisirisi" : "stroke-ink"} />
        </button>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={productImage(product, 500, 625)}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover grayscale-[10%] contrast-[1.03] transition-transform duration-500 group-hover:scale-[1.07]"
          />
        </Link>
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-3 right-3 z-10 rounded-[10px] bg-ink py-3 text-center text-xs font-bold uppercase tracking-wide text-paper transition-all duration-300 hover:bg-orisirisi sm:translate-y-14 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          {added ? (
            <span className="inline-flex items-center justify-center gap-1.5"><Check size={13} /> Added</span>
          ) : (
            "Add to bag"
          )}
        </button>
      </div>

      <div className={listView ? "" : "pt-4"}>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-mist">{product.subcategory}</div>
        <Link href={`/product/${product.slug}`} className="mt-1 block text-[14.5px] font-semibold leading-snug hover:text-orisirisi">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2 text-sm font-bold">
          {formatNaira(product.price)}
          {product.compareAtPrice && (
            <span className="text-xs font-medium text-mist line-through">{formatNaira(product.compareAtPrice)}</span>
          )}
        </div>
        {listView && <p className="mt-1.5 text-[13px] leading-relaxed text-ink/60">{product.description}</p>}
      </div>
    </div>
  );
}
