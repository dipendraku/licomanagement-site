import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";

const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
import { PLANS as DEFAULT_PLANS } from "@/lib/marketing/content";

/**
 * Site pricing lives in one place and can be edited from /admin/pricing.
 *
 * Storage:
 *  - Supabase table `site_pricing` when the project is configured
 *  - otherwise a local JSON file (.data/pricing.json) so demo installs still work
 *
 * Nothing else in the app hardcodes a price: pages, checkout and emails all read
 * through getPricing() / priceOf().
 */

export interface PlanPricing {
  id: string;
  name: string;
  tagline: string;
  students: string;
  priceNpr: number;
  priceUsd: number;
  discountPercent: number; // 0-90, applies to both currencies
  promoLabel: string; // e.g. "Dashain offer"
  active: boolean;
  features: string[];
  cta: string;
  featured: boolean;
}

const FILE = path.join(process.cwd(), ".data", "pricing.json");
const CACHE_MS = 30_000;

let cache: { at: number; plans: PlanPricing[] } | null = null;

function defaults(): PlanPricing[] {
  return DEFAULT_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    tagline: plan.tagline,
    students: plan.students,
    priceNpr: plan.priceNpr,
    priceUsd: plan.priceUsd,
    discountPercent: 0,
    promoLabel: "",
    active: true,
    features: plan.features,
    cta: plan.cta,
    featured: Boolean(plan.featured),
  }));
}

function normalize(row: Partial<PlanPricing> & { id: string }): PlanPricing {
  const base = defaults().find((plan) => plan.id === row.id) ?? defaults()[0]!;
  return {
    ...base,
    ...row,
    priceNpr: Number(row.priceNpr ?? base.priceNpr),
    priceUsd: Number(row.priceUsd ?? base.priceUsd),
    discountPercent: Math.min(90, Math.max(0, Number(row.discountPercent ?? 0))),
    features: Array.isArray(row.features) && row.features.length ? row.features : base.features,
  };
}

async function readFile(): Promise<PlanPricing[]> {
  try {
    const raw = JSON.parse(await fs.readFile(FILE, "utf8")) as PlanPricing[];
    if (!Array.isArray(raw) || !raw.length) return defaults();
    const byId = new Map(raw.map((row) => [row.id, row]));
    return defaults().map((plan) => normalize({ ...plan, ...(byId.get(plan.id) ?? {}) }));
  } catch {
    return defaults();
  }
}

async function writeFile(plans: PlanPricing[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(plans, null, 2), "utf8");
}

export async function getPricing(options: { fresh?: boolean } = {}): Promise<PlanPricing[]> {
  if (!options.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.plans;

  let plans: PlanPricing[] = defaults();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const { data } = await supabase.from("site_pricing").select("*");
        if (data && data.length) {
          const byId = new Map(data.map((row) => [String(row.id), row as Partial<PlanPricing> & { id: string }]));
          plans = defaults().map((plan) => normalize({ ...plan, ...(byId.get(plan.id) ?? {}) }));
        }
      }
    } catch {
      // fall through to the file / defaults
    }
  } else {
    plans = await readFile();
  }

  cache = { at: Date.now(), plans };
  return plans;
}

export async function savePricing(updates: PlanPricing[]): Promise<PlanPricing[]> {
  const current = await getPricing({ fresh: true });
  const byId = new Map(updates.map((row) => [row.id, row]));
  const next = current.map((plan) => normalize({ ...plan, ...(byId.get(plan.id) ?? {}) }));

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (!supabase) throw new Error("Supabase is not available to save pricing.");
    const rows = next.map((plan) => ({
      id: plan.id,
      name: plan.name,
      tagline: plan.tagline,
      students: plan.students,
      price_npr: plan.priceNpr,
      price_usd: plan.priceUsd,
      discount_percent: plan.discountPercent,
      promo_label: plan.promoLabel,
      active: plan.active,
      featured: plan.featured,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("site_pricing").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(error.message);
  } else {
    await writeFile(next);
  }

  cache = { at: Date.now(), plans: next };
  return next;
}

/** Price actually charged today, after any admin discount. */
export function priceOf(plan: PlanPricing, currency: "NPR" | "USD") {
  const list = currency === "USD" ? plan.priceUsd : plan.priceNpr;
  const factor = (100 - plan.discountPercent) / 100;
  const final = Math.round(list * factor);
  return { list, final, discountPercent: plan.discountPercent, currency };
}
