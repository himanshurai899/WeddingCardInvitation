import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wedding } from '../config/wedding';
import { Toran } from './art/Motifs';
import { KailashRange, MalaBand } from './art/Shiva';

// Personalised link: https://your-site.vercel.app/?guest=Sharma%20Ji
const guest = new URLSearchParams(window.location.search).get('guest')?.trim().slice(0, 40);

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay },
});

// The "card opener": the first thing a guest sees after scanning the QR on the printed card.
// Sizes follow the screen height (svh) so the whole cover, button included, fits an
// iPhone with Safari's toolbars showing; very short screens can still scroll it.
const WelcomeOverlay = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    window.scrollTo(0, 0);
    if (window.weddingAudio) {
      window.weddingAudio.play().catch(() => { });
    }
    if (onOpen) onOpen();
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="night-sky fixed inset-0 w-full h-[100dvh] z-[100] overflow-hidden flex flex-col text-cream overscroll-contain"
        >
          {/* moonlight behind the picture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 38% at 50% 34%, rgba(253,230,138,.16) 0%, transparent 70%)' }}
          />
          <div className="petal-shower" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDuration: `${7 + (i % 4)}s`, animationDelay: `${i * 0.7}s` }} />
            ))}
          </div>

          {/* double gold frame, kept inside the iPhone's rounded corners and notch */}
          <div className="absolute inset-3 border border-gold/50 pointer-events-none" style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }} />
          <div className="absolute inset-[18px] border border-gold/20 pointer-events-none" style={{ top: 'calc(max(0.75rem, env(safe-area-inset-top)) + 6px)' }} />

          <Toran className="relative z-10 flex-none" />

          <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">
            <div className="min-h-full flex flex-col items-center justify-center px-6 sm:px-8 py-3 text-center">
              <motion.p {...rise(0.2)} className="deva text-gold-bright text-[15px] sm:text-base tracking-wide">
                ॥ श्री गणेशाय नमः ॥
              </motion.p>
              <motion.p {...rise(0.3)} className="hidden [@media(min-height:780px)]:block font-devaText italic text-gold-pale/75 text-[13px] leading-relaxed mt-1 max-w-[300px]">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br />निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </motion.p>

              {/* Mahadev and Parvati in a gold jharokha */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.35 }}
                className="relative mt-3 h-[clamp(96px,calc(40svh-80px),320px)] [@media(min-width:768px)_and_(max-height:720px)]:h-[calc(40svh-110px)] aspect-[4/5] rounded-t-full p-[3px] bg-gradient-to-b from-gold-pale via-gold to-gold-dark shadow-[0_0_40px_rgba(224,180,95,.35)]"
              >
                <img
                  src={wedding.art.cover.src}
                  alt={wedding.art.cover.alt}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-[50%_22%] rounded-t-full"
                />
                <span className="pointer-events-none absolute inset-[7px] rounded-t-full border border-gold-pale/60" aria-hidden="true" />
              </motion.div>

              {guest && (
                <motion.p {...rise(0.5)} className="font-serif italic text-gold-pale text-lg sm:text-xl mt-3 -mb-1">
                  Dear {guest},
                </motion.p>
              )}
              <motion.span {...rise(0.6)} className="mt-3 text-gold-pale/90 tracking-[0.2em] min-[400px]:tracking-[0.3em] uppercase text-[10px] font-semibold">
                You&apos;re invited to the wedding of
              </motion.span>

              <motion.h1
                {...rise(0.75)}
                className="deva text-[clamp(2.4rem,7.4svh,4rem)] leading-[1.15] mt-1 bg-gradient-to-b from-[#fff6e0] to-gold-bright bg-clip-text text-transparent"
              >
                शुभ विवाह
              </motion.h1>
              <motion.p {...rise(0.9)} className="script-font text-[clamp(1.9rem,min(5.9svh,9.4vw),3.25rem)] leading-tight text-cream">
                {wedding.groom.name} <span className="text-marigold-soft">&amp;</span> {wedding.bride.name}
              </motion.p>

              <motion.div {...rise(1.0)} className="w-40 my-2 opacity-80">
                <MalaBand />
              </motion.div>
              <motion.p {...rise(1.0)} className="text-[11px] tracking-[0.3em] uppercase text-gold-pale/80">
                25 · 11 · 2026 &nbsp;•&nbsp; Vadodara
              </motion.p>

              <motion.button
                {...rise(1.15)}
                type="button"
                onClick={handleOpen}
                whileTap={{ scale: 0.96 }}
                className="mt-[clamp(0.75rem,2.6svh,1.75rem)] relative overflow-hidden rounded-full px-9 py-3 font-serif text-base font-semibold tracking-[0.2em] text-maroon-ink shadow-[0_8px_30px_rgba(224,180,95,.35)] border border-gold-pale"
                style={{ background: 'linear-gradient(135deg, #c9a24b 0%, #f7e2a8 50%, #c9a24b 100%)' }}
              >
                OPEN INVITATION
                <span className="block deva text-[13px] tracking-normal font-normal text-maroon">निमंत्रण खोलें</span>
              </motion.button>
            </div>
          </div>

          {/* Kailash along the bottom of the card */}
          <KailashRange className="relative z-0 flex-none w-full h-[clamp(44px,10svh,120px)] md:h-auto md:aspect-[80/7] md:max-h-[14svh] [@media(max-height:600px)]:h-8 -mt-2 pointer-events-none" />
          <div className="flex-none bg-[#16224a]" style={{ height: 'env(safe-area-inset-bottom)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay;
