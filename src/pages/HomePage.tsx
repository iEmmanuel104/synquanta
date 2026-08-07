import {
  Hero,
  ServicesTeaser,
  Flagship,
  GlobalReach,
  WelcomeBand,
  RecentWork,
  CallToAction,
} from '../components/sections';
import { Seo } from '../components/Seo';

export const HomePage = () => {
  return (
    <>
      <Seo
        path="/"
        title="SynQuanta Technologies | Web & mobile product studio"
        description="SynQuanta is a product studio that researches before it builds. Web and mobile products for founders and teams, taken from the first sketch through to launch."
      />
      <Hero />
      <ServicesTeaser />
      <Flagship />
      <GlobalReach />
      <WelcomeBand />
      <RecentWork />
      <CallToAction />
    </>
  );
};
