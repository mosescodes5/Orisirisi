"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { fetchAllPublishedProducts } from "@/lib/products-client";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q")?.trim() ?? "";

  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetchAllPublishedProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const results = useMemo(() => {
    if (!query || !products) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  return (
    <div className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1320px]">
        <p className="eyebrow">Search</p>
        <h1 className="mt-2 font-display text-[28px] font-medium sm:text-[36px]">
          {query ? `Results for “${query}”` : "Search the assortment"}
        </h1>
        {query && (
          <p className="mt-2 text-[13.5px] text-ink/60">
            {results.length} {results.length === 1 ? "piece" : "pieces"} found
          </p>
        )}

        {query && products && results.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <SearchX size={30} strokeWidth={1.4} className="text-mist" />
            <p className="mt-4 max-w-sm text-[14.5px] text-ink/60">
              Nothing matched that search. Try a category name like &ldquo;jewelry&rdquo; or a
              product type like &ldquo;candle&rdquo;.
            </p>
            <Link
              href="/new-in"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
            >
              Browse new in
            </Link>
          </div>
        )}

        {query && !products && (
          <div className="mt-16 flex flex-col items-center text-center text-[13.5px] text-ink/50">
            Searching the assortment…
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-7 md:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
