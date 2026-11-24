import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";
import { updateProduct, deleteProduct } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/server";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();

  if (!product) {
    notFound();
  }

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Edit Product: {product.name}</h2>
          <p className="text-xs text-slate-500">Update pricing, description, visibility, and details.</p>
        </div>
        <Link
          href={`/products/${product.category}/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-blue)] hover:underline"
        >
          View live in store ↗
        </Link>
      </div>

      <ProductForm action={boundUpdate} product={product} submitLabel="Save Changes" />

      {/* Danger Zone: Delete Product */}
      <div className="max-w-2xl rounded-3xl border border-red-200 bg-red-50/50 p-6">
        <h3 className="text-sm font-bold text-red-900">Delete Product</h3>
        <p className="mt-1 text-xs text-red-700">
          Permanently remove this product from the database. If this product is linked to past customer orders,
          it will be archived and hidden from the store instead to preserve order records.
        </p>
        <form
          action={deleteProduct}
          className="mt-4"
        >
          <input type="hidden" name="productId" value={product.id} />
          <button
            type="submit"
            className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-700 shadow-xs"
          >
            Delete This Product
          </button>
        </form>
      </div>
    </div>
  );
}
