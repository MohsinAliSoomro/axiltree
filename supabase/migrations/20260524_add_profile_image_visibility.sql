alter table if exists public.profiles
  add column if not exists avatar_size integer not null default 80,
  add column if not exists avatar_alignment text not null default 'center',
  add column if not exists avatar_shape text not null default 'circle',
  add column if not exists profile_background_shape text not null default 'circle',
  add column if not exists is_profile_image_show boolean not null default true;

alter table if exists public.profiles
  drop constraint if exists profiles_avatar_alignment_check;

alter table if exists public.profiles
  add constraint profiles_avatar_alignment_check
  check (avatar_alignment in ('left', 'center', 'right'));

alter table if exists public.profiles
  drop constraint if exists profiles_avatar_size_check;

alter table if exists public.profiles
  add constraint profiles_avatar_size_check
  check (avatar_size in (56, 80, 112));

alter table if exists public.profiles
  drop constraint if exists profiles_avatar_shape_check;

alter table if exists public.profiles
  add constraint profiles_avatar_shape_check
  check (avatar_shape in (
    'circle',
    'rounded',
    'diamond',
    'hexagon',
    'star',
    'heart',
    'teardrop',
    'blob-one',
    'blob-two',
    'octagon'
  ));

alter table if exists public.profiles
  drop constraint if exists profiles_profile_background_shape_check;

alter table if exists public.profiles
  add constraint profiles_profile_background_shape_check
  check (profile_background_shape in (
    'circle',
    'rounded',
    'diamond',
    'hexagon',
    'star',
    'heart',
    'teardrop',
    'blob-one',
    'blob-two',
    'octagon'
  ));
