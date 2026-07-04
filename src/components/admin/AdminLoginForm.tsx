"use client";

import { useActionState } from "react";
import { LogIn, AlertCircle } from "lucide-react";
import { signInAdmin, type ActionResult } from "@/lib/admin/actions";

export function AdminLoginForm({ next, notAuthorized }: { next: string; notAuthorized: boolean }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(signInAdmin, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      {(state && !state.ok) || notAuthorized ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-600/[0.08] px-4 py-3 text-[13px] text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            {state && !state.ok ? state.error : "That account doesn't have admin access."}
          </span>
        </div>
      ) : null}

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Email</span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@orisirisiwithtaiwo.com"
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
