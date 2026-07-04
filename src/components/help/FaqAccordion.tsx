"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-ink/[0.08] rounded-card border border-ink/[0.08]">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className="px-6 py-1 sm:px-7">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-[14.5px] font-semibold">{item.question}</span>
              <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-orisirisi" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <p className="pb-5 text-[13.5px] leading-relaxed text-ink/60">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
