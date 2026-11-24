"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaBoxOpen,
} from "react-icons/fa";
import { deleteProduct, toggleProductStatus } from "@/lib/dashboard-actions";
import { productCategories } from "@/lib/site-data";
import { formatPrice, getCategoryLabel, getProductImage } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

export function AdminProductsTable({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "hidden">("all");
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  // Statistics
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.is_active).length;
  const hiddenCount = totalCount - activeCount;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus === "active" && !product.is_active) return false;
      if (selectedStatus === "hidden" && product.is_active) return false;

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        return (
          product.name.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [products, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top eCommerce Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{totalCount}</p>
          <p className="mt-1 text-xs text-slate-400">In database</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active in Store</p>
          <p className="mt-2 text-2xl font-black text-emerald-700">{activeCount}</p>
          <p className="mt-1 text-xs text-slate-400">Visible to customers</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hidden / Draft</p>
          <p className="mt-2 text-2xl font-black text-slate-600">{hiddenCount}</p>
          <p className="mt-1 text-xs text-slate-400">Unpublished</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-blue)]">Categories</p>
          <p className="mt-2 text-2xl font-black text-[var(--brand-blue)]">{productCategories.length}</p>
          <p className="mt-1 text-xs text-slate-400">Product categories</p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Add Product */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-xs outline-none ring-[var(--brand-blue)]/20 focus:bg-white focus:ring"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 outline-none ring-[var(--brand-blue)]/20 focus:ring"
          >
            <option value="all">All Categories</option>
            {productCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as "all" | "active" | "hidden")}
            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 outline-none ring-[var(--brand-blue)]/20 focus:ring"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
        </div>

        {/* Add Product Button */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:brightness-95 whitespace-nowrap"
        >
          <FaPlus className="h-3 w-3" /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Product</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">SKU</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Store Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <FaBoxOpen className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-semibold">No products found matching filters.</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const liveUrl = `/products/${product.category}/${product.slug}`;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition">
                    {/* Name & Thumbnail */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
                          <Image
                            src={getProductImage(product)}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-blue)] whitespace-nowrap">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-4 font-mono text-xs font-bold text-slate-600">
                      {product.sku}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 font-black text-slate-900">
                      {formatPrice(Number(product.price))}
                    </td>

                    {/* Status with Toggle Button */}
                    <td className="px-4 py-4">
                      <form action={toggleProductStatus}>
                        <input type="hidden" name="productId" value={product.id} />
                        <input
                          type="hidden"
                          name="currentStatus"
                          value={product.is_active ? "true" : "false"}
                        />
                        <button
                          type="submit"
                          title="Click to toggle store visibility"
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition hover:opacity-80 ${
                            product.is_active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {product.is_active ? (
                            <>
                              <FaEye className="h-3 w-3" /> Live
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className="h-3 w-3" /> Hidden
                            </>
                          )}
                        </button>
                      </form>
                    </td>

                    {/* Actions: View, Modify (Edit), Delete */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View in Store */}
                        <Link
                          href={liveUrl}
                          target="_blank"
                          title="View product in store"
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[var(--brand-blue)] transition"
                        >
                          <FaExternalLinkAlt className="h-3.5 w-3.5" />
                        </Link>

                        {/* Modify / Edit */}
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          title="Modify product details"
                          className="rounded-lg p-2 text-slate-600 hover:bg-blue-50 hover:text-[var(--brand-blue)] transition"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Link>

                        {/* Delete button (opens confirmation) */}
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(product)}
                          title="Delete product"
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteCandidate(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <FaTrash className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Delete Product?</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Are you sure you want to delete <strong>{deleteCandidate.name}</strong> ({deleteCandidate.sku})?
              If this product is referenced by prior customer orders, it will be automatically archived and hidden from
              the store instead of corrupting order history.
            </p>

            <form
              action={deleteProduct}
              onSubmit={() => setDeleteCandidate(null)}
              className="mt-6 flex justify-end gap-3"
            >
              <input type="hidden" name="productId" value={deleteCandidate.id} />
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 shadow-xs"
              >
                Confirm Delete
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
