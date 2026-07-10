export type AdminRole = "customer" | "staff" | "admin";

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string };

export type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  author_bio: string;
  content: BlogContentBlock[];
  tags: string[];
  reading_time: number;
  featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: "Household" | "Jewelry" | "Wristwatch" | "Fresh Juice";
  subcategory: string;
  price: number;
  compare_at_price: number | null;
  image: string;
  description: string;
  is_new: boolean;
  is_published: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type AdminOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  image: string | null;
  price: number;
  qty: number;
  size: string | null;
};

export type AdminOrder = {
  id: string;
  reference: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  placed_at: string;
};

export type AdminOrderWithItems = AdminOrder & { items: AdminOrderItem[] };

export type SiteSettingRow = {
  key: string;
  value: string;
  updated_at: string;
};

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];
