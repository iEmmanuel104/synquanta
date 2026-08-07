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
        description="Tell us what you're building and you'll get back a written plan and a price. SynQuanta designs and builds web and mobile products for founders and teams."
        jsonLd={breadcrumb([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <PageHero
        eyebrow="Let's talk"
        title="Tell us about your business"
        subtitle="Share a few details about what you're building. You'll get back a written plan and a price, and a real person will have read it."
        image="/images/contact-texture.jpg"
      />
      <Contact hideHeading />
    </>
  );
};
