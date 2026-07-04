# Orísirísi with Taiwo

Next.js storefront for Orísirísi — household items, jewelry, clothing & accessories.
Built with the same stack as the rynts project (Next.js 16 App Router, React 19,
TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons) but stripped of every
vendor/marketplace feature — this is a straightforward retail shop.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's here so far

- `/` — homepage (hero, categories, new-in shelf, trust strip, brand story, newsletter)
- `/category/[slug]` — category listing with filters, sort, grid/list view
  (`household`, `jewelry`, `clothing`, `other`)
- `/product/[slug]` — product detail page (gallery, size/quantity, add to bag,
  wishlist, delivery/returns accordion, related products)
- `/cart` — real cart (persisted to `localStorage`), quantity controls, empty state
- `/checkout` — shipping form + Paystack payment
- `/checkout/success` — order confirmation, reads the completed order from
  `sessionStorage`
- `/search` — client-side search over the product catalog

Not built yet: wishlist page, blog. Ask for either next and they'll follow the
same component patterns already in `src/components`.

## Deployment & infrastructure

This project is set up to deploy on **Vercel**, with **Hostinger** as the
domain registrar and **Supabase** + **Sanity** as backing services:

- **Vercel** — connect this repo (push it to GitHub first) and Vercel builds
  and deploys on every push. Add every variable from `.env.example` under
  Project Settings → Environment Variables.
- **Hostinger domain** — once deployed, add the domain in Vercel's Project →
  Domains, then point it at Vercel from Hostinger's DNS panel: an `A` record
  for the apex domain (`orisirisi.com`) to Vercel's IP, and a `CNAME` for
  `www` to `cname.vercel-dns.com`. Vercel shows the exact records to add once
  you type the domain in.
- **Supabase** — will replace `src/lib/data.ts` for products/categories and
  power orders + auth. Nothing is wired up yet; when ready, swap the
  functions in that file for Supabase queries — every component reads
  through them, so that's the only file that needs to change on the frontend
  side. It's also the natural home for the server-side Paystack verification
  route mentioned below.
- **Sanity** — will power the blog once that's built. Sanity Studio runs
  separately from this Next.js app (either embedded at `/studio` or as its
  own deployment); the storefront just fetches published content with
  `@sanity/client`.

## Paystack setup

1. Copy `.env.example` to `.env.local`
2. Add your Paystack **public** key (test key is fine for development):
   ```
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
   ```
3. That's it for the client-side flow — `src/components/checkout/CheckoutForm.tsx`
   loads the Paystack inline script and opens the payment popup.

**Before going live, add server-side verification.** Right now, a successful
payment is trusted purely on the client-side `callback`. For production you
need an API route (e.g. `src/app/api/verify-payment/route.ts`) that calls
Paystack's `GET /transaction/verify/:reference` with your **secret** key and
confirms the amount/status server-side before you treat the order as paid —
otherwise someone could fake a success callback. This also a good point to
persist orders to a real database instead of `sessionStorage`.

## Cart

`src/lib/cart-context.tsx` is a React Context + `localStorage` cart — no
backend required for the shopping flow to work end-to-end in development.
When you add a real backend, swap this for whatever cart/session model it
expects; every component reads through `useCart()`, so that's the only file
that needs to change.

## Brand kit

Colors and type are locked to `Orisirisi_with_Taiwo_Final.pdf`:

| Token | Value |
|---|---|
| `--color-ink` | `#000000` |
| `--color-paper` | `#FFFFFF` |
| `--color-mist` | `#ADADAD` |
| `--color-orisirisi` | `#EF430B` |

**Fonts:** Montserrat is loaded from Google Fonts. **Beautique Display** is
self-hosted from `public/fonts/beautique-display/` and loaded via
`next/font/local` in `src/app/layout.tsx` — it's the actual licensed brand
font, not a stand-in. Per the `License.pdf` that shipped with the font files,
don't redistribute those `.otf` files outside this codebase.

## Data layer

`src/lib/data.ts` currently holds mock products and categories. Swap the
functions in that file (`getProductsByCategory`, `getFeaturedProducts`, etc.)
for real queries once you've picked a backend — Supabase is a natural fit
since rynts already uses it, but nothing here assumes that choice.

## Images

Product/category photos are placeholders from picsum.photos. Replace the
`placeholderImage()` calls in `src/lib/data.ts` with real image URLs, and add
your image host to `remotePatterns` in `next.config.ts`.
