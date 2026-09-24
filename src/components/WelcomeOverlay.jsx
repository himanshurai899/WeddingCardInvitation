import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wedding } from '../config/wedding';
import { Toran, MadhubaniBand } from './art/Motifs';

// Personalised link: https://your-site.vercel.app/?guest=Sharma%20Ji
const guest = new URLSearchParams(window.location.search).get('guest')?.trim().slice(0, 40);

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay },
});

// The "card opener": the first thing a guest sees after scanning the QR on the printed card
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
          style={{ touchAction: 'none' }}
          className="fixed inset-0 w-screen h-[100dvh] z-[100] overflow-hidden flex flex-col bg-maroon-deep text-cream"
        >
          {/* Ground and glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 45% at 50% 42%, rgba(232,130,30,.28) 0%, transparent 70%), linear-gradient(180deg, #5c1420 0%, #4a1026 55%, #3a0b1c 100%)',
            }}
          />
          <div className="petal-shower" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDuration: `${7 + (i % 4)}s`, animationDelay: `${i * 0.7}s` }} />
            ))}
          </div>

          {/* Madhubani double frame */}
          <div className="absolute inset-3 border border-gold/60 pointer-events-none" />
          <div className="absolute inset-[18px] border border-gold/25 pointer-events-none" />

          <Toran className="relative z-10 flex-none" />

          {/* ── Centered Content ── */}
          <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-8 text-center">
            <motion.p {...rise(0.2)} className="deva text-gold-bright text-base tracking-wide">
              ॥ श्री गणेशाय नमः ॥
            </motion.p>
            <motion.p {...rise(0.35)} className="font-devaText italic text-gold-pale/80 text-[13px] leading-relaxed mt-2 max-w-[300px]">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br />निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
            </motion.p>

            <motion.div {...rise(0.5)} className="w-40 my-4 opacity-80">
              <MadhubaniBand color="#e0b45f" accent="#e8821e" />
            </motion.div>

            {guest && (
              <motion.p {...rise(0.55)} className="font-serif italic text-gold-pale text-xl mb-1">
                Dear {guest},
              </motion.p>
            )}
            <motion.span {...rise(0.6)} className="text-gold-pale/90 tracking-[0.35em] uppercase text-[10px] font-semibold">
              You're invited to the wedding of
            </motion.span>

            <motion.h1
              {...rise(0.75)}
              className="deva text-6xl leading-tight mt-3 bg-gradient-to-b from-[#fff6e0] to-gold-bright bg-clip-text text-transparent"
            >
              शुभ विवाह
            </motion.h1>
            <motion.p {...rise(0.9)} className="script-font text-[44px] leading-none text-cream mt-1">
              {wedding.groom.name} <span className="text-marigold-soft">&amp;</span> {wedding.bride.name}
            </motion.p>
            <motion.p {...rise(1.0)} className="mt-3 text-[11px] tracking-[0.3em] uppercase text-gold-pale/80">
              25 · 11 · 2026 &nbsp;•&nbsp; Vadodara
            </motion.p>

            {/* CTA Button */}
            <motion.button
              {...rise(1.15)}
              type="button"
              onClick={handleOpen}
              whileTap={{ scale: 0.96 }}
              className="mt-7 relative overflow-hidden rounded-full px-9 py-3.5 font-serif text-base font-semibold tracking-[0.2em] text-maroon-ink shadow-[0_8px_30px_rgba(224,180,95,.35)] border border-gold-pale"
              style={{ background: 'linear-gradient(135deg, #c9a24b 0%, #f7e2a8 50%, #c9a24b 100%)' }}
            >
              OPEN INVITATION
              <span className="block deva text-[13px] tracking-normal font-normal text-maroon">निमंत्रण खोलें</span>
            </motion.button>
          </div>

          {/* Elephant pair greeting at the gate */}
          <div className="relative z-10 flex-none flex justify-between items-end px-4 pb-4 -mb-1">
            <img src={wedding.paintings.elephantCover} alt="" className="w-[40vw] max-w-[200px] h-auto -scale-x-100 drop-shadow-[0_6px_10px_rgba(0,0,0,.45)]" />
            <img src={wedding.paintings.elephantCover} alt="" className="w-[40vw] max-w-[200px] h-auto drop-shadow-[0_6px_10px_rgba(0,0,0,.45)]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay;
