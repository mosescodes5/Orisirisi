import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { ProductShelf } from "@/components/home/ProductShelf";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Story } from "@/components/home/Story";
import { Newsletter } from "@/components/home/Newsletter";
import { getFeaturedProducts, getCategoryCounts } from "@/lib/products";

export default async function Home() {
  const [newIn, categoryCounts] = await Promise.all([getFeaturedProducts(8), getCategoryCounts()]);

  return (
    <>
      <h1 className="sr-only">
        Orísirísi with Taiwo — Household Items, Jewelry, Clothing & Accessories
      </h1>
      <Hero />
      <Categories counts={categoryCounts} />
      <ProductShelf
        eyebrow="Fresh This Week"
        title="New in the assortment."
        products={newIn}
        viewAllHref="/new-in"
      />
      <TrustStrip />
      <Story />
      <Newsletter />
    </>
  );
}
