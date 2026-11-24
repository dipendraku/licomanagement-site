import { NextResponse } from "next/server";
import { brandedEmail, SALES_EMAIL, sendMail, escapeHtml, SUPPORT_EMAIL } from "@/lib/mail";

export const runtime = "nodejs";

interface ContactBody {
  name?: string;
  school?: string;
  role?: string;
  email?: string;
  phone?: string;
  students?: string;
  topic?: string;
  message?: string;
}

const LIMIT = { name: 120, school: 160, role: 80, email: 160, phone: 32, students: 40, topic: 40, message: 2000 };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// very small in-memory throttle: 5 submissions per IP per 10 minutes
const hits = new Map<string, { count: number; reset: number }>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + 10 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (throttled(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = clean(body.name, LIMIT.name);
  const school = clean(body.school, LIMIT.school);
  const email = clean(body.email, LIMIT.email);
  const role = clean(body.role, LIMIT.role);
  const phone = clean(body.phone, LIMIT.phone);
  const students = clean(body.students, LIMIT.students);
  const topic = clean(body.topic, LIMIT.topic) || "demo";
  const message = clean(body.message, LIMIT.message);

  const problems: string[] = [];
  if (name.length < 2) problems.push("name");
  if (school.length < 2) problems.push("school");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) problems.push("email");
  if (problems.length) {
    return NextResponse.json({ error: `Please check: ${problems.join(", ")}.` }, { status: 400 });
  }

  const summary = [
    `New ${topic} request from the website`,
    "",
    `Name:      ${name}`,
    `School:    ${school}`,
    `Role:      ${role || "—"}`,
    `Email:     ${email}`,
    `Phone:     ${phone || "—"}`,
    `Students:  ${students || "—"}`,
    `Topic:     ${topic}`,
    "",
    "Message:",
    message || "(none)",
    "",
    `Received: ${new Date().toISOString()}`,
    `IP: ${ip}`,
  ].join("\n");

  const internal = await sendMail({
    to: SALES_EMAIL,
    replyTo: email,
    subject: `[Website] ${topic} request — ${school}`,
    text: summary,
    html: brandedEmail(
      `New ${escapeHtml(topic)} request`,
      `<table style="font-size:14px;border-collapse:collapse">
        ${[
          ["Name", name],
          ["School", school],
          ["Role", role || "—"],
          ["Email", email],
          ["Phone", phone || "—"],
          ["Students", students || "—"],
        ]
          .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#597062">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`)
          .join("")}
      </table>
      <p style="margin:16px 0 4px;color:#597062">Message</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(message || "(none)")}</p>`,
    ),
  });

  // auto-reply so the requester knows it landed (never blocks the request)
  const auto = await sendMail({
    to: email,
    subject: "We received your demo request — EduCore SMS",
    text: [
      `Namaste ${name},`,
      "",
      `Thank you for reaching out about EduCore SMS for ${school}.`,
      "We reply within one business day (usually much sooner) and will propose two or three slots for a 15-minute demo using your own classes and sections.",
      "",
      "If it is urgent, call +977 9847435894.",
      "",
      `— EduCore SMS team`,
      `Support: ${SUPPORT_EMAIL}`,
    ].join("\n"),
    html: brandedEmail(
      "We received your request",
      `<p>Namaste <strong>${escapeHtml(name)}</strong>,</p>
       <p>Thank you for reaching out about EduCore SMS for <strong>${escapeHtml(school)}</strong>.</p>
       <p>We reply within one business day (usually much sooner) and will propose two or three slots for a 15-minute demo using your own classes and sections.</p>
       <p>If it is urgent, call <a href="tel:+9779847435894" style="color:#1d6b42">+977 9847435894</a>.</p>`,
    ),
  });

  return NextResponse.json({
    ok: true,
    delivered: internal.ok,
    acknowledged: auto.ok,
    via: internal.via,
    note: internal.ok ? undefined : "Email is not configured on this deployment yet — the request was logged.",
  });
}
