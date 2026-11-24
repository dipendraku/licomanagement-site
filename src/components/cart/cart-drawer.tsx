"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FaTrash, FaTimes, FaShoppingBag, FaArrowRight, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "./cart-context";
import { getProductImage, formatPrice } from "@/lib/product-helpers";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    totalPrice,
    openCheckout,
  } = useCart();

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[var(--brand-blue)]">
              <FaShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
              <p className="text-xs text-slate-500">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            type="button"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close cart"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FaShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">Your cart is empty</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              Explore our tech and software store to add products, devices, or business solutions.
            </p>
            <button
              onClick={closeCart}
              className="mt-6 rounded-full bg-[var(--brand-blue)] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-blue-strong)]"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 py-4 items-center">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {product.sku}
                    </p>
                    <Link
                      href={`/products/${product.category}/${product.slug}`}
                      onClick={closeCart}
                      className="block truncate text-sm font-bold text-[#0b2f63] hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs font-bold text-[var(--brand-blue)]">
                      {formatPrice(product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 transition"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 transition"
                          aria-label="Increase quantity"
                        >
                          <FaPlus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="ml-auto text-slate-400 hover:text-red-600 transition p-1"
                        aria-label="Remove item"
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Fulfillment & Setup</span>
                  <span className="text-emerald-700 font-semibold">Free Consultation / Setup</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-[var(--brand-blue)]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={openCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
              >
                Proceed to Checkout <FaArrowRight className="h-3 w-3" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 hover:underline"
                >
                  Clear cart
                </button>
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-xs font-semibold text-[var(--brand-blue)] hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
