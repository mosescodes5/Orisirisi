"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/layout/Reveal";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "submitted" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (new FormData(form).get("email") as string) || "";

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      setStatus("submitted");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden bg-orisirisi px-5 py-[90px] text-paper sm:px-8">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[160px] font-semibold tracking-wide text-paper/[0.06] sm:text-[220px]"
      >
        ORÍSIRÍSI
      </span>

      <Reveal className="relative z-[1] mx-auto max-w-[600px] text-center">
        <h2 className="font-display text-[30px] font-medium sm:text-[42px] lg:text-[48px]">
          Never miss an arrival.
        </h2>
        <p className="mt-3.5 text-[15px] opacity-90">
          New pieces land most weeks. Get first pick before they&apos;re gone.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-[420px] flex-wrap justify-center gap-2.5">
          <input
            name="email"
            type="email"
            required
            placeholder="Your email address"
            className="min-w-[220px] flex-1 rounded-full border-[1.5px] border-paper/50 bg-paper/[0.14] px-5.5 py-3.5 text-[13.5px] text-paper placeholder:text-paper/75 focus:border-paper focus:bg-paper/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "submitted"}
            className="rounded-full bg-secondary px-7.5 py-3.5 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {status === "submitted" ? "Subscribed ✓" : status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p className="mt-3 text-[13px] text-paper/85">Something went wrong — please try again.</p>
        )}
      </Reveal>
    </section>
  );
}
