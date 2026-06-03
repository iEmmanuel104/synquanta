import { PageHero } from '../components/ui';
import { PortfolioGrid, CallToAction } from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const PortfolioPage = () => {
  usePageTitle('Portfolio | SynQuanta Technologies');
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Products we've designed and built"
        subtitle="A look at the platforms we've shipped for founders and teams — across fintech, education, community, e-commerce and fashion."
        image="/images/portfolio-texture.jpg"
      />
      <PortfolioGrid />
      <CallToAction />
    </>
  );
};
