import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products, placeholderImage } from "@/lib/data";
import { ShopGrid } from "@/components/product/ShopGrid";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "New In",
  description: "The latest arrivals at Orísirísi with Taiwo — hand-picked and quality checked before it ships.",
};

export default function NewInPage() {
  const items = products.filter((p) => p.isNew);
  const subcategories = Array.from(new Set(items.map((p) => p.subcategory)));

  return (
    <>
      <section className="relative h-[300px] overflow-hidden">
        <Image
          src={placeholderImage("orisirisi-new-in-hero", 1600, 500)}
          alt="New arrivals"
          fill
          priority
          className="scale-105 animate-[kenburns_9s_ease-out_forwards] object-cover grayscale-[30%] contrast-[1.05] brightness-[0.72]"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-5 text-paper sm:px-8">
          <Reveal className="mx-auto w-full max-w-[1320px]">
            <p className="mb-3 text-xs font-semibold opacity-80">
              <Link href="/" className="transition-opacity hover:opacity-70">Home</Link> / <span>New In</span>
            </p>
            <h1 className="font-display text-[34px] font-medium sm:text-[46px] lg:text-[58px]">New In</h1>
            <p className="mt-2.5 max-w-[460px] text-sm opacity-85">
              Freshly added to the assortment — the latest pieces before anything else.
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

      <section className="px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[1320px]">
          {items.length > 0 ? (
            <ShopGrid products={items} subcategories={subcategories} categoryLabel="New In" />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ink/[0.14] px-6 py-20 text-center">
              <p className="text-[15px] font-semibold">Nothing new just yet.</p>
              <p className="mt-1 text-[13.5px] text-ink/60">Check back soon — the assortment updates often.</p>
              <Link
                href="/category/household"
                className="mt-6 rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
              >
                Browse everything
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
