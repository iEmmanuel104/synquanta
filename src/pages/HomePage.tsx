import {
  Hero,
  ServicesTeaser,
  WorkTeaser,
  FlagshipTeaser,
  WelcomeBand,
  CallToAction,
} from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const HomePage = () => {
  usePageTitle('SynQuanta Technologies | Research-led growth for local business');
  return (
    <>
      <Hero />
      <ServicesTeaser />
      <WorkTeaser />
      <FlagshipTeaser />
      <WelcomeBand />
      <CallToAction />
    </>
  );
};
