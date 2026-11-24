import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { PRODUCTS } from "@/lib/marketing/catalog";

export const metadata: Metadata = {
  title: "Products · Lico Management",
  description: "School management, accounting & POS, Nidhi, ERP, POS plugin, election surveys and bookings.",
};

const STATUS_LABEL: Record<string, string> = { live: "In production", beta: "Beta", custom: "Custom build" };
const STATUS_STYLE: Record<string, string> = {
  live: "border-[var(--primary)]/35 bg-[var(--secondary)] text-[var(--primary)]",
  beta: "border-[var(--accent)]/40 bg-[var(--accent)]/12 text-[#9a5b12]",
  custom: "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Products</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Systems in production, not slide decks.
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          Every product below runs on real data today. Pick the one that matches your institution and we will
          configure a sandbox with your own structure before you commit.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-16 md:grid-cols-2">
        {PRODUCTS.map((product) => (
          <article
            key={product.slug}
            className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-7 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <img
                src={product.image}
                alt={`${product.name} screen preview`}
                width={180}
                height={113}
                className="h-[113px] w-[180px] rounded-xl border border-[var(--border)] object-cover"
              />
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[product.status]}`}>
                {STATUS_LABEL[product.status]}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{product.kicker}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{product.summary}</p>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {product.modules.slice(0, 5).map((module) => (
                <li key={module} className="rounded-md border border-[var(--border)] bg-[var(--background)]/60 px-2 py-0.5 text-[11px] text-[var(--muted)]">
                  {module}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-sm font-semibold text-[var(--primary)]">{product.priceNote}</p>
                <p className="text-xs text-[var(--muted)]">{product.meta}</p>
              </div>
              <Link
                href={`/catalog/${product.slug}`}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
              >
                Details
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Need something that isn&apos;t on this list?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--muted)]">
            We take on custom builds when the problem is close to what we already run — schools, accounting,
            inventory, memberships. Tell us the workflow and we&apos;ll say honestly whether we are the right team.
          </p>
          <Link
            href="/contact?topic=custom"
            className="mt-5 inline-block rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
          >
            Describe your workflow
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

