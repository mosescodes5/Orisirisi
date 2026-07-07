"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Truck, Home, Copy, Check, Mail } from "lucide-react";
import type { CompletedOrder } from "@/lib/types";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { fetchAllPublishedProducts } from "@/lib/products-client";
import { ProductCard } from "@/components/product/ProductCard";

const ORDER_STORAGE_KEY = "orisirisi:last-order";

const TRACKING_STEPS = [
  { key: "placed", label: "Order Placed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
] as const;

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<CompletedOrder | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchAllPublishedProducts()
      .then(setAllProducts)
      .catch(() => setAllProducts([]));
  }, []);

  // sessionStorage isn't available on the server, so this has to be read in
  // an effect rather than during render (which would cause a hydration mismatch).
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: see above
      setOrder(raw ? JSON.parse(raw) : null);
    } catch {
      setOrder(null);
    }
  }, []);

  const recommendations = useMemo(() => {
    if (!order) return [];
    const purchasedIds = new Set(order.items.map((i) => i.productId));
    return allProducts.filter((p) => !purchasedIds.has(p.id)).slice(0, 4);
  }, [order, allProducts]);

  const deliveryWindow = useMemo(() => {
    if (!order) return null;
    const placed = new Date(order.placedAt);
    const from = new Date(placed);
    from.setDate(from.getDate() + 2);
    const to = new Date(placed);
    to.setDate(to.getDate() + 5);
    const fmt = (d: Date) => d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    return `${fmt(from)} – ${fmt(to)}`;
  }, [order]);

  function copyReference() {
    if (!order) return;
    navigator.clipboard.writeText(order.reference).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  if (order === undefined) return null; // avoid flash before hydration reads storage

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-[26px] font-medium sm:text-[32px]">No recent order found.</h1>
        <p className="mt-2.5 max-w-sm text-[14.5px] text-ink/60">
          If you just completed a payment, check your email for confirmation.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[640px] text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orisirisi/10">
          <CheckCircle2 size={36} className="text-orisirisi" />
        </div>
        <h1 className="mt-7 font-display text-[28px] font-medium sm:text-[36px]">Order confirmed!</h1>
        <p className="mt-2.5 text-[14.5px] text-ink/60">
          Thank you, {order.shipping.fullName.split(" ")[0] || "friend"}. Taiwo is already getting your order ready.
        </p>

        <button
          onClick={copyReference}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist transition-colors hover:text-orisirisi"
        >
          {copied ? (
            <>
              <Check size={12} /> Copied
            </>
          ) : (
            <>
              Reference: {order.reference} <Copy size={12} />
            </>
          )}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-ink/50">
          <Mail size={13} /> A confirmation was sent to {order.shipping.email}
        </p>

        {/* Order tracking timeline */}
        <div className="mt-10 rounded-card border border-ink/[0.08] p-6 sm:p-7">
          <div className="flex items-start justify-between">
            {TRACKING_STEPS.map((step, i) => (
              <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <div className={`h-[2px] flex-1 ${i === 0 ? "invisible" : "bg-orisirisi/20"}`} />
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      i === 0 ? "bg-orisirisi text-paper" : "bg-ink/[0.06] text-ink/30"
                    }`}
                  >
                    <step.icon size={16} strokeWidth={1.8} />
                  </div>
                  <div className={`h-[2px] flex-1 ${i === TRACKING_STEPS.length - 1 ? "invisible" : "bg-ink/[0.08]"}`} />
                </div>
                <span className={`mt-2.5 text-[10.5px] font-bold uppercase tracking-wide ${i === 0 ? "text-orisirisi" : "text-ink/40"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          {deliveryWindow && (
            <p className="mt-6 text-[13px] text-ink/60">
              Estimated delivery: <span className="font-semibold text-ink">{deliveryWindow}</span>
            </p>
          )}
        </div>

        <div className="mt-6 rounded-card border border-ink/[0.08] p-6 text-left sm:p-7">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Order Summary</h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.size ?? ""}`} className="flex justify-between text-[13.5px]">
                <span className="text-ink/70">
                  {item.name} {item.size && `(${item.size})`} × {item.qty}
                </span>
                <span className="font-semibold">{formatNaira(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-ink/[0.08] pt-5 text-base font-bold">
            <span>Total Paid</span>
            <span>{formatNaira(order.total)}</span>
          </div>

          <div className="mt-6 border-t border-ink/[0.08] pt-5 text-[13.5px] text-ink/70">
            <p className="font-semibold text-ink">Delivering to</p>
            <p className="mt-1">
              {order.shipping.address}, {order.shipping.city}, {order.shipping.state}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          Continue shopping <ArrowRight size={14} />
        </Link>
      </div>

      {recommendations.length > 0 && (
        <div className="mx-auto mt-20 max-w-[1100px]">
          <h2 className="text-center font-display text-2xl font-medium sm:text-[28px]">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
