import { PageHero } from '../components/ui';
import { Contact } from '../components/sections';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

export const ContactPage = () => {
  return (
    <>
      <Seo
        path="/contact"
        title="Contact | SynQuanta Technologies"
        description="Tell us about your business and we'll come back with a research-led plan and a tailored quote. Let's build your product together."
        jsonLd={breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <PageHero
        eyebrow="Let's talk"
        title="Tell us about your business"
        subtitle="Share a few details and we'll come back with a research-led plan and a tailored quote — as soon as possible."
        image="/images/contact-texture.jpg"
      />
      <Contact hideHeading />
    </>
  );
};
