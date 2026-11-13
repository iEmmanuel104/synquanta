import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { captureEvent } from '../../lib/posthog';
import { trackLead, trackFormStart } from '../../lib/facebook-pixel';
import { attributionLine, getAttribution } from '../../lib/attribution';

/**
 * The ERP enquiry flow on /erp: the landing page every ERP ad points at.
 *
 * Two ways in, one destination:
 *  - "Tell us about your business": a short guided questionnaire (5 steps,
 *    about 2 minutes, mostly taps). We learn what kind of business it is, how it
 *    runs today and what hurts, so the first reply can be specific.
 *  - "Book a session": the shortest form that still tells us who they are,
 *    plus when suits them. We confirm a time by email.
 *
 * Both submit through the existing /api/contact pipeline (persisted to the
 * platform DB, team notified, reply-to = the prospect), with need = "A custom
 * ERP system" and the answers written out as a readable brief, so no backend
 * change is required. The ad that brought them is appended from attribution.ts.
 */

type Mode = 'questionnaire' | 'booking';
type Status = 'idle' | 'sending' | 'sent' | 'error';

const BUSINESS_TYPES = [
  'Distribution / wholesale',
  'Retail / shops',
  'Manufacturing',
  'Services / agency',
  'Property / real estate',
  'Logistics / transport',
  'Healthcare',
  'Education',
  'Hospitality / food',
  'Other',
];
const TEAM_SIZES = ['1–10', '11–50', '51–200', '200+'];
const TOOLS = [
  'Spreadsheets',
  'WhatsApp / chat groups',
  'Email',
  'Paper and notebooks',
  'Accounting software',
  'An off-the-shelf system',
  'Software built for us',
];
const PAINS = [
  'I can’t see the full picture',
  'Stock and inventory mistakes',
  'Slow invoicing or getting paid',
  'Missed follow-ups with clients',
  'Reports take too long',
  'Too much depends on one person',
  'Typing the same thing in twice',
  'Hard to track staff and tasks',
];
const AREAS = ['Sales and clients', 'Stock and purchases', 'Money: invoices and expenses', 'Staff and tasks', 'Projects and delivery', 'Reports'];
const TIMELINES = ['As soon as possible', 'In 1–3 months', 'In 3–6 months', 'Just exploring'];
const BUDGETS = ['Under $5,000', '$5,000–$15,000', '$15,000–$50,000', '$50,000+', 'Not sure yet'];
const SLOTS = ['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Any time'];

const STEPS = ['Your business', 'How you work today', 'What needs fixing', 'Timing', 'Your details'];

const tz = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
})();

const empty = {
  businessType: '',
  businessTypeOther: '',
  teamSize: '',
  country: '',
  tools: [] as string[],
  pains: [] as string[],
  areas: [] as string[],
  timeline: '',
  budget: '',
  notes: '',
  name: '',
  email: '',
  company: '',
  phone: '',
  slots: [] as string[],
  followUp: 'email' as 'email' | 'session',
  website: '', // honeypot
};
type Form = typeof empty;

const fieldCls =
  'w-full rounded-sq-lg border-[1.5px] border-cream-green bg-neutral-off-white px-3.5 py-3 text-[15px] text-forest-deep placeholder:text-neutral-light-gray outline-none transition-all duration-200 focus:border-sage-medium focus:bg-white focus:ring-4 focus:ring-sage-light/20';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A tappable choice. Single- or multi-select depending on the caller. */
const Chip = ({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={`rounded-full border-[1.5px] px-4 py-2.5 text-left text-[14.5px] font-medium transition-all duration-150 ${
      on
        ? 'border-forest-primary bg-forest-primary text-white shadow-sq'
        : 'border-cream-green bg-white text-forest-deep hover:border-sage-medium'
    }`}
  >
    {children}
  </button>
);

const Q = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <fieldset className="mb-6">
    <legend className="mb-1 text-[15px] font-semibold text-forest-deep">{label}</legend>
    {hint && <p className="mb-3 text-[13px] text-neutral-medium-gray">{hint}</p>}
    <div className={`flex flex-wrap gap-2.5 ${hint ? '' : 'mt-3'}`}>{children}</div>
  </fieldset>
);

