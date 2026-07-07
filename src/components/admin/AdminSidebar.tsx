"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Palette,
  LogOut,
  ExternalLink,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin/actions";
import type { AdminProfile } from "@/lib/admin/types";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Brand Theme", href: "/admin/settings/theme", icon: Palette },
];

export function AdminSidebar({
  profile,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: {
  profile: AdminProfile;
  /** Icon-only rail instead of the full sidebar. Desktop (lg+) only — the
   *  mobile drawer always shows full labels regardless of this. */
  collapsed: boolean;
  /** Whether the off-canvas drawer is open. Ignored at lg+ (sidebar is
   *  always visible there; only its width changes, via `collapsed`). */
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const label = collapsed ? "lg:hidden" : ""; // hide text only when collapsed AND at lg+

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-[248px] shrink-0 flex-col overflow-y-auto border-r border-white/[0.08] bg-secondary text-paper transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${collapsed ? "lg:w-[84px]" : "lg:w-[248px]"}`}
    >
      <div className={`flex items-center justify-between border-b border-white/[0.08] py-6 ${collapsed ? "lg:justify-center lg:px-2" : "px-6"}`}>
        <span className={`flex flex-col leading-none ${collapsed ? "lg:hidden" : ""}`}>
          <span className="font-display text-xl font-semibold">
            Orísirísi<span className="text-orisirisi">.</span>
          </span>
          <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/40">with Taiwo</span>
        </span>
        <span className={`hidden font-display text-xl font-semibold ${collapsed ? "lg:block" : ""}`}>
          O<span className="text-orisirisi">.</span>
        </span>
        <div className={`flex items-center gap-2 ${collapsed ? "lg:hidden" : ""}`}>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/70">
            Admin
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
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
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-medium transition-colors ${
                  collapsed ? "lg:justify-center lg:px-0" : ""
                } ${active ? "bg-orisirisi text-paper" : "text-white/65 hover:bg-white/[0.06] hover:text-paper"}`}
              >
                <Icon size={17} strokeWidth={1.8} className="shrink-0" />
                <span className={label}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          target="_blank"
          title={collapsed ? "View storefront" : undefined}
          className={`mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-paper ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <ExternalLink size={16} strokeWidth={1.8} className="shrink-0" />
          <span className={label}>View storefront</span>
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className={`mt-2 hidden w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-paper lg:flex ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          {collapsed ? <ChevronsRight size={16} strokeWidth={1.8} /> : <ChevronsLeft size={16} strokeWidth={1.8} />}
          <span className={label}>Collapse</span>
        </button>
      </nav>

      <div className={`border-t border-white/[0.08] px-4 py-4 ${collapsed ? "lg:px-2" : ""}`}>
        <div className={`mb-3 flex items-center gap-3 px-2 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orisirisi/20 text-[13px] font-bold uppercase text-orisirisi">
            {profile.full_name?.[0] ?? profile.email[0]}
          </div>
          <div className={`min-w-0 ${label}`}>
            <p className="truncate text-[13px] font-semibold">{profile.full_name ?? profile.email}</p>
            <p className="truncate text-[11px] uppercase tracking-wide text-white/40">{profile.role}</p>
          </div>
        </div>
        <form action={signOutAdmin}>
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-paper ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <LogOut size={16} strokeWidth={1.8} className="shrink-0" />
            <span className={label}>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
