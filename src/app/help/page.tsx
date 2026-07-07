import type { Metadata } from "next";
import Link from "next/link";
import { Truck, PackageSearch, RotateCcw, MessageCircleQuestion, ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/help/FaqAccordion";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Track an order, check delivery times, start a return, or browse frequently asked questions about shopping at Orísirísi with Taiwo.",
};

const FAQ_ITEMS = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders are dispatched within 48 hours of payment and typically arrive within 2–5 business days depending on your location within Nigeria. Lagos addresses are usually on the faster end of that window.",
  },
  {
    question: "Do you deliver outside Lagos?",
    answer:
      "Yes — we deliver nationwide across Nigeria. Delivery fees are calculated at checkout based on the state you select, and orders over ₦50,000 qualify for free delivery anywhere.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Items can be returned within 7 days of delivery provided they're unused, unworn and in their original packaging. Reach out through the Contact page with your order reference and we'll sort out a pickup or drop-off.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "All payments are processed securely through Paystack, which supports debit and credit cards, bank transfers, and USSD. Your card details are handled entirely by Paystack — we never see or store them.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You'll receive an order confirmation by email as soon as payment goes through, with your order reference. For a status update at any time, reach out on the Contact page with that reference and we'll get back to you with the latest.",
  },
  {
    question: "An item arrived damaged — what do I do?",
    answer:
      "Please contact us within 48 hours of delivery with a photo of the item and your order reference. We'll arrange a replacement or refund — no need to send anything back first.",
  },
];

export default function HelpPage() {
  return (
    <div className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <p className="eyebrow">Help Center</p>
          <h1 className="mt-2.5 font-display text-[32px] font-medium sm:text-[44px]">How can we help?</h1>
          <p className="mt-2.5 max-w-lg text-[14.5px] text-ink/60">
            Everything about orders, delivery and returns — and if it&apos;s not here, the Contact page reaches
            a real person.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <a href="#track" className="group flex flex-col gap-3 rounded-card border border-ink/[0.08] p-6 transition-colors hover:border-orisirisi">
            <PackageSearch size={20} strokeWidth={1.6} className="text-orisirisi" />
            <span className="text-[13.5px] font-bold">Track My Order</span>
          </a>
          <a href="#delivery" className="group flex flex-col gap-3 rounded-card border border-ink/[0.08] p-6 transition-colors hover:border-orisirisi">
            <Truck size={20} strokeWidth={1.6} className="text-orisirisi" />
            <span className="text-[13.5px] font-bold">Delivery Info</span>
          </a>
          <a href="#returns" className="group flex flex-col gap-3 rounded-card border border-ink/[0.08] p-6 transition-colors hover:border-orisirisi">
            <RotateCcw size={20} strokeWidth={1.6} className="text-orisirisi" />
            <span className="text-[13.5px] font-bold">Returns Policy</span>
          </a>
        </div>

        <section id="track" className="mt-16 scroll-mt-28">
          <h2 className="font-display text-xl font-medium sm:text-2xl">Track My Order</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/60">
            Every order gets an emailed confirmation with a reference number the moment payment clears — check
            your inbox (and spam folder) for a message from Orísirísi with Taiwo. For a live status update
            beyond that, message us on the{" "}
            <Link href="/contact" className="font-semibold text-orisirisi hover:underline">
              Contact page
            </Link>{" "}
            with your reference and we&apos;ll reply with where things stand.
          </p>
        </section>

        <section id="delivery" className="mt-14 scroll-mt-28">
          <h2 className="font-display text-xl font-medium sm:text-2xl">Delivery Info</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/60">
            Orders are dispatched within 48 hours of payment and delivered nationwide across Nigeria — typically
            2–5 business days depending on your state. Delivery is free on orders over ₦50,000; otherwise a flat
            fee is calculated at checkout based on your delivery address.
          </p>
        </section>

        <section id="returns" className="mt-14 scroll-mt-28">
          <h2 className="font-display text-xl font-medium sm:text-2xl">Returns Policy</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/60">
            Not quite right? Items can be returned within 7 days of delivery as long as they&apos;re unused, unworn
            and in their original packaging. Get in touch through the{" "}
            <Link href="/contact" className="font-semibold text-orisirisi hover:underline">
              Contact page
            </Link>{" "}
            with your order reference and we&apos;ll arrange the rest.
          </p>
        </section>

        <section id="faq" className="mt-16 scroll-mt-28">
          <h2 className="font-display text-xl font-medium sm:text-2xl">Frequently Asked Questions</h2>
          <div className="mt-6">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        <div className="mt-16 flex flex-col items-start gap-4 rounded-card bg-ink/[0.04] p-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <MessageCircleQuestion size={22} strokeWidth={1.6} className="shrink-0 text-orisirisi" />
            <div>
              <p className="text-[14.5px] font-semibold">Still stuck?</p>
              <p className="text-[13px] text-ink/60">Send a message and we&apos;ll get back to you personally.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary px-6 py-3 text-[12.5px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-orisirisi"
          >
            Contact us <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
