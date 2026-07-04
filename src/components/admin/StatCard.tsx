import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-ink/[0.08] bg-paper p-6">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
          accent ? "bg-orisirisi text-paper" : "bg-ink/[0.05] text-ink"
        }`}
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">{label}</p>
        <p className="mt-1 truncate font-display text-[26px] font-medium">{value}</p>
      </div>
    </div>
  );
}
