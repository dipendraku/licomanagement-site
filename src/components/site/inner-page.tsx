import Link from "next/link";

export function InnerPage({
  title,
  subtitle,
  points,
  cta,
}: {
  title: string;
  subtitle: string;
  points: string[];
  cta: { href: string; label: string };
}) {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(110deg,_#0b2f63_0%,_#104a9b_58%,_#2571d9_100%)] py-20">
        <div className="absolute -left-20 top-6 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[var(--brand-orange)]/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-blue-100">{subtitle}</p>
          <Link
            href={cta.href}
            className="mt-8 inline-flex rounded-full bg-[var(--brand-orange)] px-7 py-3 text-sm font-semibold text-white transition hover:brightness-95"
          >
            {cta.label}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {points.map((point) => (
            <article key={point} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Why It Matters</h2>
              <p className="mt-2 text-slate-600">{point}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
