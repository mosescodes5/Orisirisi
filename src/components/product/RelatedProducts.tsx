"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { RevealStagger, revealItem } from "@/components/layout/Reveal";

export function RelatedProducts({ products: items }: { products: Product[] }) {
  return (
    <RevealStagger className="grid grid-cols-2 gap-6 sm:gap-7 md:grid-cols-4">
      {items.map((p) => (
        <motion.div key={p.id} variants={revealItem}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </RevealStagger>
  );
}
