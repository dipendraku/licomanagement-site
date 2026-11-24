-- Admin console: editable site/app settings + user role management.
--
-- site_settings is a small key/value store that /admin/settings writes to and the
-- server reads back (SMTP, payment gateways, WhatsApp). It is readable and writable
-- by super_admins only - never expose it to the browser bundle.
--
-- Safe to re-run.

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Same helper as migration 003 (idempotent) so this file also works on its own.
create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.current_profile_role() from public;
grant execute on function public.current_profile_role() to anon, authenticated, service_role;

drop policy if exists "site_settings_super_admin" on public.site_settings;
create policy "site_settings_super_admin" on public.site_settings
  for all using (public.current_profile_role() = 'super_admin')
  with check (public.current_profile_role() = 'super_admin');

-- super_admins can change any profile (role changes from /admin/users).
drop policy if exists "profiles_update_super_admin" on public.profiles;
create policy "profiles_update_super_admin" on public.profiles
  for update using (public.current_profile_role() = 'super_admin')
  with check (public.current_profile_role() = 'super_admin');
