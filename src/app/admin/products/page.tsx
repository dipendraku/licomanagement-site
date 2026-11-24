import { createClient } from "@/lib/supabase/server";
import { AdminProductsTable } from "@/components/dashboard/admin-products-table";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("category")
    .order("name");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Product Management</h2>
        <p className="text-xs text-slate-500">
          Manage your store inventory: add new products, modify pricing and descriptions, toggle live
          status, and delete items.
        </p>
      </div>

      <AdminProductsTable initialProducts={products ?? []} />
    </div>
  );
}
