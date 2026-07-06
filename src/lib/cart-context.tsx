"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "orisirisi:cart";
const SAVED_STORAGE_KEY = "orisirisi:saved-for-later";
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
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  savedItems: CartItem[];
  saveForLater: (productId: string, size?: string | null) => void;
  moveToCart: (productId: string, size?: string | null) => void;
  removeSaved: (productId: string, size?: string | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, size?: string | null) {
  return `${productId}::${size ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  // Load persisted cart + saved-for-later list once on mount. This has to run
  // in an effect (not during render) because localStorage doesn't exist on
  // the server — reading it during render would desync server/client output
  // and trigger a hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: see above
      if (raw) setItems(JSON.parse(raw));
      const rawSaved = window.localStorage.getItem(SAVED_STORAGE_KEY);
      if (rawSaved) setSavedItems(JSON.parse(rawSaved));
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

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems, hydrated]);

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

  // Move a line item out of the bag and into the saved-for-later shelf.
  const saveForLater = useCallback((productId: string, size?: string | null) => {
    setItems((prev) => {
      const key = lineKey(productId, size);
      const target = prev.find((i) => lineKey(i.productId, i.size) === key);
      if (!target) return prev;
      setSavedItems((savedPrev) => {
        const savedKey = lineKey(target.productId, target.size);
        const existing = savedPrev.find((i) => lineKey(i.productId, i.size) === savedKey);
        if (existing) {
          return savedPrev.map((i) => (lineKey(i.productId, i.size) === savedKey ? { ...i, qty: i.qty + target.qty } : i));
        }
        return [...savedPrev, target];
      });
      return prev.filter((i) => lineKey(i.productId, i.size) !== key);
    });
  }, []);

  // Move a saved item back into the active bag.
  const moveToCart = useCallback((productId: string, size?: string | null) => {
    setSavedItems((prev) => {
      const key = lineKey(productId, size);
      const target = prev.find((i) => lineKey(i.productId, i.size) === key);
      if (!target) return prev;
      setItems((itemsPrev) => {
        const itemKey = lineKey(target.productId, target.size);
        const existing = itemsPrev.find((i) => lineKey(i.productId, i.size) === itemKey);
        if (existing) {
          return itemsPrev.map((i) => (lineKey(i.productId, i.size) === itemKey ? { ...i, qty: i.qty + target.qty } : i));
        }
        return [...itemsPrev, target];
      });
      return prev.filter((i) => lineKey(i.productId, i.size) !== key);
    });
  }, []);

  const removeSaved = useCallback((productId: string, size?: string | null) => {
    setSavedItems((prev) => prev.filter((i) => lineKey(i.productId, i.size) !== lineKey(productId, size)));
  }, []);

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
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    savedItems,
    saveForLater,
    moveToCart,
    removeSaved,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { FREE_DELIVERY_THRESHOLD };
