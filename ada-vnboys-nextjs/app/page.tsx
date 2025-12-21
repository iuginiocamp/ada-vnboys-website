import Introduction from './components/Introduction';
import ResearchQuestions from './components/ResearchQuestions';
import Channels from './components/Channels';
import Grouping from './components/Grouping';
import Pageviews from './components/Pageviews';
import Opinions from './components/Opinions';
import Conclusion from './components/Conclusion';
import References from './components/References';
import Section from '@/components/Section';
import Reveal from '@/components/motion/Reveal';

export default function Home() {
  return (
    <>
      <Section>
        <Reveal>
          <Introduction />
        </Reveal>
      </Section>
      <ResearchQuestions />
      <Channels />
      <Grouping />
      <Pageviews />
      <Opinions />
      <Conclusion />
      <References />
    </>
  );
}
