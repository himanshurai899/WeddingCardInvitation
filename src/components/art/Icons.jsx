import { JaimalaCouple } from './Couple';
import { Diya, Fish, Kalash, Marigold } from './Motifs';

// Illustrated icons for the function timeline, one per rasam.

const hand = 'M12 88 L10 52 L8 34 C8 28 15 28 15 34 L16 46 L16 20 C16 14 24 14 24 20 L25 44 L25 14 C25 8 33 8 33 14 L34 44 L34 20 C34 14 42 14 42 20 L42 56 L48 46 C51 40 58 42 55 50 L46 70 C44 76 42 80 40 88 Z';

const HennaHand = ({ flip }) => (
  <g transform={flip ? 'translate(60 0) scale(-1 1)' : undefined}>
    <path d={hand} fill="#f5c9a0" stroke="#b45309" strokeWidth="1.2" strokeLinejoin="round" />
    {[[11.5, 31], [20, 17], [29, 11], [38, 17]].map(([x, y]) => (
      <circle key={x} cx={x} cy={y + 1} r="3.4" fill="#9a3412" />
    ))}
    {[[11.5, 40], [20, 28], [29, 24], [38, 28], [20, 36], [29, 34], [38, 36]].map(([x, y]) => (
      <path key={`${x}-${y}`} d={`M${x - 3} ${y} h6`} stroke="#9a3412" strokeWidth="1.2" />
    ))}
    <circle cx="26" cy="64" r="8" fill="none" stroke="#9a3412" strokeWidth="1.4" />
    <circle cx="26" cy="64" r="3" fill="#9a3412" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <circle key={i} cx={26 + Math.cos(a) * 11.5} cy={64 + Math.sin(a) * 11.5} r="1.3" fill="#9a3412" />;
    })}
    <path d="M14 82 Q26 76 38 82" stroke="#9a3412" strokeWidth="1.2" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" />
  </g>
);

export const MehendiHands = (props) => (
  <svg viewBox="0 0 124 100" aria-hidden="true" {...props}>
    <g transform="translate(4 0)"><HennaHand /></g>
    <g transform="translate(60 0)"><HennaHand flip /></g>
    <Marigold x="30" y="76" width="22" height="22" />
    <Marigold x="50" y="80" width="18" height="18" outer="#fde047" mid="#f59e0b" />
    <Marigold x="68" y="76" width="22" height="22" />
  </svg>
);

export const Dholak = (props) => (
  <svg viewBox="0 0 124 90" aria-hidden="true" {...props}>
    <path d="M18 14 C50 7 74 7 106 14 V66 C74 73 50 73 18 66 Z" fill="#9a3412" stroke="#7c2d12" strokeWidth="1.4" />
    <path d="M18 34 C50 28 74 28 106 34 V46 C74 52 50 52 18 46 Z" fill="#b91c1c" />
    <polyline
      points={Array.from({ length: 11 }, (_, i) => `${22 + i * 8},${i % 2 ? 64 : 16}`).join(' ')}
      fill="none" stroke="#fde68a" strokeWidth="1.5"
    />
    {Array.from({ length: 6 }, (_, i) => (
      <circle key={i} cx={30 + i * 16} cy="64" r="2.2" fill="#e0b45f" />
    ))}
    <ellipse cx="18" cy="40" rx="10" ry="26" fill="#fdf6e3" stroke="#7c2d12" strokeWidth="2" />
    <ellipse cx="106" cy="40" rx="10" ry="26" fill="#fdf6e3" stroke="#7c2d12" strokeWidth="2" />
    <ellipse cx="106" cy="40" rx="5" ry="13" fill="#e7d9b8" />
    <path d="M100 64 C96 74 98 82 102 86 M108 64 C110 74 108 80 112 86" stroke="#c8102e" strokeWidth="1.6" fill="none" />
    <circle cx="102" cy="86" r="3" fill="#e8821e" />
    <circle cx="112" cy="86" r="3" fill="#e8821e" />
  </svg>
);

