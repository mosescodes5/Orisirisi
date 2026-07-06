-- Run this once in the Supabase SQL Editor if you already ran schema.sql
-- and seed.sql before the category taxonomy changed. Safe to run even if
-- you have zero products yet, or products beyond the original mock catalog
-- (the UPDATE only touches rows that still say 'Clothing' or 'Accessories').
--
-- New taxonomy: Jewelry, Wristwatch, Household, Fresh Juice
-- (previously:  Household, Jewelry, Clothing, Accessories)

-- 1. Fold any existing Clothing/Accessories products into Household so
--    nothing disappears from the storefront.
update public.products
set category = 'Household'
where category in ('Clothing', 'Accessories');

-- 2. Replace the CHECK constraint so the old values can no longer be saved
--    (from /admin or anywhere else). The constraint name below is Postgres's
--    default auto-generated name for an inline CHECK on the `category`
--    column — if this errors with "constraint does not exist", open
--    Database → Tables → products → the "..." menu → view constraints in
--    the Supabase dashboard to find the actual name and swap it in below.
alter table public.products drop constraint if exists products_category_check;
alter table public.products
  add constraint products_category_check
  check (category in ('Household', 'Jewelry', 'Wristwatch', 'Fresh Juice'));
