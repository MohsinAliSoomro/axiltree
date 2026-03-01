-- Smart Link Scheduling for links
-- Adds optional publish and expiry windows to each link.

alter table if exists public.links
  add column if not exists publish_at timestamptz null,
  add column if not exists expire_at timestamptz null;

alter table if exists public.links
  drop constraint if exists links_schedule_window_check;

alter table if exists public.links
  add constraint links_schedule_window_check
  check (
    expire_at is null
    or publish_at is null
    or expire_at > publish_at
  );

create index if not exists links_profile_schedule_idx
  on public.links (profile_id, is_active, publish_at, expire_at, position);
