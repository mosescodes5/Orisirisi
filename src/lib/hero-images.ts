import { placeholderImage } from "@/lib/data";

export type HeroImageSlot = {
  /** site_settings row key this slot reads/writes. */
  key: string;
  /** Groups slots on the admin "Hero Images" page. */
  section: string;
  label: string;
  /** What renders until someone uploads an override for this slot. */
  defaultSrc: string;
};

// Every admin-editable hero/banner photo on the site. Add a slot here and it
// automatically gets a field on /admin/settings/hero-images — nothing else
// to wire up on the admin side. The storefront pages that actually render
// these still look them up by `key` individually (see src/app/page.tsx and
// src/app/category/[slug]/page.tsx).
export const HERO_IMAGE_SLOTS: HeroImageSlot[] = [
  {
    key: "hero_home_float_household",
    section: "Homepage",
    label: "Household photo (top-left)",
    defaultSrc: placeholderImage("orisirisi-household", 700, 900),
  },
  {
    key: "hero_home_float_jewelry",
    section: "Homepage",
    label: "Jewelry photo (top-right)",
    defaultSrc: placeholderImage("orisirisi-jewelry", 600, 600),
  },
  {
    key: "hero_home_float_wristwatch",
    section: "Homepage",
    label: "Wristwatch photo (bottom-left)",
    defaultSrc: placeholderImage("orisirisi-wristwatch", 600, 600),
  },
  {
    key: "hero_category_jewelry",
    section: "Category banners",
    label: "Jewelry",
    defaultSrc: placeholderImage("orisirisi-cat-hero-jewelry", 1600, 500),
  },
  {
    key: "hero_category_wristwatch",
    section: "Category banners",
    label: "Wristwatch",
    defaultSrc: placeholderImage("orisirisi-cat-hero-wristwatch", 1600, 500),
  },
  {
    key: "hero_category_household",
    section: "Category banners",
    label: "Home & Living",
    defaultSrc: "/images/home-living.jpg",
  },
  {
    key: "hero_category_fresh_juice",
    section: "Category banners",
    label: "Fresh Juice",
    defaultSrc: placeholderImage("orisirisi-cat-hero-fresh-juice", 1600, 500),
  },
];
