-- Fix: "infinite recursion detected in policy for relation profiles" (42P17).
--
-- The profiles SELECT policy looked the caller's role up with
--   exists (select 1 from public.profiles p where p.id = auth.uid() ...)
-- inside its own USING clause. Postgres re-applies the same policy to that
-- subquery, detects the recursion and aborts the statement, so every read of
-- profiles returned HTTP 500. That made /admin redirect to /account even for
-- super_admins (the layout could not read the role) and broke every policy that
-- joins profiles, such as the product and order policies.
--
-- Fix: resolve the role through a SECURITY DEFINER helper. It reads profiles
-- with the owner's privileges, so it does not re-enter row level security.
--
-- Safe to re-run.

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

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (
    auth.uid() = id
    or public.current_profile_role() in ('employee', 'super_admin')
  );
