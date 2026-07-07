-- Run this once in the Supabase SQL Editor.
-- Customer accounts (sign up / sign in) were wired up in the UI, but two
-- RLS policies were missing, which silently broke pieces of the flow:
--   1. Customers couldn't save their own name on sign-up (no UPDATE policy
--      on profiles), so the profiles.update() call in signUpCustomer() did
--      nothing.
--   2. Customers couldn't see their own past orders on /account (only
--      staff had a read policy on orders/order_items), so Order History
--      would always show empty even after a successful purchase.
-- Safe to re-run.

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "orders: customer reads own" on public.orders;
create policy "orders: customer reads own" on public.orders
  for select using (customer_email = (auth.jwt() ->> 'email'));

drop policy if exists "order_items: customer reads own" on public.order_items;
create policy "order_items: customer reads own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.customer_email = (auth.jwt() ->> 'email')
    )
  );
