import type { OrderStatus } from "@/lib/admin/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-ink/[0.06] text-ink/70",
  paid: "bg-orisirisi/[0.12] text-orisirisi",
  processing: "bg-orisirisi/[0.12] text-orisirisi",
  shipped: "bg-black text-paper",
  delivered: "bg-green-600/[0.12] text-green-700",
  cancelled: "bg-red-600/[0.1] text-red-600",
  refunded: "bg-red-600/[0.1] text-red-600",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
