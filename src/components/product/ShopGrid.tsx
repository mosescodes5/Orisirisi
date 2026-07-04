"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, LayoutGrid, List, X, ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Filters } from "@/components/product/Filters";

const PAGE_SIZE = 9;
const ease = [0.16, 0.84, 0.44, 1] as const;

export function ShopGrid({
  products,
  subcategories,
  categoryLabel,
}: {
  products: Product[];
  subcategories: string[];
  categoryLabel: string;
}) {
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([]);
  const [swatch, setSwatch] = useState<string | null>(null);

  const maxPrice = useMemo(
    () => Math.max(80000, ...products.map((p) => p.price)),
    [products]
  );
  const [priceLimit, setPriceLimit] = useState(maxPrice);

  function toggleSubcat(s: string) {
    setSelectedSubcats((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    setPage(1);
  }

  function clearFilters() {
    setSelectedSubcats([]);
    setPriceLimit(maxPrice);
    setSwatch(null);
    setPage(1);
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedSubcats.length > 0 && !selectedSubcats.includes(p.subcategory)) return false;
      if (p.price > priceLimit) return false;
      return true;
    });
  }, [products, selectedSubcats, priceLimit]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return list;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="grid grid-cols-1 items-start gap-11 md:grid-cols-[260px_1fr]">
      {/* desktop sidebar */}
      <aside className="sticky top-[110px] hidden md:block">
        <Filters
          subcategories={subcategories}
          selected={selectedSubcats}
          onToggle={toggleSubcat}
          maxPrice={maxPrice}
          priceLimit={priceLimit}
          onPriceChange={(v) => {
            setPriceLimit(v);
            setPage(1);
          }}
          swatch={swatch}
          onSwatchChange={setSwatch}
          onClear={clearFilters}
        />
      </aside>

      <div>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3.5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/[0.14] px-4.5 py-2.5 text-[13px] font-bold transition-colors hover:border-orisirisi hover:text-orisirisi md:hidden"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>

          <p className="text-[13.5px] text-ink/60">
            <strong className="text-ink">{sorted.length}</strong> piece{sorted.length === 1 ? "" : "s"} in{" "}
            {categoryLabel}
          </p>

          <div className="flex items-center gap-4.5">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-full border-[1.5px] border-ink/[0.14] bg-paper py-2.5 pl-4 pr-9 text-[13px] font-semibold transition-colors hover:border-orisirisi/50"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mist">⌄</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border-[1.5px] transition-colors ${
                  view === "grid" ? "border-ink bg-ink text-paper" : "border-ink/[0.14] hover:border-orisirisi"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border-[1.5px] transition-colors ${
                  view === "list" ? "border-ink bg-ink text-paper" : "border-ink/[0.14] hover:border-orisirisi"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ink/[0.14] px-6 py-20 text-center">
            <PackageSearch size={30} strokeWidth={1.4} className="text-mist" />
            <p className="mt-4 text-[15px] font-semibold">No pieces match your filters.</p>
            <p className="mt-1 text-[13.5px] text-ink/60">Try widening your price range or clearing filters.</p>
            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={
              view === "grid"
                ? "grid grid-cols-2 gap-6 sm:grid-cols-3"
                : "flex flex-col gap-8"
            }
          >
            <AnimatePresence mode="popLayout">
              {pageItems.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <ProductCard product={p} listView={view === "list"} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2.5">
            <button
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink/[0.05] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-10 w-10 rounded-full border-[1.5px] text-[13px] font-bold transition-colors ${
                  n === page ? "border-ink bg-ink text-paper" : "border-ink/[0.14] hover:border-orisirisi hover:text-orisirisi"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink/[0.05] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity md:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`fixed bottom-0 left-0 top-0 z-[91] w-[86%] max-w-[340px] overflow-y-auto bg-paper p-6 transition-transform duration-400 md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[15px] font-bold">Filters</span>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <Filters
          subcategories={subcategories}
          selected={selectedSubcats}
          onToggle={toggleSubcat}
          maxPrice={maxPrice}
          priceLimit={priceLimit}
          onPriceChange={(v) => {
            setPriceLimit(v);
            setPage(1);
          }}
          swatch={swatch}
          onSwatchChange={setSwatch}
          onClear={clearFilters}
        />
      </aside>
    </div>
  );
}
