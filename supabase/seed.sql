-- Licomanagement Site: seed data.
--
-- Run after `schema.sql` and the files in `supabase/migrations/` (Supabase CLI
-- picks this file up automatically on `supabase db reset`). It can also be pasted
-- into the Dashboard -> SQL Editor.
--
-- Creates the first super_admin login used for /admin:
--   email: admin@licomanagement.com
--
-- The password is deliberately NOT stored in this file (the repository is public).
-- Set it for the current SQL session first, then run the rest of the file:
--   select set_config('lico.seed_admin_password', 'your-strong-password', false);
--
-- Re-running is safe: the auth user, its email identity, and the profile row are
-- created once, then the password/role are re-applied from that setting.
--
-- Supabase Auth stores bcrypt hashes, so the password is inserted through
-- crypt()/gen_salt() rather than in plain text.

create extension if not exists pgcrypto;

do $$
declare
  admin_email text := 'admin@licomanagement.com';
  admin_id uuid := '9b2f4c3a-6d1e-4f57-8a0b-1c2d3e4f5a60';
  admin_password text := nullif(current_setting('lico.seed_admin_password', true), '');
begin
  if admin_password is null or length(admin_password) < 8 then
    raise exception
      'Set the seed password first: select set_config(''lico.seed_admin_password'', ''<strong-password>'', false);';
  end if;

  -- 1. The auth user that /login signs in with.
  if not exists (select 1 from auth.users where email = admin_email) then
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change,
      email_change_token_new
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      admin_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Licomanagement Admin"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  else
    update auth.users
       set encrypted_password = crypt(admin_password, gen_salt('bf')),
           email_confirmed_at = coalesce(email_confirmed_at, now()),
           updated_at = now()
     where email = admin_email
    returning id into admin_id;
  end if;

  -- 2. The email identity GoTrue requires for email/password sign-in.
  if not exists (
    select 1 from auth.identities
     where user_id = admin_id and provider = 'email'
  ) then
    insert into auth.identities (
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    )
    values (
      admin_id,
      admin_id::text,
      format(
        '{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}',
        admin_id,
        admin_email
      )::jsonb,
      'email',
      now(),
      now(),
      now()
    );
  end if;

  -- 3. The profile with full access. The on_auth_user_created trigger may have
  --    already inserted this row as 'customer', so upsert the role instead.
  insert into public.profiles (id, email, full_name, role)
  values (admin_id, admin_email, 'Licomanagement Admin', 'super_admin')
  on conflict (id) do update
    set email = excluded.email,
        role = 'super_admin';

  update public.profiles
     set full_name = 'Licomanagement Admin'
   where id = admin_id
     and full_name is null;
end $$;
