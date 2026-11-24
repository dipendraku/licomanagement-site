import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { getProduct, PRODUCTS } from "@/lib/marketing/catalog";
import { getPricing, priceOf } from "@/lib/pricing-store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product · Lico Management" };
  return { title: `${product.name} · ${product.kicker}`, description: product.summary };
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = PRODUCTS.filter((item) => item.slug !== product.slug).slice(0, 3);
  const isSchool = product.slug === "educore-sms";
  const schoolPlans = isSchool ? (await getPricing()).filter((plan) => plan.active) : [];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(700px 300px at 15% -10%, rgba(29,107,66,0.2), transparent 60%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-16">
          <nav className="text-xs text-[var(--muted)]">
            <Link href="/products" className="hover:text-[var(--foreground)]">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--foreground)]">{product.name}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--secondary)] text-3xl" aria-hidden>
                {product.icon}
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">{product.kicker}</p>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">{product.summary}</p>
              <img
                src={product.image}
                alt={`${product.name} screen preview`}
                width={640}
                height={400}
                className="mt-6 w-full rounded-2xl border border-[var(--border)] shadow-sm"
              />

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={product.cta.href}
                  className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
                >
                  {product.cta.label}
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)]"
                >
                  Book a demo
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-[var(--muted)]">Best for</dt>
                  <dd className="mt-1 font-medium">{product.bestFor}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-[var(--muted)]">Delivery</dt>
                  <dd className="mt-1">{product.delivery}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-[var(--muted)]">Pricing</dt>
                  <dd className="mt-1 font-semibold text-[var(--primary)]">{product.priceNote}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-4">
                {product.modules.map((module) => (
                  <span key={module} className="rounded-md border border-[var(--border)] bg-[var(--background)]/60 px-2 py-0.5 text-[11px] text-[var(--muted)]">
                    {module}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* highlights */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">What&apos;s inside</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.highlights.map((highlight) => (
            <div key={highlight} className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
              <span className="mt-0.5 text-[var(--primary)]">✓</span>
              <p className="text-sm leading-relaxed">{highlight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* plans for the school product, otherwise enquiry */}
      {isSchool ? (
        <section className="border-y border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">Plans</h2>
              <Link href="/pricing" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                Full pricing →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {schoolPlans.map((plan) => {
                const npr = priceOf(plan, "NPR");
                return (
                  <div key={plan.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                    <p className="font-semibold">{plan.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{plan.students}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-xl font-semibold">NPR {npr.final.toLocaleString("en-IN")}</p>
                      {npr.discountPercent > 0 && (
                        <p className="text-xs text-[var(--muted)] line-through">NPR {npr.list.toLocaleString("en-IN")}</p>
                      )}
                    </div>
                    <Link
                      href={`/checkout?plan=${plan.id}`}
                      className="mt-4 block rounded-xl border border-[var(--border)] px-4 py-2 text-center text-sm font-semibold transition hover:border-[var(--primary)]"
                    >
                      Choose {plan.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="border-y border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Priced per deployment</h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
                {product.name} is quoted after a short discovery call — the number of branches, users and imports
                decides the effort. You get a fixed price in writing, valid for 30 days, before any work starts.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-center">
              <p className="text-sm text-[var(--muted)]">Starting point</p>
              <p className="mt-1 text-lg font-semibold text-[var(--primary)]">{product.priceNote}</p>
              <Link
                href="/contact"
                className="mt-4 block rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
              >
                Request a quote
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* other products */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Also in the studio</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {others.map((item) => (
            <Link
              key={item.slug}
              href={`/catalog/${item.slug}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:shadow-lg"
            >
              <span className="text-2xl" aria-hidden>{item.icon}</span>
              <p className="mt-3 font-semibold">{item.name}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{item.kicker}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
