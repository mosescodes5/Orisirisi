"use client";

import { useState, type FormEvent } from "react";
import { UserPlus, LogIn, Mail } from "lucide-react";

export function AccountGate() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-[420px]">
      <div className="flex rounded-full bg-ink/[0.05] p-1">
        <button
          onClick={() => {
            setTab("signin");
            setSubmitted(false);
          }}
          className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold uppercase tracking-wide transition-colors ${
            tab === "signin" ? "bg-secondary text-paper" : "text-ink/60"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setTab("signup");
            setSubmitted(false);
          }}
          className={`flex-1 rounded-full py-2.5 text-[12.5px] font-bold uppercase tracking-wide transition-colors ${
            tab === "signup" ? "bg-secondary text-paper" : "text-ink/60"
          }`}
        >
          Create Account
        </button>
      </div>

      {submitted ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-dashed border-ink/[0.14] px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orisirisi/[0.1] text-orisirisi">
            <Mail size={18} />
          </span>
          <p className="text-[14.5px] font-semibold">Accounts aren&apos;t live just yet.</p>
          <p className="max-w-xs text-[13px] leading-relaxed text-ink/60">
            We&apos;re still building out sign-in. In the meantime you can check out as a guest — your order
            confirmation always goes to your email either way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {tab === "signup" && (
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Full name</span>
              <input
                type="text"
                required
                placeholder="Your full name"
                className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
              />
            </label>
          )}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Email</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Password</span>
            <input
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="h-12 rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 text-[14px] transition-colors focus:border-orisirisi focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
          >
            {tab === "signin" ? <LogIn size={14} /> : <UserPlus size={14} />}
            {tab === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
