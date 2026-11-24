import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-slate-200 text-slate-700",
};

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, products(id, name, category, price, slug)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">You have no orders or requests yet.</p>;
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-extrabold text-[#0b2f63]">{order.products?.name ?? "Product"}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyles[order.status] ?? "bg-slate-100 text-slate-700"}`}>
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {order.type === "buy" ? "Purchase Request" : "Product Request"} · ${Number(order.products?.price ?? 0).toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-slate-400">Submitted {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
