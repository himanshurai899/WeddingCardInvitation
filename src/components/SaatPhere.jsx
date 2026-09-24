import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { JaimalaCouple } from './art/Couple';

const vows = [
  { hindi: 'पहला फेरा', theme: 'अन्न', text: "We'll make sure there's always food on our table, and we'll share it." },
  { hindi: 'दूसरा फेरा', theme: 'बल', text: "We'll keep each other strong, in body and in mind." },
  { hindi: 'तीसरा फेरा', theme: 'धन', text: "We'll earn honestly and look after what we build together." },
  { hindi: 'चौथा फेरा', theme: 'सुख', text: "We'll love and respect each other's families as our own." },
  { hindi: 'पाँचवाँ फेरा', theme: 'संतान', text: "We'll raise our children with love and good values." },
  { hindi: 'छठा फेरा', theme: 'आरोग्य', text: "We'll take care of each other, in sickness and in health." },
  { hindi: 'सातवाँ फेरा', theme: 'मित्रता', text: "We'll stay best friends, in this life and the six after it." },
];

const ordinal = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
const flame = { transformBox: 'fill-box', transformOrigin: 'center bottom' };

const SaatPhere = () => {
  const [step, setStep] = useState(0);
  // Rounds walked in total. It only grows, so "Once more" doesn't spin the couple backwards
  const [turns, setTurns] = useState(0);
  const done = step === vows.length;

  const next = () => {
    if (done) return;
    const upcoming = step + 1;
    setStep(upcoming);
    setTurns((t) => t + 1);
    if (upcoming === vows.length) {
      setTimeout(() => confetti({
        particleCount: 120, spread: 90, origin: { y: 0.55 },
        colors: ['#e8821e', '#c8102e', '#e0b45f', '#fffaf0'], disableForReducedMotion: true,
      }), 1500);
    }
  };

  return (
    <section className="relative py-16 px-5 overflow-hidden bg-gradient-to-b from-maroon-deep to-maroon-ink text-cream">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(232,130,30,.25), transparent 70%)' }} />

      <header className="relative text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-gold-bright">Saat Vachan</p>
        <h2 className="deva text-5xl mt-2 bg-gradient-to-b from-[#fff6e0] to-gold-bright bg-clip-text text-transparent">सात फेरे</h2>
        <p className="font-serif italic text-lg text-gold-pale/80 mt-1">Tap the button and walk each phera with them</p>
      </header>

      {/* The agni and its circle */}
      <div className="relative mx-auto mt-8 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
        <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <circle cx="150" cy="150" r="118" fill="none" stroke="#e0b45f" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="4 6" />
          <circle cx="150" cy="150" r="60" fill="rgba(232,130,30,.12)" />
          {vows.map((_, i) => {
            const a = (i / vows.length) * Math.PI * 2 - Math.PI / 2;
            const x = 150 + Math.cos(a) * 118;
            const y = 150 + Math.sin(a) * 118;
            const lit = i < step;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="15" fill={lit ? '#e0b45f' : '#47101a'} stroke="#e0b45f" strokeWidth="1.5" />
                <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontFamily="Yatra One, serif" fill={lit ? '#47101a' : '#e0b45f'}>
                  {['१', '२', '३', '४', '५', '६', '७'][i]}
                </text>
              </g>
            );
          })}
          {/* havan kund */}
          <path d="M112 196 H188 L180 212 H120 Z" fill="#92400e" stroke="#e0b45f" strokeWidth="1.2" />
          <path d="M120 184 H180 L176 196 H124 Z" fill="#b45309" stroke="#e0b45f" strokeWidth="1.2" />
          <g className="animate-flicker" style={flame}>
            <path d="M150 104 C172 128 172 164 150 184 C128 164 128 128 150 104 Z" fill="#f97316" />
            <path d="M134 140 C144 152 144 170 134 184 C124 170 124 152 134 140 Z" fill="#fb923c" />
            <path d="M166 140 C176 152 176 170 166 184 C156 170 156 152 166 140 Z" fill="#fb923c" />
            <path d="M150 132 C160 146 160 168 150 182 C140 168 140 146 150 132 Z" fill="#fde68a" />
          </g>
        </svg>

        {/* The couple circles the fire once per phera */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: turns * 360 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute left-1/2 top-[10.7%]"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ rotate: -turns * 360 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <JaimalaCouple className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[0_2px_6px_rgba(0,0,0,.5)]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Vow card */}
      <div className="relative max-w-md mx-auto mt-6 min-h-[150px] text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, delay: step ? 0.9 : 0 }}
          >
            {step === 0 && (
              <p className="font-serif text-xl text-gold-pale leading-relaxed">
                They'll go around the agni seven times, and every round comes with a promise.
              </p>
            )}
            {step > 0 && !done && (
              <>
                <p className="deva text-2xl text-gold-bright">{vows[step - 1].hindi} · {vows[step - 1].theme}</p>
                <p className="font-serif text-xl text-cream leading-relaxed mt-2">{vows[step - 1].text}</p>
              </>
            )}
            {done && (
              <>
                <p className="deva text-2xl text-gold-bright">{vows[6].hindi} · {vows[6].theme}</p>
                <p className="font-serif text-xl text-cream leading-relaxed mt-2">{vows[6].text}</p>
                <p className="script-font text-4xl text-gold-bright mt-4">Vivah sampann!</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex justify-center gap-3 mt-4">
        {!done ? (
          <motion.button
            type="button"
            onClick={next}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-7 py-3 font-extrabold tracking-wider text-sm text-maroon-ink border border-gold-pale shadow-[0_6px_24px_rgba(224,180,95,.35)]"
            style={{ background: 'linear-gradient(135deg, #c9a24b 0%, #f7e2a8 50%, #c9a24b 100%)' }}
          >
            Take the {ordinal[step]} phera
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={() => setStep(0)}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-sm text-gold-pale border border-gold/60"
          >
            <RotateCcw className="w-4 h-4" /> Once more
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default SaatPhere;
