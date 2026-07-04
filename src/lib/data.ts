import type { CategoryDef, Product } from "./types";

/*
  Mock data layer. Every function here is the seam to swap in a real
  database later (Supabase, Sanity, etc.) — components only ever import
  from this file, never construct product objects themselves.
*/

export const categories: CategoryDef[] = [
  { slug: "household", name: "Household Items", itemCount: 42, image: "orisirisi-cat-household" },
  { slug: "jewelry", name: "Jewelries", itemCount: 67, image: "orisirisi-cat-jewelry" },
  { slug: "clothing", name: "Clothing & Accessories", itemCount: 89, image: "orisirisi-cat-clothing" },
  { slug: "other", name: "A Little Bit of Everything", itemCount: 31, image: "orisirisi-cat-other" },
];

export const products: Product[] = [
  { id: "1", slug: "woven-storage-basket-set", name: "Woven Storage Basket Set (3pc)", category: "Household", subcategory: "Storage", price: 24500, image: "orisirisi-p1", description: "Hand-woven baskets in three nesting sizes — sisal and seagrass blend, sturdy enough for daily use.", isNew: true },
  { id: "2", slug: "layered-gold-plated-necklace", name: "Layered Gold-Plated Necklace", category: "Jewelry", subcategory: "Necklaces", price: 18000, compareAtPrice: 23000, image: "orisirisi-p2", description: "Three-tier chain in warm gold plate — wear alone or stack with your own pieces." },
  { id: "3", slug: "linen-wrap-top-sand", name: "Linen Wrap Top — Sand", category: "Clothing", subcategory: "Tops", price: 15200, image: "orisirisi-p3", description: "Breathable linen wrap top, true to size, hand-wash recommended.", isNew: true },
  { id: "4", slug: "ceramic-table-lamp-ivory", name: "Ceramic Table Lamp — Ivory", category: "Household", subcategory: "Lighting", price: 32000, image: "orisirisi-p4", description: "Hand-glazed ceramic base with a natural linen shade, warm-white bulb included." },
  { id: "5", slug: "beaded-drop-earrings", name: "Beaded Drop Earrings", category: "Jewelry", subcategory: "Earrings", price: 9800, image: "orisirisi-p5", description: "Hand-strung glass beads on gold-tone hooks — lightweight for all-day wear.", isNew: true },
  { id: "6", slug: "structured-tote-bag-tan", name: "Structured Tote Bag — Tan", category: "Accessories", subcategory: "Bags", price: 27500, image: "orisirisi-p6", description: "Vegan leather tote with a structured base, fits a 13-inch laptop." },
  { id: "7", slug: "scented-soy-candle-set", name: "Scented Soy Candle Set", category: "Household", subcategory: "Décor", price: 13000, image: "orisirisi-p7", description: "Set of two hand-poured soy candles — sandalwood and citrus grove." },
  { id: "8", slug: "silk-hair-scarf-rust", name: "Silk Hair Scarf — Rust", category: "Accessories", subcategory: "Hair", price: 7200, image: "orisirisi-p8", description: "100% mulberry silk scarf, hand-rolled edges, one size.", isNew: true },
  { id: "9", slug: "statement-hoop-earrings", name: "Statement Hoop Earrings", category: "Jewelry", subcategory: "Earrings", price: 11500, image: "orisirisi-j3", description: "Bold twisted hoops in a brushed-gold finish, lightweight for all-day wear.", isNew: true },
  { id: "10", slug: "pearl-cluster-ring", name: "Pearl Cluster Ring", category: "Jewelry", subcategory: "Rings", price: 8000, image: "orisirisi-j4", description: "Freshwater pearl cluster set on an adjustable band." },
  { id: "11", slug: "beaded-waist-bangle-set", name: "Beaded Waist Bangle Set", category: "Jewelry", subcategory: "Bangles & Bracelets", price: 14200, compareAtPrice: 17000, image: "orisirisi-j5", description: "Set of 5 stackable bangles in mixed beadwork." },
  { id: "12", slug: "fine-chain-anklet", name: "Fine Chain Anklet", category: "Jewelry", subcategory: "Bangles & Bracelets", price: 6500, image: "orisirisi-j6", description: "Delicate gold-plated anklet with a small charm detail.", isNew: true },
];

export function getProductsByCategory(categoryName: Product["category"]) {
  return products.filter((p) => p.category === categoryName);
}

export function getFeaturedProducts(limit = 8) {
  return products.slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// Cheap placeholder image source — swap for real product photography or your CDN.
export function placeholderImage(seed: string, w = 600, h = 750) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}
