import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { PRODUCTS, STUDIO_STATS } from "@/lib/marketing/catalog";
import { FAQS, STEPS, TESTIMONIALS } from "@/lib/marketing/content";

const STATUS_LABEL: Record<string, string> = { live: "In production", beta: "Beta", custom: "Custom build" };
const STATUS_STYLE: Record<string, string> = {
  live: "border-[var(--primary)]/35 bg-[var(--secondary)] text-[var(--primary)]",
  beta: "border-[var(--accent)]/40 bg-[var(--accent)]/12 text-[#9a5b12]",
  custom: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
};

const CAPABILITIES = [
  {
    title: "Product engineering",
    body: "Next.js, React, Node and Postgres — the same stack the big SaaS products use, tuned to run on modest Nepali hosting.",
    icon: "⌘",
  },
  {
    title: "Payments & billing",
    body: "eSewa, Khalti, Stripe and bank reconciliation wired into the product, not bolted on with spreadsheets.",
    icon: "₹",
  },
  {
    title: "Data migration",
    body: "We import years of Excel, Tally exports and paper registers, then reconcile the opening balances with your accountant.",
    icon: "⇄",
  },
  {
    title: "Support that answers",
    body: "Nepali and English, Sunday to Friday. A named person for every deployment, not a ticket queue.",
    icon: "☎",
  },
];

export default function HomePage() {
  const live = PRODUCTS.filter((product) => product.status === "live").length;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(720px 320px at 12% -8%, rgba(29,107,66,0.22), transparent 62%), radial-gradient(640px 300px at 88% 4%, rgba(240,160,75,0.16), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
              Software studio · Butwal, Nepal
            </span>

            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              Serious software for
              <span className="block text-[var(--primary)]">Nepali schools &amp; businesses.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--muted)]">
              We build and run the systems small institutions actually depend on — school management,
              accounting &amp; POS, Nidhi operations, ERP and booking. {live} products in daily production,
              deployed on your domain with your data.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:brightness-110"
              >
                Browse the products
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold transition hover:border-[var(--primary)]"
              >
                Book a 15-minute demo
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--border)] pt-7 sm:grid-cols-4">
              {STUDIO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[11px] uppercase tracking-widest text-[var(--muted)]">{stat.label}</dt>
                  <dd className="mt-1 text-xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Product mosaic */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[var(--primary)]/15 via-transparent to-[var(--accent)]/20 blur-2xl" aria-hidden />
            <div className="relative grid gap-3 sm:grid-cols-2">
              {PRODUCTS.slice(0, 4).map((product, index) => (
                <Link
                  key={product.slug}
                  href={`/catalog/${product.slug}`}
                  className={`group rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-xl ${
                    index % 2 === 0 ? "sm:translate-y-4" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <img
                      src={product.image}
                      alt={`${product.name} screen preview`}
                      width={96}
                      height={60}
                      className="h-[60px] w-[96px] rounded-lg border border-[var(--border)] object-cover"
                    />
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[product.status]}`}>
                      {STATUS_LABEL[product.status]}
                    </span>
                  </div>
                  <p className="mt-3 font-semibold leading-tight">{product.name}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{product.kicker}</p>
                  <p className="mt-3 text-[11px] font-medium text-[var(--primary)] opacity-0 transition group-hover:opacity-100">
                    View product →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ───────────────────────────────────────── */}
      <section id="products" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">The catalogue</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Six systems. One studio behind them.
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              Each product is deployed on your own domain with your own data. Start with one, add the next when it
              makes sense.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            All products →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PRODUCTS.map((product) => (
            <article
              key={product.slug}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <img
                  src={product.image}
                  alt={`${product.name} screen preview`}
                  width={112}
                  height={70}
                  className="h-[70px] w-[112px] rounded-xl border border-[var(--border)] object-cover"
                />
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[product.status]}`}>
                  {STATUS_LABEL[product.status]}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{product.kicker}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">{product.summary}</p>
              <p className="mt-4 text-sm font-semibold text-[var(--primary)]">{product.priceNote}</p>
              <Link
                href={`/catalog/${product.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:gap-2"
              >
                {product.cta.label} <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Studio / capabilities ──────────────────────────── */}
      <section id="studio" className="scroll-mt-20 border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">The studio</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                We ship, then we stay.
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                Most software in this market is sold once and abandoned. Ours runs in production every day — school
                offices before assembly, shops at closing time, accountants at fiscal year-end. That reality shapes
                what we build: fewer features, better defaults, real support.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Your domain, your database, your data — export any time.",
                  "One-time pricing instead of per-user rent.",
                  "Nepali and English, with on-site visits in western Nepal.",
                ].map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <span className="mt-1 text-[var(--primary)]">◆</span>
                    <span className="text-[var(--muted)]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {CAPABILITIES.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--secondary)] text-[var(--primary)]">{item.icon}</span>
                  <h3 className="mt-3 font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">How an engagement runs</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Four steps, usually one week</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Step {index + 1}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Proof ──────────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">In the words of the people who run it</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <blockquote key={item.org} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <p className="text-[15px] leading-relaxed">“{item.quote}”</p>
                <footer className="mt-4 text-sm text-[var(--muted)]">
                  <span className="font-medium text-[var(--foreground)]">{item.name}</span> · {item.org}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <h2 className="text-3xl font-semibold tracking-tight">Straight answers</h2>
        <div className="mt-8 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium">
                <span className="flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-[var(--muted)] transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#12452a] via-[var(--primary)] to-[#2f8f5b] px-8 py-14 text-center text-white">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us what your office does on paper. We&apos;ll show you the screen that replaces it.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Fifteen minutes, your own classes, sections, items or members — no slideshow, no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#12452a] transition hover:bg-white/90">
              Book a demo
            </Link>
            <Link href="/products" className="rounded-xl border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Browse products
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
