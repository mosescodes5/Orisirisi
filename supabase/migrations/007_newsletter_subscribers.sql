-- Run this once in the Supabase SQL Editor.
-- The newsletter signup form (Newsletter.tsx -> /api/newsletter) sent a
-- welcome email but never saved the subscriber anywhere — there was no
-- table to save it to. This adds one. Safe to re-run.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Only staff/admins can read the list (e.g. to export it for a campaign).
-- The signup route itself writes with the service-role key, which bypasses
-- RLS, so no public insert policy is needed.
drop policy if exists "newsletter_subscribers: staff reads" on public.newsletter_subscribers;
create policy "newsletter_subscribers: staff reads" on public.newsletter_subscribers
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'staff'))
  );
