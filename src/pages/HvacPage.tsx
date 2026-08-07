import { useEffect, useRef } from 'react';
import {
  PhoneMissed,
  PhoneForwarded,
  Hash,
  BotMessageSquare,
  Clock,
  CalendarCheck,
  MessageSquareText,
  ClipboardList,
  ShieldCheck,
  Check,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { PageHero, Button, Card, SectionHeading, Accordion, Picture } from '../components/ui';
import { Section } from '../components/layout';
import { FadeIn, StaggerContainer } from '../components/animations';
import { Seo } from '../components/Seo';
import { captureEvent } from '../lib/posthog';
import { breadcrumb, faqPageSchema, hvacServiceSchema } from '../lib/structuredData';
import { hvacPlan, hvacPlanIncludes } from '../constants/hvac';
import type { FaqItem } from '../types';

/**
 * Where the "Start free trial" CTA sends people: the tenant sign-up flow in the
 * SynQuanta app. This is the Railway-generated hostname for now — it moves to a
 * custom domain (e.g. app.synquanta.com) once that is set up, and this constant
 * is the only place that needs to change when it does.
 */
const SIGNUP_URL = 'https://frontend-production-15ea.up.railway.app/hvac/sign-up';

/** PostHog event fired by every primary CTA, tagged with which one was clicked. */
function trackCta(location: 'hero' | 'how_it_works' | 'pricing' | 'final') {
  captureEvent('hvac_cta_clicked', { cta_location: location, plan_price_usd: hvacPlan.priceUsd });
}

/**
 * Fire `callback` once, the first time `ref`'s element is at least a third
 * visible. Used for the pricing-section view event — a scroll-depth proxy that
 * is far more meaningful on a paid-ad landing page than raw pageviews.
 */
function useViewedOnce(ref: React.RefObject<HTMLElement>, callback: () => void) {
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            callback();
            io.disconnect();
          }
        }
      },
      { threshold: 0.33 },
    );
    io.observe(el);
    return () => io.disconnect();
    // callback is a stable module-scope-style closure at the call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

const steps = [
  {
    icon: Hash,
    step: '01',
    title: 'Pick your number',
    body: 'We give you a dedicated local number in your area code. It is live in minutes. Nothing to install, no hardware, no app on your techs’ phones.',
  },
  {
    icon: PhoneForwarded,
    step: '02',
    title: 'Forward on busy or no answer',
    body: 'Set your existing business line to forward to that number when you are on another call or nobody picks up. Your carrier already supports it; it takes about two minutes.',
  },
  {
    icon: BotMessageSquare,
    step: '03',
    title: 'The AI answers, qualifies and books',
    body: 'Calls you would have missed get answered on the first or second ring. The AI works out what is wrong, how urgent it is, books the job, and texts you the moment the call ends.',
  },
];

const onCall = [
  {
    icon: ClipboardList,
    title: 'Gets the details that matter',
    body: 'Name, callback number, service address, what the system is doing: “no cold air”, “blowing warm”, “thermostat is dead”, “water round the furnace”.',
  },
  {
    icon: Clock,
    title: 'Reads the urgency',
    body: 'A 96° house with an infant in it is not the same call as a filter change. It flags the emergencies so you know which one to ring back first.',
  },
  {
    icon: CalendarCheck,
    title: 'Books the job',
    body: 'It offers the slots you have made available and puts the appointment straight in, while the homeowner is still on the phone and still deciding.',
  },
  {
    icon: MessageSquareText,
    title: 'Texts you immediately',
    body: 'A text and an email land the second the call ends, with the caller, the problem, the urgency and the booking. No dashboard-checking required.',
  },
  {
    icon: Headphones,
    title: 'Records and transcribes everything',
    body: 'Every call is recorded and written up, so you can hear exactly what the homeowner said before you roll a truck.',
  },
  {
    icon: ShieldCheck,
    title: 'Says it is an AI. Every time.',
    body: 'It opens by telling the caller it is an AI assistant for your business, and announces recording where the law requires it. It never pretends to be a person, and there is no setting that makes it pretend.',
  },
];

