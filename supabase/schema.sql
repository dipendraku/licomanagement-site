-- Licomanagement Site: Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / CREATE OR REPLACE / DROP ... IF EXISTS).

-- ---------------------------------------------------------------------------
-- profiles
--
-- Three roles:
--   customer    - default. Places requests/orders, sees only their own data.
--   employee    - staff. Can add/edit products, and view (read-only) customer orders.
--   super_admin - full access: products (incl. delete), orders (incl. status updates),
--                 and notification management/broadcast.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
-- Migrate any previously-seeded 'admin' rows (from before the 3-role model) to 'super_admin'.
update public.profiles set role = 'super_admin' where role = 'admin';
alter table public.profiles add constraint profiles_role_check check (role in ('customer', 'employee', 'super_admin'));

alter table public.profiles enable row level security;

-- Role lookup for RLS policies. SECURITY DEFINER so reading profiles inside a
-- profiles policy does not re-enter row level security (which Postgres rejects
-- with "infinite recursion detected in policy for relation profiles", 42P17).
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

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row (default role: customer) whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- To promote your own account to the full-access super_admin role after signing up, run:
--   update public.profiles set role = 'super_admin' where email = 'you@example.com';
-- To make someone staff (product/order access only, no notification broadcast), run:
--   update public.profiles set role = 'employee' where email = 'staff-member@example.com';
-- To bootstrap the first admin without signing up first, run supabase/seed.sql (it
-- creates admin@licomanagement.com as a confirmed super_admin, password in that file).

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  slug text not null,
  description text not null,
  price numeric(10, 2) not null,
  sku text not null,
  is_active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  unique (category, slug)
);

alter table public.products add column if not exists image_url text;

alter table public.products enable row level security;

drop policy if exists "products_select_active_or_admin" on public.products;
drop policy if exists "products_select_active_or_staff" on public.products;
create policy "products_select_active_or_staff" on public.products
  for select using (
    is_active
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('employee', 'super_admin'))
  );

-- Employees and super_admins can add and edit products.
drop policy if exists "products_write_admin" on public.products;
drop policy if exists "products_insert_staff" on public.products;
create policy "products_insert_staff" on public.products
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('employee', 'super_admin'))
  );

drop policy if exists "products_update_staff" on public.products;
create policy "products_update_staff" on public.products
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('employee', 'super_admin'))
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('employee', 'super_admin'))
  );

-- Employees and super_admins can delete products.
drop policy if exists "products_delete_super_admin" on public.products;
drop policy if exists "products_delete_staff" on public.products;
create policy "products_delete_staff" on public.products
  for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('employee', 'super_admin'))
  );

-- ---------------------------------------------------------------------------
-- orders  (product requests and "Direct Buy" order-requests; no live payment gateway)
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  type text not null check (type in ('request', 'buy')),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'confirmed', 'cancelled', 'completed')),
  full_name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Employees can see every customer's order (read-only); super_admins can see and update them.
drop policy if exists "orders_select_own_or_admin" on public.orders;
drop policy if exists "orders_select_own_or_staff" on public.orders;
create policy "orders_select_own_or_staff" on public.orders
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('employee', 'super_admin'))
  );

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

