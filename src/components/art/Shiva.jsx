import { useId } from 'react';

// Mahadev's symbols, drawn as SVG so they stay crisp at any size: trishul and damru,
// the crescent from his jata, rudraksha, and the Kailash range. The figures of Shiva and
// Parvati themselves are illustrations in public/art/ (see `wedding.art` in the config).
// Like the motifs, each piece spreads extra props onto its <svg>.

const safeId = (raw) => raw.replace(/[^a-zA-Z0-9_-]/g, '');

// Chandra, the crescent Shiva wears in his jata. Horns point up.
export const Chandra = ({ color = '#e0b45f', ...props }) => (
  <svg viewBox="0 0 40 26" aria-hidden="true" {...props}>
    <path d="M3 4 A17 17 0 0 0 37 4 A15 12 0 0 1 3 4 Z" fill={color} />
  </svg>
);

// Trishul with the damru tied below the prongs
export const Trishul = ({ metal = '#e0b45f', edge = '#8a6a1f', drum = '#7b1e2b', ...props }) => (
  <svg viewBox="0 0 60 160" aria-hidden="true" {...props}>
    <rect x="28.3" y="44" width="3.4" height="114" rx="1.7" fill={metal} stroke={edge} strokeWidth=".8" />
    <path d="M30 2 C34.5 12 35.5 26 32.2 42 H27.8 C24.5 26 25.5 12 30 2 Z" fill={metal} stroke={edge} strokeWidth="1" />
    <path d="M27 47 C14 48 6 37 8.5 12 C11.5 25 15.5 34 27 39 Z" fill={metal} stroke={edge} strokeWidth="1" />
    <path d="M33 47 C46 48 54 37 51.5 12 C48.5 25 44.5 34 33 39 Z" fill={metal} stroke={edge} strokeWidth="1" />
    <rect x="21" y="40" width="18" height="6" rx="3" fill={metal} stroke={edge} strokeWidth=".9" />
    <circle cx="30" cy="51" r="2.6" fill={metal} stroke={edge} strokeWidth=".8" />
    {/* damru */}
    <path d="M17.5 58 L29 68 L17.5 78 Z M42.5 58 L31 68 L42.5 78 Z" fill={drum} stroke={edge} strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17.5" cy="68" rx="2.6" ry="10" fill={metal} stroke={edge} strokeWidth=".9" />
    <ellipse cx="42.5" cy="68" rx="2.6" ry="10" fill={metal} stroke={edge} strokeWidth=".9" />
    <rect x="27.5" y="64.5" width="5" height="7" rx="1.5" fill={metal} stroke={edge} strokeWidth=".8" />
    <path d="M28 71 C25 78 22 82 20 88 M32 71 C35 78 38 82 40 88" stroke={edge} strokeWidth=".9" fill="none" />
    <circle cx="20" cy="89.5" r="2.2" fill={metal} stroke={edge} strokeWidth=".7" />
    <circle cx="40" cy="89.5" r="2.2" fill={metal} stroke={edge} strokeWidth=".7" />
    {/* the cloth tied round the staff */}
    <path d="M31.5 96 C40 92 46 98 52 94 C48 102 41 101 31.5 104 Z" fill="#c8102e" />
    <path d="M28.5 96 C22 93 17 98 11 95 C14 102 20 101 28.5 104 Z" fill="#e8821e" />
  </svg>
);

const RudrakshaBead = ({ cx, cy, r, fill }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={fill} />
    <path
      d={`M${cx} ${cy - r} V${cy + r} M${cx - r * 0.5} ${cy - r * 0.86} Q${cx - r * 0.78} ${cy} ${cx - r * 0.5} ${cy + r * 0.86} M${cx + r * 0.5} ${cy - r * 0.86} Q${cx + r * 0.78} ${cy} ${cx + r * 0.5} ${cy + r * 0.86}`}
      stroke="#3b1406" strokeWidth={r * 0.11} fill="none" opacity=".6"
    />
    <circle cx={cx - r * 0.32} cy={cy - r * 0.36} r={r * 0.22} fill="#e2a571" opacity=".45" />
  </g>
);

