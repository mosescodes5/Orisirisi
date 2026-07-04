"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { CompletedOrder } from "@/lib/types";
import { formatNaira } from "@/lib/format";

const ORDER_STORAGE_KEY = "orisirisi:last-order";

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<CompletedOrder | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
      setOrder(raw ? JSON.parse(raw) : null);
    } catch {
      setOrder(null);
    }
  }, []);

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
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
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
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-mist">Reference: {order.reference}</p>

        <div className="mt-10 rounded-card border border-ink/[0.08] p-6 text-left sm:p-7">
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
          className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          Continue shopping <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
