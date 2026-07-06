"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { placeholderImage, productImage } from "@/lib/data";
import { RevealStagger, revealItem } from "@/components/layout/Reveal";
import type { CategoryDef, Product } from "@/lib/types";

export function CategoriesGrid({
  categories,
  products,
}: {
  categories: CategoryDef[];
  products: Product[];
}) {
  return (
    <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {categories.map((cat) => {
        const itemsInCategory = products.filter((p) => p.category === cat.productCategory);
        const preview = itemsInCategory.slice(0, 3);

        return (
          <motion.div key={cat.slug} variants={revealItem}>
            <Link
              href={`/category/${cat.slug}`}
              className="group relative isolate flex h-[420px] flex-col justify-end overflow-hidden rounded-[22px]"
            >
              <Image
                src={placeholderImage(cat.image, 800, 900)}
                alt={cat.name}
                fill
                className="object-cover grayscale-[35%] contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/20 to-black/0 transition-opacity duration-500 group-hover:from-black/92" />
              <div className="absolute inset-0 z-[1] bg-orisirisi opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-30" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] rounded-[22px] ring-1 ring-inset ring-paper/0 transition-all duration-500 group-hover:ring-paper/25"
              />

              <div className="relative z-[2] flex flex-col gap-4 p-7 text-paper sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-paper opacity-75">{itemsInCategory.length} items</p>
                  {itemsInCategory.some((p) => p.isNew) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orisirisi px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                      <Sparkles size={11} /> New in
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="font-display text-[28px] font-medium sm:text-[32px]">{cat.name}</h2>
                  <p className="mt-2 max-w-[380px] text-[13.5px] leading-relaxed opacity-85">{cat.blurb}</p>
                </div>

                {preview.length > 0 && (
                  <div className="flex gap-2.5">
                    {preview.map((p) => (
                      <div key={p.id} className="relative h-14 w-14 overflow-hidden rounded-[10px] ring-1 ring-paper/25">
                        <Image src={productImage(p, 120, 120)} alt={p.name} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-transform duration-300 group-hover:translate-x-1.5">
                  Explore {cat.name} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </RevealStagger>
  );
}
