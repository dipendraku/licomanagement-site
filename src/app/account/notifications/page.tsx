import { markNotificationRead } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/server";

export default async function AccountNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .or(`user_id.eq.${user!.id},role_target.eq.customer`)
    .order("created_at", { ascending: false });

  if (!notifications || notifications.length === 0) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No notifications yet.</p>;
  }

  return (
    <div className="grid gap-3">
      {notifications.map((notification) => (
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
                <input type="hidden" name="path" value="/account/notifications" />
                <button type="submit" className="whitespace-nowrap text-xs font-semibold text-[var(--brand-blue)] hover:underline">
                  Mark read
                </button>
              </form>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
