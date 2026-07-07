"use client";

import { useState, type FormEvent } from "react";
import { Send, Check } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: (data.get("name") as string) || "",
      email: (data.get("email") as string) || "",
      message: (data.get("message") as string) || "",
    };

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.error || "Failed to send");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-ink/[0.08] px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orisirisi/[0.1] text-orisirisi">
          <Check size={22} />
        </span>
        <p className="font-display text-lg font-medium">Message sent.</p>
        <p className="max-w-xs text-[13.5px] text-ink/60">
          Thanks for reaching out — we usually reply within a business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Name</span>
          <input
            name="name"
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
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-ink/60">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Order reference, question, or anything else — we read all of it."
          className="resize-none rounded-[10px] border-[1.5px] border-ink/[0.14] bg-transparent px-4 py-3 text-[14px] leading-relaxed transition-colors focus:border-orisirisi focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending…" : "Send message"} <Send size={14} />
      </button>

      {status === "error" && (
        <p className="text-[13px] text-orisirisi">Something went wrong sending that — please try again, or email us directly.</p>
      )}
    </form>
  );
}
