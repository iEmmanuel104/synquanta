import { Header, Footer } from './components/layout';
import {
  Hero,
  Services,
  Products,
  CoverageBand,
  Intel,
  WelcomeBand,
  Values,
  CallToAction,
  Contact,
} from './components/sections';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        <Hero />
        <Services />
        <Products />
        <CoverageBand />
        <Intel />
        <WelcomeBand />
        <Values />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
