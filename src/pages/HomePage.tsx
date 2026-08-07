import {
  Hero,
  ServicesTeaser,
  // Flagship,  ← AI Receptionist band, hidden until the product is finished.
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
      {/* HIDDEN 2026-08-07 — the AI Receptionist is not shown anywhere on the
          site until the product is finished end to end. The component and its
          page are intentionally kept, not deleted. Restore alongside the nav
          link in constants/navigation.ts and the /hvac route in App.tsx. */}
      {/* <Flagship /> */}
      <GlobalReach />
      <WelcomeBand />
      <RecentWork />
      <CallToAction />
    </>
  );
};
