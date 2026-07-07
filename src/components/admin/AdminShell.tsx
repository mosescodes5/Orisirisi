"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import type { AdminProfile } from "@/lib/admin/types";

const COLLAPSE_KEY = "orisirisi-admin-sidebar-collapsed";

export function AdminShell({ profile, children }: { profile: AdminProfile; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read the saved preference after mount only, so server and first-paint
  // client markup match (avoids a hydration mismatch flash). This has to
  // run in an effect — localStorage isn't available during SSR/hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a browser-only API after mount, not a render-derived value
    if (window.localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
  }, []);

  function toggleCollapse() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6F4] text-ink">
      {mobileOpen && (
        <div
          role="button"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <AdminSidebar
        profile={profile}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={toggleCollapse}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <div className="flex items-center gap-3 border-b border-ink/[0.08] bg-paper px-4 py-3.5 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/[0.05]"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-[15px] font-semibold">
            Orísirísi<span className="text-orisirisi">.</span>
          </span>
        </div>

        <div className="mx-auto w-full max-w-[1200px] px-5 py-6 sm:px-10 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
