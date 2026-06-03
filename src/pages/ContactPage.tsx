import { PageHero } from '../components/ui';
import { Contact } from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const ContactPage = () => {
  usePageTitle('Contact | SynQuanta Technologies');
  return (
    <>
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
