import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { PageHero } from '../components/ui';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FadeIn } from '../components/animations';
import { ErpIntake } from '../components/sections/ErpIntake';
import { ErpHub, HeroFlow, NextStepsRail, PainCards, WorkTimeline } from '../components/sections/ErpFlow';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

/**
 * /erp: the landing page for the ERP ad campaign (marketing/erp/GUIDE.md).
 * One job: get a business owner to tell us about their business, or book a
 * session, without leaving the page. Plain words; "ERP" comes second.
 *
 * Order is deliberate: ad visitors land ready to act, so the form comes right
 * after the hero; the explanation (hub, pains, timeline) follows for those who
 * want to read first, and every section leads back to the form.
 *
 * ?path=book opens the booking form first (used by the booking-led ad copy).
 */
type Mode = 'questionnaire' | 'booking';

export const ErpPage = () => {
  const [mode, setMode] = useState<Mode>('questionnaire');
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('path') === 'book') setMode('booking');
  }, []);

  const go = (m: Mode) => {
    setMode(m);
    document.getElementById('start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const ctas = (dark: boolean) => (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => go('questionnaire')}
        className={`group inline-flex items-center gap-2 rounded-sq-lg px-6 py-3.5 text-[16.5px] font-semibold shadow-sq transition-transform hover:-translate-y-0.5 ${
          dark ? 'bg-mint-pale text-forest-deep' : 'bg-forest-primary text-white'
        }`}
      >
        Tell us about your business
        <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
      </button>
      <button
        type="button"
        onClick={() => go('booking')}
        className={`inline-flex items-center gap-2 rounded-sq-lg border-2 px-6 py-3 text-[16.5px] font-semibold transition-colors ${
          dark
            ? 'border-white/70 text-white hover:bg-white hover:text-forest-deep'
            : 'border-forest-primary text-forest-primary hover:bg-forest-primary hover:text-white'
        }`}
      >
        <CalendarDays className="h-[18px] w-[18px]" />
        Book a session
      </button>
    </div>
  );

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
        {ctas(true)}
        <HeroFlow />
      </PageHero>

      {/* 1 · The form, right away */}
      <Section className="bg-aurora-soft">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
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
          <FadeIn className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <NextStepsRail />
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 2 · What an ERP actually is, shown not told */}
      <Section>
        <SectionHeading
          title="From scattered to one system"
          subtitle="An ERP is simply one system that brings your whole business together. We don’t sell you someone else’s software. We build yours around how you already work."
        />
        <ErpHub />
      </Section>

      {/* 3 · Sound familiar? */}
      <Section className="bg-aurora-cream">
        <SectionHeading title="Sound familiar?" subtitle="If any of these ring true, one system will save you time every single day." />
        <PainCards />
      </Section>

      {/* 4 · How we work */}
      <Section>
        <SectionHeading title="How we work" subtitle="Four clear steps, with you involved the whole way." />
        <WorkTimeline />
      </Section>

      {/* 5 · Back to the form */}
      <Section variant="gradient">
        <FadeIn className="text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to see your business in one place?
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-xl text-lg text-white/80">
            Start with a few taps, or book a session. We reply within one working day.
          </p>
          {ctas(true)}
        </FadeIn>
      </Section>
    </>
  );
};
