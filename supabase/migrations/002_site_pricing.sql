-- Site pricing, editable from /admin/pricing.
create table if not exists public.site_pricing (
  id text primary key,
  name text not null,
  tagline text,
  students text,
  price_npr integer not null default 0,
  price_usd integer not null default 0,
  discount_percent integer not null default 0 check (discount_percent between 0 and 90),
  promo_label text default '',
  active boolean not null default true,
  featured boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.site_pricing enable row level security;

-- Anyone may read the public price list; only admins/owners may change it.
drop policy if exists "site_pricing readable by all" on public.site_pricing;
create policy "site_pricing readable by all"
  on public.site_pricing for select
  using (true);

drop policy if exists "site_pricing writable by admins" on public.site_pricing;
create policy "site_pricing writable by admins"
  on public.site_pricing for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner', 'super_admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner', 'super_admin')
    )
  );

insert into public.site_pricing (id, name, tagline, students, price_npr, price_usd, featured)
values
  ('starter', 'Starter', 'Small schools finding their feet', 'up to 300 students', 45000, 349, false),
  ('growth', 'Growth', 'Most schools pick this', 'up to 1,200 students', 85000, 649, true),
  ('campus', 'Campus', 'Colleges & multi-branch groups', 'unlimited students', 150000, 1190, false)
on conflict (id) do nothing;
