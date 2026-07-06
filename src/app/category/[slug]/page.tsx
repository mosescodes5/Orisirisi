import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, placeholderImage } from "@/lib/data";
import { getProductsByCategory } from "@/lib/products";
import { ShopGrid } from "@/components/product/ShopGrid";
import { Reveal } from "@/components/layout/Reveal";
import type { Product } from "@/lib/types";

const CATEGORY_MAP: Record<string, { name: Product["category"]; blurb: string; hero: string }> = {
  jewelry: {
    name: "Jewelry",
    blurb: "Necklaces, earrings and bangles that don't wait for an occasion.",
    hero: "orisirisi-cat-hero-jewelry",
  },
  wristwatch: {
    name: "Wristwatch",
    blurb: "Timepieces picked the same way as everything else here — worth the wrist space.",
    hero: "orisirisi-cat-hero-wristwatch",
  },
  household: {
    name: "Household",
    blurb: "Pieces that make a house feel lived-in — décor, storage and everyday essentials.",
    hero: "orisirisi-cat-hero-household",
  },
  "fresh-juice": {
    name: "Fresh Juice",
    blurb: "Cold-pressed and made fresh — nothing from concentrate.",
    hero: "orisirisi-cat-hero-fresh-juice",
  },
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: `Shop ${cat.name} at Orísirísi with Taiwo — hand-picked and quality checked before it ships.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  const map = CATEGORY_MAP[slug];
  if (!cat || !map) return notFound();

  const items = await getProductsByCategory(map.name);
  const subcategories = Array.from(new Set(items.map((p) => p.subcategory)));

  return (
    <>
      <section className="relative h-[300px] overflow-hidden">
        <Image
          src={placeholderImage(map.hero, 1600, 500)}
          alt={cat.name}
          fill
          priority
          className="scale-105 animate-[kenburns_9s_ease-out_forwards] object-cover grayscale-[30%] contrast-[1.05] brightness-[0.72]"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-5 text-paper sm:px-8">
          <Reveal className="mx-auto w-full max-w-[1320px]">
            <p className="mb-3 text-xs font-semibold opacity-80">
              <Link href="/" className="transition-opacity hover:opacity-70">Home</Link> / <span>{cat.name}</span>
            </p>
            <h1 className="font-display text-[34px] font-medium sm:text-[46px] lg:text-[58px]">{cat.name}</h1>
            <p className="mt-2.5 max-w-[460px] text-sm opacity-85">{map.blurb}</p>
          </Reveal>
        </div>
        <style>{`
          @keyframes kenburns {
            from { transform: scale(1.12); }
            to { transform: scale(1.02); }
          }
        `}</style>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[1320px]">
          <ShopGrid products={items} subcategories={subcategories} categoryLabel={cat.name} />
        </div>
      </section>
    </>
  );
}
