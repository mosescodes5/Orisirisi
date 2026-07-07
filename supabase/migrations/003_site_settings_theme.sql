-- Run this once in the Supabase SQL Editor.
-- Adds a small key/value settings table and seeds it with the default brand
-- theme (Sunset Ember, the original orange) so the admin "Brand Theme" page
-- has something to read on first load. Safe to re-run.

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- The storefront (root layout) reads the theme on every page load for
-- every visitor, so reads must be public.
drop policy if exists "site_settings: public reads" on public.site_settings;
create policy "site_settings: public reads" on public.site_settings
  for select using (true);

-- Only admins/staff can change it, from the admin dashboard.
drop policy if exists "site_settings: staff full access" on public.site_settings;
create policy "site_settings: staff full access" on public.site_settings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
  );

insert into public.site_settings (key, value)
values ('theme_palette_id', 'sunset-ember')
on conflict (key) do nothing;
