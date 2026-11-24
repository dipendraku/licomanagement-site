import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { saveSettings } from "@/lib/dashboard-actions";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings, SECRET_SETTING_KEYS, type SettingKey, type SiteSettings } from "@/lib/site-settings";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = { title: "Settings", robots: noIndexRobots };
export const dynamic = "force-dynamic";

type Field = {
  key: SettingKey;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: "text" | "password" | "number";
  options?: { value: string; label: string }[];
};

const SECTIONS: { title: string; description: string; note: string; fields: Field[] }[] = [
  {
    title: "General",
    description: "Brand and contact details used across the site, emails and notifications.",
    note: "Saved values override the env defaults.",
    fields: [
      { key: "siteName", label: "Site name" },
      { key: "supportEmail", label: "Support email", type: "text" },
      { key: "supportPhone", label: "Support phone" },
      { key: "whatsappNumber", label: "WhatsApp number", hint: "International format, digits only (e.g. 9779847435894)." },
    ],
  },
  {
    title: "Email / SMTP",
    description: "Outgoing mail for order receipts, demo requests and contact replies.",
    note: "If these are blank the app falls back to GMAIL_USER / GMAIL_APP_PASSWORD, then Resend or Brevo.",
    fields: [
      { key: "smtpHost", label: "SMTP host", placeholder: "smtp.gmail.com" },
      { key: "smtpPort", label: "Port", placeholder: "465", type: "number" },
      {
        key: "smtpSecure",
        label: "TLS mode",
        options: [
          { value: "true", label: "SSL (port 465)" },
          { value: "false", label: "STARTTLS (port 587)" },
        ],
      },
      { key: "smtpUser", label: "Username" },
      { key: "smtpPass", label: "Password / app password", type: "password" },
      { key: "smtpFromName", label: "From name", placeholder: "Lico Management" },
      { key: "smtpFromEmail", label: "From email" },
    ],
  },
  {
    title: "Payment gateways",
    description: "Checkout keys for eSewa, Khalti and Stripe.",
    note: "eSewa stays on its sandbox credentials until you switch the mode to live. Blank fields fall back to the env values.",
    fields: [
      {
        key: "esewaEnv",
        label: "eSewa mode",
        options: [
          { value: "test", label: "Sandbox" },
          { value: "live", label: "Live" },
        ],
      },
      { key: "esewaMerchantCode", label: "eSewa merchant code", placeholder: "EPAYTEST" },
      { key: "esewaSecret", label: "eSewa secret key", type: "password" },
      {
        key: "khaltiEnv",
        label: "Khalti mode",
        options: [
          { value: "test", label: "Sandbox" },
          { value: "live", label: "Live" },
        ],
      },
      { key: "khaltiSecret", label: "Khalti secret key", type: "password" },
      { key: "stripeSecret", label: "Stripe secret key", type: "password", placeholder: "sk_live_…" },
      { key: "stripeCurrency", label: "Stripe currency", placeholder: "usd" },
    ],
  },
  {
    title: "WhatsApp",
    description: "WhatsApp Business Cloud API credentials for order follow-ups.",
    note: "Stored for the messaging integration; tokens are never rendered back to the browser.",
    fields: [
      { key: "whatsappApiUrl", label: "API base URL", placeholder: "https://graph.facebook.com/v20.0" },
      { key: "whatsappPhoneId", label: "Phone number ID" },
      { key: "whatsappToken", label: "Access token", type: "password" },
    ],
  },
];

function isConfigured(settings: SiteSettings, field: Field) {
  return Boolean(settings[field.key]);
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  if (me?.role !== "super_admin") redirect("/admin");

  const params = await searchParams;
  const settings = await getSiteSettings({ fresh: true });

  return (
    <div className="space-y-5">
      {params.saved ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Settings saved.</p>
      ) : null}
      {params.error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          Settings could not be saved. Apply <code>supabase/migrations/004_admin_console.sql</code> so the
          <code> site_settings</code> table and its policy exist.
        </p>
      ) : null}

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">Application settings</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
          Integrations and brand details. Secrets are stored server-side and only readable by super admins; leave a secret
          field blank to keep the value that is already saved.
        </p>
      </div>

      <form action={saveSettings} className="space-y-5">
        {SECTIONS.map((section) => (
          <section key={section.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-sm">
            <header className="mb-4">
              <h3 className="text-base font-semibold text-[var(--foreground)]">{section.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{section.description}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{section.note}</p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => {
                const secret = SECRET_SETTING_KEYS.includes(field.key);
                const configured = isConfigured(settings, field);
                const id = `setting-${field.key}`;

                return (
                  <div key={field.key} className={field.options ? "" : "sm:col-span-1"}>
                    <label htmlFor={id} className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      <span>{field.label}</span>
                      {secret ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${configured ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                          {configured ? "Configured" : "Not set"}
                        </span>
                      ) : null}
                    </label>

                    {field.options ? (
                      <select
                        id={id}
                        name={field.key}
                        defaultValue={settings[field.key] || field.options[0]!.value}
                        className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
                      >
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        name={field.key}
                        type={secret ? "password" : field.type ?? "text"}
                        defaultValue={secret ? "" : settings[field.key]}
                        placeholder={secret ? (configured ? "•••••••• saved — leave blank to keep" : "Not configured") : field.placeholder}
                        autoComplete="off"
                        className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
                      />
                    )}

                    {field.hint ? <p className="mt-1 text-xs text-[var(--muted)]">{field.hint}</p> : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
          >
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}
