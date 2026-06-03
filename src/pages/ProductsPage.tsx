import { PageHero } from '../components/ui';
import { Products, CoverageBand, CallToAction } from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const ProductsPage = () => {
  usePageTitle('Products | SynQuanta Technologies');
  return (
    <>
      <PageHero
        eyebrow="Built for the 2026 surge"
        title="Productized growth for the World Cup"
        subtitle="Three ways we turn deep local research into matchday revenue — across every host city in the USA, Canada and Mexico."
        image="/images/products-stadium.jpg"
      />
      <Products />
      <CoverageBand />
      <CallToAction />
    </>
  );
};
