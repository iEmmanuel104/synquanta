// Vercel serverless function — SynQuanta website contact form.
// Sends the enquiry to the team inbox via Resend (same verified sender the
// platform uses). Set RESEND_API_KEY + EMAIL_FROM (+ optional CONTACT_TO) in
// the Vercel project env. Runs separately from the Vite build.
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
    const message = String(body.message || "").trim();
    // Honeypot: bots fill hidden fields; humans don't.
    if (String(body.website || "").trim()) return res.status(200).json({ ok: true });

    if (!name || !email || !message)
      return res.status(400).json({ error: "Please add your name, email and a message." });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "That email doesn't look right." });
    if (message.length > 5000) return res.status(400).json({ error: "Message is a little too long." });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || "info@synquanta.com";
    const to = process.env.CONTACT_TO || from;
    if (!apiKey) return res.status(500).json({ error: "Contact is not configured yet — please email us directly." });

    const resend = new Resend(apiKey);
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#1A1F1C;max-width:560px">
        <h2 style="color:#1B4332;margin:0 0 12px">New website enquiry</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tr><td style="padding:6px 0;color:#74796E;width:96px">Name</td><td style="padding:6px 0;font-weight:600">${esc(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#74796E">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}" style="color:#2D6A4F">${esc(email)}</a></td></tr>
          ${company ? `<tr><td style="padding:6px 0;color:#74796E">Company</td><td style="padding:6px 0">${esc(company)}</td></tr>` : ""}
        </table>
        <div style="margin-top:14px;padding:14px 16px;background:#F8FAF9;border:1px solid #D8F3DC;border-radius:12px;white-space:pre-wrap;font-size:14px;line-height:1.6">${esc(message)}</div>
        <p style="margin-top:16px;color:#95A097;font-size:12px">Sent from synquanta.com · reply directly to reach ${esc(name)}.</p>
      </div>`;

    const { error } = await resend.emails.send({
      from: `SynQuanta Website <${from}>`,
      to,
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` · ${company}` : ""}`,
      html,
    });
    if (error) return res.status(502).json({ error: "Couldn't send right now — please email info@synquanta.com." });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Something went wrong. Please try again or email us directly." });
  }
}
