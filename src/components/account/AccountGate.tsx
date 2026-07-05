"use client";

import { useActionState, useState } from "react";
import { UserPlus, LogIn, Mail, AlertCircle } from "lucide-react";
import { signInCustomer, signUpCustomer, type CustomerAuthResult } from "@/lib/customer/actions";

export function AccountGate() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="mx-auto max-w-[420px]">
      <div className="flex rounded-full bg-ink/[0.05] p-1">
        <button
          onClick={() => setTab("signin")}
          className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold uppercase tracking-wide transition-colors ${
            tab === "signin" ? "bg-ink text-paper" : "text-ink/60"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab("signup")}
          className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold uppercase tracking-wide transition-colors ${
            tab === "signup" ? "bg-ink text-paper" : "text-ink/60"
          }`}
        >
          Create Account
        </button>
      </div>

      {tab === "signin" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}

function SignInForm() {
  const [state, formAction, pending] = useActionState<CustomerAuthResult | null, FormData>(signInCustomer, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      {state && !state.ok && <ErrorBanner message={state.error} />}

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Email</span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Password</span>
        <input
          type="password"
          name="password"
          required
          placeholder="Your password"
          className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:opacity-60"
      >
        <LogIn size={14} />
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function SignUpForm() {
  const [state, formAction, pending] = useActionState<CustomerAuthResult | null, FormData>(signUpCustomer, null);

  if (state?.ok && "needsConfirmation" in state) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-dashed border-ink/[0.14] px-6 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orisirisi/[0.1] text-orisirisi">
          <Mail size={18} />
        </span>
        <p className="text-[14.5px] font-semibold">Check your email to confirm your account.</p>
        <p className="max-w-xs text-[13px] leading-relaxed text-ink/60">
          We&apos;ve sent a confirmation link — once you click it, you can sign in here.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      {state && !state.ok && <ErrorBanner message={state.error} />}

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Full name</span>
        <input
          type="text"
          name="fullName"
          required
          placeholder="Your full name"
          className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Email</span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:opacity-60"
      >
        <UserPlus size={14} />
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-red-600/[0.08] px-4 py-3 text-[13px] text-red-700">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
