import type { Metadata } from "next";
import Link from "next/link";
import { Package, ShoppingCart, Clock, Wallet, ArrowRight } from "lucide-react";
import { getDashboardStats, getRecentOrders } from "@/lib/admin/queries";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const [stats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrders(6)]);

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-2 font-display text-[30px] font-medium sm:text-[36px]">Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatNaira(stats.revenue)} icon={Wallet} accent />
        <StatCard label="Total Orders" value={String(stats.orderCount)} icon={ShoppingCart} />
        <StatCard label="Pending Orders" value={String(stats.pendingCount)} icon={Clock} />
        <StatCard label="Products" value={String(stats.productCount)} icon={Package} />
      </div>

      <div className="mt-10 rounded-2xl border border-ink/[0.08] bg-paper">
        <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-5">
          <h2 className="font-display text-[19px] font-medium">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-orisirisi transition-opacity hover:opacity-70"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-6 py-12 text-center text-[14px] text-ink/50">No orders yet.</p>
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-ink/[0.06] last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-semibold hover:text-orisirisi">
                        {order.reference}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{order.customer_name}</td>
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
