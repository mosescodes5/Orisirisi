import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { placeholderImage } from "@/lib/data";
import { getProductBySlug, getProductsByCategory, getAllProductSlugs } from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Reveal } from "@/components/layout/Reveal";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [placeholderImage(product.image, 800, 1000)],
    },
  };
}

const CATEGORY_SLUG: Record<string, string> = {
  Jewelry: "jewelry",
  Wristwatch: "wristwatch",
  Household: "household",
  "Fresh Juice": "fresh-juice",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  // Only one real photo exists per product right now, so the gallery shows
  // just that — showing fabricated "-2"/"-3" variants would silently fall
  // back to unrelated random photos for any product without real angles shot.
  const gallery = [placeholderImage(product.image, 700, 875)];

  const relatedAll = await getProductsByCategory(product.category);
  const related = relatedAll.filter((p) => p.id !== product.id).slice(0, 4);

  const categorySlug = CATEGORY_SLUG[product.category] ?? "household";

  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-[1320px]">
        <p className="mb-8 text-xs font-semibold text-ink/60">
          <Link href="/" className="hover:text-orisirisi">Home</Link> /{" "}
          <Link href={`/category/${categorySlug}`} className="hover:text-orisirisi">{product.category}</Link> /{" "}
          <span className="text-ink">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <ProductGallery images={gallery} alt={product.name} />
          </Reveal>
          <ProductActions product={product} />
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <Reveal className="mb-9">
              <p className="eyebrow">You Might Also Like</p>
              <h2 className="mt-2 font-display text-[26px] font-medium sm:text-[32px]">
                More from {product.category}
              </h2>
            </Reveal>
            <RelatedProducts products={related} />
          </section>
        )}
      </div>
    </div>
  );
}
