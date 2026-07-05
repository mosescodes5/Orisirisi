-- Orísirísi admin schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- 1. Profiles (extends auth.users with a role for access control)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'staff', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SECURITY DEFINER: checks a user's role while bypassing RLS internally, so
-- policies that need "is this user admin/staff?" never have to subquery
-- `profiles` under RLS themselves (which causes Postgres to re-apply
-- profiles' own policies to that subquery — infinite recursion).
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

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: admin reads all" on public.profiles;
create policy "profiles: admin reads all" on public.profiles
  for select using (public.is_admin_or_staff(auth.uid()));

-- Auto-create a profile row (role defaults to 'customer') whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- IMPORTANT: after your admin account signs up once through Supabase Auth,
-- promote it manually, e.g.:
--   update public.profiles set role = 'admin' where email = 'you@orisirisiwithtaiwo.com';

-- ---------------------------------------------------------------------------
-- 2. Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('Household', 'Jewelry', 'Clothing', 'Accessories')),
  subcategory text not null default '',
  price integer not null check (price >= 0), -- stored in kobo/naira as a whole number, matching src/lib/data.ts
  compare_at_price integer,
  image text not null default '', -- legacy placeholder seed; used only as a fallback when `images` is empty
  images text[] not null default '{}', -- real photo URLs (Supabase Storage), display order, images[0] is primary
  description text not null default '',
  is_new boolean not null default false,
  is_published boolean not null default true,
  stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products: public reads published" on public.products;
create policy "products: public reads published" on public.products
  for select using (is_published = true);

drop policy if exists "products: staff full access" on public.products;
create policy "products: staff full access" on public.products
  for all using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Orders + order items
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique, -- Paystack transaction reference
  customer_email text not null,
  customer_name text not null,
  customer_phone text,
  shipping_address text,
  shipping_city text,
  shipping_state text,
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  ),
  placed_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders: staff full access" on public.orders;
create policy "orders: staff full access" on public.orders
  for all using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  image text,
  price integer not null,
  qty integer not null default 1,
  size text
);

alter table public.order_items enable row level security;

drop policy if exists "order_items: staff full access" on public.order_items;
create policy "order_items: staff full access" on public.order_items
  for all using (public.is_admin_or_staff(auth.uid()))
  with check (public.is_admin_or_staff(auth.uid()));

-- Helpful indexes
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_order_items_order_id on public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- 4. Product photography storage
-- ---------------------------------------------------------------------------
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
