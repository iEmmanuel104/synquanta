import { PageHero } from '../components/ui';
import { PortfolioGrid, CallToAction } from '../components/sections';
import { Seo } from '../components/Seo';
import { portfolioProjects } from '../constants';
import { breadcrumb, creativeWorkListSchema } from '../lib/structuredData';

export const PortfolioPage = () => {
  return (
    <>
      <Seo
        path="/portfolio"
        title="Portfolio | SynQuanta Technologies"
        description="Selected work from SynQuanta. Platforms we've designed and shipped for founders, businesses and non-profits: AI products, marketplaces, fintech, education, community, e-commerce and websites."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Portfolio', path: '/portfolio' },
          ]),
          creativeWorkListSchema(portfolioProjects),
        ]}
      />
      <PageHero
        eyebrow="Selected work"
        title="Products we've designed and built"
        subtitle="Products we've shipped for founders, businesses and non-profits, from AI marketing and service marketplaces to fintech, education and e-commerce. Each one started as a conversation much like the one you're about to have."
        image="/images/portfolio-texture.jpg"
      />
      <PortfolioGrid />
      <CallToAction />
    </>
  );
};
