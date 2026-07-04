import Link from "next/link";
import { formatNaira } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart-context";

export function CartSummary({
  subtotal,
  deliveryFee,
  total,
  ctaLabel,
  ctaHref,
  onCta,
  onCtaClick,
  ctaDisabled,
  formId,
}: {
  subtotal: number;
  deliveryFee: number;
  total: number;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  formId?: string;
}) {
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <div className="rounded-card border border-ink/[0.08] p-6 sm:p-7">
      <h3 className="font-display text-lg font-medium">Order Summary</h3>

      {remaining > 0 ? (
        <div className="mt-3">
          <p className="rounded-lg bg-orisirisi/[0.08] px-3.5 py-2.5 text-xs font-medium text-orisirisi">
            Add {formatNaira(remaining)} more for free delivery.
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.08]">
            <div
              className="h-full rounded-full bg-orisirisi transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : subtotal > 0 ? (
        <p className="mt-3 rounded-lg bg-orisirisi/[0.08] px-3.5 py-2.5 text-xs font-medium text-orisirisi">
          You&apos;ve unlocked free delivery 🎉
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 text-[13.5px]">
        <div className="flex justify-between text-ink/70">
          <span>Subtotal</span>
          <span className="font-semibold text-ink">{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink/70">
          <span>Delivery</span>
          <span className="font-semibold text-ink">{deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}</span>
        </div>
      </div>

      <div className="mt-5 flex justify-between border-t border-ink/[0.08] pt-5 text-base font-bold">
        <span>Total</span>
        <span>{formatNaira(total)}</span>
      </div>

      {ctaLabel && (ctaHref ? (
        <Link
          href={ctaHref}
          onClick={onCtaClick}
          className="mt-6 block rounded-full bg-ink py-3.5 text-center text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
        >
          {ctaLabel}
        </Link>
      ) : (
        <button
          type={formId ? "submit" : "button"}
          form={formId}
          onClick={onCta}
          disabled={ctaDisabled}
          className="mt-6 w-full rounded-full bg-ink py-3.5 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
        >
          {ctaLabel}
        </button>
      ))}
    </div>
  );
}
