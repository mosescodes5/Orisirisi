export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Household" | "Jewelry" | "Clothing" | "Accessories";
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  /** Legacy placeholder-image seed. Falls back to this only when `images` is empty. */
  image: string;
  /** Real photo URLs from Supabase Storage, in display order — images[0] is the primary shot. */
  images: string[];
  description: string;
  isNew?: boolean;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size?: string | null;
};

export type ShippingDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};

export type CompletedOrder = {
  reference: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shipping: ShippingDetails;
  placedAt: string;
};

export type CategoryDef = {
  slug: string;
  name: string;
  itemCount: number;
  image: string;
  /** The Product["category"] value that this listing filters by. */
  productCategory: "Household" | "Jewelry" | "Clothing" | "Accessories";
  blurb: string;
  heroImage: string;
};

export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
  bio: string;
};

// A Sanity Portable Text document — rendered with @portabletext/react.
// Typed loosely rather than pulling in the full `sanity`/`@portabletext/types`
// dependency tree just for this one field.
export type PortableTextContent = Record<string, unknown>[];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  author: BlogAuthor;
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
  content: PortableTextContent;
  tags?: string[];
};
