"use client";

import { useState, useActionState } from "react";
import { UserPlus, LogIn, Mail, AlertCircle } from "lucide-react";
import { signInCustomer, signUpCustomer } from "@/lib/customer/actions";

export function AccountGate() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [signUpState, signUpAction, signUpPending] = useActionState(signUpCustomer, null);
  const [signInState, signInAction, signInPending] = useActionState(signInCustomer, null);

  const state = tab === "signup" ? signUpState : signInState;
  const pending = tab === "signup" ? signUpPending : signInPending;

  if (state?.ok && "needsConfirmation" in state && state.needsConfirmation) {
    return (
      <div className="mx-auto max-w-[420px]">
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-ink/[0.14] px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orisirisi/[0.1] text-orisirisi">
            <Mail size={18} />
          </span>
          <p className="text-[14.5px] font-semibold">Check your email</p>
          <p className="max-w-xs text-[13px] leading-relaxed text-ink/60">
            We&apos;ve sent a confirmation link to your email address. Click it to activate your account,
            then come back here to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[420px]">
      <div className="flex rounded-full bg-ink/[0.05] p-1">
        <button
          type="button"
          onClick={() => setTab("signin")}
          className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold uppercase tracking-wide transition-colors ${
            tab === "signin" ? "bg-secondary text-paper" : "text-ink/60"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold uppercase tracking-wide transition-colors ${
            tab === "signup" ? "bg-secondary text-paper" : "text-ink/60"
          }`}
        >
          Create Account
        </button>
      </div>

      {state && !state.ok && (
        <div className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {tab === "signup" ? (
        <form key="signup" action={signUpAction} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Full name</span>
            <input
              name="fullName"
              type="text"
              required
              placeholder="Your full name"
              className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={signUpPending}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={14} />
            {signUpPending ? "Creating account…" : "Create account"}
          </button>
        </form>
      ) : (
        <form key="signin" action={signInAction} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Password</span>
            <input
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={signInPending}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={14} />
            {signInPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
