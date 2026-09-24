import { useId } from 'react';

// Small Madhubani (Mithila) ornaments. Every motif spreads extra props onto its <svg>,
// so it works both as a standalone element and nested inside a larger illustration
// (pass x / y / width / height).

const flame = { transformBox: 'fill-box', transformOrigin: 'center bottom' };

// Machhli: in Mithila art a pair of fish stands for marriage and fertility
export const Fish = ({ body = '#e8821e', line = '#5c1420', flip = false, ...props }) => (
  <svg viewBox="0 0 120 60" aria-hidden="true" {...props}>
    <g transform={flip ? 'translate(120 0) scale(-1 1)' : undefined} stroke={line} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 30 L7 12 Q15 30 7 48 Z" fill={body} />
      <path d="M11 22 L24 30 M9 30 H24 M11 38 L24 30" fill="none" strokeWidth="1.4" />
      <path d="M26 30 C46 6 88 8 110 30 C88 52 46 54 26 30 Z" fill={body} />
      <path d="M58 13 Q64 2 75 11 M58 47 Q64 58 75 49" fill={body} />
      <path d="M40 17 Q34 30 40 43 M46 14 Q40 30 46 46" fill="none" />
      {[22, 30, 38].map((y) =>
        [52, 60, 68].map((x) => (
          <path key={`${x}-${y}`} d={`M${x + (y === 30 ? 4 : 0)} ${y - 3} q4 6 8 0`} fill="none" strokeWidth="1.4" />
        ))
      )}
      <path d="M86 16 Q78 30 86 44" fill="none" />
      <circle cx="96" cy="27" r="4.5" fill="#fffaf0" />
      <circle cx="96" cy="27" r="1.8" fill={line} stroke="none" />
    </g>
  </svg>
);

export const Lotus = ({ petal = '#f472b6', inner = '#fbcfe8', line = '#9d174d', ...props }) => (
  <svg viewBox="0 0 60 44" aria-hidden="true" {...props}>
    <g stroke={line} strokeWidth="1.3" strokeLinejoin="round">
      <path d="M30 38 C16 40 4 34 1 26 C12 23 24 28 30 38 Z" fill={petal} />
      <path d="M30 38 C44 40 56 34 59 26 C48 23 36 28 30 38 Z" fill={petal} />
      <path d="M30 38 C18 32 10 20 10 8 C22 12 29 24 30 38 Z" fill={inner} />
      <path d="M30 38 C42 32 50 20 50 8 C38 12 31 24 30 38 Z" fill={inner} />
      <path d="M30 2 C38 12 38 28 30 38 C22 28 22 12 30 2 Z" fill={petal} />
      <path d="M30 10 V32 M16 16 L27 32 M44 16 L33 32" fill="none" strokeWidth="0.8" opacity=".6" />
    </g>
  </svg>
);

export const Marigold = ({ outer = '#f59e0b', mid = '#ea580c', core = '#9a3412', ...props }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <circle key={i} cx={20 + Math.cos(a) * 12} cy={20 + Math.sin(a) * 12} r="6.5" fill={outer} />;
    })}
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + 0.3;
      return <circle key={i} cx={20 + Math.cos(a) * 6.5} cy={20 + Math.sin(a) * 6.5} r="5" fill={mid} />;
    })}
    <circle cx="20" cy="20" r="4.5" fill={core} />
  </svg>
);

export const Kalash = ({ pot = '#d4a24c', ...props }) => (
  <svg viewBox="0 0 80 100" aria-hidden="true" {...props}>
    {[-62, -32, 0, 32, 62].map((deg) => (
      <g key={deg} transform={`translate(40 44) rotate(${deg})`}>
        <path d="M0 0 C7 -10 7 -26 0 -36 C-7 -26 -7 -10 0 0 Z" fill="#4d7c0f" stroke="#365314" strokeWidth="1" />
        <path d="M0 -3 V-32" stroke="#a3e635" strokeWidth=".8" />
      </g>
    ))}
    <ellipse cx="40" cy="28" rx="11" ry="13" fill="#8b5a2b" stroke="#5b3a1a" strokeWidth="1.2" />
    <path d="M34 18 Q40 12 46 18 M36 22 Q40 18 44 22" stroke="#5b3a1a" strokeWidth="1" fill="none" />
    <path d="M30 44 H50 L48 52 H32 Z" fill={pot} stroke="#8a6a1f" strokeWidth="1.2" />
    <rect x="26" y="41" width="28" height="5" rx="2.5" fill="#b7862c" stroke="#8a6a1f" strokeWidth="1" />
    <path d="M33 49 H47" stroke="#c8102e" strokeWidth="2" />
    <path d="M32 52 C8 58 8 94 40 96 C72 94 72 58 48 52 Z" fill={pot} stroke="#8a6a1f" strokeWidth="1.4" />
    <path d="M17 66 Q40 76 63 66" stroke="#7b1e2b" strokeWidth="2" fill="none" />
    <path d="M15 72 Q40 83 65 72" stroke="#7b1e2b" strokeWidth="1" fill="none" strokeDasharray="1 3" strokeLinecap="round" />
    <circle cx="40" cy="84" r="5" fill="#c8102e" stroke="#fde68a" strokeWidth="1.5" />
    <path d="M26 60 Q30 56 34 60" stroke="#fde68a" strokeWidth="1.4" fill="none" />
  </svg>
);

