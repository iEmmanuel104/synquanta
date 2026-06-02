import { useState } from 'react';
import { Mail, Globe, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { FadeIn } from '../animations/FadeIn';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const channels = [
  { icon: Mail, label: 'Email us', value: 'info@synquanta.com', href: 'mailto:info@synquanta.com' },
  { icon: Globe, label: 'Visit', value: 'synquanta.com', href: 'https://synquanta.com' },
];

const field =
  'w-full rounded-sq-xl border border-cream-green bg-white px-4 py-3 text-forest-deep placeholder:text-neutral-light-gray outline-none transition-all duration-200 focus:border-sage-medium focus:ring-4 focus:ring-sage-light/20';

export const Contact = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', website: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not send your message.');
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your message.');
      setStatus('error');
    }
  };

  return (
    <Section id="contact" variant="light" className="scroll-mt-20">
      <SectionHeading title="Get In Touch" subtitle="Have a project in mind? Tell us about it — we usually reply within a day." />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
        {/* Left — invitation + channels */}
        <FadeIn className="lg:col-span-2">
          <div className="lg:sticky lg:top-28">
            <h3 className="text-2xl font-semibold text-forest-deep mb-3">Let's build something that pays for itself.</h3>
            <p className="text-neutral-medium-gray leading-relaxed mb-8">
              Whether it's a website rebuild, an automation, or the World Cup revenue push — send a few details and we'll come back with a clear, no-pressure next step.
            </p>
            <div className="space-y-3">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-sq-xl bg-white border border-cream-green p-4 shadow-sq hover:shadow-sq-lg hover:border-sage-light transition-all duration-300"
                >
                  <span className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-forest-deep to-sage-medium flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-white" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-wide text-neutral-medium-gray">{c.label}</span>
                    <span className="block font-semibold text-forest-deep group-hover:text-forest-primary transition-colors truncate">{c.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Right — the form */}
        <FadeIn delay={0.1} className="lg:col-span-3">
          <div className="relative bg-white rounded-sq-2xl p-6 sm:p-8 lg:p-10 shadow-sq-lg border border-cream-green overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-forest-primary via-sage-medium to-sage-light" />

            {status === 'sent' ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-cream-green flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-forest-primary" />
                </div>
                <h3 className="text-xl font-semibold text-forest-deep mb-2">Message sent — thank you!</h3>
                <p className="text-neutral-medium-gray max-w-sm mx-auto">
                  We've got it and will reply to <span className="font-medium text-forest-primary">{form.email}</span> shortly. Talk soon.
                </p>
                <button
                  onClick={() => { setForm({ name: '', email: '', company: '', message: '', website: '' }); setStatus('idle'); }}
                  className="mt-6 text-sm font-medium text-forest-primary hover:text-forest-deep transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="block text-sm font-medium text-forest-deep mb-1.5">Name</span>
                    <input className={field} value={form.name} onChange={set('name')} placeholder="Jane Doe" autoComplete="name" required />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-forest-deep mb-1.5">Email</span>
                    <input className={field} type="email" value={form.email} onChange={set('email')} placeholder="jane@business.com" autoComplete="email" required />
                  </label>
                </div>
                <label className="block">
                  <span className="block text-sm font-medium text-forest-deep mb-1.5">Business <span className="text-neutral-light-gray font-normal">(optional)</span></span>
                  <input className={field} value={form.company} onChange={set('company')} placeholder="Your business name" autoComplete="organization" />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-forest-deep mb-1.5">How can we help?</span>
                  <textarea className={`${field} min-h-[140px] resize-y`} value={form.message} onChange={set('message')} placeholder="A sentence or two about what you're after…" required />
                </label>

                {/* Honeypot — hidden from humans */}
                <input
                  type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')}
                  className="hidden" aria-hidden="true"
                />

                {status === 'error' && (
                  <div className="flex items-start gap-2 rounded-sq-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-sq-xl bg-gradient-to-r from-forest-deep to-sage-medium px-7 py-3.5 font-semibold text-white shadow-sq transition-all duration-300 hover:shadow-sq-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {status === 'sending' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                  ) : (
                    <>Send message <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </button>
                <p className="text-xs text-neutral-light-gray">
                  Prefer email? <a href="mailto:info@synquanta.com" className="text-forest-primary hover:underline">info@synquanta.com</a>
                </p>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};
