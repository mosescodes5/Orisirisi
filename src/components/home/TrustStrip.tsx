"use client";

import { Truck, ShieldCheck, BadgeCheck, RotateCcw } from "lucide-react";
import { RevealStagger, revealItem } from "@/components/layout/Reveal";
import { motion } from "framer-motion";

const ITEMS = [
  { icon: Truck, title: "Nationwide Delivery", body: "Dispatched within 48 hours, tracked door to door." },
  { icon: ShieldCheck, title: "Secure Checkout", body: "Every payment encrypted and verified." },
  { icon: BadgeCheck, title: "Hand-Checked Quality", body: "Taiwo inspects every piece before it ships." },
  { icon: RotateCcw, title: "Easy 7-Day Returns", body: "Not quite right? Send it back, no wahala." },
];

export function TrustStrip() {
  return (
    <section className="bg-ink px-5 py-14 text-paper sm:px-8">
      <RevealStagger className="mx-auto grid max-w-[1320px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, body }, i) => (
          <motion.div
            key={title}
            variants={revealItem}
            className={`group flex items-start gap-4 px-0 py-4 lg:px-7 lg:py-0 ${
              i > 0 ? "lg:border-l lg:border-paper/[0.1]" : ""
            }`}
          >
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper/[0.06] transition-all duration-300 group-hover:scale-110 group-hover:bg-orisirisi/20">
              <Icon size={20} strokeWidth={1.5} className="text-orisirisi" />
            </span>
            <div>
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="mt-1 text-[12.5px] leading-relaxed text-paper/55">{body}</p>
            </div>
          </motion.div>
        ))}
      </RevealStagger>
    </section>
  );
}