export const Diya = ({ bowl = '#c2410c', ...props }) => (
  <svg viewBox="0 0 60 60" aria-hidden="true" {...props}>
    <g className="animate-flicker" style={flame}>
      <path d="M30 8 C38 18 38 30 30 36 C22 30 22 18 30 8 Z" fill="#f59e0b" />
      <path d="M30 18 C34 24 34 31 30 34 C26 31 26 24 30 18 Z" fill="#fde68a" />
    </g>
    <path d="M6 38 C12 54 48 54 54 38 C44 42 16 42 6 38 Z" fill={bowl} stroke="#7c2d12" strokeWidth="1.4" />
    <path d="M6 38 C16 42 44 42 54 38 L58 35 C44 36 16 36 2 35 Z" fill="#9a3412" />
    <path d="M18 45 Q30 50 42 45" stroke="#fde68a" strokeWidth="1.2" fill="none" strokeDasharray="1 3" strokeLinecap="round" />
  </svg>
);

// Toran: mango leaves and marigolds strung across a doorway
export const Toran = ({ className }) => {
  const id = useId();
  return (
    <svg className={className} width="100%" height="58" aria-hidden="true">
      <defs>
        <pattern id={`toran-${id}`} width="48" height="58" patternUnits="userSpaceOnUse">
          <path d="M0 5 Q24 15 48 5" stroke="#7c2d12" strokeWidth="1.6" fill="none" />
          <path d="M24 10 C32 22 32 38 24 52 C16 38 16 22 24 10 Z" fill="#4d7c0f" stroke="#365314" strokeWidth="1" />
          <path d="M24 13 V48" stroke="#a3e635" strokeWidth=".8" />
          {[8, 18, 27].map((y, i) => (
            <circle key={y} cx="0" cy={y} r={7 - i * 1.5} fill={i === 1 ? '#c8102e' : '#f59e0b'} stroke="#c2410c" strokeWidth=".8" />
          ))}
          {[8, 18, 27].map((y, i) => (
            <circle key={`r${y}`} cx="48" cy={y} r={7 - i * 1.5} fill={i === 1 ? '#c8102e' : '#f59e0b'} stroke="#c2410c" strokeWidth=".8" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="58" fill={`url(#toran-${id})`} />
    </svg>
  );
};

// Madhubani sawtooth border ("dant") framed by double rules
export const MadhubaniBand = ({ className, color = '#7b1e2b', accent = '#c9a24b' }) => {
  const id = useId();
  return (
    <svg className={className} width="100%" height="24" aria-hidden="true">
      <defs>
        <pattern id={`band-${id}`} width="20" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 19 L5 6 L10 19 Z" fill={color} />
          <path d="M10 6 L15 19 L20 6" fill="none" stroke={color} strokeWidth="1.2" />
          <circle cx="15" cy="10" r="1.4" fill={accent} />
        </pattern>
      </defs>
      <rect y="0.5" width="100%" height="1.2" fill={color} />
      <rect y="3" width="100%" height="0.8" fill={accent} />
      <rect width="100%" height="24" fill={`url(#band-${id})`} />
      <rect y="20.2" width="100%" height="0.8" fill={accent} />
      <rect y="22.3" width="100%" height="1.2" fill={color} />
    </svg>
  );
};

// Fish pair around a lotus, the classic Mithila wedding emblem, used as a divider
export const FishDivider = ({ className }) => (
  <div className={`flex items-center justify-center gap-2 ${className ?? ''}`} aria-hidden="true">
    <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-gold" />
    <Fish className="w-12 h-6" />
    <Lotus className="w-8 h-6" />
    <Fish className="w-12 h-6" flip />
    <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-gold" />
  </div>
);

export const Divider = ({ className }) => (
  <svg viewBox="0 0 240 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M0 12h86M154 12h86" />
    <path d="M120 2.5c3 0 5 2.2 5 4.3 0 2.1-2 3.8-5 3.8s-5-1.7-5-3.8c0-2.1 2-4.3 5-4.3zM120 21.5c-3 0-5-2.2-5-4.3 0-2.1 2-3.8 5-3.8s5 1.7 5 3.8c0 2.1-2 4.3-5 4.3z" fill="currentColor" fillOpacity=".25" />
    <path d="M104 12c-3-4-8-4-10 0 2 4 7 4 10 0zM136 12c3-4 8-4 10 0-2 4-7 4-10 0z" fill="currentColor" fillOpacity=".25" />
    <circle cx="90" cy="12" r="1.6" fill="currentColor" />
    <circle cx="150" cy="12" r="1.6" fill="currentColor" />
  </svg>
);
