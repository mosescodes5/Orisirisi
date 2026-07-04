import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, Phone, MapPin } from "lucide-react";
import { getOrder } from "@/lib/admin/queries";
import { formatNaira } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = { title: "Order Detail — Admin" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-ink/50 hover:text-orisirisi"
      >
        <ChevronLeft size={14} /> Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Order</p>
          <h1 className="mt-2 font-display text-[28px] font-medium sm:text-[34px]">{order.reference}</h1>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink/45">Status</span>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <div className="rounded-2xl border border-ink/[0.08] bg-paper">
          <div className="border-b border-ink/[0.08] px-6 py-5">
            <h2 className="font-display text-[19px] font-medium">Items</h2>
          </div>
          <div className="divide-y divide-ink/[0.06]">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-[12.5px] text-ink/50">
                    Qty {item.qty}
                    {item.size ? ` · Size ${item.size}` : ""}
                  </p>
                </div>
                <p className="font-semibold">{formatNaira(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-ink/[0.08] px-6 py-5 text-[13.5px]">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span>{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Delivery</span>
              <span>{formatNaira(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between border-t border-ink/[0.08] pt-2.5 text-[16px] font-bold">
              <span>Total</span>
              <span>{formatNaira(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="h-fit rounded-2xl border border-ink/[0.08] bg-paper">
          <div className="border-b border-ink/[0.08] px-6 py-5">
            <h2 className="font-display text-[19px] font-medium">Customer</h2>
          </div>
          <div className="flex flex-col gap-4 px-6 py-5 text-[13.5px]">
            <p className="font-semibold">{order.customer_name}</p>
            <div className="flex items-center gap-2.5 text-ink/65">
              <Mail size={15} /> {order.customer_email}
            </div>
            {order.customer_phone && (
              <div className="flex items-center gap-2.5 text-ink/65">
                <Phone size={15} /> {order.customer_phone}
              </div>
            )}
            {order.shipping_address && (
              <div className="flex items-start gap-2.5 text-ink/65">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>
                  {order.shipping_address}
                  {order.shipping_city ? `, ${order.shipping_city}` : ""}
                  {order.shipping_state ? `, ${order.shipping_state}` : ""}
                </span>
              </div>
            )}
            <p className="mt-1 text-[12px] text-ink/40">
              Placed{" "}
              {new Date(order.placed_at).toLocaleString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
