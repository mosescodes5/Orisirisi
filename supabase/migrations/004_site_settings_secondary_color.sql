-- Run this once in the Supabase SQL Editor.
-- Upgrades the brand theme setting from a single palette id to two
-- independently controllable colors: primary (--color-orisirisi) and
-- secondary (--color-ink). Safe to re-run.

insert into public.site_settings (key, value)
values
  ('theme_primary', '#EF430B'),
  ('theme_secondary', '#000000')
on conflict (key) do nothing;

-- If a previous version of the theme picker already saved a palette choice,
-- carry its accent color forward into theme_primary so nothing resets.
update public.site_settings
set value = case
  (select value from public.site_settings where key = 'theme_palette_id')
  when 'sunset-ember' then '#EF430B'
  when 'terracotta-clay' then '#C1502F'
  when 'amber-gold' then '#C6892E'
  when 'emerald-noir' then '#1F6F54'
  when 'royal-amethyst' then '#6B3FA0'
  when 'rose-blush' then '#C2456B'
  when 'deep-sapphire' then '#2C4E7C'
  when 'espresso-bronze' then '#8C5A34'
  else value
end
where key = 'theme_primary'
  and exists (select 1 from public.site_settings where key = 'theme_palette_id');

-- theme_palette_id itself is no longer read by the app; safe to leave in
-- place (harmless) or delete it — uncomment to remove it:
-- delete from public.site_settings where key = 'theme_palette_id';
