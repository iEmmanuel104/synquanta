import { PageHero, Accordion } from '../components/ui';
import { Section } from '../components/layout';
import { CallToAction } from '../components/sections';
import { faqs } from '../constants';
import { Seo } from '../components/Seo';
import { breadcrumb, faqPageSchema } from '../lib/structuredData';

export const FaqPage = () => {
  return (
    <>
      <Seo
        path="/faq"
        title="FAQ | SynQuanta Technologies"
        description="Answers to what founders and teams ask us most: how we research, what we build, what it costs and how long it takes."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
          faqPageSchema(faqs),
        ]}
      />
      <PageHero
        eyebrow="Answers"
        title="Frequently asked questions"
        subtitle="What people usually want to know before they get in touch. If yours isn't here, just ask."
        image="/images/faq-texture.jpg"
      />
      <Section>
        <Accordion items={faqs} />
      </Section>
      <CallToAction />
    </>
  );
};