export const HaldiBowl = (props) => (
  <svg viewBox="0 0 124 84" aria-hidden="true" {...props}>
    <path d="M16 40 C22 72 102 72 108 40 Z" fill="#d4a24c" stroke="#8a6a1f" strokeWidth="1.4" />
    <path d="M28 54 Q62 64 96 54" stroke="#7b1e2b" strokeWidth="1.4" fill="none" strokeDasharray="1 3" strokeLinecap="round" />
    <path d="M52 68 H72 L76 76 H48 Z" fill="#b7862c" />
    <ellipse cx="62" cy="40" rx="47" ry="9" fill="#b7862c" stroke="#8a6a1f" strokeWidth="1.2" />
    <ellipse cx="62" cy="39" rx="41" ry="7" fill="#f2b705" />
    <path d="M36 39 C42 24 82 24 88 39 Z" fill="#f5c518" />
    <path d="M48 32 Q58 26 70 29" stroke="#fef08a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Marigold x="0" y="48" width="28" height="28" />
    <Marigold x="96" y="48" width="28" height="28" />
    <Marigold x="84" y="62" width="18" height="18" outer="#fde047" mid="#f59e0b" />
  </svg>
);

export const TilakThali = (props) => (
  <svg viewBox="0 0 124 84" aria-hidden="true" {...props}>
    <ellipse cx="62" cy="58" rx="56" ry="20" fill="#e0b45f" stroke="#a67c2e" strokeWidth="1.4" />
    <ellipse cx="62" cy="56" rx="47" ry="15" fill="#f3d27a" />
    <ellipse cx="62" cy="56" rx="47" ry="15" fill="none" stroke="#a67c2e" strokeWidth="1" strokeDasharray="1 3" strokeLinecap="round" />
    <ellipse cx="36" cy="55" rx="11" ry="5.5" fill="#c8102e" stroke="#7b1e2b" strokeWidth="1.2" />
    <ellipse cx="88" cy="56" rx="11" ry="5.5" fill="#fffaf0" stroke="#d6c7a8" strokeWidth="1.2" />
    {[[84, 54], [88, 56], [92, 54], [86, 58], [90, 58]].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r=".9" fill="#d6c7a8" />
    ))}
    <Diya x="46" y="16" width="32" height="32" />
    <Marigold x="54" y="58" width="16" height="16" />
    <Marigold x="20" y="62" width="12" height="12" outer="#fde047" mid="#f59e0b" />
  </svg>
);

export const MatkorPot = (props) => (
  <svg viewBox="0 0 124 92" aria-hidden="true" {...props}>
    <path d="M86 88 C92 72 112 72 120 88 Z" fill="#92400e" />
    {[[96, 82], [104, 80], [110, 84], [100, 86]].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="#fde68a" />
    ))}
    <path d="M40 26 C14 36 16 82 62 86 C108 82 110 36 84 26 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.4" />
    <path d="M44 18 H80 L84 27 H40 Z" fill="#9a3412" />
    <ellipse cx="62" cy="18" rx="22" ry="4" fill="#7c2d12" />
    <path d="M26 44 Q62 54 98 44" stroke="#fdf6e3" strokeWidth="2" fill="none" />
    <polyline points={Array.from({ length: 9 }, (_, i) => `${30 + i * 8},${i % 2 ? 50 : 55}`).join(' ')} fill="none" stroke="#fdf6e3" strokeWidth="1.2" />
    <Fish x="42" y="56" width="40" height="20" body="#fdf6e3" line="#7c2d12" />
    <Diya x="0" y="58" width="30" height="30" />
  </svg>
);

export const KalashIcon = (props) => (
  <svg viewBox="0 0 124 100" aria-hidden="true" {...props}>
    <Kalash x="32" y="0" width="60" height="96" />
    <Marigold x="6" y="70" width="26" height="26" />
    <Marigold x="92" y="70" width="26" height="26" />
  </svg>
);

export const ReceptionStage = (props) => (
  <svg viewBox="0 0 124 100" aria-hidden="true" {...props}>
    <path d="M10 98 V40 Q62 -10 114 40 V98" fill="#fff7e6" stroke="#e0b45f" strokeWidth="3" />
    <path d="M18 98 V44 Q62 2 106 44 V98" fill="none" stroke="#e0b45f" strokeWidth="1" strokeDasharray="2 3" />
    {[[22, 18], [100, 16], [62, 4]].map(([x, y]) => (
      <path key={x} d={`M${x} ${y - 5} L${x + 1.5} ${y - 1.5} L${x + 5} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 5} L${x - 1.5} ${y + 1.5} L${x - 5} ${y} L${x - 1.5} ${y - 1.5} Z`} fill="#e0b45f" />
    ))}
    <JaimalaCouple x="22" y="22" width="80" height="78" />
  </svg>
);
