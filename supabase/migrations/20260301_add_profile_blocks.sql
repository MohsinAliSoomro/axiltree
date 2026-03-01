-- Content blocks beyond links
-- Adds profile_blocks table to support text, video, music, and gallery blocks.

create table if not exists public.profile_blocks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('text', 'video', 'music', 'gallery')),
  title text null,
  content_json jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_active boolean not null default true,
  publish_at timestamptz null,
  expire_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.profile_blocks
  add column if not exists publish_at timestamptz null,
  add column if not exists expire_at timestamptz null;

alter table if exists public.profile_blocks
  drop constraint if exists profile_blocks_schedule_window_check;

alter table if exists public.profile_blocks
  add constraint profile_blocks_schedule_window_check
  check (
    expire_at is null
    or publish_at is null
    or expire_at > publish_at
  );

create index if not exists profile_blocks_profile_position_idx
  on public.profile_blocks (profile_id, position);

create index if not exists profile_blocks_profile_active_idx
  on public.profile_blocks (profile_id, is_active);

create index if not exists profile_blocks_schedule_idx
  on public.profile_blocks (profile_id, is_active, publish_at, expire_at, position);

alter table public.profile_blocks enable row level security;

drop policy if exists profile_blocks_owner_all on public.profile_blocks;
create policy profile_blocks_owner_all
  on public.profile_blocks
  for all
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

drop policy if exists profile_blocks_public_select on public.profile_blocks;
create policy profile_blocks_public_select
  on public.profile_blocks
  for select
  to anon, authenticated
  using (is_active = true);
