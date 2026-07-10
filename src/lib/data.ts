import type { CategoryDef, Product } from "./types";

/*
  Static/reference data layer: categories, placeholder images, and blog
  content. Product data now lives in Supabase — see src/lib/products.ts
  (server-only queries, for Server Components) and
  src/lib/products-client.ts (browser queries, for Client Components like
  search and wishlist). This file stays free of server-only imports so
  Client Components can keep importing `categories`/`placeholderImage`
  from it directly.
*/

export const categories: CategoryDef[] = [
  { slug: "jewelry", name: "Jewelry", itemCount: 6, image: "orisirisi-cat-jewelry" },
  { slug: "wristwatch", name: "Wristwatch", itemCount: 0, image: "orisirisi-cat-wristwatch" },
  { slug: "household", name: "Household Items", itemCount: 6, image: "orisirisi-cat-household" },
  { slug: "fresh-juice", name: "Fresh Juice", itemCount: 0, image: "orisirisi-cat-fresh-juice" },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// Curated real photos (Unsplash, free-to-use license) keyed by the same
// seed strings already stored on categories/products/blog posts — this is
// the only place that needs to change when real product photography exists.
// Unmapped seeds still fall back to picsum so nothing 404s if a new seed
// is added without a matching entry here.
const CURATED_IMAGES: Record<string, string> = {
  // Products
  "orisirisi-p1": "1632574231053-2dda4c5774eb", // woven storage baskets
  "orisirisi-p2": "1758995115682-1452a1a9e35b", // layered gold necklace
  "orisirisi-p3": "1774005906344-57048d3f5856", // linen wrap top
  "orisirisi-p4": "1528414450725-0b2677fc991a", // ceramic table lamp
  "orisirisi-p5": "1756792340190-2039b9a1787d", // beaded drop earrings
  "orisirisi-p6": "1598532163257-ae3c6b2524b6", // structured tote bag
  "orisirisi-p7": "1559548290-d6b0cb6c9050", // soy candle set
  "orisirisi-p8": "1683356177083-0872f7ed3d95", // silk hair scarf
  "orisirisi-j3": "1680968921717-4abbbe793bb3", // statement hoop earrings
  "orisirisi-j4": "1656010280156-fa8c1793c235", // pearl cluster ring
  "orisirisi-j5": "1741071520895-47d81779c11e", // beaded waist bangle set
  "orisirisi-j6": "1741071520895-47d81779c11e", // fine chain anklet
  // Categories
  "orisirisi-cat-household": "1632574231053-2dda4c5774eb",
  "orisirisi-cat-jewelry": "1758995115682-1452a1a9e35b",
  "orisirisi-cat-wristwatch": "1704428303280-84768603d539",
  "orisirisi-cat-fresh-juice": "1600271886742-f049cd451bba",
  // Category page hero banners (separate key namespace from the cards above)
  "orisirisi-cat-hero-household": "1528414450725-0b2677fc991a",
  "orisirisi-cat-hero-jewelry": "1758995115682-1452a1a9e35b",
  "orisirisi-cat-hero-wristwatch": "1704428303280-84768603d539",
  "orisirisi-cat-hero-fresh-juice": "1600271886742-f049cd451bba",
  // Homepage hero accents + category/new-in banners
  "orisirisi-household": "1632574231053-2dda4c5774eb",
  "orisirisi-jewelry": "1758995115682-1452a1a9e35b",
  "orisirisi-wristwatch": "1704428303280-84768603d539",
  "orisirisi-categories-hero": "1741071520895-47d81779c11e",
  "orisirisi-new-in-hero": "1756792340190-2039b9a1787d",
  "orisirisi-story-hero": "1528414450725-0b2677fc991a",
  // Founder — intentionally a hands/craft shot rather than a stranger's
  // face: don't attach a real, identifiable stock model's likeness to a
  // named founder bio. Swap for Taiwo's actual photo before launch.
  "orisirisi-taiwo": "1757087824089-bdb33ecc3439",
  "orisirisi-author-taiwo": "1757087824089-bdb33ecc3439",
  // Blog covers
  "orisirisi-blog-sourcing": "1756792340190-2039b9a1787d",
  "orisirisi-blog-layering": "1758995115682-1452a1a9e35b",
  "orisirisi-blog-care": "1598532163257-ae3c6b2524b6",
  "orisirisi-blog-market": "1757087824089-bdb33ecc3439",
  "orisirisi-blog-fewer-better": "1632574231053-2dda4c5774eb",
};

// Cheap placeholder image source — swap for real product photography or your CDN.
export function placeholderImage(seed: string, w = 600, h = 750) {
  const curated = CURATED_IMAGES[seed];
  if (curated) {
    return `https://images.unsplash.com/photo-${curated}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
  }
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

// Same resolution logic as placeholderImage, but takes the product itself —
// used wherever a Product object (rather than a bare seed string) is on
// hand, e.g. building the order confirmation email after a webhook fires.
export function productImage(product: Pick<Product, "image">, w = 600, h = 750) {
  return placeholderImage(product.image, w, h);
}

