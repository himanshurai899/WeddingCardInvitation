import { useState } from 'react';
import Hero from './components/Hero';
import Shloka from './components/Shloka';
import CoupleReveal from './components/CoupleReveal';
import ScratchReveal from './components/ScratchReveal';
import Countdown from './components/Countdown';
import FunctionsTimeline from './components/FunctionsTimeline';
import WeddingNight from './components/WeddingNight';
import SaatPhere from './components/SaatPhere';
import Venue from './components/Venue';
import DressCode from './components/DressCode';
import Families from './components/Families';
import Rsvp from './components/Rsvp';
import MusicPlayer from './components/MusicPlayer';
import WelcomeOverlay from './components/WelcomeOverlay';
import SectionNav from './components/SectionNav';
import ScrollProgress from './components/ScrollProgress';
import { FramedPainting } from './components/art/Painting';
import { Diya } from './components/art/Motifs';
import { MotionConfig, motion } from 'framer-motion';
import { wedding, coupleShort } from './config/wedding';

function App() {
  const [opened, setOpened] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative selection:bg-marigold/30 w-full overflow-x-clip">
        <WelcomeOverlay onOpen={() => setOpened(true)} />
        <ScrollProgress visible={opened} />
        <MusicPlayer src={wedding.music} />
        <SectionNav visible={opened} />

        <Hero opened={opened} />

        <Shloka />

        <CoupleReveal />

        <ScratchReveal />

        <Countdown />

        <FunctionsTimeline />

        <WeddingNight />

        <SaatPhere />

        <Venue />

        <DressCode />

        <Families />

        <Rsvp />

        {/* Final Blessing Section */}
        <section className="relative pt-16 paper text-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto px-8"
          >
            <div className="mb-8 flex justify-center gap-3">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                >
                  <Diya className="w-9 h-9" />
                </motion.div>
              ))}
            </div>

            <p className="font-devaText text-xl md:text-2xl text-maroon-deep leading-relaxed mb-4">
              {wedding.doha.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
            <p className="text-xl md:text-2xl font-serif text-maroon-deep italic leading-relaxed mb-10">
              With our elders' blessings and God's grace, we can't wait to welcome you.
            </p>

            <div className="flex flex-col items-center">
              <span className="text-sindoor tracking-[0.5em] uppercase text-xs font-bold mb-3">With Love</span>
              <h4 className="script-font text-5xl text-maroon">{coupleShort}</h4>
              <p className="deva text-lg text-marigold mt-1">
                {wedding.groom.familyHindi} एवं {wedding.bride.familyHindi} परिवार
              </p>
            </div>
          </motion.div>

          <FramedPainting
            src={wedding.paintings.finale.src}
            alt="Krishna with the gopis beneath the trees on the bank of the Yamuna"
            caption={wedding.paintings.finale.caption}
            className="max-w-2xl mx-auto px-5 mt-10 pb-12"
          />
        </section>

        {/* Footer Branding */}
        <footer className="pt-8 pb-28 bg-[#f3e8d2] text-center border-t border-gold/20">
          <p className="text-[10px] tracking-[0.3em] uppercase text-ink-soft">
            Shubh Vivah • 25.11.2026 • Vadodara
          </p>
          <p className="mt-2 px-6 text-[10px] leading-relaxed text-ink-soft/80">
            Paintings courtesy of The Metropolitan Museum of Art, Open Access (public domain)
          </p>
        </footer>
      </main>
    </MotionConfig>
  );
}

export default App;
