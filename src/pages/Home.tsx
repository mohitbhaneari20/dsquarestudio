import { Faq } from '../components/home/Faq';
import { Hero } from '../components/home/Hero';
import { HomeWork } from '../components/home/HomeWork';
import { OngoingSection } from '../components/home/OngoingSection';
import { Statement } from '../components/home/Statement';
import { StudioIntro } from '../components/home/StudioIntro';
import { WhyDsquare } from '../components/home/WhyDsquare';
import { CTA } from '../components/ui/CTA';
import { Seo } from '../components/ui/Seo';

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <StudioIntro />
      <HomeWork />
      <Statement />
      <WhyDsquare />
      <OngoingSection />
      <Faq />
      <CTA title={['Have something', 'worth building?']} />
    </>
  );
}
