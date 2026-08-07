import { Link } from 'react-router-dom';
import { ArrowRight, PhoneMissed, CalendarCheck, MessageSquareText } from 'lucide-react';
import { Section } from '../layout/Section';
import { FadeIn } from '../animations/FadeIn';
import { hvacPlan } from '../../constants/hvac';

/**
 * Home-page band for the one product we actually sell. `/hvac` was previously a
 * paid-ad landing page linked from nowhere on the site; this is the organic
 * route into it. The price comes from `constants/hvac.ts` rather than being
 * retyped here, because Paddle cross-checks published prices against the
 * catalog and a second hardcoded figure is a second thing to forget.
 */
const highlights = [
  {
    icon: PhoneMissed,
    text: 'Answers the calls you miss, on the number you already advertise',
  },
  {
    icon: CalendarCheck,
    text: 'Works out what is wrong and books the job while the caller is still on the line',
  },
  {
    icon: MessageSquareText,
    text: 'Texts and emails you the moment the call ends, with a full transcript',
  },
];

export const Flagship = () => {
  return (
    <Section id="flagship" className="scroll-mt-20">
      <div className="wc-band relative overflow-hidden rounded-sq-2xl p-8 shadow-sq-lg sm:p-10 lg:p-12">
        <div className="wc-pattern" style={{ opacity: 0.35 }} aria-hidden="true" />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <FadeIn>
            <p className="sq-eyebrow mb-3.5 text-mint-pale">Our own product</p>
            <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              The job goes to whoever picks up first
            </h2>
            <p className="mb-7 max-w-xl text-lg leading-relaxed text-white/70">
              {hvacPlan.name}, built for contractors who are losing work to voicemail. A homeowner
              with no cold air does not leave a message. They hang up and call the next company on
              the list.
            </p>

            <ul className="mb-8 flex flex-col gap-3.5">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-start gap-3.5">
                  <span className="contact-chip flex-shrink-0">
                    <h.icon size={18} />
                  </span>
                  <span className="pt-1.5 text-[15px] leading-relaxed text-white/80">{h.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/hvac"
                className="inline-flex items-center gap-2 rounded-sq bg-white px-5 py-3 text-sm font-semibold text-forest-deep transition-colors hover:bg-cream-green"
              >
                See how it works
                <ArrowRight size={16} />
              </Link>
              <span className="text-sm text-white/60">
                {hvacPlan.trialDays} days free, then {hvacPlan.priceDisplay}
                {hvacPlan.intervalDisplay}
              </span>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.12}>
            <div className="rounded-sq-xl border border-white/10 bg-white/[0.06] p-7 text-center">
              <p className="mb-1 text-5xl font-semibold text-white">
                {hvacPlan.includedMinutes}
              </p>
              <p className="mb-6 text-sm text-white/60">answered minutes included each month</p>
              <p className="text-[15px] leading-relaxed text-white/75">
                It tells every caller it is an AI. Every time. We would rather a homeowner knew what
                they were talking to and got their problem solved.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
};
