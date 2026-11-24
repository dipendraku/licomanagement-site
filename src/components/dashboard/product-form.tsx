"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { productCategories } from "@/lib/site-data";
import { getProductImage } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  product?: Product;
  submitLabel: string;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [category, setCategory] = useState(product?.category ?? productCategories[0].slug);
  const [sku, setSku] = useState(product?.sku ?? "");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");

  function handleAutoSlug() {
    if (!name.trim()) return;
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  }

  function handleAutoSku() {
    const prefix = category
      .split("-")
      .map((w) => w[0]?.toUpperCase())
      .join("");
    const random = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix}-${random}`);
  }

  const previewImage = imageUrl.trim()
    ? imageUrl.trim()
    : getProductImage({ category, image_url: null });

  return (
    <form
      action={action}
      className="grid max-w-2xl gap-5 rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm"
    >
      <div>
        <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          Product Category *
        </label>
        <select
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
        >
          {productCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          Product Name *
        </label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Smart Hub Pro Controller"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
              Slug (URL Identifier) *
            </label>
            <button
              type="button"
              onClick={handleAutoSlug}
              className="text-[11px] font-bold text-[var(--brand-blue)] hover:underline"
            >
              Generate from Name
            </button>
          </div>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. smart-hub-controller"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring font-mono"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
              SKU (Stock Keeping Unit) *
            </label>
            <button
              type="button"
              onClick={handleAutoSku}
              className="text-[11px] font-bold text-[var(--brand-blue)] hover:underline"
            >
              Generate SKU
            </button>
          </div>
          <input
            name="sku"
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. SD-001"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring font-mono uppercase"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          Price (USD) *
        </label>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            placeholder="299.00"
            className="w-full rounded-xl border border-slate-300 pl-8 pr-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring font-semibold"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          Image URL (Optional)
        </label>
        <input
          name="image_url"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/product-image.png (or leave blank to use category graphic)"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
        />
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
            <Image
              src={previewImage}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized={Boolean(imageUrl.trim())}
            />
          </div>
          <div className="text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Display Preview</p>
            <p>
              {imageUrl.trim()
                ? "Custom product image will be displayed in the store."
                : "Default category graphic will be used."}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.06em] text-slate-500">
          Description *
        </label>
        <textarea
          name="description"
          required
          defaultValue={product?.description}
          rows={3}
          placeholder="Detailed description of features, benefits, specifications, and scope..."
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
            className="h-4 w-4 rounded accent-[var(--brand-blue)]"
          />
          <div>
            <p>Active (Live in Our Store)</p>
            <p className="text-xs font-normal text-slate-500">
              When checked, customers can browse, add to cart, and purchase this product online.
            </p>
          </div>
        </label>
      </div>

      <div className="mt-2 flex items-center gap-3 pt-2">
        <Link
          href="/admin/products"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="flex-1 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:brightness-95"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
