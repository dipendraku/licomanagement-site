import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { FAQS, SUPPORT_ADDON } from "@/lib/marketing/content";
import { getPricing, priceOf } from "@/lib/pricing-store";

export const metadata: Metadata = {
  title: "Pricing · Lico Management",
  description: "One-time setup pricing for schools and colleges. No per-student billing, no hidden charges.",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = (await getPricing()).filter((plan) => plan.active);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">Pricing</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Pay once for the software. Never per student.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
          One licence, one price. Setup, data import, staff training and payment-gateway fees are included — the
          amount on this page is exactly what you pay.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-14 lg:grid-cols-3">
        {plans.map((plan) => {
          const npr = priceOf(plan, "NPR");
          const usd = priceOf(plan, "USD");
          return (
            <article
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                plan.featured ? "border-[var(--primary)] bg-[var(--surface-strong)] shadow-xl" : "border-[var(--border)] bg-[var(--surface-strong)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                {plan.discountPercent > 0 ? (
                  <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#9a5b12]">
                    {plan.promoLabel || `${plan.discountPercent}% off`}
                  </span>
                ) : (
                  plan.featured && (
                    <span className="rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                      Most chosen
                    </span>
                  )
                )}
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{plan.tagline}</p>

              <div className="mt-5">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold">NPR {npr.final.toLocaleString("en-IN")}</p>
                  {npr.discountPercent > 0 && (
                    <p className="text-sm text-[var(--muted)] line-through">NPR {npr.list.toLocaleString("en-IN")}</p>
                  )}
                </div>
                <p className="text-sm text-[var(--muted)]">
                  ≈ USD {usd.final}
                  {usd.discountPercent > 0 && <span className="ml-1 line-through">USD {usd.list}</span>} · one-time
                </p>
                <p className="mt-1 text-xs font-medium text-[var(--primary)]">{plan.students}</p>
              </div>

              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-0.5 text-[var(--primary)]">✓</span>
                    <span className="text-[var(--muted)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.id === "campus" ? "/contact?topic=campus" : `/checkout?plan=${plan.id}`}
                className={`mt-6 rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110"
                    : "border border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                {plan.id === "campus" ? "Talk to sales" : plan.cta}
              </Link>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-3">
          {[
            ["No hidden charges", "Gateway fees, setup, import and training are inside the price above."],
            ["Fixed for 12 months", "We do not raise the licence price after you buy."],
            ["7-day refund", "Full refund before setup starts; pro-rated after that."],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="text-xl font-semibold">Care plan (optional)</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Keeps your deployment healthy after launch — updates, backups, uptime monitoring and one hour of
              changes every month. Cancel any time; the software keeps working.
            </p>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {SUPPORT_ADDON.points.map((point) => (
                <li key={point} className="flex gap-2 text-[var(--muted)]">
                  <span className="text-[var(--primary)]">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 text-center">
            <p className="text-2xl font-semibold">
              NPR {SUPPORT_ADDON.priceNpr.toLocaleString("en-IN")}
              <span className="ml-1 text-sm font-normal text-[var(--muted)]">/ month</span>
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">≈ USD {SUPPORT_ADDON.priceUsd} · billed monthly</p>
            <Link
              href="/contact?topic=care"
              className="mt-4 block rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
            >
              Add the care plan
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">Billing questions</h2>
        <div className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
          {FAQS.slice(0, 5).map((faq) => (
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

      <SiteFooter />
    </div>
  );
}
