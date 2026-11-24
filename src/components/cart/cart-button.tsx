"use client";

import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./cart-context";

export function CartButton() {
  const { totalCount, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="View shopping cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)] hover:bg-blue-50/50"
    >
      <FaShoppingCart className="h-4 w-4" />
      {totalCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-orange)] px-1.5 text-[10px] font-black text-white shadow-xs animate-in zoom-in-50">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </button>
  );
}
