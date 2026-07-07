"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { fetchProductsByIds } from "@/lib/products-client";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { addItem, openDrawer } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Effect (not derived state) because this is fetching from an external
  // system (Supabase) in response to the wishlist id list changing.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: kicks off loading state for an external fetch
    setLoading(true);
    fetchProductsByIds(ids)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ids]);

  function addAllToBag() {
    products.forEach((p) => addItem(p, 1));
    openDrawer();
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-28 text-center text-[13.5px] text-ink/50 sm:px-8">
        Loading your wishlist…
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink/[0.04]">
          <Heart size={30} strokeWidth={1.4} className="text-mist" />
        </div>
        <h1 className="mt-7 font-display text-[26px] font-medium sm:text-[32px]">Your wishlist is empty.</h1>
        <p className="mt-2.5 max-w-sm text-[14.5px] text-ink/60">
          Tap the heart on anything you like the look of — it&apos;ll be saved here for later.
        </p>
        <Link
          href="/new-in"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          Start browsing <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[30px] font-medium sm:text-[38px]">Your Wishlist</h1>
            <p className="mt-1.5 text-[13.5px] text-ink/60">
              {products.length} piece{products.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <button
            onClick={addAllToBag}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
          >
            <ShoppingBag size={15} /> Add all to bag
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
