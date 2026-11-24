"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FaCheckCircle, FaTimes, FaLock, FaShoppingBag } from "react-icons/fa";
import { useCart } from "./cart-context";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getProductImage } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

export function CheckoutModal() {
  const pathname = usePathname();
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
    totalPrice,
    buyNowProduct,
    closeBuyNow,
  } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Single product buy-now or full cart
  const isSingleBuyNow = Boolean(buyNowProduct);
  const isOpen = isCheckoutOpen || isSingleBuyNow;

  // Active items for this checkout session
  const activeItems: Array<{ product: Product; quantity: number }> = isSingleBuyNow
    ? [{ product: buyNowProduct!, quantity: 1 }]
    : items;

  const currentTotal = isSingleBuyNow
    ? Number(buyNowProduct!.price)
    : totalPrice;

  useEffect(() => {
    if (!isOpen) {
      setOrderComplete(false);
      setErrorMsg(null);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingUser(false);
    });
  }, [isOpen]);

  function handleClose() {
    if (isSingleBuyNow) {
      closeBuyNow();
    } else {
      closeCheckout();
    }
  }

  async function handleSubmitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    if (activeItems.length === 0) {
      setErrorMsg("No items to checkout.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("full_name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const address = String(formData.get("address") || "");
    const notes = String(formData.get("notes") || "");

    const supabase = createClient();

    try {
      // Insert an order row for each product item
      for (const item of activeItems) {
        const orderNotes = [
          `Qty: ${item.quantity}`,
          address ? `Delivery Address: ${address}` : null,
          notes ? `Special Notes: ${notes}` : null,
        ]
          .filter(Boolean)
          .join(" | ");

        const { error } = await supabase.from("orders").insert({
          user_id: user.id,
          product_id: item.product.id,
          type: "buy",
          status: "pending",
          full_name: fullName,
          email: email,
          phone: phone,
          message: orderNotes,
        });

        if (error) {
          throw error;
        }
      }

      setOrderCount(activeItems.length);
      setOrderComplete(true);

      // Clear cart if this was a cart checkout
      if (!isSingleBuyNow) {
        clearCart();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place your order. Please try again.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close checkout"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        {orderComplete ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FaCheckCircle className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-900">Order Placed Successfully!</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Thank you for choosing Licomanagement. We have received your purchase request for {orderCount}{" "}
              {orderCount === 1 ? "product" : "products"}. Our team will review your order and reach out to
              arrange fulfillment.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Status: Pending Staff Confirmation</p>
              <p>No payment has been charged online. Our specialist will contact you directly to confirm delivery and setup.</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/account/orders"
                onClick={handleClose}
                className="rounded-full bg-[var(--brand-blue)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-blue-strong)] text-center"
              >
                View My Orders
              </Link>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-[var(--brand-orange)]">
                <FaShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {isSingleBuyNow ? "Instant Buy Now" : "Complete Your Order"}
                </h2>
                <p className="text-xs text-slate-500">Fast, secure order placement</p>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Order Items ({activeItems.length})
              </p>
              <div className="mt-2 max-h-36 overflow-y-auto divide-y divide-slate-200/60">
                {activeItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
                        <Image
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-[var(--brand-blue)]">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-[var(--brand-blue)]">{formatPrice(currentTotal)}</span>
              </div>
            </div>

            {loadingUser ? (
              <div className="mt-6 h-32 animate-pulse rounded-2xl bg-slate-100" />
            ) : !user ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <FaLock className="h-4 w-4" />
                </div>
                <h3 className="mt-2 text-base font-bold text-amber-900">Sign in to complete purchase</h3>
                <p className="mt-1 text-xs text-amber-700 max-w-sm mx-auto">
                  Please log in or create an account so we can link this purchase to your profile and track order status.
                  Your items will remain safely in your cart.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    onClick={handleClose}
                    className="rounded-full bg-[var(--brand-blue)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--brand-blue-strong)]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={handleClose}
                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:border-[var(--brand-blue)]"
                  >
                    Register
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="mt-6 space-y-4">
                {errorMsg && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {errorMsg}
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Full Name *
                    </label>
                    <input
                      name="full_name"
                      required
                      defaultValue={user.user_metadata?.full_name ?? ""}
                      placeholder="e.g. John Doe"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={user.email ?? ""}
                      placeholder="e.g. john@example.com"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 000-0000"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Shipping / Installation Address
                  </label>
                  <input
                    name="address"
                    placeholder="Street, City, State, ZIP"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Special Requirements or Note
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Any specific delivery instructions, timing, or project requirements..."
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                  <p>
                    <strong>Payment policy:</strong> Direct Buy submits an order request for staff verification.
                    Our technical and sales team will confirm your order and invoice you securely.
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
                  >
                    {submitting ? "Placing Order…" : `Confirm Purchase (${formatPrice(currentTotal)})`}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
