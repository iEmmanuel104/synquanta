import { PageHero } from '../components/ui';
import { Services, Values, CallToAction } from '../components/sections';
import { Seo } from '../components/Seo';
import { services } from '../constants';
import { breadcrumb, serviceListSchema } from '../lib/structuredData';

export const ServicesPage = () => {
  return (
    <>
      <Seo
        path="/services"
        title="Services | SynQuanta Technologies"
        description="Platforms, web & mobile products, custom software and AI. SynQuanta helps teams turn an idea into a launched product — research-led, from first sketch to ship."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
          serviceListSchema(services),
        ]}
      />
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
