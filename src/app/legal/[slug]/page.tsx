import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { getLegalDoc, LEGAL_LINKS } from "@/lib/marketing/legal";
import { SUPPORT_EMAIL } from "@/lib/mail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  return {
    title: doc ? `${doc.title} · Lico Management` : "Legal · Lico Management",
    description: doc?.summary,
  };
}

export function generateStaticParams() {
  return LEGAL_LINKS.map((doc) => ({ slug: doc.slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* header band */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(640px 260px at 12% -20%, rgba(29,107,66,0.18), transparent 62%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-14">
          <nav className="text-xs text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--foreground)]">{doc.title}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                {doc.kicker} · plain language
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{doc.title}</h1>
              <p className="mt-3 text-[var(--muted)]">{doc.summary}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-xs text-[var(--muted)]">
              <p className="font-semibold text-[var(--foreground)]">Last updated</p>
              <p className="mt-0.5">{doc.updated}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[240px_1fr]">
        {/* sticky TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">On this page</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {doc.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-md px-2 py-1 text-[var(--muted)] transition hover:bg-[var(--secondary)]/50 hover:text-[var(--foreground)]"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">Other documents</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {LEGAL_LINKS.filter((link) => link.slug !== doc.slug).map((link) => (
                  <li key={link.slug}>
                    <Link href={`/legal/${link.slug}`} className="text-[var(--muted)] transition hover:text-[var(--foreground)]">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-xs">
              <p className="font-semibold">Questions?</p>
              <p className="mt-1 text-[var(--muted)]">
                Write to{" "}
                <a className="text-[var(--primary)] hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>{" "}
                — a human replies, usually the same day.
              </p>
            </div>
          </div>
        </aside>

        {/* content */}
        <article className="min-w-0">
          <div className="space-y-8">
            {doc.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 sm:p-7">
                <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-[15px] leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[var(--primary)]" />
                        <span className="text-[var(--muted)]">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--primary)]/30 bg-[var(--secondary)]/40 p-6">
            <div>
              <p className="font-semibold">Still unclear about something?</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Ask us before you buy. Written answers beat assumptions in a contract.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:brightness-110">
                Contact us
              </Link>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--primary)]">
                Email support
              </a>
            </div>
          </div>
        </article>
      </section>

      <SiteFooter />
    </div>
  );
}
