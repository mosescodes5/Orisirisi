import type { Metadata } from "next";
import Image from "next/image";
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
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/brand/orisirisi-logo-stacked.png"
            alt="Orísirísi with Taiwo"
            width={120}
            height={120}
            className="rounded-2xl"
            priority
          />
          <p className="mt-4 text-[13px] text-ink/60">Sign in to manage products and orders.</p>
        </div>
        <AdminLoginForm next={params.next ?? "/admin"} notAuthorized={params.error === "not-authorized"} />
      </div>
    </div>
  );
}
