import {
  Hero,
  ServicesTeaser,
  GlobalReach,
  WelcomeBand,
  FlagshipTeaser,
  CallToAction,
} from '../components/sections';
import { usePageTitle } from '../lib/usePageTitle';

export const HomePage = () => {
  usePageTitle('SynQuanta Technologies | We design platforms & build products');
  return (
    <>
      <Hero />
      <ServicesTeaser />
      <GlobalReach />
      <WelcomeBand />
      <FlagshipTeaser />
      <CallToAction />
    </>
  );
};
