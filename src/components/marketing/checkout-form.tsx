"use client";

import { useMemo, useState, type FormEvent } from "react";

export interface PlanView {
  id: string;
  name: string;
  priceNpr: number;
  priceUsd: number;
  listNpr: number;
  listUsd: number;
  discountPercent: number;
  promoLabel: string;
  students: string;
  active: boolean;
}

interface GatewayView {
  id: string;
  label: string;
  hint: string;
}

export function CheckoutForm({
  plans,
  initialPlan,
  gateways,
}: {
  plans: PlanView[];
  initialPlan: string;
  gateways: GatewayView[];
}) {
  const visible = plans.filter((plan) => plan.active);
  const [planId, setPlanId] = useState(visible.some((p) => p.id === initialPlan) ? initialPlan : visible[0]!.id);
  const [currency, setCurrency] = useState<"NPR" | "USD">("NPR");
  const [gateway, setGateway] = useState(gateways[0]?.id ?? "demo");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const plan = useMemo(() => visible.find((item) => item.id === planId) ?? visible[0]!, [planId, visible]);
  const amount = currency === "USD" ? plan.priceUsd : plan.priceNpr;
  const list = currency === "USD" ? plan.listUsd : plan.listNpr;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      plan: plan.id,
      gateway,
      currency,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      school: String(form.get("school") ?? ""),
      phone: String(form.get("phone") ?? ""),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as {
        ok?: boolean;
        kind?: "redirect" | "form";
        redirectUrl?: string;
        action?: string;
        fields?: Record<string, string>;
        error?: string;
      };
      if (!response.ok || !json.ok) throw new Error(json.error || "Could not start checkout.");

      if (json.kind === "form" && json.action && json.fields) {
        // eSewa: signed HTML form POST
        const formEl = document.createElement("form");
        formEl.method = "POST";
        formEl.action = json.action;
        for (const [key, value] of Object.entries(json.fields)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          formEl.appendChild(input);
        }
        document.body.appendChild(formEl);
        formEl.submit();
        return;
      }

      if (!json.redirectUrl) throw new Error("The gateway did not return a payment link.");
      window.location.href = json.redirectUrl;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start checkout.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">1 · Choose a plan</h2>
          <div className="mt-4 grid gap-3">
            {visible.map((item) => {
              const itemPrice = currency === "USD" ? item.priceUsd : item.priceNpr;
              const itemList = currency === "USD" ? item.listUsd : item.listNpr;
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    planId === item.id ? "border-[var(--primary)] bg-[var(--secondary)]/40" : "border-[var(--border)] hover:border-[var(--primary)]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={item.id}
                    checked={planId === item.id}
                    onChange={() => setPlanId(item.id)}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-sm">
                        {currency === "USD" ? `USD ${itemPrice}` : `NPR ${itemPrice.toLocaleString("en-IN")}`}
                        {item.discountPercent > 0 && (
                          <span className="ml-2 text-xs text-[var(--muted)] line-through">
                            {currency === "USD" ? `$${itemList}` : `NPR ${itemList.toLocaleString("en-IN")}`}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">{item.students}</span>
                    {item.discountPercent > 0 && (
                      <span className="mt-1 inline-block rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[11px] font-medium text-[#9a5b12]">
                        {item.promoLabel || `${item.discountPercent}% off`}
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-4 inline-flex rounded-lg border border-[var(--border)] p-1 text-xs">
            {(["NPR", "USD"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCurrency(code)}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  currency === code ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted)]"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">2 · Your details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { name: "name", label: "Full name", placeholder: "Ramesh Adhikari", required: true, type: "text", span: false },
              { name: "school", label: "School / college", placeholder: "Shree Janata Secondary School", required: true, type: "text", span: true },
              { name: "email", label: "Email for the receipt", placeholder: "you@school.edu.np", required: true, type: "email", span: false },
              { name: "phone", label: "Phone", placeholder: "+977 98…", required: false, type: "tel", span: false },
            ].map((field) => (
              <label key={field.name} className={field.span ? "sm:col-span-2" : ""}>
                <span className="mb-1.5 block text-sm font-medium">
                  {field.label} {field.required && <span className="text-[var(--danger)]">*</span>}
                </span>
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">3 · Payment method</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {gateways.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                  gateway === item.id ? "border-[var(--primary)] bg-[var(--secondary)]/40" : "border-[var(--border)] hover:border-[var(--primary)]/40"
                }`}
              >
                <input
                  type="radio"
                  name="gateway"
                  value={item.id}
                  checked={gateway === item.id}
                  onChange={() => setGateway(item.id)}
                  className="accent-[var(--primary)]"
                />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-[var(--muted)]">{item.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Sandbox gateways never move real money. Switch to live by setting the gateway env variables.
          </p>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">{plan.name} licence</span>
            <span className="font-medium">
              {currency === "USD" ? `USD ${list}` : `NPR ${list.toLocaleString("en-IN")}`}
            </span>
          </div>
          {plan.discountPercent > 0 && (
            <div className="flex justify-between text-[var(--primary)]">
              <span>{plan.promoLabel || "Offer"}</span>
              <span>−{plan.discountPercent}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Setup, import &amp; training</span>
            <span className="text-[var(--primary)]">included</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Gateway / processing fees</span>
            <span className="text-[var(--primary)]">we pay them</span>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-[var(--border)] pt-4">
          <span className="text-sm font-semibold">Total to pay</span>
          <span className="text-xl font-semibold">
            {currency === "USD" ? `USD ${amount}` : `NPR ${amount.toLocaleString("en-IN")}`}
          </span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">No hidden charges — the number above is exactly what the gateway charges.</p>

        {error && (
          <p className="mt-4 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-5 w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-60"
        >
          {status === "sending" ? "Starting checkout…" : `Pay with ${gateways.find((g) => g.id === gateway)?.label ?? "gateway"}`}
        </button>
        <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
          Secure payment · receipt emailed instantly · 7-day refund window
        </p>
      </aside>
    </form>
  );
}
