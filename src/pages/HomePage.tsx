import {
  Hero,
  ServicesTeaser,
  FlagshipTeaser,
  WelcomeBand,
  CallToAction,
} from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const HomePage = () => {
  usePageTitle('SynQuanta Technologies | We design platforms & build products');
  return (
    <>
      <Hero />
      <ServicesTeaser />
      <WelcomeBand />
      <FlagshipTeaser />
      <CallToAction />
    </>
  );
};
