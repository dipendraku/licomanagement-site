import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { PRODUCTS, STUDIO_STATS } from "@/lib/marketing/catalog";
import { SUPPORT_EMAIL } from "@/lib/mail";

export const metadata: Metadata = {
  title: "About · Lico Management",
  description:
    "A small software studio in Butwal, Nepal building the systems schools, shops and cooperatives run on every day.",
};

const VALUES = [
  {
    title: "Software that survives Monday",
    body: "Every feature is judged by whether an office clerk can use it at 9 am without calling us. Fancy demos that break in week two are not features.",
    icon: "🏫",
  },
  {
    title: "You own what you pay for",
    body: "Your domain, your database, your data. Export any time, in a format you can open without us. No hostage-taking through data.",
    icon: "🔑",
  },
  {
    title: "Price it once, say it clearly",
    body: "One-time licence, optional care plan, no per-student rent and no fees discovered at checkout. If we need to raise a price, we tell existing customers first.",
    icon: "🏷️",
  },
  {
    title: "Support that knows your name",
    body: "A named person for every deployment. When a school calls on fee-collection day, they reach someone who already knows their sections and fee heads.",
    icon: "📞",
  },
];

const TIMELINE = [
  { year: "2019", title: "First school deployment", body: "Started with a single secondary school in Rupandehi that was tracking fees in three different registers." },
  { year: "2021", title: "Accounting & POS", body: "Shops and distributors asked for the same discipline for their ledgers — LedgerPro was born out of those requests." },
  { year: "2023", title: "Nidhi & cooperatives", body: "NidhiSuite built with a cooperative in Butwal, then hardened through two statutory audits." },
  { year: "2025", title: "Six products, one team", body: "Added ERP, election surveys and a WordPress POS to the school and accounting systems. Same studio, same support inbox." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-75"
          style={{
            background:
              "radial-gradient(640px 280px at 15% -10%, rgba(29,107,66,0.2), transparent 62%), radial-gradient(520px 240px at 88% 0%, rgba(240,160,75,0.14), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
              About the studio
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              A small studio in Butwal, building software people actually open every morning.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--muted)]">
              Lico Management builds and runs management systems for schools, shops, cooperatives and campaign teams.
              We are not a body shop shipping prototypes — every product on this site is in production, with a named
              person responsible for it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:brightness-110">
                See the products
              </Link>
              <Link href="/contact" className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold hover:border-[var(--primary)]">
                Talk to the team
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STUDIO_STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs leading-snug text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* story */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">The story</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">It started with a fee register that never balanced.</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-[var(--muted)]">
            <p>
              In 2019 a school in Rupandehi asked for one simple thing: collect fees, print a receipt and tell the
              accountant who had paid. The office had three registers, two people and no reliable way to reconcile
              them at the end of the month.
            </p>
            <p>
              We built that first system in six weeks. It broke twice in the first term — once because a teacher
              entered marks for the wrong section, once because the school changed its fee structure mid-year and the
              receipt numbers skipped. Both times we were on site the same day, and both times the fix went back into
              the product instead of staying with that one client.
            </p>
            <p>
              Seven years later the same discipline applies to every product here: build it close to the people who
              use it, keep the number of clicks down, and never let the software make a decision that belongs to the
              office.
            </p>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">How we work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Four rules we do not trade away</h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <article key={value.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <span className="text-2xl" aria-hidden>{value.icon}</span>
                <h3 className="mt-3 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-semibold tracking-tight">A short history</h2>
        <ol className="mt-9 space-y-4">
          {TIMELINE.map((item) => (
            <li key={item.year} className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 sm:grid-cols-[90px_1fr]">
              <span className="text-sm font-semibold text-[var(--primary)]">{item.year}</span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* products strip */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">What we maintain today</h2>
            <Link href="/products" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              All products →
            </Link>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/catalog/${product.slug}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/50"
              >
                <span className="text-xl" aria-hidden>{product.icon}</span>
                <p className="mt-2 text-sm font-semibold">{product.name}</p>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">{product.kicker}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Come see the office</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              We are in Butwal and visit schools and businesses across Lumbini, Gandaki and Karnali. If you are nearby,
              a demo in person usually takes twenty minutes — chai included.
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Email{" "}
              <a className="text-[var(--primary)] hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              {" · "}
              <a className="text-[var(--primary)] hover:underline" href="tel:+9779847435894">+977 9847435894</a>
              {" · "}
              Sunday–Friday, 09:00–18:00 NPT
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/contact" className="rounded-xl bg-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-[var(--primary-foreground)] hover:brightness-110">
              Book a demo
            </Link>
            <Link href="/pricing" className="rounded-xl border border-[var(--border)] px-5 py-3 text-center text-sm font-semibold hover:border-[var(--primary)]">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
