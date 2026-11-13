import { useEffect, useState } from 'react';
import { PageHero } from '../components/ui';
import { Section } from '../components/layout/Section';
import { FadeIn } from '../components/animations';
import { ErpIntake } from '../components/sections/ErpIntake';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

/**
 * /erp: the landing page for the ERP ad campaign (marketing/erp/GUIDE.md).
 * One job: get a business owner to tell us about their business, or book a
 * session, without leaving the page. Plain words; "ERP" comes second.
 *
 * ?path=book opens the booking form first (used by the booking-led ad copy).
 */
const STEPS = [
  ['Learn', 'We learn how your business runs today: the people, the steps, the tools.'],
  ['Plan', 'We agree what the system should do first, and what it will cost.'],
  ['Build', 'We build it around the way you already work, and show you progress as we go.'],
  ['Launch', 'We set it up, move your information across and train your team.'],
];

const PAINS = [
  'Information spread across spreadsheets, chat groups and separate apps',
  'Nobody can see the full picture without asking around',
  'Too much depends on one person remembering everything',
];

export const ErpPage = () => {
  const [mode, setMode] = useState<'questionnaire' | 'booking'>('questionnaire');
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('path') === 'book') setMode('booking');
  }, []);

  const go = (m: 'questionnaire' | 'booking') => {
    setMode(m);
    document.getElementById('start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Seo
        path="/erp"
        title="One System for Your Whole Business (Custom ERP) | SynQuanta"
        description="Sales, stock, money, staff and reports in one system, built around how your business actually works. Tell us about your business or book a session with our team."
        jsonLd={breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'Custom ERP systems', path: '/erp' },
        ])}
      />
      <PageHero
        eyebrow="Custom business systems (ERP)"
        title="One system for your whole business"
        subtitle="Your sales, stock, money, staff and reports in one place, built around the way your business already works."
        image="/images/contact-texture.jpg"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => go('questionnaire')}
            className="rounded-sq-lg bg-mint-pale px-6 py-3.5 text-[16.5px] font-semibold text-forest-deep shadow-sq transition-transform hover:-translate-y-0.5"
          >
            Tell us about your business
          </button>
          <button
            type="button"
            onClick={() => go('booking')}
            className="rounded-sq-lg border-2 border-white/70 px-6 py-3 text-[16.5px] font-semibold text-white transition-colors hover:bg-white hover:text-forest-deep"
          >
            Book a session
          </button>
        </div>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* On phones the form comes first: most visitors arrive from an ad, ready to start. */}
          <FadeIn className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-forest-deep">Sound familiar?</h2>
              <ul className="mb-8 space-y-3">
                {PAINS.map((p) => (
                  <li key={p} className="flex gap-3 text-[15.5px] leading-relaxed text-neutral-charcoal">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sage-medium" /> {p}
                  </li>
                ))}
              </ul>
              <p className="mb-8 text-[15.5px] leading-relaxed text-neutral-medium-gray">
                An ERP is simply one system that brings it all together. We don’t sell you someone else’s software
                and ask you to change how you work. We build yours around how you already work.
              </p>
              <h3 className="mb-4 text-lg font-semibold text-forest-deep">How we work</h3>
              <ol className="space-y-3">
                {STEPS.map(([t, d], i) => (
                  <li key={t} className="flex gap-3.5 rounded-sq-lg bg-white p-4 shadow-sq">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-primary text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-semibold text-forest-deep">{t}</span>
                      <span className="block text-sm leading-relaxed text-neutral-medium-gray">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="order-1 lg:order-2">
            <div id="start" className="scroll-mt-24">
              <h2 className="mb-2 text-3xl font-semibold tracking-tight text-forest-deep">Let’s start with your business</h2>
              <p className="mb-6 text-[15.5px] text-neutral-medium-gray">
                Choose how you’d like to begin. Either way, a real person on our team replies by email within one
                working day.
              </p>
              <ErpIntake initialMode={mode} />
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
};
