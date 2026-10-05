import { useId } from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../config/wedding';

// Kalam: a handwriting face with Devanagari and Latin, so the note looks written by the kids.
// Loaded here so the rest of the site doesn't pay for it until this section is on the page.
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap';
if (typeof document !== 'undefined' && !document.querySelector(`link[href="${FONT_HREF}"]`)) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONT_HREF;
  document.head.appendChild(link);
}

const hand = { fontFamily: "'Kalam', 'Tiro Devanagari Hindi', cursive" };
const LINE = 30; // px between ruled lines; the poem's line-height matches it
const inkBlue = '#1f3b8f';
// A yellow highlighter stroke across the lower half of the text
const marker = { background: 'linear-gradient(transparent 50%, rgba(250,204,21,.6) 50%, rgba(250,204,21,.6) 90%, transparent 90%)' };

// Wobbly crayon strokes: a little turbulence pushes every edge off true
const Crayon = ({ id }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
    <feDisplacementMap in="SourceGraphic" scale="1.6" />
  </filter>
);

const Heart = ({ className, color = '#e11d48' }) => (
  <svg viewBox="0 0 24 22" className={className} aria-hidden="true">
    <path d="M12 20 C4 14 1 10 2 6 C3 2 8 1 12 6 C16 1 21 2 22 6 C23 10 20 14 12 20 Z" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
  </svg>
);

const Star = ({ className, color = '#f59e0b' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 2 L14.6 9 L22 9.3 L16.2 13.8 L18.3 21 L12 16.8 L5.7 21 L7.8 13.8 L2 9.3 L9.4 9 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// Four little ones holding hands, crayon style: two brothers, two sisters with plaits
const Kids = ({ className }) => {
  const uid = useId().replace(/:/g, '');
  const f = `url(#crayon-${uid})`;
  const kid = (x, color, girl) => (
    <g key={x} transform={`translate(${x} 0)`} stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={f}>
      <circle cx="0" cy="14" r="9" stroke="#7c4a2d" />
      <path d="M-3 13 h0.5 M3 13 h0.5" stroke="#3b2416" strokeWidth="2.6" />
      <path d="M-3.5 18 q3.5 3 7 0" stroke="#be123c" strokeWidth="2" />
      {girl ? (
        <>
          <path d="M-9 10 q-6 8 -3 14 M9 10 q6 8 3 14" stroke="#3b2416" strokeWidth="2.6" />
          <path d="M0 24 L-12 52 H12 Z" fill={color} fillOpacity=".25" />
        </>
      ) : (
        <>
          <path d="M-8 8 q8 -8 16 0" stroke="#3b2416" strokeWidth="2.6" />
          <path d="M0 23 V44" />
          <path d="M-7 27 h14 v15 h-14 Z" fill={color} fillOpacity=".25" />
        </>
      )}
      <path d="M-5 52 L-7 66 M5 52 L7 66" />
      <path d="M-27 32 L0 30 L27 32" />
    </g>
  );
  return (
    <svg viewBox="0 0 220 72" className={className} aria-hidden="true">
      <defs><Crayon id={`crayon-${uid}`} /></defs>
      {kid(30, '#2563eb', false)}
      {kid(84, '#db2777', true)}
      {kid(138, '#16a34a', false)}
      {kid(192, '#ea580c', true)}
    </svg>
  );
};

// A little request from the kids on both sides, on a page from a school notebook
const BalManuhar = () => {
  const note = wedding.balManuhar;
  if (!note) return null;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.35 }}
      viewport={{ once: true }}
      className="relative max-w-sm sm:max-w-md mx-auto mt-14 mb-4"
    >
      {/* washi tape holding the page up */}
      <span className="absolute -top-3 left-6 z-10 h-7 w-24 -rotate-6 bg-marigold/45 shadow-sm" aria-hidden="true" />
      <span className="absolute -top-3 right-6 z-10 h-7 w-24 rotate-6 bg-sindoor/30 shadow-sm" aria-hidden="true" />

      <div
        className="relative overflow-hidden rounded-sm pl-11 pr-4 sm:pl-12 sm:pr-6 pt-9 pb-4 shadow-[0_14px_30px_rgba(92,20,32,.18)]"
        style={{
          backgroundColor: '#fffdf6',
          backgroundImage: `linear-gradient(90deg, transparent 34px, rgba(225,29,72,.45) 34px, rgba(225,29,72,.45) 36px, transparent 36px), repeating-linear-gradient(180deg, transparent 0, transparent ${LINE - 1}px, rgba(96,165,250,.35) ${LINE - 1}px, rgba(96,165,250,.35) ${LINE}px)`,
          backgroundPositionY: '0, 14px',
        }}
      >
        <Star className="absolute top-3 right-4 w-6 h-6 rotate-12" />
        <Heart className="absolute top-28 right-3 w-5 h-5 -rotate-12" color="#db2777" />
        <Star className="absolute bottom-24 left-3 w-5 h-5 -rotate-12" color="#16a34a" />

        <figcaption style={hand} className="text-sindoor text-2xl font-bold leading-none">
          {note.title}
          <svg viewBox="0 0 120 10" className="block w-28 h-2.5 mt-1" aria-hidden="true">
            <path d="M2 6 C20 1 34 9 52 5 S88 2 118 6" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </figcaption>

        <blockquote style={{ ...hand, color: inkBlue, lineHeight: `${LINE}px` }} className="mt-3 text-[clamp(0.95rem,4.3vw,1.25rem)]">
          {note.lines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </blockquote>

        <p style={{ ...hand, lineHeight: `${LINE}px` }} className="mt-[30px] text-[clamp(0.85rem,3.8vw,1rem)] text-ink">
          {note.english}
        </p>

        <div style={{ ...hand, lineHeight: `${LINE}px` }} className="mt-[30px] text-right">
          {note.fromHindi.map((line) => (
            <p key={line} className="text-maroon text-lg whitespace-nowrap">{line}</p>
          ))}
          {note.highlight?.map(({ label, names }) => (
            <p key={label} className="text-maroon text-lg">
              {label}{' '}
              {names.map((name, i) => (
                <span key={name}>
                  {i > 0 && (i === names.length - 1 ? ' और ' : ', ')}
                  <span className="font-bold px-0.5 whitespace-nowrap" style={marker}>{name}</span>
                </span>
              ))}
            </p>
          ))}
          <p className="text-ink-soft text-sm">
            {note.from} <Heart className="inline w-4 h-4 -mt-1" />
          </p>
        </div>

        <Kids className="block w-48 h-auto mx-auto mt-2" />
      </div>
    </motion.figure>
  );
};

export default BalManuhar;
