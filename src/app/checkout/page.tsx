import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { CheckoutForm, type PlanView } from "@/components/marketing/checkout-form";
import { getPricing, priceOf } from "@/lib/pricing-store";
import { availableGateways } from "@/lib/payments";

export const metadata: Metadata = {
  title: "Checkout · Lico Management",
  description: "Buy an EduCore SMS licence for your school.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const params = await searchParams;
  const pricing = await getPricing();
  const plans: PlanView[] = pricing.map((plan) => {
    const npr = priceOf(plan, "NPR");
    const usd = priceOf(plan, "USD");
    return {
      id: plan.id,
      name: plan.name,
      priceNpr: npr.final,
      listNpr: npr.list,
      priceUsd: usd.final,
      listUsd: usd.list,
      discountPercent: plan.discountPercent,
      promoLabel: plan.promoLabel,
      students: plan.students,
      active: plan.active,
    };
  });

  const requested = params.plan ?? "growth";
  const initialPlan = plans.some((plan) => plan.id === requested && plan.active) ? requested : (plans.find((p) => p.active)?.id ?? "growth");
  const gateways = availableGateways().map((gateway) => ({ id: gateway.id, label: gateway.label, hint: gateway.hint }));

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Reserve your licence</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Pick a plan and a payment method. The price you see is the price charged — setup, data import, training and
            gateway fees are all included.
          </p>
        </div>

        <CheckoutForm plans={plans} initialPlan={initialPlan} gateways={gateways} />
      </section>

      <SiteFooter />
    </div>
  );
}
