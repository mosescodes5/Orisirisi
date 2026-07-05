# Orísirísi Blog Studio

This is Taiwo's content-editing UI for the blog — a separate small app from
the main storefront, so it has its own `package.json` and doesn't affect the
Next.js app's build or dependencies at all. It talks to the same Sanity
project the storefront reads from.

## One-time setup

**1. Do you already have a Sanity project?**
Check `NEXT_PUBLIC_SANITY_PROJECT_ID` in the main app's `.env.local` / Vercel
env vars. If it's already set, skip to step 3 and just reuse that ID.

If not, create one:
```
npx sanity@latest init
```
This asks you to log in (free account) and creates a new project + dataset
(call the dataset `production`). Note the **Project ID** it gives you.

**2. Add the Project ID to the storefront**
In the main app's `.env.local` (and Vercel env vars):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<the id from step 1>
NEXT_PUBLIC_SANITY_DATASET=production
```
(`SANITY_API_READ_TOKEN` can stay blank — it's only needed for a private
dataset or draft previews. A public dataset serving published posts works
without it.)

**3. Set up this Studio locally**
```
cd studio
npm install
cp .env.local.example .env.local
# fill in SANITY_STUDIO_PROJECT_ID with the same project ID
npm run dev
```
Opens at `http://localhost:3333`. You should see **Blog Post** and **Author**
in the sidebar.

**4. Create an Author document first**
Add one for Taiwo (name, role, avatar photo, bio) — every post references an
author, so this needs to exist before you can publish a post.

**5. Deploy the Studio so Taiwo can use it without your laptop running**
```
npm run deploy
```
Pick a studio hostname (e.g. `orisirisi`) — it'll be hosted free at
`https://orisirisi.sanity.studio`. Bookmark that for day-to-day editing.

## Writing a post

- **Category** is a fixed dropdown matching the storefront's filter pills
  (`Style Guides`, `Behind the Brand`, `Care & Maintenance`, `Lagos Life`).
  Adding a new option to that list in `schemaTypes/post.ts` requires a code
  change and redeploying the Studio — the storefront itself doesn't need
  touching, since its category filter is generated live from whatever's
  actually in use.
- **Featured** — only mark one post featured at a time. If more than one is
  marked, the storefront just shows the most recently published one.
- **Cover image** is required; posts without one would fall back to a
  placeholder on the storefront, which isn't a great look.
- Content supports headings, quotes, bold/italic, links, bullet lists, and
  inline images — it's the same rich editor as any modern blog CMS.

## Notes

- This Studio is intentionally not embedded inside the Next.js app. Keeping
  it separate avoids version conflicts between Sanity's Studio dependencies
  and the storefront's, and means redeploying one never risks breaking the
  other.
- The storefront only ever reads published content (drafts are explicitly
  excluded in `src/lib/blog.ts`'s queries), so unpublished drafts here are
  safe to leave in progress without showing up live.
