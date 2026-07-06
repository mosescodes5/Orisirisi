import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, HandHeart, PackageCheck, Users } from "lucide-react";
import { placeholderImage } from "@/lib/data";
import { Reveal } from "@/components/layout/Reveal";
import { ValuesGrid } from "@/components/story/ValuesGrid";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Orísirísi with Taiwo started, what it stands for, and the promise behind every piece in the assortment.",
};

const VALUES = [
  {
    icon: <HandHeart size={22} strokeWidth={1.6} />,
    title: "Hand-picked, not mass-sourced",
    body: "Every piece is chosen the way Taiwo shops for herself — nothing goes on the shelf she wouldn't buy.",
  },
  {
    icon: <PackageCheck size={22} strokeWidth={1.6} />,
    title: "Quality-checked before it ships",
    body: "Stitching, clasps, glaze, weight in the hand — every item is inspected, not just photographed.",
  },
  {
    icon: <Sparkles size={22} strokeWidth={1.6} />,
    title: "A little bit of everything, on purpose",
    body: "Household, jewelry, wristwatches and fresh juice — sorted by taste, not by category, the way a good shelf actually works.",
  },
  {
    icon: <Users size={22} strokeWidth={1.6} />,
    title: "Built for repeat customers",
    body: "Slower restocks, fewer regrets. We'd rather bring a favorite back than flood the shop with new drops.",
  },
];

const MILESTONES = [
  { year: "2023", title: "The phone gallery", body: "A running album of things Taiwo kept buying for her own home — the seed of the assortment." },
  { year: "2024", title: "First sorted shelf", body: "Household, jewelry and wristwatches organized into a proper catalogue, shared with friends first." },
  { year: "2025", title: "Orísirísi opens", body: "The shop goes live to everyone, with nationwide delivery across Nigeria." },
  { year: "2026", title: "The journal begins", body: "Sourcing notes, styling guides and Lagos life — the stories behind the shelf, written down." },
];

export default function StoryPage() {
  return (
    <>
      <section className="relative h-[320px] overflow-hidden sm:h-[400px]">
        <Image
          src={placeholderImage("orisirisi-story-hero", 1600, 700)}
          alt="Orísirísi with Taiwo"
          fill
          priority
          className="object-cover grayscale-[25%] contrast-[1.05] brightness-[0.7]"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-5 text-paper sm:px-8">
          <Reveal className="mx-auto w-full max-w-[1320px]">
            <p className="eyebrow text-paper/80">Since 2023</p>
            <h1 className="mt-3 font-display text-[36px] font-medium sm:text-[52px] lg:text-[64px]">Our Story</h1>
            <p className="mt-3 max-w-[460px] text-sm opacity-85">
              How a phone gallery of things Taiwo couldn&apos;t stop buying became a shop.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
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
            <p className="mt-5 max-w-[560px] text-[15.5px] leading-[1.8] text-ink/60">
              It started as a phone gallery full of things I couldn&apos;t stop buying — a lamp here, a necklace
              there, a watch too nice not to share. Friends kept asking where things came from, then asking
              me to just buy one for them too. At some point that stopped being a favor and started being a
              shop.
            </p>
            <p className="mt-4 max-w-[560px] text-[15.5px] leading-[1.8] text-ink/60">
              Orísirísi is that gallery, sorted and made shoppable: household pieces that make a house feel
              lived-in, jewelry that doesn&apos;t need an occasion, a wristwatch worth the wrist space, fresh
              juice made the way it should be. Every item on this shelf passed through my hands first. That&apos;s
              the whole promise — not a slogan, just how I&apos;d want to be shopped from.
            </p>
            <p className="mt-5 font-display text-[22px] italic text-orisirisi">— Taiwo</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink/[0.04] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mx-auto max-w-lg text-center">
            <p className="eyebrow">What We Stand For</p>
            <h2 className="mt-2.5 font-display text-[28px] font-medium sm:text-[36px]">
              A few things that don&apos;t change
            </h2>
          </Reveal>

          <ValuesGrid values={VALUES} />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[860px]">
          <Reveal className="text-center">
            <p className="eyebrow">How We Got Here</p>
            <h2 className="mt-2.5 font-display text-[28px] font-medium sm:text-[36px]">The short version</h2>
          </Reveal>

          <div className="mt-14 flex flex-col gap-10">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.05}>
                <div className="flex gap-6 sm:gap-10">
                  <div className="w-16 shrink-0 text-right font-display text-xl font-medium text-orisirisi sm:w-20 sm:text-2xl">
                    {m.year}
                  </div>
                  <div className="flex-1 border-l-[1.5px] border-ink/[0.1] pb-2 pl-6 sm:pl-10">
                    <h3 className="font-display text-lg font-medium sm:text-xl">{m.title}</h3>
                    <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-ink/60">{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-20 text-paper sm:px-8">
        <Reveal className="relative z-[1] mx-auto max-w-[560px] text-center">
          <h2 className="font-display text-[28px] font-medium sm:text-[36px]">Come see the shelf.</h2>
          <p className="mt-3 text-[14.5px] text-paper/70">
            Jewelry, wristwatch, household items and fresh juice — hand-picked, one piece at a time.
          </p>
          <Link
            href="/new-in"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-orisirisi px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-transform hover:scale-105"
          >
            Shop the assortment <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
