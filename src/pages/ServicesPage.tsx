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
        description="Web and mobile products, custom software, system architecture and AI. SynQuanta researches before it builds, and takes products from first sketch through to launch."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
          serviceListSchema(services),
        ]}
      />
      <PageHero
        eyebrow="Services"
        title="From a rough idea to a launched product"
        subtitle="Web and mobile products, custom software, architecture and AI. Whatever the brief says on day one, the first week goes on working out what should actually exist."
        image="/images/services-workspace.jpg"
      />
      <Services />
      <Values />
      <CallToAction />
    </>
  );
};
