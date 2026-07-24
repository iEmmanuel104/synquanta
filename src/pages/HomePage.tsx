import {
  Hero,
  ServicesTeaser,
  GlobalReach,
  WelcomeBand,
  CallToAction,
} from '../components/sections';
import { Seo } from '../components/Seo';

export const HomePage = () => {
  return (
    <>
      <Seo
        path="/"
        title="SynQuanta Technologies | We design platforms & build products"
        description="SynQuanta is a research-led product studio. We design platforms, build web & mobile products, and bring startup ideas to life — from first sketch to launch."
      />
      <Hero />
      <ServicesTeaser />
      <GlobalReach />
      <WelcomeBand />
      <CallToAction />
    </>
  );
};
