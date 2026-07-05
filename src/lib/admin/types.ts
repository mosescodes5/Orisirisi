export type AdminRole = "customer" | "staff" | "admin";

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
  category: "Household" | "Jewelry" | "Clothing" | "Accessories";
  subcategory: string;
  price: number;
  compare_at_price: number | null;
  image: string;
  images: string[];
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

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];
