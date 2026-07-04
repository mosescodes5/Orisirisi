"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { CompletedOrder, ShippingDetails } from "@/lib/types";

const NIGERIAN_STATES = [
  "Abia", "Abuja (FCT)", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const ORDER_STORAGE_KEY = "orisirisi:last-order";

const emptyForm: ShippingDetails = { fullName: "", email: "", phone: "", address: "", city: "", state: "" };

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const [form, setForm] = useState<ShippingDetails>(emptyForm);
  const [scriptReady, setScriptReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  function update<K extends keyof ShippingDetails>(key: K, value: ShippingDetails[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!publicKey) {
      setError("Payment isn't configured yet — add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to your .env.local file.");
      return;
    }
    if (!scriptReady || !window.PaystackPop) {
      setError("Payment is still loading — try again in a moment.");
      return;
    }

    setSubmitting(true);
    const reference = `ORS-${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: form.email,
      amount: Math.round(total * 100), // kobo
      currency: "NGN",
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: "Full Name", variable_name: "full_name", value: form.fullName },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
        ],
      },
      callback: () => {
        const order: CompletedOrder = {
          reference,
          items,
          subtotal,
          deliveryFee,
          total,
          shipping: form,
          placedAt: new Date().toISOString(),
        };
        window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));

        // Fire-and-forget — never block the redirect on email delivery.
        fetch("/api/send-order-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }).catch((err) => console.error("Order confirmation email failed:", err));

        clearCart();
        router.push(`/checkout/success?ref=${reference}`);
      },
      onClose: () => {
        setSubmitting(false);
      },
    });

    handler.openIframe();
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-lg font-medium">Shipping Details</h2>
          <p className="mt-1 text-[13px] text-ink/60">Where should we deliver your assortment?</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="input-field"
              placeholder="Taiwo Adebayo"
            />
          </Field>
          <Field label="Email" required>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Phone number" required>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="input-field"
              placeholder="080X XXX XXXX"
            />
          </Field>
          <Field label="State" required>
            <select
              required
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className="input-field"
            >
              <option value="" disabled>Select state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="City" required>
            <input
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="input-field"
              placeholder="Ikeja"
            />
          </Field>
          <Field label="Delivery address" required className="sm:col-span-2">
            <input
              required
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="input-field"
              placeholder="Street address, apartment, etc."
            />
          </Field>
        </div>

        {error && (
          <p className="rounded-lg bg-orisirisi/[0.08] px-4 py-3 text-[13px] font-medium text-orisirisi">{error}</p>
        )}

        <button
          type="submit"
          disabled={items.length === 0 || submitting}
          className="mt-2 flex items-center justify-center gap-2.5 rounded-full bg-ink py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing…
            </>
          ) : (
            "Pay with Paystack"
          )}
        </button>
        <p className="text-center text-xs text-mist">Payments are handled securely by Paystack.</p>
      </form>
    </>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">
        {label}
        {required && <span className="text-orisirisi"> *</span>}
      </span>
      {children}
    </label>
  );
}
