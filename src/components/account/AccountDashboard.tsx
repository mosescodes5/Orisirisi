import Link from "next/link";
import { Package, ArrowRight, LogOut, Mail } from "lucide-react";
import { signOutCustomer } from "@/lib/customer/actions";
import { getMyOrders } from "@/lib/customer/queries";
import { formatNaira } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { CustomerProfile } from "@/lib/customer/queries";

export async function AccountDashboard({ profile }: { profile: CustomerProfile }) {
  const orders = await getMyOrders();

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/[0.08] bg-paper px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orisirisi/[0.12] text-[15px] font-bold uppercase text-orisirisi">
            {(profile.full_name ?? profile.email)[0]}
          </div>
          <div>
            <p className="text-[14.5px] font-semibold">{profile.full_name ?? "Welcome back"}</p>
            <p className="flex items-center gap-1.5 text-[12.5px] text-ink/50">
              <Mail size={12} /> {profile.email}
            </p>
          </div>
        </div>
        <form action={signOutCustomer}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-ink/[0.14] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-ink/70 transition-colors hover:bg-secondary hover:text-paper"
          >
            <LogOut size={13} /> Sign out
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-ink/[0.08] bg-paper">
        <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-5">
          <h2 className="font-display text-[19px] font-medium">Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <Package size={26} strokeWidth={1.4} className="text-mist" />
            <p className="text-[14px] text-ink/60">No orders yet.</p>
            <Link
              href="/new-in"
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-ink/[0.06]">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.reference}`}
                className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-ink/[0.02]"
              >
                <div>
                  <p className="text-[13.5px] font-semibold">{order.reference}</p>
                  <p className="mt-0.5 text-[12px] text-ink/45">
                    {new Date(order.placed_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <span className="text-[13.5px] font-bold">{formatNaira(order.total)}</span>
                  <ArrowRight size={14} className="text-ink/30" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
