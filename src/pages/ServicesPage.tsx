import { PageHero } from '../components/ui';
import { Services, Values, Intel, CallToAction } from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const ServicesPage = () => {
  usePageTitle('Services | SynQuanta Technologies');
  return (
    <>
      <PageHero
        eyebrow="What we build"
        title="Services that move the needle"
        subtitle="From research-led websites to custom software, AI and distributed systems — end-to-end digital solutions, built to win."
        image="/images/services-workspace.jpg"
      />
      <Services />
      <Values />
      <Intel />
      <CallToAction />
    </>
  );
};
