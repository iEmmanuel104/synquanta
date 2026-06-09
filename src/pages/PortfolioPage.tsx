import { PageHero } from '../components/ui';
import { PortfolioGrid, CallToAction } from '../components/sections';
import { Seo } from '../components/Seo';

export const PortfolioPage = () => {
  return (
    <>
      <Seo
        path="/portfolio"
        title="Portfolio | SynQuanta Technologies"
        description="Selected work from SynQuanta — platforms we've designed and shipped for founders and teams across fintech, education, community, e-commerce and fashion."
      />
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
