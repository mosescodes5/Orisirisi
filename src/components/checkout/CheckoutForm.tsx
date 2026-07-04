"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { User, MapPin, Package, Pencil, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { placeholderImage } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import type { CompletedOrder, ShippingDetails } from "@/lib/types";

const NIGERIAN_STATES = [
  "Abia", "Abuja (FCT)", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const ORDER_STORAGE_KEY = "orisirisi:last-order";
export const CHECKOUT_FORM_ID = "checkout-form";

const emptyForm: ShippingDetails = { fullName: "", email: "", phone: "", address: "", city: "", state: "" };

type FieldName = keyof ShippingDetails;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+234|0)[7-9][0-1]\d{8}$/;

function validateField(name: FieldName, value: string): string | null {
  switch (name) {
    case "fullName":
      return value.trim().length < 2 ? "Enter your full name." : null;
    case "email":
      return !EMAIL_RE.test(value.trim()) ? "Enter a valid email address." : null;
    case "phone":
      return !PHONE_RE.test(value.trim().replace(/\s/g, "")) ? "Enter a valid Nigerian phone number." : null;
    case "state":
      return value.trim().length === 0 ? "Select a state." : null;
    case "city":
      return value.trim().length < 2 ? "Enter your city." : null;
    case "address":
      return value.trim().length < 5 ? "Enter your delivery address." : null;
    default:
      return null;
  }
}

function validateAll(form: ShippingDetails): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  (Object.keys(form) as FieldName[]).forEach((key) => {
    const err = validateField(key, form[key]);
    if (err) errors[key] = err;
  });
  return errors;
}

export function CheckoutForm({ onSubmittingChange }: { onSubmittingChange?: (submitting: boolean) => void }) {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const [form, setForm] = useState<ShippingDetails>(emptyForm);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [scriptReady, setScriptReady] = useState(false);
  const [submitting, setSubmittingState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setSubmitting(value: boolean) {
    setSubmittingState(value);
    onSubmittingChange?.(value);
  }

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const errors = validateAll(form);
  const hasErrors = Object.keys(errors).length > 0;

  function update<K extends FieldName>(key: K, value: ShippingDetails[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function markTouched(key: FieldName) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Surface every validation error, even for fields the person never focused.
    setTouched({ fullName: true, email: true, phone: true, address: true, city: true, state: true });
    if (hasErrors) {
      setError("Please fix the highlighted fields before continuing.");
      const firstInvalid = document.querySelector<HTMLElement>("[data-invalid='true']");
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

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

      <form id={CHECKOUT_FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-6">
        <fieldset disabled={submitting} className="contents">
        <Section icon={User} title="Contact" subtitle="Who's this order for?">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" required error={touched.fullName ? errors.fullName : undefined}>
              <input
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                onBlur={() => markTouched("fullName")}
                data-invalid={touched.fullName && !!errors.fullName}
                className={inputClass(touched.fullName && !!errors.fullName)}
                placeholder="Taiwo Adebayo"
              />
            </Field>
            <Field label="Email" required error={touched.email ? errors.email : undefined}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => markTouched("email")}
                data-invalid={touched.email && !!errors.email}
                className={inputClass(touched.email && !!errors.email)}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone number" required error={touched.phone ? errors.phone : undefined} className="sm:col-span-2">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                onBlur={() => markTouched("phone")}
                data-invalid={touched.phone && !!errors.phone}
                className={inputClass(touched.phone && !!errors.phone)}
                placeholder="080X XXX XXXX"
              />
            </Field>
          </div>
        </Section>

        <Section icon={MapPin} title="Delivery" subtitle="Where should we bring your assortment?">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="State" required error={touched.state ? errors.state : undefined}>
              <select
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                onBlur={() => markTouched("state")}
                data-invalid={touched.state && !!errors.state}
                className={inputClass(touched.state && !!errors.state)}
              >
                <option value="" disabled>Select state</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="City" required error={touched.city ? errors.city : undefined}>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                onBlur={() => markTouched("city")}
                data-invalid={touched.city && !!errors.city}
                className={inputClass(touched.city && !!errors.city)}
                placeholder="Ikeja"
              />
            </Field>
            <Field label="Delivery address" required error={touched.address ? errors.address : undefined} className="sm:col-span-2">
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                onBlur={() => markTouched("address")}
                data-invalid={touched.address && !!errors.address}
                className={inputClass(touched.address && !!errors.address)}
                placeholder="Street address, apartment, etc."
              />
            </Field>
          </div>
        </Section>

        <Section icon={Package} title="Order Review" subtitle={`${items.length} item${items.length === 1 ? "" : "s"} in your bag`}>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size ?? ""}`} className="flex items-center gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink/[0.04]">
                  <Image src={placeholderImage(item.image, 200, 250)} alt={item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold">{item.name}</p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {item.size && `Size: ${item.size} · `}Qty {item.qty}
                  </p>
                </div>
                <span className="shrink-0 text-[13.5px] font-bold">{formatNaira(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <Link
            href="/cart"
            className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink/60 transition-colors hover:text-orisirisi"
          >
            <Pencil size={13} /> Edit bag
          </Link>
        </Section>
        </fieldset>

        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-orisirisi/[0.08] px-4 py-3 text-[13px] font-medium text-orisirisi">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}

        {/* No visible submit button here — the sticky mobile bar and desktop
            sidebar CTA both submit this form via the `form` attribute. */}
      </form>
    </>
  );
}

function inputClass(invalid?: boolean) {
  return `input-field ${invalid ? "!border-orisirisi" : ""}`;
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof User;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-ink/[0.08] p-6 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orisirisi/[0.1] text-orisirisi">
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="font-display text-lg font-medium">{title}</h2>
          <p className="text-[13px] text-ink/60">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
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
      {error && (
        <span className="flex items-center gap-1 text-xs font-medium text-orisirisi">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </label>
  );
}