const hvacFaqs: FaqItem[] = [
  {
    q: 'What happens if the AI cannot answer something?',
    a: 'It stops guessing and takes a message. If a caller asks for a firm price, a warranty decision, or anything outside what you have configured, the AI says a member of the team will call back, captures the details, and flags it to you. It will never invent a quote or commit you to something you did not agree to.',
  },
  {
    q: 'Does it sound like a robot?',
    a: 'No. It is a natural voice with normal conversational timing, and it handles interruptions and people talking over it. But it also tells every caller up front that it is an AI assistant. We think a homeowner who knows what they are talking to and gets their problem solved is worth far more than one who feels tricked afterwards.',
  },
  {
    q: 'Can I listen to the calls?',
    a: 'Yes. Every call is recorded and transcribed, and both are in your dashboard, searchable, alongside the details the AI captured. You can hear exactly how a call went before you decide how to follow up.',
  },
  {
    q: 'What if I miss the notification?',
    a: 'Nothing is lost. The text and the email are just the fast path. Every call sits in your dashboard with the recording, the transcript, the caller’s number and the booking. Notifications can go to more than one person, so a dispatcher or an office manager sees them too.',
  },
  {
    q: 'How fast is setup?',
    a: 'An afternoon, start to finish. You pick a number, tell us your service area, hours and the questions you want asked, and set conditional forwarding on your existing line. The forwarding step is the only thing you do on your own phone, and it is a short code your carrier already supports.',
  },
  {
    q: 'Do I have to change the number on my truck?',
    a: 'No. You keep your existing business number, your existing carrier and your existing phone bill. Nothing is ported. Your number stays on your truck, your yard signs and your Google listing. We only ever see the calls it forwards to us because you were busy or nobody picked up.',
  },
  {
    q: 'What happens after the 14-day trial?',
    a: `If you do nothing, the subscription starts and you are billed $${hvacPlan.priceUsd} for your first month. If you cancel before day 14, you are never charged at all. We take a payment method up front only so the service does not cut out mid-week if you decide to keep it.`,
  },
  {
    q: 'Can I cancel?',
    a: 'Any time, in two clicks in your dashboard. No contract, no notice period, no retention call. The service runs to the end of the month you have already paid for and you are not billed again. Just remember to point your line back before that date.',
  },
];

