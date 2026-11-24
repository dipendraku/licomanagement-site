# Licomanagement Site Agent Guide

## Project Overview

Licomanagement Site is a small, content-driven marketing website for Licomanagement Pvt. Ltd. The public messaging currently spans cloud hosting for accounting and tax practices, custom software development, SaaS, smart devices, lighting, home automation, and security solutions.

This repository uses:

- Next.js `16.2.3` with the App Router. `next dev` uses Turbopack; `npm run build` builds with webpack because Turbopack's PostCSS/loader worker subprocesses fail on some shared hosts (Hostinger). `npm run build:turbo` is the Turbopack build for machines that support it.
- React `19.2.4` and TypeScript in strict mode.
- Tailwind CSS v4 through `@tailwindcss/postcss` and `src/app/globals.css`.
- `next/font/google` with Manrope for body text and Plus Jakarta Sans for headings.
- `react-icons` for technology and social icons, Radix Slot and `class-variance-authority` for the shared Button component.
- The `@/*` import alias, mapped to `src/*` in `tsconfig.json`.
- `@supabase/supabase-js` and `@supabase/ssr` for authentication (email/password), the product catalog, order requests, and notifications. See "Backend / Supabase" below.

Most marketing pages are still static/presentational with no backend. The product catalog, authentication, and the two dashboards (`/account`, `/admin`) are backed by Supabase — see "Backend / Supabase" for what that does and does not include.

## Commands

Run commands from the repository root:

```text
npm run dev         # Start the local development server at http://localhost:3000 (Turbopack)
npm run lint        # Run ESLint with Next core-web-vitals and TypeScript rules
npm run build       # Create a production build with webpack (deployment-safe default)
npm run build:turbo # Create a production build with Turbopack (faster; needs a host that allows child processes)
npm run start       # Serve the production build
```

Use `npm run lint` after source changes and `npm run build` for route, type, or build-system changes. Do not add a new formatter or test framework without a clear need.

Keep `npm run build` on webpack: the Hostinger build host kills Turbopack's loader worker processes, which surfaces as `TurbopackInternalError` while parsing `src/app/globals.css`. Do not "fix" that by dropping PostCSS plugins from `postcss.config.mjs` — the CSS is valid and the same build passes locally with both bundlers.

## Application Structure

