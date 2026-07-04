export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Household" | "Jewelry" | "Clothing" | "Accessories";
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  image: string;
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
};

export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
  bio: string;
};

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string };

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
  content: BlogBlock[];
  tags?: string[];
};
