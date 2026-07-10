-- Run this once in the Supabase SQL Editor.
-- Replaces the Sanity CMS blog plan with an admin-managed blog: posts live
-- in this table and are written/edited from /admin/blog.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  category text not null default '',
  cover_image text not null default '',
  author_name text not null default 'Taiwo',
  author_role text not null default 'Founder, Orísirísi',
  author_avatar text not null default '',
  author_bio text not null default '',
  -- Array of { type: "paragraph" | "heading" | "quote", text: string }
  content jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  reading_time integer not null default 1,
  featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts: public reads published" on public.blog_posts;
create policy "blog_posts: public reads published" on public.blog_posts
  for select using (is_published = true);

drop policy if exists "blog_posts: staff full access" on public.blog_posts;
create policy "blog_posts: staff full access" on public.blog_posts
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
  );