const Field = ({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) => (
  <label className="mb-4 flex flex-col gap-[7px]">
    <span className="text-[13px] font-semibold text-neutral-charcoal">
      {label} {optional && <span className="font-normal text-neutral-light-gray">(optional)</span>}
    </span>
    {children}
  </label>
);

export const ErpIntake = ({ initialMode = 'questionnaire' }: { initialMode?: Mode }) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(empty);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [sentMode, setSentMode] = useState<Mode>('questionnaire');
  const started = useRef(false);
  const top = useRef<HTMLDivElement>(null);

  const touch = () => {
    if (started.current) return;
    started.current = true;
    captureEvent('erp_intake_started', { path: mode });
    trackFormStart({ content_category: 'erp', path: mode });
  };
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    if (k !== 'website') touch();
    setF((s) => ({ ...s, [k]: v }));
  };
  const one = (k: 'businessType' | 'teamSize' | 'timeline' | 'budget', v: string) => set(k, f[k] === v ? '' : v);
  const many = (k: 'tools' | 'pains' | 'areas' | 'slots', v: string) =>
    set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const inp = (k: 'businessTypeOther' | 'country' | 'notes' | 'name' | 'email' | 'company' | 'phone' | 'website') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value);

  const scrollTop = () => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const switchMode = (m: Mode) => {
    setMode(m);
    setStep(0);
    setStatus('idle');
    setError('');
    captureEvent('erp_intake_path_selected', { path: m });
  };

  // The page's hero buttons pick a path; follow them without losing answers.
  useEffect(() => {
    setMode((m) => (m === initialMode ? m : initialMode));
    setStep(0);
    setError('');
  }, [initialMode]);

  const businessLabel = f.businessType === 'Other' && f.businessTypeOther.trim() ? f.businessTypeOther.trim() : f.businessType;

  // What each step needs before "Next" is allowed. Kept light: one answer is enough.
  const stepError = (s: number): string => {
    if (mode === 'questionnaire') {
      if (s === 0 && !f.businessType) return 'Pick the closest type of business.';
      if (s === 1 && !f.tools.length) return 'Pick at least one.';
      if (s === 2 && !f.pains.length) return 'Pick at least one thing that isn’t working.';
      if (s === 3 && !f.timeline) return 'Pick a timing.';
    }
    if (s === STEPS.length - 1 || mode === 'booking') {
      if (mode === 'booking' && !f.businessType) return 'Pick the closest type of business.';
      if (!f.name.trim()) return 'Please add your name.';
      if (!EMAIL_RE.test(f.email.trim())) return 'Please add a valid email address.';
      if (mode === 'booking' && !f.slots.length) return 'Pick when suits you.';
    }
    return '';
  };

  const next = () => {
    const err = stepError(step);
    if (err) return setError(err);
    setError('');
    captureEvent('erp_intake_step_completed', { path: mode, step: STEPS[step] });
    setStep((s) => s + 1);
    scrollTop();
  };
  const back = () => {
    setError('');
    setStep((s) => Math.max(0, s - 1));
    scrollTop();
  };

  /** The answers as a brief the team can read in the notification email. */
  const brief = (): string => {
    const L = (k: string, v: string | string[]) =>
      (Array.isArray(v) ? v.length : v) ? `${k}: ${Array.isArray(v) ? v.join(', ') : v}` : null;
    const head =
      mode === 'booking'
        ? 'ERP enquiry · wants to BOOK A SESSION'
        : `ERP enquiry · questionnaire · follow-up: ${f.followUp === 'session' ? 'BOOK A SESSION' : 'email first'}`;
    return [
      head,
      '',
      L('Business type', businessLabel),
      L('Team size', f.teamSize),
      L('Country', f.country),
      L('Uses today', f.tools),
      L('Not working', f.pains),
      L('Handle first', f.areas),
      L('Timing', f.timeline),
      L('Budget', f.budget),
      L('Good times', f.slots),
      tz ? `Time zone: ${tz}` : null,
      f.notes.trim() ? `\nIn their words:\n${f.notes.trim()}` : null,
      '',
      `Source: ${attributionLine()}`,
    ]
      .filter((l) => l !== null)
      .join('\n');
  };

  const submit = async () => {
    const err = stepError(mode === 'booking' ? 0 : STEPS.length - 1);
    if (err) return setError(err);
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    const attr = getAttribution();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          email: f.email.trim(),
          company: f.company.trim(),
          phone: f.phone.trim(),
          need: 'A custom ERP system',
          message: brief().slice(0, 4900),
          pageUrl: window.location.href.slice(0, 500),
          website: f.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not send that.');
      const props = {
        path: mode,
        follow_up: mode === 'booking' ? 'session' : f.followUp,
        business_type: businessLabel || undefined,
        team_size: f.teamSize || undefined,
        timeline: f.timeline || undefined,
        budget: f.budget || undefined,
        utm_content: attr.utm_content,
      };
      captureEvent('erp_intake_submitted', props);
      captureEvent('contact_form_submitted', { need: 'A custom ERP system', has_company: Boolean(f.company) });
      // Category + path only: no name, email or answers go to Meta.
      trackLead({ content_category: 'erp', path: mode });
      setSentMode(mode);
      setStatus('sent');
      scrollTop();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send that.');
      setStatus('error');
    }
  };

  const contactFields = (
    <>
      <div className="grid grid-cols-1 gap-x-3.5 sm:grid-cols-2">
        <Field label="Your name">
          <input className={fieldCls} value={f.name} onChange={inp('name')} autoComplete="name" placeholder="Your name" />
        </Field>
        <Field label="Email">
          <input className={fieldCls} type="email" value={f.email} onChange={inp('email')} autoComplete="email" placeholder="you@business.com" />
        </Field>
        <Field label="Business name" optional>
          <input className={fieldCls} value={f.company} onChange={inp('company')} autoComplete="organization" placeholder="Your business" />
        </Field>
        <Field label="Phone or WhatsApp" optional>
          <input className={fieldCls} type="tel" value={f.phone} onChange={inp('phone')} autoComplete="tel" placeholder="+44 7700 900123" />
        </Field>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={inp('website')} className="hidden" aria-hidden="true" />
    </>
  );

  const businessQ = (
    <>
      <Q label="What kind of business do you run?">
        {BUSINESS_TYPES.map((o) => (
          <Chip key={o} on={f.businessType === o} onClick={() => one('businessType', o)}>
            {o}
          </Chip>
        ))}
      </Q>
      {f.businessType === 'Other' && (
        <Field label="Tell us in a few words">
          <input className={fieldCls} value={f.businessTypeOther} onChange={inp('businessTypeOther')} placeholder="e.g. a chain of pharmacies" />
        </Field>
      )}
      <Q label="How many people work in the business?">
        {TEAM_SIZES.map((o) => (
          <Chip key={o} on={f.teamSize === o} onClick={() => one('teamSize', o)}>
            {o}
          </Chip>
        ))}
      </Q>
    </>
  );

  // ---------------------------------------------------------------- sent
  if (status === 'sent') {
    const wantsSession = sentMode === 'booking' || f.followUp === 'session';
    return (
      <div ref={top} className="scroll-mt-24 rounded-sq-2xl border border-cream-green bg-white p-8 text-center shadow-sq-lg sm:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cream-green">
          <CheckCircle2 className="h-8 w-8 text-forest-primary" />
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-forest-deep">
          Thanks{f.name ? `, ${f.name.trim().split(' ')[0]}` : ''}. That’s with our team now.
        </h3>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-neutral-medium-gray">
          {wantsSession
            ? 'We’ll email you within one working day to confirm a time for your session. '
            : 'We’ll read your answers and email you within one working day with our first thoughts and next steps. '}
          Look out for a message to <span className="font-medium text-forest-primary">{f.email}</span>.
        </p>
        <ol className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {[
            ['1', 'We read it', 'A real person on our team reviews your business.'],
            ['2', 'We reply by email', wantsSession ? 'We confirm a time that suits you.' : 'With questions, first ideas and options.'],
            ['3', 'We talk it through', 'A session with our team, at no cost.'],
          ].map(([n, t, d]) => (
            <li key={n} className="rounded-sq-lg bg-neutral-off-white p-4">
              <div className="mb-1 text-sm font-semibold text-sage-medium">Step {n}</div>
              <div className="font-semibold text-forest-deep">{t}</div>
              <div className="text-sm text-neutral-medium-gray">{d}</div>
            </li>
          ))}
        </ol>
        {!wantsSession && (
          <button
            type="button"
            onClick={() => {
              setF((s) => ({ ...s, slots: [] }));
              switchMode('booking');
            }}
            className="mt-8 inline-flex items-center gap-2 rounded-sq-lg border-2 border-forest-deep px-5 py-2.5 font-semibold text-forest-deep transition-colors hover:bg-forest-deep hover:text-white"
          >
            <CalendarDays className="h-5 w-5" /> Want to talk sooner? Book a session
          </button>
        )}
      </div>
    );
  }

  const last = mode === 'booking' || step === STEPS.length - 1;

  return (
    <div ref={top} className="scroll-mt-24">
      {/* Path picker */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2" role="tablist" aria-label="How would you like to start?">
        {(
          [
            ['questionnaire', ClipboardList, 'Tell us about your business', 'About 2 minutes, mostly taps. We reply with first ideas.'],
            ['booking', CalendarDays, 'Book a session', 'Talk it through with our team. We confirm a time by email.'],
          ] as const
        ).map(([m, Icon, t, d]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => mode !== m && switchMode(m)}
            className={`flex items-start gap-3.5 rounded-sq-xl border-2 p-5 text-left transition-all ${
              mode === m ? 'border-forest-primary bg-white shadow-sq-lg' : 'border-cream-green bg-white/60 hover:border-sage-medium'
            }`}
          >
            <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${mode === m ? 'bg-forest-primary text-white' : 'bg-cream-green text-forest-primary'}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[16.5px] font-semibold text-forest-deep">{t}</span>
              <span className="block text-sm text-neutral-medium-gray">{d}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-sq-2xl border border-cream-green bg-white p-6 shadow-sq-lg sm:p-8 lg:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-forest-primary via-sage-medium to-sage-light" />

        {mode === 'questionnaire' && (
          <div className="mb-7">
            <div className="mb-2 flex justify-between text-[13px] font-semibold">
              <span className="text-forest-primary">{STEPS[step]}</span>
              <span className="text-neutral-medium-gray">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream-green" aria-hidden="true">
              <div className="h-full rounded-full bg-forest-primary transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>
        )}

        {mode === 'questionnaire' && step === 0 && (
          <>
            {businessQ}
            <Field label="Which country are you in?" optional>
              <input className={fieldCls} value={f.country} onChange={inp('country')} autoComplete="country-name" placeholder="e.g. Nigeria, UK, UAE" />
            </Field>
          </>
        )}

        {mode === 'questionnaire' && step === 1 && (
          <Q label="What does your business run on today?" hint="Pick all that apply.">
            {TOOLS.map((o) => (
              <Chip key={o} on={f.tools.includes(o)} onClick={() => many('tools', o)}>
                {o}
              </Chip>
            ))}
          </Q>
        )}

        {mode === 'questionnaire' && step === 2 && (
          <>
            <Q label="What isn’t working well?" hint="Pick all that apply.">
              {PAINS.map((o) => (
                <Chip key={o} on={f.pains.includes(o)} onClick={() => many('pains', o)}>
                  {o}
                </Chip>
              ))}
            </Q>
            <Q label="What should one system handle first?" hint="Optional. Pick any.">
              {AREAS.map((o) => (
                <Chip key={o} on={f.areas.includes(o)} onClick={() => many('areas', o)}>
                  {o}
                </Chip>
              ))}
            </Q>
          </>
        )}

        {mode === 'questionnaire' && step === 3 && (
          <>
            <Q label="When would you like this in place?">
              {TIMELINES.map((o) => (
                <Chip key={o} on={f.timeline === o} onClick={() => one('timeline', o)}>
                  {o}
                </Chip>
              ))}
            </Q>
            <Q label="Do you have a budget in mind?" hint="Optional, in US dollars. It helps us suggest the right size of first step.">
              {BUDGETS.map((o) => (
                <Chip key={o} on={f.budget === o} onClick={() => one('budget', o)}>
                  {o}
                </Chip>
              ))}
            </Q>
            <Field label="Anything else we should know?" optional>
              <textarea
                className={`${fieldCls} min-h-[96px] resize-y`}
                rows={3}
                value={f.notes}
                onChange={inp('notes')}
                placeholder="In your own words: how the business works, what slows you down, what you’d love to see in one place."
              />
            </Field>
          </>
        )}

        {mode === 'questionnaire' && step === 4 && (
          <>
            <p className="mb-5 text-[15px] text-neutral-medium-gray">Last step. Where should we send our reply?</p>
            {contactFields}
            <Q label="What would you like next?">
              <Chip on={f.followUp === 'email'} onClick={() => set('followUp', 'email')}>
                Email me your first thoughts
              </Chip>
              <Chip on={f.followUp === 'session'} onClick={() => set('followUp', 'session')}>
                Book a session with the team
              </Chip>
            </Q>
          </>
        )}

        {mode === 'booking' && (
          <>
            <p className="mb-6 text-[15px] text-neutral-medium-gray">
              A few details so the session is useful from the first minute. We’ll confirm a time by email
              {tz ? ` (your time zone: ${tz.replace(/_/g, ' ')})` : ''}.
            </p>
            {businessQ}
            {contactFields}
            <Q label="When suits you?">
              {SLOTS.map((o) => (
                <Chip key={o} on={f.slots.includes(o)} onClick={() => many('slots', o)}>
                  {o}
                </Chip>
              ))}
            </Q>
            <Field label="What would you like to talk about?" optional>
              <textarea
                className={`${fieldCls} min-h-[84px] resize-y`}
                rows={3}
                value={f.notes}
                onChange={inp('notes')}
                placeholder="A line or two about your business and what you want to fix."
              />
            </Field>
          </>
        )}

        {error && (
          <div role="alert" className="mb-4 flex items-start gap-2 rounded-sq-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{error}</span>
          </div>
        )}

        <div className="mt-2 flex items-center gap-3">
          {mode === 'questionnaire' && step > 0 && (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 rounded-sq-lg px-4 py-3.5 font-semibold text-forest-deep hover:bg-cream-green"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          <button
            type="button"
            onClick={last ? submit : next}
            disabled={status === 'sending'}
            className="group ml-auto inline-flex flex-1 items-center justify-center gap-2 rounded-sq-lg bg-gradient-to-r from-forest-deep to-sage-medium px-7 py-3.5 text-[17px] font-semibold text-white shadow-sq transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sq-lg disabled:opacity-70 sm:flex-none sm:min-w-[240px]"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Sending…
              </>
            ) : (
              <>
                {last ? (mode === 'booking' ? 'Request my session' : 'Send to the team') : 'Next'}
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
        <p className="mt-4 text-center text-[12.5px] text-neutral-medium-gray">
          A real person reads every answer. We only use your details to reply to you. See our{' '}
          <a href="/privacy" className="underline">
            privacy policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};
