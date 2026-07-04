import type { Metadata } from "next";
import Link from "next/link";
import { listOrders } from "@/lib/admin/queries";
import { formatNaira } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ORDER_STATUSES } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await listOrders({ status });

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Fulfillment</p>
        <h1 className="mt-2 font-display text-[30px] font-medium sm:text-[36px]">Orders</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill label="All" href="/admin/orders" active={!status} />
        {ORDER_STATUSES.map((s) => (
          <FilterPill key={s} label={s} href={`/admin/orders?status=${s}`} active={status === s} />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-paper">
        {orders.length === 0 ? (
          <p className="px-6 py-14 text-center text-[14px] text-ink/50">No orders match this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-ink/[0.08] text-[11px] font-bold uppercase tracking-wide text-ink/45">
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-ink/[0.06] last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-semibold hover:text-orisirisi">
                        {order.reference}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-[12px] text-ink/45">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold">{formatNaira(order.total)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-ink/50">
                      {new Date(order.placed_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition-colors ${
        active ? "bg-ink text-paper" : "bg-ink/[0.05] text-ink/60 hover:bg-ink/[0.1]"
      }`}
    >
      {label}
    </Link>
  );
}
