import { PageHero } from '../components/ui';
import { Products, Intel, CoverageBand, CallToAction } from '../components/sections';
import { Seo } from '../components/Seo';
import { products } from '../constants/products';
import { breadcrumb, productListSchema } from '../lib/structuredData';

export const ProductsPage = () => {
  return (
    <>
      <Seo
        path="/products"
        title="World Cup Revenue Optimization | SynQuanta Technologies"
        description="We turn deep local research into matchday revenue for businesses across every 2026 World Cup host city in the USA, Canada and Mexico."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
          ]),
          productListSchema(products),
        ]}
      />
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
