import { wedding } from '../../config/wedding';
import { Divider } from './Motifs';
import { Chandra, ShivDivider, Trishul } from './Shiva';

// Ram's side of the symbols, in the same viewBoxes as Shiva's so the two swap one for one.

// Dhanush: the bow Ram broke in Janak's court to win Sita, with its arrow
export const Dhanush = ({ metal = '#e0b45f', edge = '#8a6a1f', ...props }) => (
  <svg viewBox="0 0 60 160" aria-hidden="true" {...props}>
    <path d="M16 6 C54 40 54 120 16 154" fill="none" stroke={edge} strokeWidth="8" strokeLinecap="round" />
    <path d="M16 6 C54 40 54 120 16 154" fill="none" stroke={metal} strokeWidth="5.5" strokeLinecap="round" />
    <path d="M16 6 V154" stroke={edge} strokeWidth="1" />
    <rect x="22" y="76" width="30" height="3.2" rx="1.6" fill={metal} stroke={edge} strokeWidth=".7" />
    <path d="M54 77.6 L44 71 L47 77.6 L44 84.2 Z" fill={metal} stroke={edge} strokeWidth=".7" strokeLinejoin="round" />
    <path d="M22 77.6 L14 72 M22 77.6 L14 83 M26 77.6 L18 72 M26 77.6 L18 83" stroke="#c8102e" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="34" cy="62" r="2.4" fill="#c8102e" />
    <circle cx="34" cy="94" r="2.4" fill="#c8102e" />
  </svg>
);

// Surya: the rising sun, for Ram's Suryavansh. Same size and place as Chandra.
export const Surya = ({ color = '#e0b45f', ...props }) => (
  <svg viewBox="0 0 40 26" aria-hidden="true" {...props}>
    <path d="M10 24 A10 10 0 0 1 30 24 Z" fill={color} />
    <g stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M20 10 V4 M10.5 13 L6.5 8.5 M29.5 13 L33.5 8.5 M5.5 20 H2 M34.5 20 H38" />
    </g>
  </svg>
);

const ram = wedding.theme !== 'shiv';

// What the rest of the card uses, so a component never has to ask which theme is on
export const Emblem = ram ? Dhanush : Trishul; // the big gate and shloka symbol
export const Crest = ram ? Surya : Chandra; // the small crown over arches and headings
export const ThemeDivider = ram
  ? ({ className = '' }) => <Divider className={`w-44 h-5 mx-auto text-gold ${className}`} />
  : ShivDivider;

// One chapter of Sita's story (`story` in the Siya-Ram theme), numbered in the order the card tells it.
// Renders nothing in the other looks.
export const StoryNote = ({ part, dark = false, className = '' }) => {
  const note = wedding.story?.[part];
  if (!note) return null;
  const n = (Object.keys(wedding.story).indexOf(part) + 1).toLocaleString('hi-IN-u-nu-deva');
  return (
    <div className={`max-w-md mx-auto text-center ${className}`}>
      <p className={`deva text-base ${dark ? 'text-gold-bright' : 'text-sindoor'}`}>✻ सिया की कथा {n} · {note.title} ✻</p>
      {note.verse && (
        <p className={`font-devaText text-lg leading-relaxed mt-1 ${dark ? 'text-gold-pale' : 'text-maroon-deep'}`}>
          {note.verse.map((line) => <span key={line} className="block">{line}</span>)}
        </p>
      )}
      <p className={`font-serif italic leading-relaxed mt-1 ${dark ? 'text-neel-pale' : 'text-ink'}`}>{note.text}</p>
    </div>
  );
};
