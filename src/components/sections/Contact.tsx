import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { FadeIn } from '../animations/FadeIn';
import { captureEvent } from '../../lib/posthog';
import { trackLead, trackContact, trackFormStart } from '../../lib/facebook-pixel';

type Status = 'idle' | 'sending' | 'sent' | 'error';

// `href` makes the entry clickable. The email address used to render as plain
// text, which meant the page told people to email us and then gave them no way
// to do it — a conversion leak, quite apart from the tracking.
const methods = [
  { icon: Mail, label: 'Email us', value: 'info@synquanta.com', href: 'mailto:info@synquanta.com' },
  { icon: Phone, label: 'Call us', value: 'Mon–Fri, 9–6' },
  { icon: MapPin, label: 'Who we work with', value: 'Founders & teams, remote-first' },
];

const needOptions = [
  'A web app or platform',
  'A mobile app (iOS / Android)',
  'Custom software',
  'AI & automation',
  'Bring my idea to life',
  'Something else',
];

const fieldCls =
  'w-full rounded-sq-lg border-[1.5px] border-cream-green bg-neutral-off-white px-3.5 py-3 text-[15px] text-forest-deep placeholder:text-neutral-light-gray outline-none transition-all duration-200 focus:border-sage-medium focus:bg-white focus:ring-4 focus:ring-sage-light/20';

