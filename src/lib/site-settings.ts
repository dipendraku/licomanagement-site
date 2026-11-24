import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Editable application settings (Admin -> Settings).
 *
 * Stored in public.site_settings (RLS: super_admin only) and read by server code
 * such as mail.ts and payments.ts. Empty values fall back to the env defaults, so
 * an unconfigured project keeps working exactly as before.
 */

export const SETTING_KEYS = [
  "siteName",
  "supportEmail",
  "supportPhone",
  "whatsappNumber",
  "smtpHost",
  "smtpPort",
  "smtpSecure",
  "smtpUser",
  "smtpPass",
  "smtpFromName",
  "smtpFromEmail",
  "esewaEnv",
  "esewaMerchantCode",
  "esewaSecret",
  "khaltiEnv",
  "khaltiSecret",
  "stripeSecret",
  "stripeCurrency",
  "whatsappApiUrl",
  "whatsappPhoneId",
  "whatsappToken",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];
export type SiteSettings = Record<SettingKey, string>;

/** Values that must never be rendered back into HTML. */
export const SECRET_SETTING_KEYS: SettingKey[] = ["smtpPass", "esewaSecret", "khaltiSecret", "stripeSecret", "whatsappToken"];

const env = (name: string) => process.env[name]?.trim() || "";

function defaults(): SiteSettings {
  const gmailUser = env("GMAIL_USER");
  return {
    siteName: env("NEXT_PUBLIC_SITE_NAME") || "Lico Management",
    supportEmail: env("SUPPORT_EMAIL") || "support@licomanagement.com",
    supportPhone: env("SUPPORT_PHONE") || "+977 9847435894",
    whatsappNumber: env("WHATSAPP_NUMBER") || "9779847435894",
    smtpHost: gmailUser ? "smtp.gmail.com" : env("SMTP_HOST"),
    smtpPort: gmailUser ? "465" : env("SMTP_PORT"),
    smtpSecure: gmailUser ? "true" : env("SMTP_SECURE"),
    smtpUser: gmailUser || env("SMTP_USER"),
    smtpPass: env("GMAIL_APP_PASSWORD") || env("SMTP_PASS"),
    smtpFromName: env("SUPPORT_NAME") || "Lico Management",
    smtpFromEmail: env("SMTP_FROM_EMAIL") || gmailUser || env("SUPPORT_EMAIL") || "support@licomanagement.com",
    esewaEnv: env("ESEWA_ENV") || "test",
    esewaMerchantCode: env("ESEWA_MERCHANT_CODE"),
    esewaSecret: env("ESEWA_SECRET_KEY"),
    khaltiEnv: env("KHALTI_ENV") || "test",
    khaltiSecret: env("KHALTI_SECRET_KEY"),
    stripeSecret: env("STRIPE_SECRET_KEY"),
    stripeCurrency: env("STRIPE_CURRENCY") || "usd",
    whatsappApiUrl: env("WHATSAPP_API_URL") || "https://graph.facebook.com/v20.0",
    whatsappPhoneId: env("WHATSAPP_PHONE_ID"),
    whatsappToken: env("WHATSAPP_TOKEN"),
  };
}

const CACHE_MS = 15_000;
let cache: { at: number; settings: SiteSettings } | null = null;

export async function getSiteSettings(options: { fresh?: boolean } = {}): Promise<SiteSettings> {
  if (!options.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.settings;

  const settings = defaults();

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key,value");
    for (const row of data ?? []) {
      const key = String(row.key) as SettingKey;
      if (!SETTING_KEYS.includes(key)) continue;
      const value = String(row.value ?? "").trim();
      if (value) settings[key] = value;
    }
  } catch {
    // table or project not configured yet - keep the env defaults
  }

  cache = { at: Date.now(), settings };
  return settings;
}

export async function saveSiteSettings(values: Partial<Record<SettingKey, string>>): Promise<void> {
  const supabase = await createClient();
  const rows = Object.entries(values).map(([key, value]) => ({
    key,
    value: value ?? "",
    updated_at: new Date().toISOString(),
  }));

  if (rows.length === 0) return;

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
  cache = null;
}
