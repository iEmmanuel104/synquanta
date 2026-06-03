import { PageHero } from '../components/ui';
import { Products, Intel, CoverageBand, CallToAction } from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const ProductsPage = () => {
  usePageTitle('World Cup Revenue Optimization | SynQuanta Technologies');
  return (
    <>
      <PageHero
        eyebrow="Featured product · World Cup 2026"
        title="World Cup Revenue Optimization"
        subtitle="One of our products: we turn deep local research into matchday revenue for businesses across every 2026 host city in the USA, Canada and Mexico."
        image="/images/products-stadium.jpg"
      />
      <Products />
      <Intel />
      <CoverageBand />
      <CallToAction />
    </>
  );
};
