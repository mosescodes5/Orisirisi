import type { CategoryDef, BlogPost, Product } from "./types";

/*
  Static/reference data layer: categories, placeholder images, and blog
  content. Product data now lives in Supabase — see src/lib/products.ts
  (server-only queries, for Server Components) and
  src/lib/products-client.ts (browser queries, for Client Components like
  search and wishlist). This file stays free of server-only imports so
  Client Components can keep importing `categories`/`placeholderImage`
  from it directly.
*/

export const categories: CategoryDef[] = [
  { slug: "jewelry", name: "Jewelry", itemCount: 6, image: "orisirisi-cat-jewelry" },
  { slug: "wristwatch", name: "Wristwatch", itemCount: 0, image: "orisirisi-cat-wristwatch" },
  { slug: "household", name: "Household Items", itemCount: 6, image: "orisirisi-cat-household" },
  { slug: "fresh-juice", name: "Fresh Juice", itemCount: 0, image: "orisirisi-cat-fresh-juice" },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// Curated real photos (Unsplash, free-to-use license) keyed by the same
// seed strings already stored on categories/products/blog posts — this is
// the only place that needs to change when real product photography exists.
// Unmapped seeds still fall back to picsum so nothing 404s if a new seed
// is added without a matching entry here.
const CURATED_IMAGES: Record<string, string> = {
  // Products
  "orisirisi-p1": "1632574231053-2dda4c5774eb", // woven storage baskets
  "orisirisi-p2": "1758995115682-1452a1a9e35b", // layered gold necklace
  "orisirisi-p3": "1774005906344-57048d3f5856", // linen wrap top
  "orisirisi-p4": "1528414450725-0b2677fc991a", // ceramic table lamp
  "orisirisi-p5": "1756792340190-2039b9a1787d", // beaded drop earrings
  "orisirisi-p6": "1598532163257-ae3c6b2524b6", // structured tote bag
  "orisirisi-p7": "1559548290-d6b0cb6c9050", // soy candle set
  "orisirisi-p8": "1683356177083-0872f7ed3d95", // silk hair scarf
  "orisirisi-j3": "1680968921717-4abbbe793bb3", // statement hoop earrings
  "orisirisi-j4": "1656010280156-fa8c1793c235", // pearl cluster ring
  "orisirisi-j5": "1741071520895-47d81779c11e", // beaded waist bangle set
  "orisirisi-j6": "1741071520895-47d81779c11e", // fine chain anklet
  // Categories
  "orisirisi-cat-household": "1632574231053-2dda4c5774eb",
  "orisirisi-cat-jewelry": "1758995115682-1452a1a9e35b",
  "orisirisi-cat-wristwatch": "1704428303280-84768603d539",
  "orisirisi-cat-fresh-juice": "1600271886742-f049cd451bba",
  // Category page hero banners (separate key namespace from the cards above)
  "orisirisi-cat-hero-household": "1528414450725-0b2677fc991a",
  "orisirisi-cat-hero-jewelry": "1758995115682-1452a1a9e35b",
  "orisirisi-cat-hero-wristwatch": "1704428303280-84768603d539",
  "orisirisi-cat-hero-fresh-juice": "1600271886742-f049cd451bba",
  // Homepage hero accents + category/new-in banners
  "orisirisi-household": "1632574231053-2dda4c5774eb",
  "orisirisi-jewelry": "1758995115682-1452a1a9e35b",
  "orisirisi-wristwatch": "1704428303280-84768603d539",
  "orisirisi-categories-hero": "1741071520895-47d81779c11e",
  "orisirisi-new-in-hero": "1756792340190-2039b9a1787d",
  "orisirisi-story-hero": "1528414450725-0b2677fc991a",
  // Founder — intentionally a hands/craft shot rather than a stranger's
  // face: don't attach a real, identifiable stock model's likeness to a
  // named founder bio. Swap for Taiwo's actual photo before launch.
  "orisirisi-taiwo": "1757087824089-bdb33ecc3439",
  "orisirisi-author-taiwo": "1757087824089-bdb33ecc3439",
  // Blog covers
  "orisirisi-blog-sourcing": "1756792340190-2039b9a1787d",
  "orisirisi-blog-layering": "1758995115682-1452a1a9e35b",
  "orisirisi-blog-care": "1598532163257-ae3c6b2524b6",
  "orisirisi-blog-market": "1757087824089-bdb33ecc3439",
  "orisirisi-blog-fewer-better": "1632574231053-2dda4c5774eb",
};

// Cheap placeholder image source — swap for real product photography or your CDN.
export function placeholderImage(seed: string, w = 600, h = 750) {
  const curated = CURATED_IMAGES[seed];
  if (curated) {
    return `https://images.unsplash.com/photo-${curated}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
  }
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

// Same resolution logic as placeholderImage, but takes the product itself —
// used wherever a Product object (rather than a bare seed string) is on
// hand, e.g. building the order confirmation email after a webhook fires.
export function productImage(product: Pick<Product, "image">, w = 600, h = 750) {
  return placeholderImage(product.image, w, h);
}

/* ------------------------------------------------------------------ */
/*  Blog                                                                */
/*  Mock content layer for the blog — swap for Sanity once it's wired  */
/*  up (see README). Every blog page reads through the functions below,  */
/*  never the arrays directly, so that's the only seam to change later. */
/* ------------------------------------------------------------------ */

const taiwo: import("./types").BlogAuthor = {
  name: "Taiwo",
  role: "Founder, Orísirísi",
  avatar: "orisirisi-author-taiwo",
  bio: "Taiwo curates every piece that ends up in the Orísirísi assortment — household finds, jewelry, and the odd wildcard. She writes here about the hunt, the styling, and the small decisions that make a house feel like yours.",
};

export const blogCategories = ["Style Guides", "Behind the Brand", "Care & Maintenance", "Lagos Life"];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-i-source-the-assortment",
    title: "How I Source Every Piece in the Assortment",
    excerpt:
      "People ask why Orísirísi carries such a mix — baskets next to earrings next to linen tops. Here's the honest answer, and the three questions every piece has to survive.",
    category: "Behind the Brand",
    coverImage: "orisirisi-blog-sourcing",
    author: taiwo,
    publishedAt: "2026-05-04",
    readingTime: 6,
    featured: true,
    tags: ["sourcing", "brand story"],
    content: [
      { type: "paragraph", text: "Every few weeks someone asks me some version of the same question: what does a household basket have to do with a gold-plated necklace? Fair question. The honest answer is that Orísirísi was never built around a category — it was built around a way of shopping." },
      { type: "heading", text: "The three-question filter" },
      { type: "paragraph", text: "Before anything makes it into the shop, it has to survive three questions. Would I actually use this in my own house? Would I be a little disappointed if a friend bought the same thing somewhere cheaper and worse? And does it hold up if you look closely — stitching, clasp, glaze, weight in the hand?" },
      { type: "paragraph", text: "Most things fail on the third one. It's the least glamorous filter and the most important. A basket that looks perfect in a photo but frays at the handle after two months isn't a bargain, it's a slow-motion complaint." },
      { type: "quote", text: "If I wouldn't put it in my own hallway, it doesn't go in the shop." },
      { type: "heading", text: "Where things actually come from" },
      { type: "paragraph", text: "Some pieces come from small workshops I've visited in person — the woven baskets, most of the ceramics. Others come from suppliers I've worked with long enough to trust their quality control more than my own inspection. None of it is mass-ordered off a catalogue without someone from the team actually holding a sample first." },
      { type: "paragraph", text: "That's slower than it needs to be, and it means the assortment changes in small batches rather than huge seasonal drops. I've made peace with that trade — I'd rather restock a favorite twice a year than flood the shop with things nobody asked for." },
    ],
  },
  {
    slug: "five-ways-to-style-layered-necklaces",
    title: "Five Ways to Style a Layered Necklace Without Overdoing It",
    excerpt:
      "Layering looks effortless on other people and stressful in your own mirror. Here's the actual method — lengths, metals, and the one rule that fixes 90% of layering mistakes.",
    category: "Style Guides",
    coverImage: "orisirisi-blog-layering",
    author: taiwo,
    publishedAt: "2026-04-18",
    readingTime: 5,
    tags: ["jewelry", "styling"],
    content: [
      { type: "paragraph", text: "Layered necklaces have a reputation for looking effortless on other people and chaotic in your own mirror. The gap between the two is almost never the jewelry — it's the lengths." },
      { type: "heading", text: "Start with length, not pieces" },
      { type: "paragraph", text: "The rule that fixes most layering attempts: no two necklaces should sit at the exact same point on your chest. A two-centimetre gap between lengths is usually enough to read as intentional instead of tangled. Choke, then a mid-length piece, then something that drops past the collarbone — that's the whole formula." },
      { type: "paragraph", text: "If you only own one length, that's fine too. A single fine chain with a slightly heavier pendant chain on top of it does the same job at a smaller scale." },
      { type: "heading", text: "Mixing metals is allowed" },
      { type: "paragraph", text: "Gold-on-gold is the safe choice, but a single silver or beaded piece in the mix reads as deliberate, not accidental, as long as it's not competing for the same visual weight as your statement piece. Think of it as a supporting layer, not a co-lead." },
      { type: "quote", text: "Two centimetres of gap between lengths is the difference between styled and tangled." },
      { type: "paragraph", text: "Last thing — take one piece off before you leave the house. It's an old rule for a reason. If you can remove something and the look doesn't change, it wasn't doing anything." },
    ],
  },
  {
    slug: "caring-for-vegan-leather",
    title: "How to Actually Care for Vegan Leather (So It Lasts)",
    excerpt:
      "Vegan leather gets blamed for cracking early, but most of the damage comes from how it's stored, not what it's made of. A five-minute routine that adds years to a bag's life.",
    category: "Care & Maintenance",
    coverImage: "orisirisi-blog-care",
    author: taiwo,
    publishedAt: "2026-03-27",
    readingTime: 4,
    tags: ["accessories", "care"],
    content: [
      { type: "paragraph", text: "Vegan leather has a reputation for cracking and peeling early, and it's mostly undeserved — most of the damage I see on returned bags comes from storage, not the material itself." },
      { type: "heading", text: "The biggest mistake: stuffing it away empty" },
      { type: "paragraph", text: "An empty bag left flat or folded for months develops creases that turn into cracks. Stuff it loosely with tissue paper or an old t-shirt before it goes on a shelf, so it holds its shape instead of collapsing on itself." },
      { type: "paragraph", text: "Heat is the other silent killer — a bag left in a hot car or near direct sunlight for hours will soften and warp in ways that don't reverse. Treat it the way you'd treat anything with a coating: keep it out of direct heat and it'll keep its structure for years." },
      { type: "heading", text: "The five-minute monthly routine" },
      { type: "paragraph", text: "Wipe it down with a barely damp cloth, let it air dry away from direct sun, then go over it with a dry microfiber cloth to bring back the sheen. That's genuinely it — no oils, no leather conditioner, none of the products made for actual animal hide. Vegan leather doesn't need feeding, it needs to be kept clean and out of the heat." },
    ],
  },
  {
    slug: "a-morning-in-balogun-market",
    title: "A Morning in Balogun Market, Looking for Fabric",
    excerpt:
      "Notes from a sourcing trip that started at 7am and ended with three metres of linen I didn't plan on buying — and why the detours are usually the point.",
    category: "Lagos Life",
    coverImage: "orisirisi-blog-market",
    author: taiwo,
    publishedAt: "2026-02-11",
    readingTime: 7,
    tags: ["lagos", "sourcing", "behind the scenes"],
    content: [
      { type: "paragraph", text: "I go to Balogun with a list and I never come back with only the things on it. This trip the list said thread and buttons. I came back with those, plus three metres of a sand-colored linen I have no immediate plan for, because the vendor unrolled it while I was mid-sentence about something else and that was that." },
      { type: "heading", text: "Why I still go in person" },
      { type: "paragraph", text: "Fabric doesn't photograph honestly. Weight, drape, the way light sits on a weave — none of it survives a phone camera the way it survives a hand running across it. I could source over WhatsApp and save half a day, and sometimes I do for repeat orders, but for anything new I have to be standing there." },
      { type: "paragraph", text: "There's also the conversation that happens while you're standing there, which doesn't happen over a screen. A vendor mentioning a new supplier, a tailor two stalls down who does something I hadn't thought to ask for — that's how half the accessories line started, honestly. Someone pointed at something and said 'you should look at this.'" },
      { type: "quote", text: "Fabric doesn't photograph honestly — you have to be standing there." },
      { type: "heading", text: "The unplanned linen, for the record" },
      { type: "paragraph", text: "It's becoming the wrap top that'll be in the shop by the time this posts. So the detour was, in fact, the point." },
    ],
  },
  {
    slug: "the-honest-case-for-fewer-better-things",
    title: "The Honest Case for Fewer, Better Things",
    excerpt:
      "Not a minimalism essay — a practical one, about the actual math of buying one good basket instead of three flimsy ones, and why 'curated' shouldn't just mean 'expensive.'",
    category: "Behind the Brand",
    coverImage: "orisirisi-blog-fewer-better",
    author: taiwo,
    publishedAt: "2026-01-22",
    readingTime: 5,
    tags: ["brand story", "sustainability"],
    content: [
      { type: "paragraph", text: "This isn't a minimalism essay — I have opinions about minimalism essays and most of them aren't kind. This is closer to a practical argument, the kind you'd make with a calculator rather than a mood board." },
      { type: "heading", text: "The actual math" },
      { type: "paragraph", text: "A flimsy storage basket that falls apart in eight months and costs a third of the price isn't cheaper if you replace it three times in two years. It's more expensive, and you've also thrown out three baskets. The well-made version that costs more up front and lasts five years wins on both the money and the waste, every time I've actually sat down and done the sums." },
      { type: "paragraph", text: "'Curated' gets used as a synonym for 'expensive' a lot, and I don't love that. What I mean by it is closer to: someone already did the failing-badly part for you, by testing things and rejecting the ones that don't hold up. That's worth paying a bit more for. It isn't the same thing as paying more for a logo." },
      { type: "heading", text: "What this means for how Orísirísi buys" },
      { type: "paragraph", text: "It means the shop will always be smaller than it could be. There are entire categories of things I don't carry because I haven't found a version I'd trust yet, and I'd rather leave a gap on the site than fill it with something that fails the three-question test from a few weeks ago." },
    ],
  },
];

export function getFeaturedPost() {
  return blogPosts.find((p) => p.featured) ?? blogPosts[0];
}

export function getBlogPosts() {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aScore = a.category === post.category ? 1 : 0;
      const bScore = b.category === post.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function estimateReadingTime(post: BlogPost) {
  const words = post.content.reduce((sum, block) => sum + block.text.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
}
