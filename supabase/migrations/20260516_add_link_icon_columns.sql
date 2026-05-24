alter table if exists public.links
  add column if not exists left_icon_name text null,
  add column if not exists right_icon_name text null;
