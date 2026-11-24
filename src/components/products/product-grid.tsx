"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaBolt, FaCheck, FaArrowRight } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice, getProductImage } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

export function ProductGrid({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const { addToCart, startBuyNow } = useCart();

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) {
          setError(true);
          return;
        }
        setProducts(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  function handleAddToCart(product: Product) {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        Products aren&rsquo;t available yet — this site&rsquo;s Supabase project hasn&rsquo;t been connected. Set
        `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then run{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5">supabase/schema.sql</code> in the Supabase SQL editor.
      </p>
    );
  }

  if (!products) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-slate-100" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        <p>No products are currently listed in this category.</p>
        <Link
          href="/store"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand-blue)] px-5 py-2 text-xs font-bold uppercase text-white"
        >
          View All Store Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const isAdded = Boolean(addedIds[product.id]);
        const detailUrl = `/products/${category}/${product.slug}`;

        return (
          <div
            key={product.id}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
          >
            <div>
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50/30 p-6">
                <div className="relative h-32 w-32 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="absolute right-4 top-4 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-500">
                  {product.sku}
                </span>
              </div>

              <div className="p-6">
                <Link href={detailUrl} className="block">
                  <h3 className="text-base font-extrabold text-[#0b2f63] line-clamp-1 transition hover:text-[var(--brand-blue)]">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 min-h-8">
                  {product.description}
                </p>

                <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-3">
                  <p className="text-xl font-black text-slate-900">
                    {formatPrice(Number(product.price))}
                  </p>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Available
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/60 p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition shadow-xs ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "border border-[var(--brand-blue)] bg-white text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <FaCheck className="h-3 w-3" /> Added!
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="h-3 w-3" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => startBuyNow(product)}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--brand-orange)] px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:brightness-95"
                >
                  <FaBolt className="h-3 w-3" /> Buy Now
                </button>
              </div>

              <Link
                href={detailUrl}
                className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[var(--brand-blue)] transition pt-1"
              >
                See Details <FaArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
