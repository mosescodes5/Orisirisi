"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal, RevealStagger, revealItem } from "@/components/layout/Reveal";

export function ProductShelf({
  title,
  eyebrow,
  products,
  viewAllHref,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  viewAllHref?: string;
}) {
  return (
    <section className="bg-ink/[0.04] px-5 py-24 sm:px-8 sm:py-[96px]">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-2.5 font-display text-[28px] font-medium tracking-tight sm:text-[36px] lg:text-[44px]">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group border-b-[1.5px] border-ink pb-1 text-[13px] font-bold uppercase tracking-wide transition-colors hover:border-orisirisi hover:text-orisirisi"
            >
              View all{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          )}
        </Reveal>

        <RevealStagger className="grid grid-cols-2 gap-6 sm:gap-7 md:grid-cols-4">
          {products.map((p) => (
            <motion.div key={p.id} variants={revealItem}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
