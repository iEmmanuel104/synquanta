import { PageHero, Accordion } from '../components/ui';
import { Section } from '../components/layout';
import { CallToAction } from '../components/sections';
import { faqs } from '../constants';
import { usePageTitle } from '../lib/usePageTitle';

export const FaqPage = () => {
  usePageTitle('FAQ | SynQuanta Technologies');
  return (
    <>
      <PageHero
        eyebrow="Answers"
        title="Frequently asked questions"
        subtitle="Everything you might want to know about how we research, what we build, and how we work."
        image="/images/faq-texture.jpg"
      />
      <Section>
        <Accordion items={faqs} />
      </Section>
      <CallToAction />
    </>
  );
};
