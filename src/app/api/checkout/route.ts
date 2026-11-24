import { NextResponse } from "next/server";
import { availableGateways, createCheckout, type Gateway } from "@/lib/payments";
import { brandedEmail, SALES_EMAIL, sendMail } from "@/lib/mail";
import { getPricing, priceOf } from "@/lib/pricing-store";

export const runtime = "nodejs";

interface CheckoutBody {
  plan?: string;
  gateway?: string;
  name?: string;
  email?: string;
  school?: string;
  phone?: string;
  currency?: string;
}

const text = (value: unknown, max = 160) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // price comes from the store, never from the browser
  const plans = await getPricing();
  const plan = plans.find((item) => item.id === text(body.plan, 40) && item.active);
  if (!plan) return NextResponse.json({ error: "That plan is not available right now." }, { status: 400 });

  const name = text(body.name, 120);
  const email = text(body.email);
  const school = text(body.school, 160);
  const phone = text(body.phone, 32);
  if (name.length < 2 || school.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Name, school and a valid email are required." }, { status: 400 });
  }

  const gateways = (await availableGateways()).map((item) => item.id);
  const requested = text(body.gateway, 20) as Gateway | "";
  const gateway: Gateway = requested && gateways.includes(requested as Gateway) ? (requested as Gateway) : (gateways[0] as Gateway);

  const currency: "NPR" | "USD" = text(body.currency, 3).toUpperCase() === "USD" ? "USD" : "NPR";
  const priced = priceOf(plan, currency);

  const order = {
    plan: plan.id,
    planName: plan.name,
    amount: priced.final,
    currency,
    customerName: name,
    customerEmail: email,
    schoolName: school,
    phone,
  };

  try {
    const session = await createCheckout(order, gateway);

    void sendMail({
      to: SALES_EMAIL,
      replyTo: email,
      subject: `[Checkout] ${plan.name} · ${school} · ${currency} ${priced.final}`,
      text: [
        `Checkout started — ${session.gateway}`,
        "",
        `Plan:      ${plan.name} (${plan.id})`,
        `List price:${currency} ${priced.list}`,
        `Discount:  ${priced.discountPercent}%`,
        `Charged:   ${currency} ${priced.final}`,
        `Customer:  ${name} <${email}>`,
        `Phone:     ${phone || "—"}`,
        `School:    ${school}`,
        `Reference: ${session.reference}`,
        `Started:   ${new Date().toISOString()}`,
      ].join("\n"),
      html: brandedEmail(
        "Checkout started",
        `<p><strong>${plan.name}</strong> · ${currency} ${priced.final}${
          priced.discountPercent ? ` <span style="color:#597062">(list ${currency} ${priced.list}, −${priced.discountPercent}%)</span>` : ""
        }</p>
         <p>${school}<br/>${name} &lt;${email}&gt;${phone ? ` · ${phone}` : ""}</p>
         <p style="color:#597062;font-size:13px">Gateway: ${session.gateway} · Reference: ${session.reference}</p>`,
      ),
    }).catch(() => undefined);

    return NextResponse.json({
      ok: true,
      kind: session.kind,
      gateway: session.gateway,
      reference: session.reference,
      amount: priced.final,
      currency,
      ...(session.kind === "redirect"
        ? { redirectUrl: session.redirectUrl, demo: session.gateway === "demo" }
        : { action: session.action, fields: session.fields }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start the checkout." },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ gateways: await availableGateways() });
}