export const HvacPage = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  useViewedOnce(pricingRef, () =>
    captureEvent('hvac_pricing_viewed', {
      plan_price_usd: hvacPlan.priceUsd,
      trial_days: hvacPlan.trialDays,
    }),
  );

  return (
    <>
      <Seo
        path="/hvac"
        title="AI Phone Receptionist for HVAC Contractors | SynQuanta"
        description="Every missed call is a job that goes to whoever picks up first. SynQuanta's AI receptionist answers the calls you miss, qualifies the homeowner and books the job, all on your existing number. $299/month, 14-day free trial."
        image="/images/products-city.jpg"
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'AI Receptionist for HVAC', path: '/hvac' },
          ]),
          hvacServiceSchema(hvacPlan),
          faqPageSchema(hvacFaqs),
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="For HVAC contractors"
        title="The job goes to whoever picks up first"
        subtitle="A homeowner with no cold air does not leave a voicemail. They hang up and dial the next company on the list. Our AI receptionist answers the calls you miss, works out what is wrong, and books the job before your competitor’s phone even rings."
        image="/images/products-city.jpg"
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button
              href={SIGNUP_URL}
              size="lg"
              variant="gold"
              onClick={() => trackCta('hero')}
              className="w-full sm:w-auto"
            >
              Start your 14-day free trial
              <ArrowRight size={18} className="ml-2" aria-hidden="true" />
            </Button>
            <p className="text-sm text-white/60">
              {hvacPlan.priceDisplay}/month after. Cancel anytime.
            </p>
          </div>

          {/* The objection that kills this sale is "I'm not changing my number".
              Answer it in the hero, not in the FAQ. */}
          <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-white/70">
            {['Keep your existing number', 'No porting, no new hardware', 'Only your missed calls reach us'].map(
              (chip) => (
                <li key={chip} className="inline-flex items-center gap-2">
                  <Check size={15} className="text-mint-pale" aria-hidden="true" />
                  {chip}
                </li>
              ),
            )}
          </ul>
        </div>
      </PageHero>

      {/* ── 2. The problem ──────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          title="The calls you never hear about"
          subtitle="You are not losing work to a better company. You are losing it to a company that answered."
        />
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: PhoneMissed,
              title: 'It is 7pm on a Friday',
              body: 'The AC quit and the house is climbing through 90°. Your voicemail picks up. They do not leave a message. They are already scrolling to the next result and calling it.',
            },
            {
              icon: Clock,
              title: 'You are on a roof',
              body: 'Two calls come in while your hands are full. By the time you climb down, listen back and dial out, both homeowners have someone booked for tomorrow morning.',
            },
            {
              icon: PhoneForwarded,
              title: 'The line is already busy',
              body: 'One office phone, one person on it. The second caller gets a busy tone, which is the clearest possible signal that you are not available and somebody else is.',
            },
          ].map((item) => (
            <Card key={item.title} className="flex h-full flex-col">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-sq-lg bg-cream-green text-forest-primary">
                <item.icon size={21} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-forest-deep">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-neutral-medium-gray">{item.body}</p>
            </Card>
          ))}
        </StaggerContainer>

        <FadeIn>
          <p className="mx-auto mt-12 max-w-2xl text-center text-lg leading-relaxed text-neutral-dark-gray">
            One booked diagnostic covers a fraction of the month. One missed emergency replacement
            covers the year.{' '}
            <strong className="text-forest-deep">
              The only thing that decides which one you get is whether somebody answered.
            </strong>
          </p>
        </FadeIn>
      </Section>

      {/* ── 3. How it works ─────────────────────────────────────────────────── */}
      <Section variant="light">
        <SectionHeading
          title="Three steps. Nothing changes on your truck."
          subtitle="You keep your number, your carrier and your phone bill. We only ever get the calls you were not going to answer anyway."
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.step} className="flex h-full flex-col">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-sq-lg bg-forest-deep text-mint-pale">
                  <s.icon size={21} aria-hidden="true" />
                </span>
                <span className="sq-mono text-sm font-semibold text-sage-medium">{s.step}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-forest-deep">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-neutral-medium-gray">{s.body}</p>
            </Card>
          ))}
        </StaggerContainer>

        <FadeIn>
          <div className="mx-auto mt-12 max-w-3xl rounded-sq-xl border border-sage-medium/25 bg-white p-6 text-center shadow-sq sm:p-8">
            <p className="text-[16.5px] leading-relaxed text-neutral-dark-gray">
              <strong className="text-forest-deep">To be completely clear:</strong> we do not port
              your number, we do not replace your phone service, and we do not put an app on
              anyone’s phone. Your number stays exactly where it is. If you answer, we never see the
              call at all.
            </p>
            <div className="mt-6">
              <Button href={SIGNUP_URL} size="md" onClick={() => trackCta('how_it_works')}>
                Set it up in an afternoon
                <ArrowRight size={17} className="ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ── 4. What it does on the call ─────────────────────────────────────── */}
      <Section>
        <SectionHeading
          title="What actually happens on the call"
          subtitle="Not a voicemail box with a nicer greeting. A conversation that ends with a booked job and a text in your pocket."
        />
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {onCall.map((item) => (
            <Card key={item.title} className="flex h-full flex-col">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-sq-lg bg-cream-green text-forest-primary">
                <item.icon size={21} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-forest-deep">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-neutral-medium-gray">{item.body}</p>
            </Card>
          ))}
        </StaggerContainer>
      </Section>

      {/* ── 5. Pricing ──────────────────────────────────────────────────────── */}
      <section
        ref={pricingRef}
        id="pricing"
        className="relative overflow-hidden bg-mesh-forest section-padding scroll-mt-20"
      >
        <div className="grain-overlay" aria-hidden="true" />
        <div className="container-custom relative z-10">
          <SectionHeading
            light
            title="One plan. One price."
            subtitle="No tiers to decode, no setup fee, no contract. Try it free for two weeks before you pay anything."
          />

          <FadeIn>
            <div className="wc-flag-ring mx-auto max-w-xl overflow-hidden rounded-sq-xl bg-white shadow-sq-xl">
              <div className="border-b border-cream-green px-7 py-8 text-center sm:px-9">
                <p className="sq-eyebrow mb-3">{hvacPlan.name}</p>
                <p className="flex items-baseline justify-center gap-1.5">
                  <span className="sq-mono text-5xl font-semibold tracking-tight text-forest-deep">
                    {hvacPlan.priceDisplay}
                  </span>
                  <span className="text-lg text-neutral-medium-gray">
                    {hvacPlan.intervalDisplay}
                  </span>
                </p>
                <p className="mt-3 text-[15px] text-neutral-medium-gray">
                  <strong className="text-forest-deep">
                    {hvacPlan.trialDays}-day free trial
                  </strong>
                  . You are not charged until it ends. Billed monthly, cancel anytime.
                </p>
              </div>

              <div className="px-7 py-8 sm:px-9">
                <ul className="space-y-3">
                  {hvacPlanIncludes.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-sage-light"
                        aria-hidden="true"
                      />
                      <span className="text-[15px] leading-relaxed text-neutral-dark-gray">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    href={SIGNUP_URL}
                    size="lg"
                    variant="gold"
                    onClick={() => trackCta('pricing')}
                    className="w-full"
                  >
                    Start your {hvacPlan.trialDays}-day free trial
                    <ArrowRight size={18} className="ml-2" aria-hidden="true" />
                  </Button>
                  <p className="mt-4 text-center text-[13px] leading-relaxed text-neutral-medium-gray">
                    Billing is handled by Paddle, our merchant of record, so the charge appears on
                    your statement as Paddle. See our{' '}
                    <a
                      href="/refund-policy"
                      className="underline underline-offset-2 hover:text-forest-primary"
                    >
                      refund &amp; cancellation policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. FAQ ──────────────────────────────────────────────────────────── */}
      <Section variant="light">
        <SectionHeading
          title="Straight answers"
          subtitle="The things contractors actually ask us before they sign up."
        />
        <Accordion
          items={hvacFaqs}
          defaultOpen={null}
          onOpen={(item, index) =>
            captureEvent('hvac_faq_expanded', {
              faq_question: item.q,
              faq_index: index,
            })
          }
        />
      </Section>

      {/* ── 7. Final CTA ────────────────────────────────────────────────────── */}
      <Section className="bg-aurora-soft">
        <div className="relative overflow-hidden rounded-sq-xl bg-gradient-to-br from-forest-deep via-forest-primary to-sage-medium px-6 py-14 text-center shadow-sq-xl lg:py-20">
          <div className="absolute inset-0 opacity-25" aria-hidden="true">
            <Picture
              src="/images/products-city.jpg"
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <FadeIn>
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
                Stop losing jobs to a voicemail greeting
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
                Two weeks free, live this afternoon, and your number stays exactly where it is.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  href={SIGNUP_URL}
                  size="lg"
                  variant="gold"
                  onClick={() => trackCta('final')}
                >
                  Start your {hvacPlan.trialDays}-day free trial
                  <ArrowRight size={18} className="ml-2" aria-hidden="true" />
                </Button>
                <p className="text-sm text-white/60">
                  {hvacPlan.priceDisplay}/month after the trial · {hvacPlan.includedMinutes}{' '}
                  minutes included · cancel anytime
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>
    </>
  );
};
