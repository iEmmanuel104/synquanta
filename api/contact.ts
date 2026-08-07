// Vercel serverless function — SynQuanta website contact form.
//
// PRIMARY path: forward the enquiry to the platform API
// (https://api.synquanta.com/api/contact), which PERSISTS it to the Railway
// Postgres DB and sends the team notification from the verified outreach
// subdomain (so it actually delivers). This is the system of record — every
// enquiry is stored, not just fire-and-forget emailed.
//
// FALLBACK path: only if the platform is unreachable, best-effort email direct
// via Resend so a lead isn't lost during platform downtime.
//
// Env (Vercel project): PLATFORM_CONTACT_URL (default below),
// PLATFORM_CONTACT_SECRET (optional, must match the platform's
// CONTACT_INGEST_SECRET when that gate is enabled), and — for the fallback —
// RESEND_API_KEY + EMAIL_FROM (+ optional CONTACT_TO).
import { Resend } from "resend";

// Vercel Node runtime provides `process`, but the website has no @types/node in
// its tsconfig scope, so declare the slice we use to keep the build type-clean.
declare const process: { env: Record<string, string | undefined> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const PLATFORM_URL = process.env.PLATFORM_CONTACT_URL || "https://api.synquanta.com/api/contact";

async function forwardToPlatform(payload: Record<string, unknown>): Promise<{ ok: boolean; status: number; body: any }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.PLATFORM_CONTACT_SECRET) headers["x-contact-secret"] = process.env.PLATFORM_CONTACT_SECRET;
    const res = await fetch(PLATFORM_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, body };
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim();
    const phone = String(body.phone || "").trim();
    const need = String(body.need || "").trim();
    const message = String(body.message || "").trim();
    const website = String(body.website || "").trim(); // honeypot

    // Honeypot: bots fill hidden fields; humans don't.
    if (website) return res.status(200).json({ ok: true });

    if (!name || !email || !message)
      return res.status(400).json({ error: "Please add your name, email and a message." });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "That email doesn't look right." });
    if (message.length > 5000) return res.status(400).json({ error: "Message is a little too long." });

    // ── PRIMARY: forward to the platform (store + notify). ──────────────────
    try {
      const fwd = await forwardToPlatform({
        name,
        email,
        company,
        phone,
        need,
        message,
        website: "",
        pageUrl: String(req.headers["referer"] || req.headers["referrer"] || "").slice(0, 500),
      });
      if (fwd.ok) return res.status(200).json({ ok: true });
      // A 4xx from the platform is a genuine validation error — surface it.
      if (fwd.status >= 400 && fwd.status < 500) {
        return res.status(fwd.status).json({ error: fwd.body?.error || "Please check your details and try again." });
      }
      // 5xx → fall through to the email fallback below.
    } catch {
      // Network error / timeout reaching the platform → fall through to fallback.
    }

    // ── FALLBACK: platform unreachable — best-effort direct email so the lead
    //    isn't lost. (No DB record in this path; the platform is the store.) ──
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || "hello@outreach.synquanta.com";
    const to = process.env.CONTACT_TO || "info@synquanta.com";
    if (!apiKey) {
      return res
        .status(502)
        .json({ error: "We couldn't submit that just now. Please email info@synquanta.com directly." });
    }

    const resend = new Resend(apiKey);
    const composed = [
      need ? `Need: ${esc(need)}` : null,
      phone ? `Phone: ${esc(phone)}` : null,
      company ? `Company: ${esc(company)}` : null,
      "",
      esc(message),
    ]
      .filter((l) => l !== null)
      .join("\n");
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#1A1F1C;max-width:560px">
        <h2 style="color:#1B4332;margin:0 0 12px">New website enquiry (fallback)</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tr><td style="padding:6px 0;color:#74796E;width:96px">Name</td><td style="padding:6px 0;font-weight:600">${esc(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#74796E">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}" style="color:#2D6A4F">${esc(email)}</a></td></tr>
          ${company ? `<tr><td style="padding:6px 0;color:#74796E">Company</td><td style="padding:6px 0">${esc(company)}</td></tr>` : ""}
        </table>
        <div style="margin-top:14px;padding:14px 16px;background:#F8FAF9;border:1px solid #D8F3DC;border-radius:12px;white-space:pre-wrap;font-size:14px;line-height:1.6">${composed}</div>
        <p style="margin-top:16px;color:#95A097;font-size:12px">Sent from synquanta.com (platform API was unreachable, so this was NOT saved to the DB; follow up manually).</p>
      </div>`;

    const { error } = await resend.emails.send({
      from: `SynQuanta Website <${from}>`,
      to,
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` · ${company}` : ""}`,
      html,
    });
    if (error) return res.status(502).json({ error: "Couldn't send right now. Please email info@synquanta.com." });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Something went wrong. Please try again or email us directly." });
  }
}
