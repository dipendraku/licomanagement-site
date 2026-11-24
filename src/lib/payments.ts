import crypto from "node:crypto";
import { getSiteSettings } from "@/lib/site-settings";

/**
 * Payment gateways for the marketing site.
 *
 * Configuration comes from Admin -> Settings (stored in site_settings) with the env
 * vars below as fallbacks. Sandbox is the default so nothing can accidentally charge
 * a card.
 *
 *  eSewa   (Nepal)  esewaEnv=test|live, esewaMerchantCode, esewaSecret
 *                   test defaults: EPAYTEST / 8gBm/:&vY9n7/3X  (public sandbox credentials)
 *  Khalti  (Nepal)  khaltiEnv=test|live, khaltiSecret
 *  Stripe  (intl)   stripeSecret, stripeCurrency (default usd)
 *
 * eSewa v2 is a signed HTML form POST, so checkout returns { kind: "form" } for it and
 * { kind: "redirect" } for Khalti/Stripe. With nothing configured the demo gateway is used.
 */

export type Gateway = "esewa" | "khalti" | "stripe" | "demo";

export interface OrderRequest {
  plan: string;
  planName: string;
  amount: number;
  currency: "NPR" | "USD";
  customerName: string;
  customerEmail: string;
  schoolName: string;
  phone?: string;
}

export type CheckoutSession =
  | { kind: "redirect"; gateway: Gateway; redirectUrl: string; reference: string }
  | { kind: "form"; gateway: Gateway; action: string; fields: Record<string, string>; reference: string };

export interface GatewayConfig {
  esewa: { live: boolean; merchantCode: string; secret: string; action: string };
  khalti: { live: boolean; secret: string };
  stripe: { secret: string; currency: string };
}

const env = (name: string) => process.env[name]?.trim() || "";

export async function paymentConfig(): Promise<GatewayConfig> {
  const settings = await getSiteSettings();
  const isLive = (value: string) => value.trim().toLowerCase() === "live";
  const esewaLive = isLive(settings.esewaEnv);

  return {
    esewa: {
      live: esewaLive,
      merchantCode: settings.esewaMerchantCode || (esewaLive ? "" : "EPAYTEST"),
      secret: settings.esewaSecret || (esewaLive ? "" : "8gBm/:&vY9n7/3X"),
      action: esewaLive
        ? "https://epay.esewa.com.np/api/epay/main/v2/form"
        : "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    },
    khalti: { live: isLive(settings.khaltiEnv), secret: settings.khaltiSecret },
    stripe: { secret: settings.stripeSecret, currency: settings.stripeCurrency || "usd" },
  };
}

export async function availableGateways(): Promise<{ id: Gateway; label: string; hint: string }[]> {
  const config = await paymentConfig();
  const list: { id: Gateway; label: string; hint: string }[] = [];

  if (config.esewa.merchantCode && config.esewa.secret) {
    list.push({
      id: "esewa",
      label: config.esewa.live ? "eSewa" : "eSewa sandbox",
      hint: config.esewa.live ? "Nepal · wallet" : "Test wallet — no money moves",
    });
  }

  if (config.khalti.secret) {
    list.push({
      id: "khalti",
      label: config.khalti.live ? "Khalti" : "Khalti sandbox",
      hint: config.khalti.live ? "Nepal · wallet / bank" : "Test environment — no money moves",
    });
  }

  if (config.stripe.secret) {
    list.push({ id: "stripe", label: "Card (Stripe)", hint: "International cards" });
  }

  if (list.length === 0) {
    list.push({ id: "demo", label: "Demo checkout", hint: "No gateway configured yet" });
  }
  return list;
}

export async function defaultGateway(): Promise<Gateway> {
  return (await availableGateways())[0]!.id;
}

function reference(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function siteUrl(): string {
  return (env("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000").replace(/\/+$/, "");
}

/** eSewa ePay v2 requires an HMAC-SHA256 signature over the signed field list. */
export function esewaSignature(totalAmount: string | number, transactionUuid: string, productCode: string, secret: string): string {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
}

function esewaSession(order: OrderRequest, config: GatewayConfig["esewa"]): CheckoutSession {
  const txn = reference("ESW");
  const amount = String(order.amount);
  const signedFieldNames = "total_amount,transaction_uuid,product_code";
  const signature = esewaSignature(amount, txn, config.merchantCode, config.secret);

  return {
    kind: "form",
    gateway: "esewa",
    action: config.action,
    reference: txn,
    fields: {
      amount,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: txn,
      product_code: config.merchantCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${siteUrl()}/checkout/success?ref=${txn}&gateway=esewa`,
      failure_url: `${siteUrl()}/checkout/failed?ref=${txn}&gateway=esewa`,
      signed_field_names: signedFieldNames,
      signature,
    },
  };
}

async function khaltiSession(order: OrderRequest, config: GatewayConfig["khalti"]): Promise<CheckoutSession> {
  const txn = reference("KHL");
  const live = config.live;
  const base = live ? "https://khalti.com/api/v2" : "https://a.khalti.com/api/v2";
  const response = await fetch(`${base}/epayment/initiate/`, {
    method: "POST",
    headers: { authorization: `Key ${config.secret}`, "content-type": "application/json" },
    body: JSON.stringify({
      return_url: `${siteUrl()}/checkout/success?ref=${txn}&gateway=khalti`,
      website_url: siteUrl(),
      amount: Math.round(order.amount * 100),
      purchase_order_id: txn,
      purchase_order_name: `${order.planName} — ${order.schoolName}`,
      customer_info: { name: order.customerName, email: order.customerEmail, phone: order.phone || undefined },
    }),
  });
  const json = (await response.json()) as { payment_url?: string; detail?: string };
  if (!response.ok || !json.payment_url) {
    throw new Error(json.detail || `Khalti refused the payment (${response.status})`);
  }
  return { kind: "redirect", gateway: "khalti", redirectUrl: json.payment_url, reference: txn };
}

async function stripeSession(order: OrderRequest, config: GatewayConfig["stripe"]): Promise<CheckoutSession> {
  const txn = reference("STR");
  const currency = config.currency || "usd";
  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": currency,
    "line_items[0][price_data][unit_amount]": String(Math.round(order.amount * 100)),
    "line_items[0][price_data][product_data][name]": `${order.planName} — EduCore SMS`,
    success_url: `${siteUrl()}/checkout/success?ref=${txn}&gateway=stripe`,
    cancel_url: `${siteUrl()}/checkout/failed?ref=${txn}&gateway=stripe`,
    customer_email: order.customerEmail,
    "metadata[plan]": order.plan,
    "metadata[school]": order.schoolName,
    "metadata[reference]": txn,
  });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { authorization: `Bearer ${config.secret}`, "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await response.json()) as { url?: string; error?: { message?: string } };
  if (!response.ok || !json.url) throw new Error(json.error?.message || `Stripe refused the session (${response.status})`);
  return { kind: "redirect", gateway: "stripe", redirectUrl: json.url, reference: txn };
}

export async function createCheckout(order: OrderRequest, gateway: Gateway): Promise<CheckoutSession> {
  const config = await paymentConfig();

  switch (gateway) {
    case "esewa":
      return esewaSession(order, config.esewa);
    case "khalti":
      return await khaltiSession(order, config.khalti);
    case "stripe":
      return await stripeSession(order, config.stripe);
    case "demo":
    default: {
      const txn = reference("DEMO");
      return {
        kind: "redirect",
        gateway: "demo",
        redirectUrl: `/checkout/success?ref=${txn}&demo=1`,
        reference: txn,
      };
    }
  }
}
