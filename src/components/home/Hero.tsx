"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import type { PointerEvent } from "react";
import { placeholderImage } from "@/lib/data";

const ease = [0.16, 0.84, 0.44, 1] as const;

export function Hero() {
  // Raw pointer position within the hero art, normalized to -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Springed so the parallax trails the cursor smoothly instead of snapping
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.4 });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section className="overflow-hidden px-5 pb-[70px] pt-[72px] sm:px-8 sm:pt-[92px]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow"
          >
            The Assortment, Curated
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-4.5 font-display text-[40px] font-medium leading-[1.02] tracking-tight sm:text-[56px] lg:text-[74px]"
          >
            Every sort of
            <br />
            thing, <em className="font-normal italic text-orisirisi">beautifully</em>
            <br />
            found.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
            className="mt-6.5 max-w-[440px] text-[16.5px] leading-[1.7] text-ink/60"
          >
            Orísirísi means variety — and that&apos;s exactly what this is. Household pieces, fine
            jewelry, wristwatches and fresh juice, hand-picked by Taiwo so you never have to shop
            five places for one home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease }}
            className="mt-8.5 flex flex-wrap items-center gap-6"
          >
            <Link
              href="/new-in"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-secondary px-8.5 py-4.5 text-[13px] font-bold uppercase tracking-wide text-paper transition-transform hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-orisirisi transition-transform duration-400 group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2.5">
                Shop the assortment
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/story"
              className="group inline-flex items-center gap-2 border-b-[1.5px] border-secondary pb-1 text-[13px] font-bold uppercase tracking-wide transition-colors hover:border-orisirisi hover:text-orisirisi"
            >
              Meet Taiwo
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative h-[380px] sm:h-[480px]"
        >
          <FloatCard
            className="left-[6%] top-0 z-[2] h-[64%] w-[56%]"
            src={placeholderImage("orisirisi-household", 700, 900)}
            alt="Household items"
            y={[0, -10, 0]}
            duration={7}
            parallaxX={sx}
            parallaxY={sy}
            depth={18}
          />
          <FloatCard
            className="right-0 top-[10%] z-[1] h-[46%] w-[44%]"
            src={placeholderImage("orisirisi-jewelry", 600, 600)}
            alt="Jewelry"
            y={[0, 8, 0]}
            duration={8}
            parallaxX={sx}
            parallaxY={sy}
            depth={-26}
          />
          <FloatCard
            className="bottom-0 left-0 z-[3] h-[44%] w-[42%]"
            src={placeholderImage("orisirisi-wristwatch", 600, 600)}
            alt="Wristwatch"
            y={[0, -6, 0]}
            duration={6.5}
            parallaxX={sx}
            parallaxY={sy}
            depth={32}
          />
          <motion.div
            style={{
              x: useTransform(sx, (v) => v * 10),
              y: useTransform(sy, (v) => v * 10),
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            className="absolute bottom-[8%] right-[10%] z-[4] flex items-center gap-2 rounded-full border border-ink/[0.14] bg-paper px-4.5 py-2.5 text-xs font-bold shadow-[0_14px_30px_-12px_rgba(0,0,0,0.25)]"
          >
            <span className="h-2 w-2 rounded-full bg-orisirisi" />
            320+ pieces added this month
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mx-auto mt-16 hidden max-w-[1320px] items-center gap-3 sm:flex"
      >
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-ink/40"
        >
          <ArrowDown size={13} />
        </motion.span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/35">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
}

function FloatCard({
  className,
  src,
  alt,
  y,
  duration,
  parallaxX,
  parallaxY,
  depth,
}: {
  className: string;
  src: string;
  alt: string;
  y: number[];
  duration: number;
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
  depth: number;
}) {
  const x = useTransform(parallaxX, (v) => v * depth);
  const yParallax = useTransform(parallaxY, (v) => v * depth);

  return (
    <motion.div style={{ x, y: yParallax }} className={`absolute ${className}`}>
      <motion.div
        animate={{ y }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full overflow-hidden rounded-[18px] bg-ink/[0.04] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.28)]"
      >
        <Image src={src} alt={alt} fill className="object-cover grayscale-[15%] contrast-[1.05]" />
      </motion.div>
    </motion.div>
  );
}