export const Contact = ({ hideHeading = false }: { hideHeading?: boolean } = {}) => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    need: needOptions[0],
    message: '',
    website: '', // honeypot
  });

  // Fired once, the first time this visitor touches the form. A ref rather than
  // state because flipping it must not re-render the form mid-keystroke.
  const startedRef = useRef(false);
  const noteStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    captureEvent('contact_form_started');
    trackFormStart();
  };

  /**
   * Someone chose to email us instead of using the form. Meta's `Contact`
   * standard event. Weaker than `Lead` — a click is not a sent email — so do
   * not optimise campaigns against it once Lead carries enough volume.
   */
  const noteEmailClick = () => {
    captureEvent('contact_email_clicked', { location: 'contact_section' });
    trackContact({ content_category: 'email' });
  };

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      // Not the honeypot: it is hidden, so only a bot ever fills it, and a bot
      // must not look like a human starting an enquiry.
      if (k !== 'website') noteStart();
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      // The message field is optional in the UI, but the API requires a
      // non-empty message. Fall back to the selected "need" so a details-light
      // enquiry (name + email + need) still submits.
      const message = form.message.trim() || `Interested in: ${form.need}`;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone,
          need: form.need,
          message,
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not send your message.');
      // Conversion event so submissions are visible in PostHog (not just
      // pageviews). No PII beyond the need category + whether a company was given.
      captureEvent('contact_form_submitted', {
        need: form.need,
        has_company: Boolean(form.company),
        has_phone: Boolean(form.phone),
      });
      // The same conversion, as Meta's `Lead` standard event, so Ads Manager can
      // attribute an enquiry to the ad that produced it and optimise delivery
      // toward people who enquire. Fired only AFTER the request succeeds — a
      // Lead recorded on a failed submission trains the algorithm on nothing.
      // Deliberately no email, name or message: Meta receives the category only.
      trackLead({ content_category: form.need });
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your message.');
      setStatus('error');
    }
  };

  return (
    <Section id="contact" className="scroll-mt-20">
      {!hideHeading && (
        <SectionHeading
          title="Tell us about your project"
          subtitle="A few details is enough to start. You'll get back a plan and a price."
        />
      )}

      <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left — dark reassurance aside */}
        <FadeIn>
          <div className="wc-band relative flex h-full flex-col justify-center overflow-hidden rounded-sq-2xl p-8 shadow-sq-lg sm:p-9">
            <div className="sq-grid-pattern" style={{ opacity: 0.35 }} aria-hidden="true" />
            <div className="relative z-10">
              <span className="wc-gold-chip mb-5">
                <span className="sq-livedot h-[7px] w-[7px] rounded-full bg-wc-gold-bright" /> A real person reads this
              </span>
              <h3 className="mb-3.5 text-2xl font-semibold leading-snug tracking-tight text-white">
                No script, no pressure. Just a straight answer about what we'd build.
              </h3>
              <p className="mb-7 text-[15.5px] leading-relaxed text-white/70">
                An idea, a rough spec, or a product that already exists and is creaking. Tell us where
                you are and you'll get back a plan in plain English, with a price attached.
              </p>
              <div className="flex flex-col gap-4">
                {methods.map((m) => {
                  const body = (
                    <>
                      <div className="contact-chip">
                        <m.icon size={18} />
                      </div>
                      <div>
                        <div className="text-[13px] text-white/55">{m.label}</div>
                        <div className="text-[15px] font-semibold text-white">{m.value}</div>
                      </div>
                    </>
                  );
                  return m.href ? (
                    <a
                      key={m.label}
                      href={m.href}
                      onClick={noteEmailClick}
                      className="flex items-center gap-3.5 rounded-sq transition-opacity hover:opacity-80"
                    >
                      {body}
                    </a>
                  ) : (
                    <div key={m.label} className="flex items-center gap-3.5">
                      {body}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Right — the working form card */}
        <FadeIn delay={0.1}>
          <div className="relative overflow-hidden rounded-sq-2xl border border-cream-green bg-white p-6 shadow-sq-lg sm:p-8 lg:p-9">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-forest-primary via-sage-medium to-sage-light" />

            {status === 'sent' ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center py-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cream-green">
                  <CheckCircle2 className="h-8 w-8 text-forest-primary" />
                </div>
                <h3 className="mb-2 text-2xl font-semibold text-forest-deep">That's with us now</h3>
                <p className="max-w-sm text-base leading-relaxed text-neutral-medium-gray">
                  Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. We'll read through{' '}
                  {form.company || 'your project'} and reply to{' '}
                  <span className="font-medium text-forest-primary">{form.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setForm({
                      name: '',
                      email: '',
                      company: '',
                      phone: '',
                      need: needOptions[0],
                      message: '',
                      website: '',
                    });
                    setStatus('idle');
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-sq border-2 border-forest-deep px-4 py-2 text-sm font-medium text-forest-deep transition-colors hover:bg-forest-deep hover:text-white"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <label className="mb-4 flex flex-col gap-[7px]">
                    <span className="text-[13px] font-semibold text-neutral-charcoal">Your name</span>
                    <input
                      className={fieldCls}
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Jordan Lee"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="mb-4 flex flex-col gap-[7px]">
                    <span className="text-[13px] font-semibold text-neutral-charcoal">Business name</span>
                    <input
                      className={fieldCls}
                      value={form.company}
                      onChange={set('company')}
                      placeholder="Burritos California"
                      autoComplete="organization"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <label className="mb-4 flex flex-col gap-[7px]">
                    <span className="text-[13px] font-semibold text-neutral-charcoal">Email</span>
                    <input
                      className={fieldCls}
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@business.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label className="mb-4 flex flex-col gap-[7px]">
                    <span className="text-[13px] font-semibold text-neutral-charcoal">Phone</span>
                    <input
                      className={fieldCls}
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="(206) 555-0142"
                      autoComplete="tel"
                    />
                  </label>
                </div>
                <label className="mb-4 flex flex-col gap-[7px]">
                  <span className="text-[13px] font-semibold text-neutral-charcoal">
                    What do you need help with?
                  </span>
                  <div className="relative">
                    <select
                      className={`${fieldCls} cursor-pointer appearance-none pr-10`}
                      value={form.need}
                      onChange={set('need')}
                    >
                      {needOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-medium-gray"
                    />
                  </div>
                </label>
                <label className="mb-4 flex flex-col gap-[7px]">
                  <span className="text-[13px] font-semibold text-neutral-charcoal">
                    Anything we should know? <span className="font-normal text-neutral-light-gray">(optional)</span>
                  </span>
                  <textarea
                    className={`${fieldCls} min-h-[84px] resize-y`}
                    rows={3}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tell us about your business and goals…"
                  />
                </label>

                {/* Honeypot — hidden from humans */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={set('website')}
                  className="hidden"
                  aria-hidden="true"
                />

                {status === 'error' && (
                  <div className="mb-4 flex items-start gap-2 rounded-sq-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-sq-lg bg-gradient-to-r from-forest-deep to-sage-medium px-7 py-3.5 text-[17px] font-semibold text-white shadow-sq transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sq-lg active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Get my free research review{' '}
                      <Send className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
                <p className="mt-3.5 text-center text-[12.5px] text-neutral-medium-gray">
                  No spam. We only reach out about your report.
                </p>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};
