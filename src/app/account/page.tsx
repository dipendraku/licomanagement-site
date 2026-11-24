import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const { count: orderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id);
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .or(`user_id.eq.${user!.id},role_target.eq.customer`)
    .eq("is_read", false);

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Welcome back,</p>
        <p className="text-xl font-extrabold text-[#0b2f63]">{profile?.full_name || user?.email}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link href="/account/orders" className="card-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-3xl font-black text-[#0c336b]">{orderCount ?? 0}</p>
          <p className="mt-2 text-sm font-semibold text-slate-600">My Orders &amp; Requests</p>
        </Link>
        <Link href="/account/notifications" className="card-lift rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-3xl font-black text-[#0c336b]">{unreadCount ?? 0}</p>
          <p className="mt-2 text-sm font-semibold text-slate-600">Unread Notifications</p>
        </Link>
      </div>

      <Link
        href="/products/it-software-development"
        className="inline-flex w-fit rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
      >
        Browse Products
      </Link>
    </div>
  );
}
