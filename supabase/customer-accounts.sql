-- Adds customer-facing access on top of schema.sql (which already ran).
-- Run this once in the Supabase SQL editor. Safe to re-run.

-- Customers can update their own profile (name, etc.) — read access already
-- exists from schema.sql's "profiles: read own" policy.
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Customers can read their own orders. Orders aren't linked to auth.users by
-- id (guest checkout is supported, so there isn't always an account at all)
-- — matched by email instead, which is required at checkout either way.
drop policy if exists "orders: customer reads own" on public.orders;
create policy "orders: customer reads own" on public.orders
  for select using (customer_email = (auth.jwt() ->> 'email'));

drop policy if exists "order_items: customer reads own" on public.order_items;
create policy "order_items: customer reads own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_email = (auth.jwt() ->> 'email')
    )
  );
