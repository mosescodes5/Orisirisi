import type { Product } from "./types";

export type DbProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  compare_at_price: number | null;
  image: string;
  description: string;
  is_new: boolean;
};

export function mapDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as Product["category"],
    subcategory: row.subcategory,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    image: row.image,
    description: row.description,
    isNew: row.is_new,
  };
}
