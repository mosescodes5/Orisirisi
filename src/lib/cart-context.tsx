"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "orisirisi:cart";
const DELIVERY_FEE = 2500;
const FREE_DELIVERY_THRESHOLD = 50000;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (product: Product, qty?: number, size?: string | null) => void;
  updateQty: (productId: string, size: string | null | undefined, qty: number) => void;
  removeItem: (productId: string, size?: string | null) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, size?: string | null) {
  return `${productId}::${size ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupted or inaccessible storage — start with an empty cart.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change, after initial hydration.
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, qty = 1, size: string | null = null) => {
    setItems((prev) => {
      const key = lineKey(product.id, size);
      const existing = prev.find((i) => lineKey(i.productId, i.size) === key);
      if (existing) {
        return prev.map((i) => (lineKey(i.productId, i.size) === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        { productId: product.id, slug: product.slug, name: product.name, image: product.image, price: product.price, qty, size },
      ];
    });
  }, []);

  const updateQty = useCallback((productId: string, size: string | null | undefined, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (lineKey(i.productId, i.size) === lineKey(productId, size) ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string, size?: string | null) => {
    setItems((prev) => prev.filter((i) => lineKey(i.productId, i.size) !== lineKey(productId, size)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    [items]
  );

  const deliveryFee = items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    deliveryFee,
    total,
    addItem,
    updateQty,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { FREE_DELIVERY_THRESHOLD };
