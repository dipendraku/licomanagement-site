"use client";

import { useActionState } from "react";
import { updatePricing, type PricingActionState } from "./actions";
import type { PlanPricing } from "@/lib/pricing-store";

const initial: PricingActionState = { ok: false, message: "" };

export function PricingEditor({ plans }: { plans: PlanPricing[] }) {
  const [state, action, pending] = useActionState(updatePricing, initial);

  return (
    <form action={action} className="space-y-5">
      {plans.map((plan) => {
        const discountedNpr = Math.round(plan.priceNpr * (1 - plan.discountPercent / 100));
        return (
          <section key={plan.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{plan.name}</h2>
                <p className="text-xs text-[var(--muted)]">{plan.students} · id: {plan.id}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name={`${plan.id}_active`}
                  defaultChecked={plan.active}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Show on site
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Price NPR</span>
                <input
                  name={`${plan.id}_npr`}
                  type="number"
                  min={0}
                  defaultValue={plan.priceNpr}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Price USD</span>
                <input
                  name={`${plan.id}_usd`}
                  type="number"
                  min={0}
                  defaultValue={plan.priceUsd}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Discount %</span>
                <input
                  name={`${plan.id}_discount`}
                  type="number"
                  min={0}
                  max={90}
                  defaultValue={plan.discountPercent}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Offer label</span>
                <input
                  name={`${plan.id}_promo`}
                  type="text"
                  maxLength={60}
                  placeholder="Dashain offer"
                  defaultValue={plan.promoLabel}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                />
              </label>
            </div>

            <p className="mt-3 text-xs text-[var(--muted)]">
              Current public price:{" "}
              <span className="font-semibold text-[var(--foreground)]">
                NPR {discountedNpr.toLocaleString("en-IN")}
              </span>
              {plan.discountPercent > 0 && (
                <>
                  {" "}
                  <span className="line-through">NPR {plan.priceNpr.toLocaleString("en-IN")}</span>{" "}
                  <span className="text-[var(--primary)]">−{plan.discountPercent}%</span>
                  {plan.promoLabel ? ` · ${plan.promoLabel}` : ""}
                </>
              )}
            </p>
          </section>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save pricing"}
        </button>
        {state.message && (
          <span className={`text-sm ${state.ok ? "text-[var(--primary)]" : "text-[var(--danger)]"}`}>{state.message}</span>
        )}
      </div>
      <p className="text-xs text-[var(--muted)]">
        Discounts apply to both currencies and are shown as a struck-through list price on the pricing page. Checkout
        always charges the discounted amount — no added fees.
      </p>
    </form>
  );
}
