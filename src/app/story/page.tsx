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
    title: "Handpicked by Taiwo",
    body: "Every product is carefully selected with the same attention I'd give my own purchases. If I wouldn't use it, I won't sell it.",
  },
  {
    icon: <PackageCheck size={22} strokeWidth={1.6} />,
    title: "Quality you can trust",
    body: "Every product is carefully inspected before it gets to you because your satisfaction matters more than making a quick sale.",
  },
  {
    icon: <Sparkles size={22} strokeWidth={1.6} />,
    title: "Everything in One Place",
    body: "Jewellery, wristwatches, household essentials and fresh juice—all thoughtfully selected so you can shop conveniently from one trusted store.",
  },
  {
    icon: <Users size={22} strokeWidth={1.6} />,
    title: "Customer first, and always.",
    body: "We don't just want your first order—we want to become the store you confidently return to whenever you need quality products.",
  },
];

const MILESTONES = [
  {
    year: "2020",
    title: "The first sale",
    body: "Like many businesses, this one started small. During the COVID-19 lockdown, I began selling wristwatches. What started as a way to earn extra income became my first lesson in entrepreneurship—and my first proof that solving everyday needs creates opportunity.",
  },
  {
    year: "2023",
    title: "The value lesson",
    body: "While serving in Abuja during NYSC, I wanted to support myself financially. One day, I made fresh fruit juice for my dad. When he finished it, he simply handed me money and asked me to make more. That moment changed how I saw business. I realized people don't just pay for products, they pay for value, convenience, and a great experience. That lesson has guided every business decision I've made since.",
  },
  {
    year: "2025",
    title: "Orisirisi is born",
    body: "Relocating from Abuja gave me a fresh perspective. I noticed people buying household items, jewellery, and wristwatches from different vendors, paying multiple delivery fees and struggling to find trusted sellers. I believed shopping could be simpler. So I created Orisirisi with Taiwo—a carefully curated store where quality products live in one place, making shopping easier, faster, and more enjoyable.",
  },
  {
    year: "Today",
    title: "Still building",
    body: "Orisirisi is more than a store. It's a reflection of what I believe business should be: creating value, earning trust, and making everyday life a little easier. Alongside the products I sell, I also share marketing insights and business lessons because I believe great businesses grow when they help people first.",
  },
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
              src="/images/taiwo-portrait.jpeg"
              alt="Taiwo, founder of Orísirísi"
              fill
              className="object-cover grayscale-[20%] contrast-[1.05]"
            />
            <div className="pointer-events-none absolute inset-[18px] rounded-2xl border-[1.5px] border-paper/55" />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">Meet Taiwo</p>
            <h2 className="mt-3 font-display text-[28px] font-medium leading-[1.15] tracking-tight sm:text-[36px] lg:text-[40px]">
              &ldquo;Every piece tells your story.&rdquo;
            </h2>
            <p className="mt-5 max-w-[560px] text-[15.5px] leading-[1.8] text-ink/60">
              I believe shopping should be simple, enjoyable, and trustworthy. That&apos;s why I created
              Orisirisi—a carefully curated marketplace where you can discover quality jewellery, stylish
              wristwatches, household essentials, refreshing fruit juice, and more, all in one place.
            </p>
            <p className="mt-4 max-w-[560px] text-[15.5px] leading-[1.8] text-ink/60">
              When I&apos;m not curating products, I&apos;m sharing marketing insights and business ideas to
              help entrepreneurs grow. Whether you&apos;re here to shop or learn, I&apos;m glad you&apos;re here.
            </p>
            <p className="mt-5 font-display text-[22px] italic text-orisirisi">
              Welcome to Orisirisi Emporium. — Taiwo
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink/[0.04] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="mx-auto max-w-lg text-center">
            <p className="eyebrow">What We Stand For</p>
            <h2 className="mt-2.5 font-display text-[28px] font-medium sm:text-[36px]">
              Why People Keep Coming Back
            </h2>
          </Reveal>

          <ValuesGrid values={VALUES} />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[860px]">
          <Reveal className="text-center">
            <p className="eyebrow">Orisirisi Story</p>
            <h2 className="mt-2.5 font-display text-[28px] font-medium sm:text-[36px]">How It All Started</h2>
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

      <section className="relative overflow-hidden bg-secondary px-5 py-20 text-paper sm:px-8">
        <Reveal className="relative z-[1] mx-auto max-w-[560px] text-center">
          <h2 className="font-display text-[28px] font-medium sm:text-[36px]">Personally Selected by Taiwo</h2>
          <p className="mt-3 text-[14.5px] text-paper/70">
            Every product in Orisirisi has been carefully chosen for its quality, usefulness, and value.
            Because if I wouldn&apos;t buy it, I won&apos;t ask you to.
          </p>
          <Link
            href="/new-in"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-orisirisi px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-paper transition-transform hover:scale-105"
          >
            Explore Orisirisi <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}