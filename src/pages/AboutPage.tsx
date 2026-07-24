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
        description="SynQuanta Technologies is a research-led software product studio. We design platforms, build web and mobile products, and turn startup ideas into launched products."
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
        subtitle="A research-led software product studio. We design platforms, build web and mobile products, and bring startup ideas to life — from first sketch to launch."
        image="/images/services-workspace.jpg"
      />

      <Section className="scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="Who we are"
            subtitle="An independent software product studio for founders and teams."
          />
          <div className="space-y-5 text-lg leading-relaxed text-neutral-medium-gray">
            <p>
              <strong className="text-forest-deep">SynQuanta Technologies</strong> (legally
              SynQuanta Technologies Ltd) is a software product studio. We design and build
              custom web and mobile products — from the first sketch through to a launched,
              scalable product that real users rely on.
            </p>
            <p>
              We are research-led: before we write a line of code we study the problem, the
              market and the people the product is for, so what we ship is grounded in evidence
              rather than guesswork. That approach runs across everything we make — platforms,
              web applications, mobile apps, custom software, AI features and early-stage MVPs.
            </p>
            <p>
              We work with founders and teams who want a partner that can take an idea and turn
              it into something tangible and dependable. Whether you are validating a new concept
              or scaling an existing product, SynQuanta Technologies helps you move from idea to
              launch with confidence.
            </p>
          </div>
        </div>
      </Section>

      <Section id="what-we-do" variant="light" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="What we do"
            subtitle="Product design and engineering, end to end."
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ['Platforms', 'Multi-sided systems and dashboards built to scale.'],
              ['Web products', 'Fast, accessible web applications that ship.'],
              ['Mobile apps', 'iOS and Android products people keep using.'],
              ['Custom software', 'Bespoke tools tailored to how your team works.'],
              ['AI features', 'Practical AI woven into real product workflows.'],
              ['MVPs', 'Lean first versions that test an idea in the market.'],
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
