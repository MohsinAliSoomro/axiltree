alter table if exists public.profiles
  add column if not exists link_height integer not null default 56,
  add column if not exists link_border_radius integer not null default 50,
  add column if not exists link_font_size integer not null default 16,
  add column if not exists link_font_weight integer not null default 500,
  add column if not exists link_horizontal_padding integer not null default 20,
  add column if not exists link_color text not null default '',
  add column if not exists link_border_width integer not null default 0,
  add column if not exists link_border_color text not null default 'transparent',
  add column if not exists link_shadow boolean not null default false;

alter table if exists public.profiles
  drop constraint if exists profiles_link_height_check;

alter table if exists public.profiles
  add constraint profiles_link_height_check
  check (link_height between 36 and 96);

alter table if exists public.profiles
  drop constraint if exists profiles_link_border_radius_check;

alter table if exists public.profiles
  add constraint profiles_link_border_radius_check
  check (link_border_radius between 0 and 60);

alter table if exists public.profiles
  drop constraint if exists profiles_link_font_size_check;

alter table if exists public.profiles
  add constraint profiles_link_font_size_check
  check (link_font_size between 12 and 24);

alter table if exists public.profiles
  drop constraint if exists profiles_link_font_weight_check;

alter table if exists public.profiles
  add constraint profiles_link_font_weight_check
  check (link_font_weight between 400 and 800);

alter table if exists public.profiles
  drop constraint if exists profiles_link_horizontal_padding_check;

alter table if exists public.profiles
  add constraint profiles_link_horizontal_padding_check
  check (link_horizontal_padding between 8 and 36);

alter table if exists public.profiles
  drop constraint if exists profiles_link_border_width_check;

alter table if exists public.profiles
  add constraint profiles_link_border_width_check
  check (link_border_width between 0 and 6);
