// Cloudflare Pages Function: SynQuanta website contact form (POST /api/contact).
// Port of the old Vercel function (api/contact.ts), same contract:
//
// PRIMARY: forward the enquiry to the platform API, which PERSISTS it to the
// Railway Postgres DB and notifies the team. That is the system of record.
// FALLBACK: only if the platform is unreachable, email the team directly via
// the Resend REST API so a lead is not lost during platform downtime.
//
// Env (Pages project secrets/vars): PLATFORM_CONTACT_URL (optional),
// PLATFORM_CONTACT_SECRET, RESEND_API_KEY, EMAIL_FROM, CONTACT_TO.

interface Env {
  PLATFORM_CONTACT_URL?: string;
  PLATFORM_CONTACT_SECRET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  CONTACT_TO?: string;
}
type Ctx = { request: Request; env: Env };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const s = (k: string) => String(body[k] ?? '').trim();
    const name = s('name');
    const email = s('email');
    const company = s('company');
    const phone = s('phone');
    const need = s('need');
    const message = s('message');

    // Honeypot: bots fill hidden fields; humans don't.
    if (s('website')) return json(200, { ok: true });

    if (!name || !email || !message) return json(400, { error: 'Please add your name, email and a message.' });
    if (!EMAIL_RE.test(email)) return json(400, { error: "That email doesn't look right." });
    if (message.length > 5000) return json(400, { error: 'Message is a little too long.' });

    const pageUrl = (s('pageUrl') || request.headers.get('referer') || '').slice(0, 500);

    // ── PRIMARY: forward to the platform (store + notify). ──────────────────
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (env.PLATFORM_CONTACT_SECRET) headers['x-contact-secret'] = env.PLATFORM_CONTACT_SECRET;
      const res = await fetch(env.PLATFORM_CONTACT_URL || 'https://api.synquanta.com/api/contact', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, company, phone, need, message, website: '', pageUrl }),
        signal: AbortSignal.timeout(12_000),
      });
      const out = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) return json(200, { ok: true });
      // A 4xx from the platform is a genuine validation error: surface it.
      if (res.status >= 400 && res.status < 500) {
        return json(res.status, { error: out.error || 'Please check your details and try again.' });
      }
      // 5xx → fall through to the email fallback.
    } catch {
      // Network error / timeout → fall through.
    }

    // ── FALLBACK: platform unreachable; best-effort direct email. ───────────
    if (!env.RESEND_API_KEY) {
      return json(502, { error: "We couldn't submit that just now. Please email info@synquanta.com directly." });
    }
    const composed = [
      need ? `Need: ${esc(need)}` : null,
      phone ? `Phone: ${esc(phone)}` : null,
      company ? `Company: ${esc(company)}` : null,
      '',
      esc(message),
    ]
      .filter((l) => l !== null)
      .join('\n');
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#1A1F1C;max-width:560px">
        <h2 style="color:#1B4332;margin:0 0 12px">New website enquiry (fallback)</h2>
        <p><b>${esc(name)}</b> · <a href="mailto:${esc(email)}" style="color:#2D6A4F">${esc(email)}</a></p>
        <div style="margin-top:14px;padding:14px 16px;background:#F8FAF9;border:1px solid #D8F3DC;border-radius:12px;white-space:pre-wrap;font-size:14px;line-height:1.6">${composed}</div>
        <p style="margin-top:16px;color:#95A097;font-size:12px">Sent from synquanta.com. The platform API was unreachable, so this was NOT saved to the DB; follow up manually.</p>
      </div>`;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `SynQuanta Website <${env.EMAIL_FROM || 'hello@outreach.synquanta.com'}>`,
        to: env.CONTACT_TO || 'info@synquanta.com',
        reply_to: email,
        subject: `New enquiry from ${name}${company ? ` · ${company}` : ''}`,
        html,
      }),
    });
    if (!r.ok) return json(502, { error: "Couldn't send right now. Please email info@synquanta.com." });
    return json(200, { ok: true });
  } catch {
    return json(500, { error: 'Something went wrong. Please try again or email us directly.' });
  }
};

export const onRequest = async (): Promise<Response> =>
  new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json' },
  });
