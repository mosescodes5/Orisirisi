import type { CategoryDef, Product } from "./types";

/*
  Static/reference data layer: categories and the placeholder image
  generator. Product data lives in Supabase — see src/lib/products.ts
  (server-only queries, for Server Components) and
  src/lib/products-client.ts (browser queries, for Client Components like
  search and wishlist). Blog content lives in Sanity — see src/lib/blog.ts
  (server-only). This file stays free of server-only imports so Client
  Components can keep importing `categories`/`placeholderImage` from it
  directly.
*/

export const categories: CategoryDef[] = [
  {
    slug: "household",
    name: "Household Items",
    itemCount: 42,
    image: "orisirisi-cat-household",
    productCategory: "Household",
    blurb: "Pieces that make a house feel lived-in — décor, storage and everyday essentials.",
    heroImage: "orisirisi-cat-hero-household",
  },
  {
    slug: "jewelry",
    name: "Jewelries",
    itemCount: 67,
    image: "orisirisi-cat-jewelry",
    productCategory: "Jewelry",
    blurb: "Necklaces, earrings and bangles that don't wait for an occasion.",
    heroImage: "orisirisi-cat-hero-jewelry",
  },
  {
    slug: "clothing",
    name: "Clothing & Accessories",
    itemCount: 89,
    image: "orisirisi-cat-clothing",
    productCategory: "Clothing",
    blurb: "Everyday clothing and accessories, chosen the way Taiwo shops for herself.",
    heroImage: "orisirisi-cat-hero-clothing",
  },
  {
    slug: "other",
    name: "A Little Bit of Everything",
    itemCount: 31,
    image: "orisirisi-cat-other",
    productCategory: "Accessories",
    blurb: "A little bit of everything — the pieces that don't fit a neat category.",
    heroImage: "orisirisi-cat-hero-other",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// Cheap placeholder image source — used as a fallback until a product has
// real photos (see productImage/productGallery below).
export function placeholderImage(seed: string, w = 600, h = 750) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/** The single best image to show for a product — a real photo if one has been uploaded, otherwise a placeholder. */
export function productImage(product: Product, w = 600, h = 750) {
  return product.images[0] ?? placeholderImage(product.image || product.id, w, h);
}

/** The full gallery for a product's detail page — real photos if any exist, otherwise a single placeholder. */
export function productGallery(product: Product, w = 800, h = 1000) {
  return product.images.length > 0 ? product.images : [placeholderImage(product.image || product.id, w, h)];
}

/**
 * Sizes a blog cover/avatar image for display. `url` is expected to be a
 * Sanity CDN URL (produced server-side by urlForImage in lib/sanity/image.ts)
 * — Sanity's asset CDN accepts w/h/fit query params directly, so we can
 * request the right size per call site without a second round of image
 * processing. Falls back to the placeholder generator if there's no real
 * image yet (e.g. a post saved without a cover image).
 */
export function blogImage(url: string | undefined, w = 900, h = 700) {
  if (url && url.startsWith("http")) {
    return `${url}?w=${w}&h=${h}&fit=crop&auto=format`;
  }
  return placeholderImage(url || "orisirisi-journal", w, h);
}

/**
 * Cart/checkout line items store a resolved image URL directly (see
 * cart-context's addItem). This guards against carts persisted in
 * localStorage before that change, which may still hold a raw seed string
 * instead of a URL.
 */
export function resolveCartImage(image: string, w = 300, h = 375) {
  return image.startsWith("http") ? image : placeholderImage(image, w, h);
}
