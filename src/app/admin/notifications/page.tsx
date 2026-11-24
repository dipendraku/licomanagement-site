import { redirect } from "next/navigation";
import { broadcastNotification, markNotificationRead } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  if (profile?.role !== "super_admin") {
    redirect("/admin");
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("role_target", "admin")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-3">
        {(notifications ?? []).length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No notifications yet.</p>
        ) : (
          notifications!.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-2xl border p-5 shadow-sm ${notification.is_read ? "border-slate-200 bg-white" : "border-[var(--brand-blue)]/30 bg-[#eaf2ff]"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0b2f63]">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
                  <p className="mt-2 text-xs text-slate-400">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
                {!notification.is_read ? (
                  <form action={markNotificationRead}>
                    <input type="hidden" name="notificationId" value={notification.id} />
                    <input type="hidden" name="path" value="/admin/notifications" />
                    <button type="submit" className="whitespace-nowrap text-xs font-semibold text-[var(--brand-blue)] hover:underline">
                      Mark read
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <form action={broadcastNotification} className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Broadcast to Customers</h2>
        <p className="mt-1 text-xs text-slate-500">Sends a notification to every customer&rsquo;s dashboard.</p>
        <div className="mt-4 grid gap-3">
          <input
            name="title"
            required
            placeholder="Title"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
          />
          <textarea
            name="body"
            required
            placeholder="Message"
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-[var(--brand-blue)]/20 focus:ring"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--brand-orange)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Send Broadcast
          </button>
        </div>
      </form>
    </div>
  );
}
