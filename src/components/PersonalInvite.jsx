import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { wedding } from '../config/wedding';
import { guest, guestName, party, plusOne } from '../lib/guests';
import { Crest, ThemeDivider } from './art/Symbols';

// On a guest's own link, a card with their name opens once the gates have swung apart.
// The words depend on how they were invited (just them, a plus one, or the whole family) and live in the config,
// so they can be edited from the admin.
const PersonalInvite = ({ opened }) => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const button = useRef(null);

  useEffect(() => {
    if (!opened || !guestName) return;
    const t = setTimeout(() => setShow(true), reduce ? 0 : 2700); // the doors take about 2.5s
    return () => clearTimeout(t);
  }, [opened, reduce]);

  useEffect(() => {
    if (!show) return;
    button.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setShow(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show]);

  const text = wedding.invite;
  const line = text?.[party === 'plusone' && !plusOne ? 'plusoneOpen' : party];
  if (!guestName || !line) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-neel-ink/60 backdrop-blur-[2px] p-4"
          onClick={() => setShow(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="personal-invite-name"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm max-h-[92svh] overflow-y-auto rounded-2xl bg-cream-card border-2 border-gold shadow-[0_20px_60px_rgba(11,18,48,.45)] p-2 text-center"
          >
            <div className="rounded-xl border border-gold/40 px-5 py-6 [@media(max-height:700px)]:py-4">
              <Crest className="mx-auto h-9 [@media(max-height:700px)]:h-6 w-auto" />
              <p className="deva text-marigold-deep text-lg mt-1">{text.heading}</p>

              <p className="font-serif italic text-ink-soft text-lg mt-3 [@media(max-height:700px)]:mt-1">Dear</p>
              <h2 id="personal-invite-name" className="script-font text-maroon text-[clamp(2.1rem,10vw,2.75rem)] leading-tight break-words">
                {guest}
              </h2>

              <ThemeDivider className="my-3 [@media(max-height:700px)]:my-1" />

              <p className="font-serif text-ink text-[17px] leading-relaxed [@media(max-height:700px)]:text-[15px] [@media(max-height:700px)]:leading-snug">{line.en}</p>
              <p className="font-devaText text-maroon-deep text-[17px] leading-relaxed mt-3 [@media(max-height:700px)]:text-[15px] [@media(max-height:700px)]:mt-2">{line.hi}</p>

              <p className="mt-5 [@media(max-height:700px)]:mt-3 text-[11px] tracking-[0.25em] uppercase font-bold text-ink-soft">
                25 November 2026 · Vadodara
              </p>
              <p className="deva text-marigold-deep mt-1">
                सप्रेम, {wedding.groom.familyHindi} एवं {wedding.bride.familyHindi} परिवार
              </p>

              <button
                ref={button}
                type="button"
                onClick={() => setShow(false)}
                className="mt-6 [@media(max-height:700px)]:mt-3 rounded-full bg-maroon px-7 py-3 [@media(max-height:700px)]:py-2.5 font-serif font-semibold tracking-wide text-cream shadow-[0_8px_24px_rgba(123,30,43,.3)] focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/50"
              >
                {text.button}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalInvite;
