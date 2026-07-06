import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, placeholderImage } from "@/lib/data";
import { getAllPublishedProducts } from "@/lib/products";
import { Reveal } from "@/components/layout/Reveal";
import { CategoriesGrid } from "@/components/category/CategoriesGrid";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Browse every category at Orísirísi with Taiwo — jewelry, wristwatches, household items and fresh juice, all hand-picked before they ship.",
};

const CATEGORY_META: Record<string, { name: Product["category"]; blurb: string }> = {
  jewelry: {
    name: "Jewelry",
    blurb: "Necklaces, earrings and bangles that don't wait for an occasion.",
  },
  wristwatch: {
    name: "Wristwatch",
    blurb: "Timepieces picked the same way as everything else here — worth the wrist space.",
  },
  household: {
    name: "Household",
    blurb: "Pieces that make a house feel lived-in — décor, storage and everyday essentials.",
  },
  "fresh-juice": {
    name: "Fresh Juice",
    blurb: "Cold-pressed and made fresh — nothing from concentrate.",
  },
};

export default async function CategoriesPage() {
  const products = await getAllPublishedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[280px] overflow-hidden sm:h-[320px]">
        <Image
          src={placeholderImage("orisirisi-categories-hero", 1600, 500)}
          alt="Orísirísi categories"
          fill
          priority
          className="scale-105 animate-[kenburns_9s_ease-out_forwards] object-cover grayscale-[30%] contrast-[1.05] brightness-[0.68]"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-5 text-paper sm:px-8">
          <Reveal className="mx-auto w-full max-w-[1320px]">
            <p className="mb-3 text-xs font-semibold opacity-80">
              <Link href="/" className="transition-opacity hover:opacity-70">
                Home
              </Link>{" "}
              / <span>Categories</span>
            </p>
            <h1 className="font-display text-[34px] font-medium sm:text-[46px] lg:text-[58px]">
              Shop by Category
            </h1>
            <p className="mt-2.5 max-w-[460px] text-sm opacity-85">
              No two Orísirísi orders look alike — that&apos;s the point. Every category is
              hand-picked and quality-checked before it ships.
            </p>
          </Reveal>
        </div>
        <style>{`
          @keyframes kenburns {
            from { transform: scale(1.12); }
            to { transform: scale(1.02); }
          }
        `}</style>
      </section>

      {/* Category grid */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1320px]">
          <CategoriesGrid categories={categories} products={products} categoryMeta={CATEGORY_META} />

          <Reveal className="mt-16 flex flex-col items-center gap-3 rounded-[22px] border border-dashed border-ink/[0.14] px-8 py-10 text-center">
            <p className="eyebrow">Can&apos;t decide?</p>
            <h3 className="font-display text-[24px] font-medium sm:text-[28px]">
              See everything in one shelf.
            </h3>
            <Link
              href="/new-in"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
            >
              Shop New In <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
