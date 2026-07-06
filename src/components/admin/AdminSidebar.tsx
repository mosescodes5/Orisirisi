"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut, ExternalLink } from "lucide-react";
import { signOutAdmin } from "@/lib/admin/actions";
import type { AdminProfile } from "@/lib/admin/types";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export function AdminSidebar({ profile }: { profile: AdminProfile }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-white/[0.08] bg-ink text-paper">
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-6 py-6">
        <span className="font-display text-xl font-semibold">
          Orísirísi<span className="text-orisirisi">.</span>
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/70">
          Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-6">
        <div className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-medium transition-colors ${
                  active ? "bg-orisirisi text-paper" : "text-white/65 hover:bg-white/[0.06] hover:text-paper"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          target="_blank"
          className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-paper"
        >
          <ExternalLink size={16} strokeWidth={1.8} />
          View storefront
        </Link>
      </nav>

      <div className="border-t border-white/[0.08] px-4 py-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orisirisi/20 text-[13px] font-bold uppercase text-orisirisi">
            {profile.full_name?.[0] ?? profile.email[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">{profile.full_name ?? profile.email}</p>
            <p className="truncate text-[11px] uppercase tracking-wide text-white/40">{profile.role}</p>
          </div>
        </div>
        <form action={signOutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-paper"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
