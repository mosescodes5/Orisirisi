import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { ProductShelf } from "@/components/home/ProductShelf";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Story } from "@/components/home/Story";
import { Newsletter } from "@/components/home/Newsletter";
import { getFeaturedProducts } from "@/lib/products";
import { getHeroImageOverrides } from "@/lib/site-settings";
import { HERO_IMAGE_SLOTS } from "@/lib/hero-images";

function heroSrc(key: string, overrides: Record<string, string>) {
  return overrides[key] ?? HERO_IMAGE_SLOTS.find((s) => s.key === key)!.defaultSrc;
}

export default async function Home() {
  const [newIn, heroOverrides] = await Promise.all([getFeaturedProducts(8), getHeroImageOverrides()]);
  const heroImages = {
    household: heroSrc("hero_home_float_household", heroOverrides),
    jewelry: heroSrc("hero_home_float_jewelry", heroOverrides),
    wristwatch: heroSrc("hero_home_float_wristwatch", heroOverrides),
  };

  return (
    <>
      <h1 className="sr-only">
        Orísirísi with Taiwo — Jewelry, Wristwatch, Home & Living & Fresh Juice
      </h1>
      <Hero images={heroImages} />
      <Categories />
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