- `src/app/layout.tsx` is the root layout. It loads fonts, global CSS, document metadata, favicon assets, and the page background.
- `src/app/page.tsx` is the home page. It composes `HeroSlideshow`, the services section, `GlobalNetworkSection`, `FeatureSection`, feature cards, and the security CTA.
- `src/app/quickbooks-hosting/page.tsx` is a dedicated page that renders `PageShell` plus reusable `InnerPage` content.
- `src/app/about-us/page.tsx` is a dedicated, bespoke page (hero, trust-stat row using `trustStats`, mission/vision, values grid, CTA band) — it does not use `InnerPage`.
- `src/components/site/service-page-template.tsx` is the shared "Service We do" page template (hero, service-highlight grid, process steps, and architecture/CTA sections). All seven Service We do pages — `it-software-development`, `smart-device`, `smart-light-solution`, `light-solution`, `home-automation`, `custome-security-setup`, `saas-for-business` — are dedicated routes that render this template with page-specific data, not the shared `InnerPage` layout. Each takes precedence over the dynamic `[slug]` route for its path. Use this template (not `InnerPage`) when adding a new Service We do page.
- `src/app/support/page.tsx` owns the support page, its four anchor sections (`#email`, `#call`, `#ticket`, `#contact`), phone/email/WhatsApp links, office details, and the currently presentational support-ticket form. There is no `/contact-us` route or nav item — all former contact-us links and anchors now point here.
- `src/app/pricing/page.tsx` owns the three pricing cards: Starter, Professional, and Enterprise.
- `src/app/[slug]/page.tsx` is the dynamic content route. It awaits Next 16 route `params`, looks up the slug in its local `copyBySlug` record, calls `notFound()` for unknown slugs, and renders the shared `InnerPage`.
- `src/components/site/page-shell.tsx` is the site-wide wrapper: `SiteHeader`, page content, and `SiteFooter`.
- `src/components/site/header.tsx` is a client component because it manages the mobile navigation state. Desktop navigation is generated from `mainNav`; mobile navigation must stay usable when adding menu items.
- `src/components/site/footer.tsx` generates footer columns from `footerColumns` and uses the shared logo/contact details.
- `src/components/site/inner-page.tsx` is the reusable hero plus four-point content layout used by detail pages.
- `src/components/home/hero-slideshow.tsx` is a client component. It rotates slides every 5600ms, exposes slide buttons, and displays the image declared by each `HeroSlide`.
- `src/components/home/global-network-section.tsx` is the home network block and embeds `InteractiveGlobe`.
- `src/components/ui/interactive-globe.tsx` is a client-side canvas animation with auto-rotation, pointer dragging, markers, and connections. Keep it browser-only and avoid unnecessary per-frame allocations.
- `src/components/ui/stack-feature-section.tsx` is a client-side orbiting technology icon section. It uses `react-icons`, local image fallbacks, and an inline spin animation.
- `src/components/ui/button.tsx` is the shared Radix Slot/CVA Button primitive. Prefer it when a button-like control needs reusable variants; use `asChild` for links.
- `src/lib/site-data.ts` contains navigation, footer links, home-page statistics/cards/features, and the typed `heroSlides` data.
- `src/lib/utils.ts` contains the `cn` class-name helper.
- `public/logo.png`, `public/favicon.svg`, and `public/hero-3d/*` are the primary branded/hero assets. Preserve their public-root URLs when moving components.
- `src/lib/supabase/client.ts`, `server.ts`, and `proxy.ts` are the three Supabase client factories (browser, Server Component/Action, and Proxy respectively). Always create a fresh client via these factories per request/render — never module-level singletons.
- `src/proxy.ts` is this Next.js version's `proxy` file (the renamed `middleware.ts` — see "Next.js and React Rules"). It refreshes the Supabase session cookie on every request and redirects unauthenticated visitors away from `/account/**` and `/admin/**`, and non-admins away from `/admin/**`.
- `src/lib/auth-actions.ts` (`signIn`, `signUp`, `signOut`) and `src/lib/dashboard-actions.ts` (product/order/notification mutations) are the Server Actions/Functions used by forms across auth and both dashboards.
- `src/components/auth/*` — `auth-menu.tsx` is the header profile icon (client component; shows Login/Register when signed out, an account/staff-dashboard dropdown when signed in). `login-form.tsx`, `register-form.tsx`, and `auth-card.tsx` back `/login` and `/register`. `google-button.tsx` is the "Continue with Google" OAuth button used on both. `forgot-password-form.tsx` (`/forgot-password`) and `reset-password-form.tsx` (`/reset-password`) back the password-reset flow.
- `src/app/auth/callback/route.ts` is the OAuth **and** password-recovery Route Handler; both Google sign-in and the "reset password" email link land here with a `code`, which it exchanges for a session via `exchangeCodeForSession` before redirecting to the `next` search param (default `/account`; the reset flow passes `next=/reset-password`).
- `src/components/products/product-grid.tsx` (client, fetches by category) and `product-actions.tsx` (client; gates Send Request/Direct Buy behind login, inserts into `orders`) back the `/products/**` routes.
- `src/components/dashboard/dashboard-shell.tsx` is the shared layout for both `/account` and `/admin` (marketing header/footer, optional grouped sidebar). `src/lib/admin-nav.ts` defines the admin sections and `src/components/dashboard/admin-nav.tsx` renders them with active-state highlighting. `product-form.tsx` backs product create/edit in `/admin/products`.
- `supabase/schema.sql` is the full database schema (tables, RLS policies, triggers, and the 42-product seed data) — run manually in the Supabase SQL editor; nothing in this repo executes it automatically.
- `supabase/seed.sql` bootstraps the first `super_admin` login (`admin@licomanagement.com`) directly in `auth.users`/`auth.identities` with a bcrypt password and a matching `profiles` row. The password is read from the `lico.seed_admin_password` session setting so no credential is committed; it is idempotent and is also the file the Supabase CLI runs as its seed on `supabase db reset`.

## Backend / Supabase

