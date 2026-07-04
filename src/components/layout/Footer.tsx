import Link from "next/link";
import { Instagram, MessageCircle, Music2 } from "lucide-react";

const SHOP_LINKS = [
  { label: "Household Items", href: "/category/household" },
  { label: "Jewelries", href: "/category/jewelry" },
  { label: "Clothing & Accessories", href: "/category/clothing" },
  { label: "New Arrivals", href: "/new-in" },
];

const HELP_LINKS = [
  { label: "Track My Order", href: "/track" },
  { label: "Delivery Info", href: "/delivery" },
  { label: "Returns Policy", href: "/returns" },
  { label: "Contact Us", href: "/contact" },
];

const ABOUT_LINKS = [
  { label: "Our Story", href: "/story" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "FAQs", href: "/faq" },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-ink/[0.08] bg-paper pb-7 pt-14">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl font-semibold">
              Orísirísi<span className="text-orisirisi">.</span>
            </div>
            <p className="mt-3.5 max-w-[260px] text-[13px] leading-relaxed text-ink/60">
              A curated assortment of household items, jewelry, clothing and accessories — with Taiwo.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Music2, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/[0.14] transition-colors hover:border-orisirisi hover:bg-orisirisi hover:text-paper"
                >
                  <Icon size={15} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Shop" links={SHOP_LINKS} />
          <FooterCol title="Help" links={HELP_LINKS} />
          <FooterCol title="About" links={ABOUT_LINKS} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] pt-6 text-xs text-mist">
          <span>© {new Date().getFullYear()} Orísirísi with Taiwo. All rights reserved.</span>
          <span>Made with care in Lagos, Nigeria.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h5 className="mb-4.5 text-[11px] font-bold uppercase tracking-[0.14em] text-mist">{title}</h5>
      <div className="flex flex-col gap-3">
        {links.map((l) => (
          <Link key={l.label} href={l.href} className="text-[13.5px] transition-colors hover:text-orisirisi">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
