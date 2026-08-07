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
        description="Selected work from SynQuanta. Platforms we've designed and shipped for founders and teams in fintech, education, community, e-commerce and fashion."
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
        subtitle="Products we've shipped for founders and teams, across fintech, education, community, e-commerce and fashion. Each one started as a conversation much like the one you're about to have."
        image="/images/portfolio-texture.jpg"
      />
      <PortfolioGrid />
      <CallToAction />
    </>
  );
};
