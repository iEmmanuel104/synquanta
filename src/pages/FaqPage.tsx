import { PageHero, Accordion } from '../components/ui';
import { Section } from '../components/layout';
import { CallToAction } from '../components/sections';
import { faqs } from '../constants';
import { Seo } from '../components/Seo';

export const FaqPage = () => {
  return (
    <>
      <Seo
        path="/faq"
        title="FAQ | SynQuanta Technologies"
        description="How SynQuanta researches, what we build, and how we work — answers to the questions founders and teams ask us most."
      />
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
