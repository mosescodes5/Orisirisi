"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, placeholderImage } from "@/lib/data";
import { Reveal, RevealStagger, revealItem } from "@/components/layout/Reveal";
import { motion, useInView, animate } from "framer-motion";

export function Categories() {
  return (
    <section id="categories" className="px-5 py-24 sm:px-8 sm:py-[96px]">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Shop by Category</p>
            <h2 className="mt-2.5 font-display text-[28px] font-medium tracking-tight sm:text-[36px] lg:text-[44px]">
              Four worlds, one shelf.
            </h2>
          </div>
          <p className="max-w-[380px] text-[14.5px] leading-relaxed text-ink/60">
            No two Orísirísi orders look alike — that&apos;s the point. Start wherever your home
            needs you most.
          </p>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={revealItem}>
              <Link
                href={`/category/${cat.slug}`}
                className="group relative isolate flex h-[360px] items-end overflow-hidden rounded-[20px]"
              >
                <Image
                  src={placeholderImage(cat.image, 500, 650)}
                  alt={cat.name}
                  fill
                  className="object-cover grayscale-[35%] contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/82 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
                <div className="absolute inset-0 z-[1] bg-orisirisi opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-30" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1] rounded-[20px] ring-1 ring-inset ring-paper/0 transition-all duration-500 group-hover:ring-paper/25"
                />
                <div className="relative z-[2] w-full p-6.5 text-paper">
                  <p className="eyebrow text-paper opacity-75">
                    <CountUp value={cat.itemCount} /> items
                  </p>
                  <h3 className="mt-1.5 font-display text-[24px] font-medium">{cat.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-transform duration-300 group-hover:translate-x-1.5">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

/** Counts up from 0 to `value` once it scrolls into view. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 0.84, 0.44, 1],
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>0</span>;
}