const beadGradient = (id) => (
  <radialGradient id={id} cx=".35" cy=".32" r=".75">
    <stop offset="0" stopColor="#c27a43" />
    <stop offset=".55" stopColor="#8a3b12" />
    <stop offset="1" stopColor="#4a1a08" />
  </radialGradient>
);

export const Rudraksha = (props) => {
  const uid = safeId(useId());
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <defs>{beadGradient(`rk-${uid}`)}</defs>
      <RudrakshaBead cx={10} cy={10} r={8.6} fill={`url(#rk-${uid})`} />
    </svg>
  );
};

// A rudraksha mala strung on gold thread, used as a band between blocks
export const MalaBand = ({ className, thread = '#c9a24b' }) => {
  const uid = safeId(useId());
  return (
    <svg className={className} width="100%" height="20" aria-hidden="true">
      <defs>
        {beadGradient(`mb-${uid}`)}
        <pattern id={`mala-${uid}`} width="24" height="20" patternUnits="userSpaceOnUse">
          <RudrakshaBead cx={12} cy={10} r={6.6} fill={`url(#mb-${uid})`} />
          <circle cx="0" cy="10" r="2.2" fill="#e0b45f" />
          <circle cx="24" cy="10" r="2.2" fill="#e0b45f" />
        </pattern>
      </defs>
      <rect y="9.4" width="100%" height="1.2" fill={thread} />
      <rect width="100%" height="20" fill={`url(#mala-${uid})`} />
    </svg>
  );
};

// The Kailash range as a strip, Kailash itself in the middle with its snow cap and ridges.
// Drawn 1600 wide so phones see Kailash and its neighbours (the sides crop away, since
// preserveAspectRatio is slice) and wide screens see the whole range.
const RANGE_W = 1600;
const ridge = [[60, 84], [110, 94], [170, 66], [220, 86], [280, 76], [330, 92], [390, 60], [440, 80], [500, 70], [550, 90], [610, 72], [660, 84], [700, 62], [736, 46]];
const mirrored = ridge.slice().reverse().map(([x, y]) => [RANGE_W - x, y]);
const lines = (pts) => pts.map(([x, y]) => `L${x} ${y}`).join(' ');
const rangePath = `M0 140 V100 ${lines(ridge)} L770 18 Q800 4 830 18 ${lines(mirrored)} L${RANGE_W} 100 V140 Z`;
const snowCaps = [[170, 66], [390, 60], [700, 62]]
  .flatMap(([x, y]) => [[x, y], [RANGE_W - x, y]])
  .map(([x, y]) => `M${x - 12} ${y + 8} L${x} ${y} L${x + 12} ${y + 8} L${x + 5} ${y + 12} L${x} ${y + 7} L${x - 6} ${y + 12} Z`)
  .join(' ');

export const KailashRange = ({ back = '#2c3f80', front = '#16224a', snow = '#e6ecf8', ...props }) => (
  <svg viewBox={`0 0 ${RANGE_W} 140`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" {...props}>
    <path d={rangePath} fill={back} />
    <path d="M756 30 L770 18 Q800 4 830 18 L844 30 L834 36 L824 28 L816 42 L808 30 L800 46 L792 30 L784 42 L776 28 L766 36 Z" fill={snow} />
    <path d="M800 46 V64 M792 34 L788 58 M808 34 L812 58" stroke={snow} strokeWidth="2" opacity=".5" />
    <path d={snowCaps} fill={snow} opacity=".85" />
    <path
      d="M0 140 V118 C120 104 220 112 340 108 C460 104 540 92 660 96 C740 100 760 108 800 108 C840 108 860 100 940 96 C1060 92 1140 104 1260 108 C1380 112 1480 104 1600 118 V140 Z"
      fill={front}
    />
  </svg>
);

// Divider for light sections: rudraksha beads either side of a small trishul
export const ShivDivider = ({ className }) => (
  <div className={`flex items-center justify-center gap-2 ${className ?? ''}`} aria-hidden="true">
    <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-gold" />
    <Rudraksha className="w-3 h-3" />
    <Rudraksha className="w-4 h-4" />
    <Trishul className="w-6 h-16" />
    <Rudraksha className="w-4 h-4" />
    <Rudraksha className="w-3 h-3" />
    <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-gold" />
  </div>
);
