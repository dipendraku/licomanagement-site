"use client";

import { type ReactNode } from "react";
import { CartProvider as InternalCartProvider, useCart } from "./cart-context";
import { CartDrawer } from "./cart-drawer";
import { CheckoutModal } from "./checkout-modal";
import { FaCheck } from "react-icons/fa";

function CartNotificationToast() {
  const { lastAddedName, openCart } = useCart();

  if (!lastAddedName) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-5">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <FaCheck className="h-3 w-3" />
      </div>
      <div className="text-xs">
        <p className="font-bold text-slate-800">Added to cart!</p>
        <p className="max-w-[200px] truncate text-slate-500">{lastAddedName}</p>
      </div>
      <button
        type="button"
        onClick={openCart}
        className="ml-2 rounded-lg bg-[var(--brand-blue)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--brand-blue-strong)]"
      >
        View Cart
      </button>
    </div>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <InternalCartProvider>
      {children}
      <CartDrawer />
      <CheckoutModal />
      <CartNotificationToast />
    </InternalCartProvider>
  );
}
