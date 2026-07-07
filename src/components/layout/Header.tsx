"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Home,
  Sparkles,
  BookOpen,
  LifeBuoy,
  User,
  ChevronRight,
} from "lucide-react";
import { Marquee } from "./Marquee";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { categories } from "@/lib/data";

const CATEGORY_STRIP = categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` }));

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  // Close the mobile menu on route change — same behavior as rynts. This has
  // to be an effect since it's reacting to navigation, not to a value read
  // during render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: see above
    setMobileMenuOpen(false);
  }, [pathname]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <div className="sticky top-0 z-50">
      <Marquee />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu sidebar — slides in from the left */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[84%] max-w-80 bg-paper transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-ink/[0.08] p-6">
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold">
                Orísirísi<span className="text-orisirisi">.</span>
              </span>
              <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.24em] text-mist">
                with Taiwo
              </span>
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-2 transition-colors hover:bg-ink/[0.04]"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-5" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex flex-col gap-1 px-4">
              <MobileLink href="/" icon={Home}>Home</MobileLink>
              <MobileLink href="/new-in" icon={Sparkles}>New In</MobileLink>

              <p className="mb-1.5 mt-5 px-4 text-xs font-bold uppercase tracking-widest text-mist">
                Categories
              </p>
              <MobileLink href="/categories">All Categories</MobileLink>
              {CATEGORY_STRIP.map((cat) => (
                <MobileLink key={cat.href} href={cat.href}>{cat.label}</MobileLink>
              ))}

              <p className="mb-1.5 mt-5 px-4 text-xs font-bold uppercase tracking-widest text-mist">
                More
              </p>
              <MobileLink href="/story">Our Story</MobileLink>
              <MobileLink href="/blog" icon={BookOpen}>Blog</MobileLink>
              <MobileLink href="/wishlist" icon={Heart}>Wishlist</MobileLink>
              <MobileLink href="/help" icon={LifeBuoy}>Help</MobileLink>
              <MobileLink href="/account" icon={User}>Account</MobileLink>
            </div>
          </div>
        </div>
      </div>

      <header className="border-b border-ink/[0.08] bg-paper/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="flex h-[76px] items-center justify-between gap-4 sm:h-[84px]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="-ml-2 p-2 text-ink md:hidden"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex flex-col leading-none">
                <span className="font-display text-[22px] font-semibold tracking-tight sm:text-[26px]">
                  Orísirísi<span className="text-orisirisi">.</span>
                </span>
                <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-mist sm:text-[9px] sm:tracking-[0.24em]">
                  with Taiwo
                </span>
              </Link>
            </div>

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="mx-6 hidden max-w-md flex-1 md:flex">
              <div className="group relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewelry, wristwatch, household…"
                  className="h-11 w-full rounded-full border-[1.5px] border-ink/[0.12] bg-ink/[0.03] pl-5 pr-12 text-[13.5px] transition-colors focus:border-orisirisi focus:bg-paper focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-paper transition-colors hover:bg-orisirisi"
                >
                  <Search size={15} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/blog"
                className="hidden items-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-ink/[0.04] hover:text-orisirisi lg:flex"
              >
                Blog
              </Link>
              <Link
                href="/help"
                className="hidden items-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-ink/[0.04] hover:text-orisirisi lg:flex"
              >
                Help
              </Link>
              <Link
                href="/account"
                aria-label="Account"
                className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.04] hover:text-orisirisi sm:flex"
              >
                <User size={19} strokeWidth={1.7} />
              </Link>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.04] hover:text-orisirisi"
              >
                <Heart size={19} strokeWidth={1.7} />
                {wishlistCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orisirisi text-[9px] font-bold text-paper">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={openDrawer}
                aria-label="Open bag"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.04] hover:text-orisirisi"
              >
                <ShoppingBag size={19} strokeWidth={1.7} />
                {count > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orisirisi text-[9px] font-bold text-paper">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search — always visible, same as rynts */}
          <form onSubmit={handleSearch} className="pb-3.5 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewelry, wristwatch, household…"
                className="h-11 w-full rounded-full border-[1.5px] border-ink/[0.12] bg-ink/[0.03] pl-5 pr-12 text-[13.5px] focus:border-orisirisi focus:bg-paper focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-paper"
              >
                <Search size={15} />
              </button>
            </div>
          </form>
        </div>

        {/* Category strip */}
        <div className="relative border-t border-ink/[0.06] bg-ink/[0.02]">
          <div className="no-scrollbar flex gap-7 overflow-x-auto px-5 py-2.5 sm:justify-center sm:px-8">
            {CATEGORY_STRIP.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="whitespace-nowrap text-[11.5px] font-bold uppercase tracking-wider text-ink/65 transition-colors hover:text-orisirisi"
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-paper via-paper/90 to-transparent px-3 sm:hidden">
            <ChevronRight size={13} className="animate-pulse text-orisirisi" />
          </div>
        </div>
      </header>
    </div>
  );
}

function MobileLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon?: typeof Home;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-orisirisi/[0.08] hover:text-orisirisi"
    >
      {Icon && <Icon size={18} strokeWidth={1.8} />}
      {children}
    </Link>
  );
}