- Auth is Supabase email/password plus Google OAuth (`signInWithOAuth`, completed via `src/app/auth/callback/route.ts`) and email-based password reset (`resetPasswordForEmail` -> same callback route -> `/reset-password` -> `updateUser({ password })`).
- Three roles on `profiles.role` (see `staffRoles` in `src/lib/types.ts`), default `customer`:
  - `customer` — places requests/orders, sees only their own `orders`/`notifications`.
  - `employee` — "staff". Can access `/admin`, add and edit products (`products_insert_staff`/`products_update_staff` RLS policies, `requireStaff()` in `dashboard-actions.ts`), and view (read-only) every customer's orders. Cannot delete products, change order status, or reach Notification Management — that nav item and route are hidden/redirected for employees (see `/admin/layout.tsx`, `/admin/notifications/page.tsx`).
  - `super_admin` — full access: everything an employee can do, plus delete products, update order/payment status, broadcast/manage notifications, change other users' roles (`/admin/users`), and edit integrations (`/admin/settings`).
  - Roles are changed from `/admin/users` (migration `004_admin_console.sql` adds the `profiles_update_super_admin` policy). The same SQL can be run manually as documented in `supabase/schema.sql`.
- Google sign-in requires two manual, non-code steps that only the project owner can do: a Google Cloud OAuth Client ID/Secret (authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`), pasted into the Supabase Dashboard's Authentication -> Providers -> Google. Nothing in this repo can configure that.
- Tables: `profiles` (auto-created per signup via a trigger, including Google sign-ups), `products`, `orders`, `notifications`, `site_pricing`, `site_settings` (key/value integrations store, super_admin only). RLS is enabled on all of them, enforcing the role matrix above at the database layer (not just in the UI) — see `supabase/schema.sql` and `supabase/migrations/` for the exact policies. Server Actions in `dashboard-actions.ts` re-check the role too (defense in depth), redirecting rather than relying on RLS alone to fail silently.
- RLS policies must never reference the table they protect. The original `profiles` policy did (`exists (select 1 from public.profiles …)`), which Postgres rejects with `42P17 infinite recursion detected in policy`; `migrations/003` replaced it with the `public.current_profile_role()` SECURITY DEFINER helper, which is also what newer policies use.
- Integrations live in `site_settings` and are read server-side only: `src/lib/site-settings.ts` merges the stored values over env defaults. SMTP feeds `mail.ts`; eSewa/Khalti/Stripe keys feed `payments.ts` (`paymentConfig()`); WhatsApp credentials are stored for the messaging integration. Secrets are never rendered back to the browser — the settings form only shows a "Configured" badge and treats a blank secret input as "keep existing".
- "Direct Buy" does **not** process any real payment — by design (see chat history), it inserts an `orders` row (`type: 'buy'`, `status: 'pending'`) for staff follow-up, identical in spirit to "Send Request" (`type: 'request'`). Do not add a payment gateway or imply one exists without an explicit request.
- A Postgres trigger on `orders` inserts a `role_target: 'admin'` row into `notifications` automatically (visible to `super_admin` only); `/admin/notifications` also lets `super_admin`s broadcast a `role_target: 'customer'` notification to every customer dashboard.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`; this is Supabase's current name for the client-safe key, formerly called the "anon key"). `.env.example` also declares the server-only `SUPABASE_SERVICE_ROLE_KEY` for trusted scripts/maintenance, but no app code reads it — every dashboard operation relies on RLS policies evaluated for the signed-in user, not a privilege-bypassing key. `NEXT_PUBLIC_SITE_URL` sets the canonical production origin used by SEO metadata, `sitemap.xml`, `robots.txt` and Open Graph images (falls back to `https://licomanagement.com`).
- Data-fetching split: pages that must redirect/404 based on real data (`/products/[category]/[product]`, `/account/**`, `/admin/**`) use the server client in a Server Component so an unconfigured Supabase project fails gracefully per-request instead of breaking `npm run build` (these routes have no `generateStaticParams` and read `cookies()`, so they're already dynamic, matching the existing `/[slug]` route). `ProductGrid` fetches client-side instead so the category listing page never blocks on the server render.

## Route Catalog

The explicitly implemented routes are `/`, `/about-us`, `/support`, `/pricing`, `/quickbooks-hosting`, the seven Service We do pages (`/it-software-development`, `/smart-device`, `/smart-light-solution`, `/light-solution`, `/home-automation`, `/custome-security-setup`, `/saas-for-business`), `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback` (Route Handler, not a page), `/products/[category]` and `/products/[category]/[product]` (category is one of the seven Service We do slugs), `/account` (+ `/account/orders`, `/account/notifications`, `/account/profile` — any signed-in user), and `/admin` (+ `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/orders`, `/admin/pricing`, `/admin/customers` — `employee` or `super_admin`; `/admin/users`, `/admin/settings`, `/admin/notifications` — `super_admin` only). There is no `/contact-us` route. The dynamic route also currently supports these slugs:

```text
/sage-hosting
/tax-software-hosting
/virtual-desktop-hosting
/resources
/data-security
/trial
/managed-it-services
/our-vision-and-mission
/blog
/article
/data-centers
/partners
/schedule-meeting
/fin-tech-software
/education-solution
/government-service-app
/automation-software
```

When adding a new service or resource, update the relevant navigation/footer links and add its copy to `copyBySlug`; an unknown dynamic slug intentionally returns a 404. Preserve existing public slugs, including the current spelling `custome-security-setup`, unless a redirect strategy is added deliberately.

## Styling and UI Conventions

- Global design tokens live in `src/app/globals.css`: `--base-bg`, `--brand-blue`, `--brand-blue-strong`, `--brand-orange`, and `--ink`.
- Use the existing `container-pad`, `section-title`, `section-copy`, `reveal-up`, `card-lift`, and font variables before introducing new global utilities.
- The established visual language uses blue/white surfaces with orange CTAs, restrained borders, rounded panels, responsive grids, subtle gradients, and reveal/hover motion. Keep responsive behavior intact at mobile, tablet, and desktop widths.
- Use Tailwind utility classes in JSX and CSS variables for repeated brand values. Do not introduce a second styling system or a new design token palette for a small change.
- Use `next/image` for local images. Add `alt` text for meaningful images; decorative images should be marked appropriately.
- Keep page sections inside `PageShell` so header/footer behavior remains consistent.
- Follow the existing accessibility patterns: semantic headings, real links for navigation, button types, labels/accessible names for controls, and preserved anchor IDs on the support page.

## Next.js and React Rules

- Follow the App Router conventions used by this repository. In this Next.js version, dynamic route `params` are awaited as a `Promise` in the page component.
- Keep pages and components server-rendered by default. Add `"use client"` only when state, effects, browser APIs, canvas, pointer events, or other client-only behavior is required.
- Do not import client-only components into server code in a way that moves unrelated logic into the browser.
- Prefer typed local data and existing component composition over duplicating page layouts.
- Do not add `generateStaticParams`, metadata, API handlers, or data-fetching abstractions unless the feature genuinely needs them.
- Before changing Next.js APIs or conventions, consult the installed documentation under `node_modules/next/dist/docs/` and heed the version installed in `package.json` rather than relying on older Next.js examples.
- This Next.js version renamed `middleware.ts` to `proxy.ts` (exported function `proxy`, same `NextRequest`/`NextResponse`/`config.matcher` API as middleware had). The repo's edge/request-time logic lives in `src/proxy.ts` — do not add a `middleware.ts` file.
- `cookies()` and `searchParams` are both async (`Promise`-returning) in this version, same as `params`.

## Content and Behavior Notes

- The site currently presents Licomanagement as both a cloud/accounting hosting provider and a broader technology solutions company. Keep new copy consistent with the surrounding page and avoid silently changing the business positioning.
- The support-ticket form (on `/support`) has no server action or submit handler yet; do not imply that submissions are being delivered until a backend/integration is implemented. This is unrelated to the product `orders` flow, which is wired to Supabase.
- Navigation and footer data contain links to both explicit pages and dynamic slugs. Check links against the route catalog when editing `site-data.ts`.
- The home hero asset paths are `/hero-3d/home-automation.svg`, `/hero-3d/software-solution.svg`, `/hero-3d/saas-business.svg`, and `/hero-3d/smart-light.svg`.
- Avoid broad copy or visual refactors while fixing a localized issue. Preserve unrelated user changes in the working tree.

## Validation Checklist

1. Run `npm run lint` after editing TypeScript, TSX, or CSS.
2. Run `npm run build` when changing routes, dynamic params, metadata, dependencies, or shared components.
3. Smoke-test the affected route at desktop and mobile widths when the change affects layout or interaction.
4. Verify every new local asset path exists under `public/` and every navigation link resolves to an explicit route or supported dynamic slug.
