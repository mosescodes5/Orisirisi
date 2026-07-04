"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { RevealStagger, revealItem } from "@/components/layout/Reveal";

export function ValuesGrid({ values }: { values: { icon: ReactNode; title: string; body: string }[] }) {
  return (
    <RevealStagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {values.map(({ icon, title, body }) => (
        <motion.div
          key={title}
          variants={revealItem}
          className="flex flex-col items-start gap-4 rounded-card border border-ink/[0.08] bg-paper p-7"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orisirisi/[0.1] text-orisirisi">
            {icon}
          </span>
          <div>
            <h3 className="font-display text-lg font-medium">{title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">{body}</p>
          </div>
        </motion.div>
      ))}
    </RevealStagger>
  );
}
