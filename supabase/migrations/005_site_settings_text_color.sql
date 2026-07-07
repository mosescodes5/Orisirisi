-- Run this once in the Supabase SQL Editor.
-- Brand theme is now three independently controllable colors:
--   theme_primary   -> --color-orisirisi (buttons' hover, links, badges)
--   theme_secondary -> --color-secondary (solid buttons, dark panels, active states)
--   theme_text      -> --color-ink       (headings, body copy, muted gray text, borders)
-- Safe to re-run.

insert into public.site_settings (key, value)
values
  ('theme_primary', '#EF430B'),
  ('theme_secondary', '#000000'),
  ('theme_text', '#000000')
on conflict (key) do nothing;

-- If an earlier version of the picker only had theme_primary/theme_secondary
-- saved, theme_text simply defaults to black above — nothing else to migrate.
