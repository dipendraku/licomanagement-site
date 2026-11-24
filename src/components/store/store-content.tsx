"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaBolt,
  FaCheck,
  FaArrowRight,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { useCart } from "@/components/cart/cart-context";
import { createClient } from "@/lib/supabase/client";
import { productCategories } from "@/lib/site-data";
import { formatPrice, getCategoryLabel, getProductImage } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export function StoreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const { addToCart, startBuyNow } = useCart();

  // Sync with URL search params if category changes externally
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch products from Supabase
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("products")
      .select("*")
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
  }, []);

  function handleAddToCart(product: Product) {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products;

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...result];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [products, selectedCategory, searchQuery, sortBy]);

  if (error) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-800">
        <h3 className="text-lg font-bold">Store Catalog Offline</h3>
        <p className="mt-2 text-sm text-amber-700">
          Products aren&rsquo;t available yet — this site&rsquo;s Supabase project hasn&rsquo;t been connected.
          Ensure <code className="rounded bg-amber-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> are configured,
          and seed data has been loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
            selectedCategory === "all"
              ? "bg-[var(--brand-blue)] text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          All Products
        </button>

        {productCategories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setSelectedCategory(category.slug)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              selectedCategory === category.slug
                ? "bg-[var(--brand-blue)] text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, SKU, or keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-8 py-2 text-sm outline-none ring-[var(--brand-blue)]/20 focus:bg-white focus:ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {products ? `${filteredProducts.length} items found` : "Loading products..."}
          </span>

          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400 h-3 w-3 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none ring-[var(--brand-blue)]/20 focus:ring"
            >
              <option value="featured">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {!products ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FaSearch className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">No products match your criteria</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search query or selecting another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-5 rounded-full bg-[var(--brand-blue)] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--brand-blue-strong)]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isAdded = Boolean(addedIds[product.id]);
            const detailUrl = `/products/${product.category}/${product.slug}`;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
              >
                <div>
                  {/* Image / Graphic Container */}
                  <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50/60 to-blue-50/30 p-6">
                    <div className="relative h-36 w-36 transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Category Tag */}
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0c336b] shadow-xs border border-slate-100">
                      {getCategoryLabel(product.category)}
                    </span>

                    {/* SKU badge */}
                    <span className="absolute right-4 top-4 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-500">
                      {product.sku}
                    </span>
                  </div>

                  {/* Card Body */}
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
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Price
                        </span>
                        <p className="text-xl font-black text-slate-900">
                          {formatPrice(Number(product.price))}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        Available to Order
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-bold transition shadow-xs ${
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

                    {/* Buy Now Button */}
                    <button
                      type="button"
                      onClick={() => startBuyNow(product)}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--brand-orange)] px-3 py-2.5 text-xs font-bold text-white shadow-xs transition hover:brightness-95"
                    >
                      <FaBolt className="h-3 w-3" /> Buy Now
                    </button>
                  </div>

                  {/* See Details Link */}
                  <Link
                    href={detailUrl}
                    className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[var(--brand-blue)] transition pt-1"
                  >
                    See Product Details <FaArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
