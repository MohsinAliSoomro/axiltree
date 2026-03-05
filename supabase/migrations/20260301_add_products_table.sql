-- Products table for commerce-style links and bulk imports

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  price numeric(10, 2),
  image_url text,
  buy_url text not null,
  is_active boolean not null default true,
  position integer not null default 0,
  publish_at timestamptz,
  expire_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_publish_before_expire
    check (expire_at is null or publish_at is null or expire_at > publish_at)
);

create index if not exists idx_products_profile_id on public.products(profile_id);
create index if not exists idx_products_profile_position on public.products(profile_id, position);

alter table public.products enable row level security;

drop policy if exists "Users can view own products" on public.products;
create policy "Users can view own products"
  on public.products
  for select
  using (auth.uid() = profile_id);

drop policy if exists "Users can insert own products" on public.products;
create policy "Users can insert own products"
  on public.products
  for insert
  with check (auth.uid() = profile_id);

drop policy if exists "Users can update own products" on public.products;
create policy "Users can update own products"
  on public.products
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

drop policy if exists "Users can delete own products" on public.products;
create policy "Users can delete own products"
  on public.products
  for delete
  using (auth.uid() = profile_id);
