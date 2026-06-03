import { PageHero } from '../components/ui';
import { Services, Values, CallToAction } from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const ServicesPage = () => {
  usePageTitle('Services | SynQuanta Technologies');
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="From idea to launch — we design, build & ship"
        subtitle="Platforms, web & mobile products, custom software, AI and more. We don't just build websites — we help teams bring real products to life."
        image="/images/services-workspace.jpg"
      />
      <Services />
      <Values />
      <CallToAction />
    </>
  );
};
