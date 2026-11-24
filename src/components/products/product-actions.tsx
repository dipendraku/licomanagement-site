"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FaShoppingCart, FaBolt, FaCheck, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/cart-context";
import type { OrderType, Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<OrderType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [added, setAdded] = useState(false);

  const { addToCart, startBuyNow } = useCart();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
  }, []);

  function handleAddToCart() {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !mode) return;

    setSubmitting(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      product_id: product.id,
      type: mode,
      full_name: String(formData.get("full_name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    });

    setSubmitting(false);
    setResult(error ? "error" : "success");
  }

  if (!ready) {
    return <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />;
  }

  if (result === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h2 className="text-xl font-bold text-emerald-800">
          {mode === "buy" ? "Purchase request received" : "Request received"}
        </h2>
        <p className="mt-2 text-emerald-700">
          Our team will reach out to confirm details. No payment has been charged — a specialist will contact you to
          complete the {mode === "buy" ? "purchase" : "request"}.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/account/orders" className="font-semibold text-emerald-800 hover:underline">
            View my orders →
          </Link>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setMode(null);
            }}
            className="text-sm font-semibold text-slate-600 hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        {!mode ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Purchase & Ordering Options</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 rounded-full border border-[var(--brand-blue)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.03em] transition shadow-xs ${
                  added
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white"
                }`}
              >
                {added ? (
                  <>
                    <FaCheck className="h-4 w-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>

              {/* Instant Buy Now */}
              <button
                type="button"
                onClick={() => startBuyNow(product)}
                className="flex items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.03em] text-white transition hover:brightness-95 shadow-xs"
              >
                <FaBolt className="h-4 w-4" /> Buy Now
              </button>
            </div>

            {/* Custom Quote / Consultation Request */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>Need custom integration or a tailored enterprise proposal?</span>
              <button
                type="button"
                onClick={() => setMode("request")}
                className="inline-flex items-center gap-1.5 font-bold text-[var(--brand-blue)] hover:underline"
              >
                <FaEnvelope className="h-3 w-3" /> Request Custom Scope
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {mode === "buy" ? `Buy ${product.name}` : `Request Quote for ${product.name}`}
              </h2>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-xs font-semibold text-slate-500 hover:underline"
              >
                Cancel
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Submit your inquiry and our technology team will contact you with deployment details.
            </p>

            {result === "error" ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Something went wrong submitting your request. Please try again.
              </p>
            ) : null}

            {!user ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                <p className="text-sm text-amber-800">Please sign in to submit your request.</p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    className="rounded-full bg-[var(--brand-blue)] px-5 py-2 text-xs font-bold uppercase text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full border border-slate-300 px-5 py-2 text-xs font-bold uppercase text-slate-700"
                  >
                    Register
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <input
                  name="full_name"
                  required
                  defaultValue={user.user_metadata?.full_name ?? ""}
                  placeholder="Full Name"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                />
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={user.email ?? ""}
                  placeholder="Email"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                />
                <textarea
                  name="message"
                  placeholder="Project specifications, questions, or requirements..."
                  className="min-h-24 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMode(null)}
                    className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : mode === "buy" ? "Submit Purchase Order" : "Submit Request"}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>

      {/* Navigation back to Store */}
      <div className="flex items-center justify-between">
        <Link
          href={`/store?category=${product.category}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-blue)] hover:underline"
        >
          <FaArrowLeft className="h-3 w-3" /> Back to Store Catalog
        </Link>
        <Link
          href="/store"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
