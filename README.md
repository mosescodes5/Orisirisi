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
- `/categories` — full category directory (all categories, previews, item counts)
- `/category/[slug]` — category listing with filters, sort, grid/list view
  (`household`, `jewelry`, `clothing`, `other`)
- `/product/[slug]` — product detail page (gallery, size/quantity, add to bag,
  wishlist, delivery/returns accordion, related products)
- `/cart` — real cart (persisted to `localStorage`), quantity controls, empty state
- `/checkout` — shipping form + Paystack payment
- `/checkout/success` — order confirmation, reads the completed order from
  `sessionStorage`
- `/search` — client-side search over the product catalog
- `/admin` — staff dashboard: products (CRUD) + orders (view/update status),
  gated behind real Supabase Auth with role-based access (see below)

## Admin dashboard setup

The admin dashboard (`/admin`) is backed by Supabase for both auth and data —
it's the first part of this project with a real backend and real
authentication (previously everything read from the mock `src/lib/data.ts`).

1. **Create/open your Supabase project**, then in the SQL Editor run the
   entire contents of [`supabase/schema.sql`](./supabase/schema.sql). It creates:
   - `profiles` — extends `auth.users` with a `role` (`customer` | `staff` | `admin`);
     a trigger auto-creates a `customer` profile on signup.
   - `products` — the admin-manageable catalog (separate from `src/lib/data.ts`
     for now — see note below).
   - `orders` / `order_items` — order records the admin can view and update.
   - Row Level Security policies so only `admin`/`staff` roles can write, and
     only published products are publicly readable.

2. **Add the Supabase keys** to `.env.local` (already stubbed in
   `.env.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
   Find these under Supabase → Project Settings → API. **Never** expose the
   service role key with a `NEXT_PUBLIC_` prefix — it's server-only and used
   in `src/lib/admin/actions.ts` to bypass RLS for verified admin writes.

3. **Create your admin account**: go to `/admin/login` and — since there's no
   public sign-up form by design — instead create the user directly in
   Supabase → Authentication → Users → "Add user" (set an email + password).
   Signing up auto-creates a `profiles` row with `role = 'customer'`; promote
   it to admin in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@orisirisiwithtaiwo.com';
   ```

4. Sign in at `/admin/login`. Routes under `/admin/*` are protected by
   `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`), which
   checks the Supabase session and the `profiles.role` on every request.

**Note on data sources:** the storefront and admin dashboard now share the
same Supabase `products` table — products created, edited, or unpublished in
`/admin/products` show up (or disappear) on the storefront immediately, no
rebuild needed. `src/lib/data.ts` still holds category definitions
(household/jewelry/clothing/accessories) and blog content as static/mock
data — only the product catalog moved to Supabase. Category item counts on
the homepage and `/categories` are still the original static numbers rather
than live counts; a small follow-up if you want those to reflect real stock.

Storefront product reads go through `src/lib/products.ts` (server-only,
public/anon Supabase client, no user session needed) for Server Components,
and `src/lib/products-client.ts` (browser client) for the couple of
Client Components that need product data — `/search` and `/wishlist`, both
of which now show a brief loading state while they fetch. If Supabase is
unreachable, these fail gracefully to an empty list rather than crashing the
page or the build.

**Remember to run `supabase/seed.sql`** after `schema.sql` if you want the
original 12-item mock catalog to appear in Supabase — otherwise the shop
starts empty until you add products in `/admin/products`.

**Already have products in Supabase from before the category taxonomy
changed to Jewelry / Wristwatch / Household / Fresh Juice?** Run
[`supabase/migrations/002_update_category_taxonomy.sql`](./supabase/migrations/002_update_category_taxonomy.sql)
once in the SQL Editor — it folds any existing Clothing/Accessories products
into Household and updates the constraint so `/admin` only accepts the new
categories going forward.

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

## Email setup

All transactional email (order confirmations, contact form, newsletter
signup) goes through the single `sendEmail()` function in `src/lib/email.ts`
— every API route reads through it, so it's the only file that needs to
change if the provider changes again.

It sends via **Resend** first, and automatically falls back to **Gmail
SMTP** if Resend isn't configured or a send fails — so you can run one or
both.

1. **Resend**: create an API key at
   [resend.com/api-keys](https://resend.com/api-keys), then verify your
   sending domain under Domains → Add Domain (until it's verified, Resend
   will only deliver to the email address on your own Resend account — fine
   for testing, not for real customers). Add to `.env.local`:
   ```
   RESEND_API_KEY=
   RESEND_FROM_EMAIL="Orísirísi with Taiwo <hello@orisirisiwithtaiwo.com>"
   ```
2. **Gmail SMTP (fallback)**: turn on 2-Step Verification on the Google
   account, then create an App Password at
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   — the regular account password won't work here. Add:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=
   SMTP_PASSWORD=
   ```
3. Add the same keys in Vercel → Project → Settings → Environment Variables
   before deploying, or production email will silently no-op (every route
   checks `isEmailConfigured()` first and skips sending rather than failing
   the request).

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

Product/category/blog photos are now real, curated stock photos (Unsplash,
free-to-use license) mapped from the same seed strings already stored on
products/categories/blog posts — see `CURATED_IMAGES` in
`src/lib/data.ts`, which `placeholderImage()` checks before falling back to
picsum.photos for any unmapped seed. These are close thematic matches, not
actual photography of your specific pieces — replace them with real product
photography (and the founder/author photo, which is intentionally a
hands-only shot rather than a stranger's face) before launch. Swapping in
real photos just means changing the URLs in `CURATED_IMAGES` or the
`image` column in Supabase — no component changes needed.