-- Only super_admins can change order/payment status; employees have read-only access (see select policy above).
drop policy if exists "orders_update_admin" on public.orders;
drop policy if exists "orders_update_super_admin" on public.orders;
create policy "orders_update_super_admin" on public.orders
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  role_target text check (role_target in ('admin', 'customer')),
  title text not null,
  body text not null,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- role_target = 'admin' notifications are for super_admins only (Notification Management is
-- not part of the employee role's access).
drop policy if exists "notifications_select_own_or_targeted" on public.notifications;
create policy "notifications_select_own_or_targeted" on public.notifications
  for select using (
    auth.uid() = user_id
    or (role_target = 'customer')
    or (role_target = 'admin' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'))
  );

drop policy if exists "notifications_update_own_or_admin" on public.notifications;
drop policy if exists "notifications_update_own_or_super_admin" on public.notifications;
create policy "notifications_update_own_or_super_admin" on public.notifications
  for update using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

drop policy if exists "notifications_insert_admin" on public.notifications;
drop policy if exists "notifications_insert_super_admin" on public.notifications;
create policy "notifications_insert_super_admin" on public.notifications
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

-- System-generated notification for admins whenever a new order comes in.
create or replace function public.handle_new_order()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  product_name text;
begin
  select name into product_name from public.products where id = new.product_id;

  insert into public.notifications (role_target, title, body, link)
  values (
    'admin',
    case when new.type = 'buy' then 'New purchase request' else 'New product request' end,
    coalesce(product_name, 'A product') || ' — from ' || new.full_name,
    '/admin/orders'
  );
  return new;
end;
$$;

drop trigger if exists on_order_created on public.orders;
create trigger on_order_created
  after insert on public.orders
  for each row execute function public.handle_new_order();

-- ---------------------------------------------------------------------------
-- Seed data: 6 sample products per Service We do category
-- ---------------------------------------------------------------------------
insert into public.products (category, name, slug, description, price, sku) values
  ('it-software-development', 'Fintech Starter Suite', 'fintech-starter-suite', 'A ready-to-launch fintech software package covering payments, lending workflows, and transaction security.', 2499.00, 'ITSD-001'),
  ('it-software-development', 'Educational LMS Platform', 'educational-lms-platform', 'A learning management platform with course delivery, grading, and student portal modules.', 3299.00, 'ITSD-002'),
  ('it-software-development', 'CRM Pro Package', 'crm-pro-package', 'A configurable CRM package for lead tracking, sales pipelines, and customer relationship workflows.', 1899.00, 'ITSD-003'),
  ('it-software-development', 'ERP Business Edition', 'erp-business-edition', 'An ERP package unifying finance, inventory, HR, and operations for growing businesses.', 4999.00, 'ITSD-004'),
  ('it-software-development', 'Workflow Automation Toolkit', 'workflow-automation-toolkit', 'A toolkit for automating repetitive business workflows across operations and finance.', 2199.00, 'ITSD-005'),
  ('it-software-development', 'Custom Software Consultation Package', 'custom-software-consultation', 'A scoped consultation engagement to plan a custom software build tailored to your business.', 999.00, 'ITSD-006'),

  ('smart-device', 'Smart Hub Controller', 'smart-hub-controller', 'A central hub for connecting and managing smart devices across your home or office.', 129.00, 'SD-001'),
  ('smart-device', 'Motion & Occupancy Sensor Kit (3-Pack)', 'motion-sensor-kit', 'Three motion and occupancy sensors for real-time presence detection.', 89.00, 'SD-002'),
  ('smart-device', 'Smart Door Lock', 'smart-door-lock', 'A keyless smart lock with centralized access control.', 159.00, 'SD-003'),
  ('smart-device', 'Smart Plug Bundle (4-Pack)', 'smart-plug-bundle', 'Four remote-controlled smart plugs with energy monitoring.', 69.00, 'SD-004'),
  ('smart-device', 'Voice Control Hub', 'voice-control-hub', 'A voice-enabled hub for hands-free device control.', 149.00, 'SD-005'),
  ('smart-device', 'Device Monitoring Subscription (Annual)', 'device-monitoring-subscription', 'A year of monitoring, firmware updates, and support for your connected devices.', 199.00, 'SD-006'),

  ('smart-light-solution', 'Smart Bulb Starter Kit (4-Pack)', 'smart-bulb-starter-kit', 'Four smart bulbs ready for scene and schedule automation.', 79.00, 'SLS-001'),
  ('smart-light-solution', 'Smart Dimmer Switch', 'smart-dimmer-switch', 'A wall-mounted smart dimmer switch with app and voice control.', 49.00, 'SLS-002'),
  ('smart-light-solution', 'Scene Controller Panel', 'scene-controller-panel', 'A physical panel for triggering custom lighting scenes.', 99.00, 'SLS-003'),
  ('smart-light-solution', 'Motion-Activated Light Sensor', 'motion-light-sensor', 'A sensor that automatically triggers lighting based on occupancy.', 39.00, 'SLS-004'),
  ('smart-light-solution', 'Outdoor Smart Light Kit', 'outdoor-smart-light-kit', 'Weather-resistant smart lighting for outdoor spaces.', 119.00, 'SLS-005'),
  ('smart-light-solution', 'Lighting Automation Subscription', 'lighting-automation-subscription', 'Ongoing scene, schedule, and energy-optimization management.', 149.00, 'SLS-006'),

  ('light-solution', 'Residential Lighting Design Package', 'residential-lighting-design', 'A full lighting design consultation for homes, covering layout and fixture selection.', 499.00, 'LS-001'),
  ('light-solution', 'Commercial Lighting Consultation', 'commercial-lighting-consultation', 'A lighting design consultation scoped for commercial and office spaces.', 899.00, 'LS-002'),
  ('light-solution', 'Fixture Installation Package (Per Room)', 'fixture-installation-package', 'Professional fixture installation for a single room.', 299.00, 'LS-003'),
  ('light-solution', 'Energy-Efficient Retrofit Kit', 'energy-retrofit-kit', 'A retrofit kit to upgrade existing lighting for efficiency.', 349.00, 'LS-004'),
  ('light-solution', 'Dimming Control Upgrade', 'dimming-control-upgrade', 'An upgrade package adding adaptive dimming controls.', 199.00, 'LS-005'),
  ('light-solution', 'Lighting Maintenance Plan (Annual)', 'lighting-maintenance-plan', 'A year of scheduled lighting maintenance and support.', 249.00, 'LS-006'),

  ('home-automation', 'Home Automation Starter Kit', 'home-automation-starter-kit', 'A starter bundle covering lighting, sensors, and a central hub.', 399.00, 'HA-001'),
  ('home-automation', 'Climate Control Package', 'climate-control-package', 'Automated heating and cooling scheduling for year-round comfort.', 549.00, 'HA-002'),
  ('home-automation', 'Entertainment Automation Bundle', 'entertainment-automation-bundle', 'Unified control for audio, video, and streaming devices.', 649.00, 'HA-003'),
  ('home-automation', 'Whole-Home Automation Package', 'whole-home-automation-package', 'A comprehensive package automating every room in the home.', 1999.00, 'HA-004'),
  ('home-automation', 'Energy Management Kit', 'energy-management-kit', 'Devices and dashboards for smarter home energy usage.', 299.00, 'HA-005'),
  ('home-automation', 'Automation Support Plan (Annual)', 'automation-support-plan', 'A year of automation monitoring, updates, and support.', 199.00, 'HA-006'),

  ('custome-security-setup', 'CCTV Surveillance Kit (4-Camera)', 'cctv-surveillance-kit', 'A four-camera surveillance kit with centralized viewing.', 599.00, 'CSS-001'),
  ('custome-security-setup', 'Smart Access Control Package', 'smart-access-control-package', 'Keyless, permission-based access control across entry points.', 449.00, 'CSS-002'),
  ('custome-security-setup', 'Intrusion Alarm System', 'intrusion-alarm-system', 'An alarm system for real-time intrusion alerting.', 349.00, 'CSS-003'),
  ('custome-security-setup', '24x7 Monitoring Subscription (Annual)', 'monitoring-subscription', 'A year of live monitoring with defined escalation workflows.', 999.00, 'CSS-004'),
  ('custome-security-setup', 'Security Audit Package', 'security-audit-package', 'A full audit of your facility''s physical and network security.', 699.00, 'CSS-005'),
  ('custome-security-setup', 'Network Hardening Service', 'network-hardening-service', 'A service to harden your network and connected security devices.', 499.00, 'CSS-006'),

  ('saas-for-business', 'SaaS Starter Architecture Package', 'saas-starter-architecture', 'Multi-tenant architecture design and setup for a new SaaS product.', 2999.00, 'SFB-001'),
  ('saas-for-business', 'Billing & Subscription Integration', 'billing-subscription-integration', 'Integrated billing, plans, and payment workflows for recurring revenue.', 1499.00, 'SFB-002'),
  ('saas-for-business', 'Multi-Tenant Setup Package', 'multi-tenant-setup-package', 'Tenant isolation and provisioning for a scalable SaaS platform.', 3499.00, 'SFB-003'),
  ('saas-for-business', 'Analytics & Observability Add-on', 'analytics-observability-addon', 'Usage analytics and monitoring foundations for product decisions.', 999.00, 'SFB-004'),
  ('saas-for-business', 'CI/CD Pipeline Setup', 'cicd-pipeline-setup', 'Continuous deployment pipelines with uptime-focused operations.', 1299.00, 'SFB-005'),
  ('saas-for-business', 'SaaS Security & Compliance Package', 'saas-security-compliance-package', 'Data protection and compliance-ready controls for your platform.', 1799.00, 'SFB-006')
on conflict (category, slug) do nothing;
