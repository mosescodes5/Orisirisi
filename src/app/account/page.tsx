import type { Metadata } from "next";
import { AccountGate } from "@/components/account/AccountGate";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create an Orísirísi with Taiwo account.",
};

export default function AccountPage() {
  return (
    <div className="px-5 py-16 sm:px-8 sm:py-20">
      <Reveal className="mx-auto max-w-[420px] text-center">
        <p className="eyebrow">My Account</p>
        <h1 className="mt-2.5 font-display text-[30px] font-medium sm:text-[36px]">Welcome back.</h1>
        <p className="mt-2.5 text-[14px] text-ink/60">Sign in to your account, or create a new one.</p>
      </Reveal>

      <div className="mt-10">
        <AccountGate />
      </div>
    </div>
  );
}
