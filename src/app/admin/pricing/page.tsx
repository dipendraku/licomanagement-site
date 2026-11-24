import type { Metadata } from "next";
import { getPricing } from "@/lib/pricing-store";
import { noIndexRobots } from "@/lib/seo";
import { PricingEditor } from "./pricing-editor";

export const metadata: Metadata = { title: "Pricing Management", robots: noIndexRobots };
export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const plans = await getPricing({ fresh: true });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Website</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Pricing &amp; offers</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Change list prices, run a discount or add an offer label. Public pages and checkout pick it up immediately —
          nothing is hardcoded anywhere else.
        </p>
      </header>

      {(
        <PricingEditor plans={plans} />
        )}
    </div>
  );
}
