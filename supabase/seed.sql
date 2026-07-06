-- Seeds the products table with the original mock catalog from src/lib/data.ts.
-- Run this once in the Supabase SQL editor, AFTER schema.sql.
-- Safe to re-run: uses ON CONFLICT (slug) DO NOTHING.

insert into public.products
  (slug, name, category, subcategory, price, compare_at_price, image, description, is_new, is_published, stock)
values
  ('woven-storage-basket-set', 'Woven Storage Basket Set (3pc)', 'Household', 'Storage', 24500, null, 'orisirisi-p1', 'Hand-woven baskets in three nesting sizes — sisal and seagrass blend, sturdy enough for daily use.', true, true, 20),
  ('layered-gold-plated-necklace', 'Layered Gold-Plated Necklace', 'Jewelry', 'Necklaces', 18000, 23000, 'orisirisi-p2', 'Three-tier chain in warm gold plate — wear alone or stack with your own pieces.', false, true, 20),
  ('linen-wrap-top-sand', 'Linen Wrap Top — Sand', 'Household', 'Tops', 15200, null, 'orisirisi-p3', 'Breathable linen wrap top, true to size, hand-wash recommended.', true, true, 20),
  ('ceramic-table-lamp-ivory', 'Ceramic Table Lamp — Ivory', 'Household', 'Lighting', 32000, null, 'orisirisi-p4', 'Hand-glazed ceramic base with a natural linen shade, warm-white bulb included.', false, true, 20),
  ('beaded-drop-earrings', 'Beaded Drop Earrings', 'Jewelry', 'Earrings', 9800, null, 'orisirisi-p5', 'Hand-strung glass beads on gold-tone hooks — lightweight for all-day wear.', true, true, 20),
  ('structured-tote-bag-tan', 'Structured Tote Bag — Tan', 'Household', 'Bags', 27500, null, 'orisirisi-p6', 'Vegan leather tote with a structured base, fits a 13-inch laptop.', false, true, 20),
  ('scented-soy-candle-set', 'Scented Soy Candle Set', 'Household', 'Décor', 13000, null, 'orisirisi-p7', 'Set of two hand-poured soy candles — sandalwood and citrus grove.', false, true, 20),
  ('silk-hair-scarf-rust', 'Silk Hair Scarf — Rust', 'Household', 'Hair', 7200, null, 'orisirisi-p8', '100% mulberry silk scarf, hand-rolled edges, one size.', true, true, 20),
  ('statement-hoop-earrings', 'Statement Hoop Earrings', 'Jewelry', 'Earrings', 11500, null, 'orisirisi-j3', 'Bold twisted hoops in a brushed-gold finish, lightweight for all-day wear.', true, true, 20),
  ('pearl-cluster-ring', 'Pearl Cluster Ring', 'Jewelry', 'Rings', 8000, null, 'orisirisi-j4', 'Freshwater pearl cluster set on an adjustable band.', false, true, 20),
  ('beaded-waist-bangle-set', 'Beaded Waist Bangle Set', 'Jewelry', 'Bangles & Bracelets', 14200, 17000, 'orisirisi-j5', 'Set of 5 stackable bangles in mixed beadwork.', false, true, 20),
  ('fine-chain-anklet', 'Fine Chain Anklet', 'Jewelry', 'Bangles & Bracelets', 6500, null, 'orisirisi-j6', 'Delicate gold-plated anklet with a small charm detail.', true, true, 20)
on conflict (slug) do nothing;
