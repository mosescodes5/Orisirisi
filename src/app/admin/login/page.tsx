import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = { title: "Admin Sign In" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-[420px] rounded-[22px] bg-paper p-8 sm:p-10">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-semibold">
            Orísirísi<span className="text-orisirisi">.</span>
          </span>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/40">with Taiwo</p>
          <p className="mt-2 text-[13px] text-ink/60">Sign in to manage products and orders.</p>
        </div>
        <AdminLoginForm next={params.next ?? "/admin"} notAuthorized={params.error === "not-authorized"} />
      </div>
    </div>
  );
}
