import { PageHero } from '../components/ui';
import { Section } from '../components/layout/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Values, CallToAction } from '../components/sections';
import { Seo } from '../components/Seo';
import { breadcrumb, aboutPageSchema } from '../lib/structuredData';

/**
 * Dedicated entity page. Clear, factual prose about who SynQuanta Technologies
 * is — the strongest on-page signal for Search's Knowledge Graph and AI
 * overviews. Brand name is written in full ("SynQuanta Technologies")
 * consistently so crawlers anchor the entity unambiguously.
 */
export const AboutPage = () => {
  return (
    <>
      <Seo
        path="/about"
        title="About SynQuanta Technologies | Software product studio"
        description="SynQuanta Technologies is a software product studio that researches before it builds. We design and build web and mobile products for founders and teams, from first sketch to launch."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
          aboutPageSchema(),
        ]}
      />

      <PageHero
        eyebrow="About us"
        title="We are SynQuanta Technologies"
        subtitle="A software product studio that does its homework first. We design and build web and mobile products, and stay with them from the first sketch through to launch."
        image="/images/services-workspace.jpg"
      />

      <Section className="scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="Who we are"
            subtitle="An independent studio, working with founders and teams."
          />
          <div className="space-y-5 text-lg leading-relaxed text-neutral-medium-gray">
            <p>
              <strong className="text-forest-deep">SynQuanta Technologies</strong> (legally
              SynQuanta Technologies Ltd) is a software product studio. We design and build custom
              web and mobile products, starting at the first sketch and staying on them well past
              the day they go live.
            </p>
            <p>
              The part that makes us useful is what happens before any code exists. We study the
              problem, the market, and the people the product is meant to serve. It is unglamorous
              work and it regularly saves clients from building the wrong thing, which is the most
              expensive mistake available in this line of work.
            </p>
            <p>
              Our clients are usually founders testing a new idea, or teams whose product has
              outgrown whatever it was first built on. Both jobs need the same thing: someone who
              will tell you what they actually found, then build accordingly.
            </p>
          </div>
        </div>
      </Section>

      <Section id="what-we-do" variant="light" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="The shapes this usually takes"
            subtitle="Design and engineering, from the first conversation to the live product."
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ['Platforms', 'Multi-sided systems and the dashboards that keep them running.'],
              ['Web products', 'Web apps that stay fast, and work for people using a screen reader.'],
              ['Mobile apps', 'iOS and Android products that survive past the first week on a phone.'],
              ['Custom software', 'Tools shaped around how your team already works.'],
              ['AI features', 'AI aimed at a specific job inside a real workflow.'],
              ['MVPs', 'A first version lean enough to test the idea before you commit to it.'],
            ].map(([title, body]) => (
              <li
                key={title}
                className="rounded-sq-xl border border-cream-green bg-white p-5 shadow-sq"
              >
                <h3 className="mb-1 text-lg font-semibold text-forest-deep">{title}</h3>
                <p className="text-sm text-neutral-medium-gray">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Values />
      <CallToAction />
    </>
  );
};
