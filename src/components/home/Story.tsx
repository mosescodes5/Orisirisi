"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/layout/Reveal";
import { placeholderImage } from "@/lib/data";

export function Story() {
  return (
    <section id="story" className="relative overflow-hidden bg-ink/[0.04] px-5 py-24 sm:px-8 sm:py-[96px]">
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
        className="pointer-events-none absolute -top-6 right-[6%] select-none font-display text-[180px] italic leading-none text-orisirisi/[0.06] sm:text-[240px]"
      >
        &rdquo;
      </motion.span>

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[20px]">
          <Image
            src={placeholderImage("orisirisi-taiwo", 700, 900)}
            alt="Taiwo, founder of Orísirísi"
            fill
            className="object-cover grayscale-[20%] contrast-[1.05]"
          />
          <div className="pointer-events-none absolute inset-[18px] rounded-2xl border-[1.5px] border-paper/55" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow">The Person Behind the Shelf</p>
          <h2 className="mt-3 font-display text-[28px] font-medium leading-[1.15] tracking-tight sm:text-[36px] lg:text-[40px]">
            &ldquo;Orísirísi is what I&apos;d sell you if you sat in my living room.&rdquo;
          </h2>
          <p className="mt-5 max-w-[520px] text-[15.5px] leading-[1.8] text-ink/60">
            It started as a phone gallery full of things I couldn&apos;t stop buying — a lamp
            here, a necklace there, a wrapper too nice not to share. Orísirísi is that gallery,
            sorted and made shoppable: household pieces that make a house feel lived-in, jewelry
            that doesn&apos;t need an occasion, clothing and accessories I&apos;d wear myself.
          </p>
          <p className="mt-4 max-w-[520px] text-[15.5px] leading-[1.8] text-ink/60">
            Every item on this shelf passed through my hands first. That&apos;s the whole promise.
          </p>
          <p className="mt-5 font-display text-[22px] italic text-orisirisi">— Taiwo</p>
        </Reveal>
      </div>
    </section>
  );
}
