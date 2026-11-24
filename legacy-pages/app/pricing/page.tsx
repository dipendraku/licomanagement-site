import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";

const plans = [
  {
    name: "Starter",
    price: "$49",
    desc: "Best for solo accountants and startups.",
    items: ["1-2 users", "Managed backups", "Email support"],
  },
  {
    name: "Professional",
    price: "$99",
    desc: "For growing accounting firms.",
    items: ["Up to 10 users", "Priority support", "Security monitoring"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large teams with compliance requirements.",
    items: ["Unlimited users", "Dedicated environment", "24x7 expert support"],
  },
];

export default function PricingPage() {
  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(110deg,_#0b2f63_0%,_#104a9b_58%,_#2571d9_100%)] py-20 text-white">
          <div className="container-pad">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">Pricing Plans</h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-100">
              Flexible cloud hosting plans for practices of all sizes. Choose a package that matches your workload and growth goals.
            </p>
          </div>
        </section>

        <section className="container-pad py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-3xl border p-7 shadow-sm ${
                  plan.featured
                    ? "border-[var(--brand-orange)] bg-white shadow-[0_15px_35px_rgba(0,0,0,0.08)]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
                <p className="mt-2 text-slate-600">{plan.desc}</p>
                <p className="mt-5 text-4xl font-extrabold text-[var(--brand-blue)]">{plan.price}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  {plan.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <Link
                  href="/support#ticket"
                  className="mt-7 inline-flex rounded-full bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-blue-strong)]"
                >
                  Request Plan Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
