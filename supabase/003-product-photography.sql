-- Run this in Supabase → SQL Editor → New query. Safe to re-run.
--
-- Part 1: defensively re-applies the profiles RLS recursion fix, in case the
-- version of schema.sql you originally ran predates it.
--
-- Part 2: adds real product photography support — an `images` column
-- (array of Storage URLs) on `products`, plus a public storage bucket with
-- RLS so only signed-in staff/admins can upload.

-- ---------------------------------------------------------------------------
-- Part 1: RLS recursion fix (safe no-op if already applied)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin_or_staff(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role in ('admin', 'staff')
  );
$$;

drop policy if exists "profiles: admin reads all" on public.profiles;
create policy "profiles: admin reads all" on public.profiles
  for select using (public.is_admin_or_staff(auth.uid()));

drop policy if exists "products: staff full access" on public.products;
create policy "products: staff full access" on public.products
  for all using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

drop policy if exists "orders: staff full access" on public.orders;
create policy "orders: staff full access" on public.orders
  for all using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

drop policy if exists "order_items: staff full access" on public.order_items;
create policy "order_items: staff full access" on public.order_items
  for all using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- Part 2: product photography
-- ---------------------------------------------------------------------------

-- Real photo URLs, in display order. images[0] is the primary/thumbnail shot.
-- The legacy `image` text column stays put as a fallback seed for the
-- placeholder generator, used only until a product has real photos.
alter table public.products
  add column if not exists images text[] not null default '{}';

-- Public bucket: anyone can view product photos (needed for the storefront),
-- but only signed-in staff/admins can upload, replace, or delete them.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product-images: public read" on storage.objects;
create policy "product-images: public read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product-images: staff upload" on storage.objects;
create policy "product-images: staff upload" on storage.objects
  for insert with check (
    bucket_id = 'product-images' and public.is_admin_or_staff(auth.uid())
  );

drop policy if exists "product-images: staff update" on storage.objects;
create policy "product-images: staff update" on storage.objects
  for update using (
    bucket_id = 'product-images' and public.is_admin_or_staff(auth.uid())
  );

drop policy if exists "product-images: staff delete" on storage.objects;
create policy "product-images: staff delete" on storage.objects
  for delete using (
    bucket_id = 'product-images' and public.is_admin_or_staff(auth.uid())
  );
