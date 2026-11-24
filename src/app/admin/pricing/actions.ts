"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPricing, savePricing, type PlanPricing } from "@/lib/pricing-store";

export interface PricingActionState {
  ok: boolean;
  message: string;
}

function num(value: FormDataEntryValue | null, fallback: number): number {
  const parsed = Number(String(value ?? "").replace(/[,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function updatePricing(_prev: PricingActionState | null, formData: FormData): Promise<PricingActionState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, message: "Sign in first." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();
  if (!profile || !["super_admin", "employee"].includes(profile.role)) {
    return { ok: false, message: "Only staff can change pricing." };
  }

  const current = await getPricing({ fresh: true });

  const updates: PlanPricing[] = current.map((plan) => {
    const priceNpr = num(formData.get(`${plan.id}_npr`), plan.priceNpr);
    const priceUsd = num(formData.get(`${plan.id}_usd`), plan.priceUsd);
    const discount = num(formData.get(`${plan.id}_discount`), plan.discountPercent);
    const promo = String(formData.get(`${plan.id}_promo`) ?? "").trim().slice(0, 60);
    const active = formData.get(`${plan.id}_active`) !== null;

    if (priceNpr < 0 || priceUsd < 0) throw new Error("Prices cannot be negative.");
    if (discount < 0 || discount > 90) throw new Error("Discount must be between 0 and 90 percent.");

    return {
      ...plan,
      priceNpr: Math.round(priceNpr),
      priceUsd: Math.round(priceUsd),
      discountPercent: Math.round(discount),
      promoLabel: promo,
      active,
    };
  });

  try {
    await savePricing(updates);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save pricing." };
  }

  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/checkout");
  revalidatePath("/products/educore-sms");
  revalidatePath("/admin/pricing");

  const live = updates.filter((plan) => plan.active && plan.discountPercent > 0);
  return {
    ok: true,
    message: live.length
      ? `Saved. ${live.length} plan(s) now show a discount.`
      : "Saved. Public prices updated.",
  };
}
