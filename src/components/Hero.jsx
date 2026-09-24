import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { wedding } from '../config/wedding';
import { CoupleArch } from './art/Couple';
import { Fish, Kalash, MadhubaniBand, Toran } from './art/Motifs';

// One leaf of the haveli gate. The two fish face each other across the seam
// (the Mithila marriage emblem) until the doors part.
const DoorPanel = ({ side }) => {
  const left = side === 'left';
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-b from-maroon to-maroon-ink ${left ? 'border-r' : 'border-l'} border-gold/70`}>
      <div className="absolute inset-2 sm:inset-3 border-2 border-gold/70" />
      <div className="absolute inset-[14px] sm:inset-[18px] border border-gold/30" />

      <div className="relative h-full flex flex-col items-center gap-3 px-5 sm:px-8 pt-8 pb-6">
        <div className="w-full max-w-[220px] aspect-[5/4] rounded-t-full border-2 border-gold/70 bg-maroon-deep/60 grid place-items-center">
          <span className="deva text-5xl sm:text-6xl pt-6 bg-gradient-to-b from-[#fff6e0] to-gold-bright bg-clip-text text-transparent">
            {left ? 'शुभ' : 'लाभ'}
          </span>
        </div>

        <div className="studs w-full max-w-[220px] flex-1 min-h-0 border border-gold/50 flex flex-col items-center justify-center gap-4">
          <Kalash className="w-14 sm:w-16 h-auto drop-shadow" />
          <Fish className="w-24 sm:w-28 h-auto" flip={!left} body="#e0b45f" line="#fdf6e3" />
        </div>

        <div className="w-full max-w-[220px]">
          <MadhubaniBand color="#e0b45f" accent="#e8821e" />
        </div>
      </div>

      {/* door ring */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${left ? 'right-3' : 'left-3'} w-7 h-7 rounded-full border-[3px] border-gold-bright shadow-[0_0_12px_rgba(224,180,95,.6)]`} />
    </div>
  );
};

// A single screen. The doors swing open by themselves once the guest opens the card,
// so scrolling below stays plain native scrolling (no scroll-jacking on phones).
const Hero = ({ opened }) => {
  const reduce = useReducedMotion();
  const swing = { duration: reduce ? 0 : 1.9, ease: [0.65, 0, 0.35, 1], delay: reduce ? 0 : 0.5 };
  const fadeDoors = { duration: 0.5, delay: reduce ? 0 : 2 };

  const door = (side) => ({
    initial: false,
    animate: opened ? { rotateY: side === 'left' ? 100 : -100, opacity: 0 } : { rotateY: 0, opacity: 1 },
    transition: { rotateY: swing, opacity: fadeDoors },
    style: { transformOrigin: `${side} center`, backfaceVisibility: 'hidden' },
    className: 'w-1/2 h-full will-change-transform',
  });

  return (
    <section id="home" className="relative h-[100svh] w-full flex flex-col overflow-hidden paper">
      <div className="relative z-30 flex-none bg-maroon-deep">
        <Toran />
      </div>

      <div className="relative flex-1 min-h-0">
        {/* What waits behind the doors */}
        <motion.div
          initial={false}
          animate={opened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 1.1, ease: 'easeOut' }}
          className="absolute inset-0 z-0 flex flex-col items-center justify-center px-6 pb-16 text-center"
        >
          <div className="petal-shower" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} style={{ left: `${8 + ((i * 29) % 86)}%`, animationDuration: `${8 + (i % 3)}s`, animationDelay: `${i * 0.9}s` }} />
            ))}
          </div>
          <span className="deva text-marigold text-2xl sm:text-3xl">सुस्वागतम्</span>
          <CoupleArch className="h-[min(48svh,440px)] w-auto max-w-[82vw] mt-2" />
          <h2 className="script-font text-4xl sm:text-6xl text-maroon-deep mt-1 leading-tight">
            {wedding.groom.name} <span className="text-sindoor">&amp;</span> {wedding.bride.name}
          </h2>
          <p className="mt-2 text-[11px] sm:text-xs tracking-[0.35em] uppercase font-bold text-ink-soft">
            Shubh Vivah · 25 November 2026
          </p>
        </motion.div>

        {/* The gate */}
        <div className="absolute inset-0 z-10 flex pointer-events-none" style={{ perspective: 1400 }}>
          <motion.div {...door('left')}>
            <DoorPanel side="left" />
          </motion.div>
          <motion.div {...door('right')}>
            <DoorPanel side="right" />
          </motion.div>
        </div>

        {/* Scroll cue, once the doors are open */}
        <motion.a
          href="#blessing"
          initial={false}
          animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 2.4 }}
          className="absolute bottom-20 inset-x-0 mx-auto w-max z-20 flex flex-col items-center text-maroon"
          aria-label="Scroll down"
        >
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
