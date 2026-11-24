import { updateOrderStatus } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = ["pending", "contacted", "confirmed", "cancelled", "completed"];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-slate-200 text-slate-700",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const isSuperAdmin = profile?.role === "super_admin";

  const { data: orders } = await supabase
    .from("orders")
    .select("*, products(id, name, category, price)")
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No orders or requests yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-semibold text-[#0b2f63]">{order.products?.name ?? "—"}</td>
              <td className="px-4 py-3 capitalize text-slate-600">{order.type}</td>
              <td className="px-4 py-3 text-slate-600">{order.full_name}</td>
              <td className="px-4 py-3 text-slate-600">
                <p>{order.email}</p>
                {order.phone ? <p className="text-xs text-slate-400">{order.phone}</p> : null}
              </td>
              <td className="px-4 py-3 text-slate-600">${Number(order.products?.price ?? 0).toLocaleString()}</td>
              <td className="px-4 py-3">
                {isSuperAdmin ? (
                  <form action={updateOrderStatus} className="flex items-center gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-semibold"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-xs font-semibold text-[var(--brand-blue)] hover:underline">
                      Update
                    </button>
                  </form>
                ) : (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusStyles[order.status] ?? "bg-slate-100 text-slate-700"}`}>
                    {order.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
