import { useId } from 'react';
import { wedding } from '../../config/wedding';
import { Kalash, Lotus } from './Motifs';

const bezier = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

// Points along the varmala loop, from Himanshu's left hand down and back up to his right
const garland = [
  [[139, 139], [120, 168], [122, 226], [146, 228]],
  [[146, 228], [168, 228], [168, 180], [156, 148]],
].flatMap((seg, s) => Array.from({ length: 12 }, (_, i) => bezier(...seg, (i + s) / 12)));

const skinBride = '#eab28b';
const skinGroom = '#d9a179';
const hair = '#2a1a12';

// Jaimala moment: Samiksha in a red lehenga with her chunri over her head, Himanshu in an
// ivory sherwani and green safa, holding the rose varmala out to her. 260 × 360 units.
export const JaimalaCouple = (props) => {
  const uid = useId().replace(/:/g, '');
  const id = (name) => `${name}-${uid}`;
  const url = (name) => `url(#${id(name)})`;

  return (
    <svg viewBox="0 0 260 360" role="img" aria-label="Bride and groom at the jaimala" {...props}>
      <defs>
        <linearGradient id={id('lehenga')} x1="0" x2="1">
          <stop offset="0" stopColor="#8f1414" />
          <stop offset=".45" stopColor="#c81e1e" />
          <stop offset="1" stopColor="#9b1515" />
        </linearGradient>
        <linearGradient id={id('chunri')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e11d48" stopOpacity=".95" />
          <stop offset="1" stopColor="#f97316" stopOpacity=".85" />
        </linearGradient>
        <linearGradient id={id('sherwani')} x1="0" x2="1">
          <stop offset="0" stopColor="#e7dcc3" />
          <stop offset=".5" stopColor="#faf5ea" />
          <stop offset="1" stopColor="#e3d6b8" />
        </linearGradient>
        <linearGradient id={id('stole')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8cc72" />
          <stop offset="1" stopColor="#76a342" />
        </linearGradient>
        <linearGradient id={id('safa')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a3c763" />
          <stop offset="1" stopColor="#5b8529" />
        </linearGradient>
        <pattern id={id('buti')} width="14" height="16" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="8" r="1.3" fill="#f7d27a" />
          <circle cx="7" cy="5.6" r=".8" fill="#f7d27a" />
          <circle cx="7" cy="10.4" r=".8" fill="#f7d27a" />
          <circle cx="4.6" cy="8" r=".8" fill="#f7d27a" />
          <circle cx="9.4" cy="8" r=".8" fill="#f7d27a" />
        </pattern>
      </defs>

      <ellipse cx="124" cy="351" rx="112" ry="7" fill="#5c1420" opacity=".1" />

      {/* ---------- Samiksha ---------- */}
      {/* chunri falling down her back */}
      <path d="M96 40 C76 42 64 64 66 92 C66 150 52 240 26 346 L60 348 C72 262 84 176 90 112 Z" fill={url('chunri')} />
      <path d="M96 40 C76 42 64 64 66 92 C66 150 52 240 26 346" stroke="#f2c14e" strokeWidth="3" fill="none" />
      <path d="M95 47 C80 49 71 68 72 94 C72 150 58 240 34 346" stroke="#f7e2a8" strokeWidth="1.6" fill="none" strokeDasharray="0.1 6" strokeLinecap="round" />

      {/* lehenga */}
      <path d="M72 166 C64 220 48 290 32 344 Q92 358 154 344 C142 290 124 220 114 166 Z" fill={url('lehenga')} />
      <path d="M72 166 C64 220 48 290 32 344 Q92 358 154 344 C142 290 124 220 114 166 Z" fill={url('buti')} opacity=".85" />
      <path d="M86 176 C80 236 70 296 60 350 M98 176 C98 236 98 296 96 354 M108 176 C116 236 128 296 136 350" stroke="#6f0d0d" strokeWidth="1.4" fill="none" opacity=".45" />
      <path d="M40 326 Q92 338 146 326" stroke="#e0b45f" strokeWidth="2" fill="none" />
      <path d="M36 335 Q92 348 150 335" stroke="#f7e2a8" strokeWidth="1.6" fill="none" strokeDasharray="1 4" strokeLinecap="round" />
      <path d="M32 344 Q92 358 154 344" stroke="#e0b45f" strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* choli and waist */}
      <path d="M73 150 H113 L114 166 H72 Z" fill={skinBride} />
      <path d="M76 108 C72 128 72 142 73 152 H113 C113 138 112 124 108 108 C98 102 86 102 76 108 Z" fill="#a31621" />
      <path d="M73 151 H113" stroke="#e0b45f" strokeWidth="2" />
      <path d="M72 166 Q93 172 114 166" stroke="#e0b45f" strokeWidth="3" fill="none" />

      {/* chunri draped across the front */}
      <path d="M110 106 C104 132 88 160 66 176 L74 186 C96 168 112 142 116 114 Z" fill={url('chunri')} />
      <path d="M110 106 C104 132 88 160 66 176" stroke="#f2c14e" strokeWidth="2" fill="none" />

      {/* arm with chooda, hands folded at the waist */}
      <path d="M106 110 C110 116 112 122 112 126" stroke="#a31621" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M112 124 C113 136 112 146 110 150 C112 158 116 162 120 164" stroke={skinBride} strokeWidth="7" fill="none" strokeLinecap="round" />
      {[[110, 148], [111, 152], [113, 156]].map(([x, y], i) => (
        <path key={`${x}-${y}`} d={`M${x - 4} ${y} h8`} stroke={i === 1 ? '#fffaf0' : '#dc2626'} strokeWidth="2.2" strokeLinecap="round" />
      ))}
      <circle cx="121" cy="164" r="4.4" fill={skinBride} />
      <circle cx="122" cy="163" r="1.2" fill="#9a3412" />

      {/* neck, face, jewellery */}
      <path d="M90.5 73 C91.5 80 91 87 89.5 93 H100.5 C99 87 98.8 80 100 73 Z" fill={skinBride} />
      <path d="M91 76.5 Q96 79.5 100.5 76" stroke="#d3946c" strokeWidth="1.2" fill="none" />
      <ellipse cx="97" cy="60" rx="12.5" ry="15.5" fill={skinBride} />
      <path d="M108 56 Q113 62 108 65 Z" fill={skinBride} />
      <path d="M86 50 C90 43 101 42 107 49 C100 47 92 48 86 54 Z" fill={hair} />
      <path d="M100 53 q3.5 -1.8 7 0" stroke={hair} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M100 58 q3 2 6 0" stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M104.6 59.4 l1.4 1.3 M102.8 60 l.9 1.6" stroke={hair} strokeWidth=".8" strokeLinecap="round" />
      <circle cx="103" cy="65" r="3.2" fill="#f59e9e" opacity=".45" />
      <path d="M104 69.5 q2.4 1.4 4 -0.3" stroke="#be123c" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <circle cx="105.5" cy="52.5" r="1.2" fill="#c8102e" />
      <circle cx="108.5" cy="65" r="3.2" fill="none" stroke="#e0b45f" strokeWidth="1.3" />
      <path d="M108 63 C101 58 94 58 88 60" stroke="#e0b45f" strokeWidth=".8" fill="none" strokeDasharray="1 1.5" />
      <path d="M87 66 h4 l1.6 5 h-7.2 Z" fill="#e0b45f" />
      <circle cx="89" cy="73" r="1.1" fill="#e0b45f" />
      <path d="M96 42 L99 49" stroke="#e0b45f" strokeWidth="1" />
      <circle cx="99.5" cy="50" r="2" fill="#e0b45f" />
      <circle cx="99.5" cy="50" r=".9" fill="#c8102e" />

      {/* chunri over the head */}
      <path d="M108 52 C107 37 91 31 80 39 C71 47 71 64 77 80 L89 82 C84 71 84 57 91 49 C97 44 103 45 108 52 Z" fill={url('chunri')} />
      <path d="M89 82 C84 71 84 57 91 49 C97 44 103 45 108 52" stroke="#f2c14e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {[[82, 50], [78, 62], [86, 40], [96, 36]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#f7d27a" />
      ))}

      <path d="M90 86 Q95 92 100 86" stroke="#e0b45f" strokeWidth="3" fill="none" />
      <path d="M88 90 Q96 114 106 94" stroke="#e0b45f" strokeWidth="1.5" fill="none" />
      <circle cx="97" cy="104" r="2.3" fill="#e0b45f" />

      {/* ---------- Himanshu ---------- */}
      {/* churidar and mojari */}
      <path d="M164 276 L160 340 H171 L175 276 Z" fill="#f5ecd6" stroke="#e2d4b3" />
      <path d="M184 276 L188 340 H199 L195 276 Z" fill="#f5ecd6" stroke="#e2d4b3" />
      <path d="M161 326 q5 2 10 0 M161 331 q5 2 10 0 M188 326 q5 2 10 0 M188 331 q5 2 10 0" stroke="#d8c8a2" fill="none" />
      <path d="M172 340 H158 C152 340 148 343 145 346 C152 348.5 164 349 173 348 Z" fill="#d4a24c" stroke="#a67c2e" />
      <path d="M145 346 q-3 -4 1 -6" stroke="#a67c2e" fill="none" />
      <path d="M200 340 V348 C192 349 182 349 175 347 C178 343 183 340 187 340 Z" fill="#d4a24c" stroke="#a67c2e" />

      {/* sherwani */}
      <path d="M160 104 C151 150 150 222 146 284 H214 C210 222 208 150 200 104 C188 96 172 96 160 104 Z" fill={url('sherwani')} stroke="#d8c8a2" />
      <path d="M180 106 V282" stroke="#d8c8a2" strokeWidth="1.2" />
      {[114, 124, 134, 144, 154, 164].map((y) => (
        <circle key={y} cx="180" cy={y} r="1.6" fill="#c9a24b" />
      ))}
      <path d="M148 270 H212" stroke="#c9a24b" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M147 277 H213" stroke="#e0b45f" strokeWidth="3" />
      <path d="M171 100 Q180 106 189 100" stroke="#e0b45f" strokeWidth="3" fill="none" />

      {/* left arm reaching round to the varmala */}
      <path d="M162 112 C156 124 150 132 142 136" stroke="#e2d6bb" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="139" cy="137" r="4.6" fill={skinGroom} />

      {/* green stole */}
      <path d="M165 104 C159 150 157 200 155 254 L168 256 C170 200 172 150 175 106 Z" fill={url('stole')} />
      <path d="M165 104 C159 150 157 200 155 254 M175 106 C172 150 170 200 168 256" stroke="#e0b45f" strokeWidth="1.2" fill="none" />
      <path d="M156 256 v6 M159 256 v6 M162 256 v6 M165 256 v6 M168 256 v6" stroke="#e0b45f" strokeWidth="1" />
      <path d="M192 104 C197 140 199 172 199 200 L209 198 C209 160 205 128 198 104 Z" fill={url('stole')} />
      {[[162, 140], [161, 176], [160, 212], [199, 150], [202, 182]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x + 2} cy={y} r="1" fill="#f7e2a8" />
      ))}

      {/* neck and face */}
      <path d="M175 80 C175.5 86 175.5 92 174.5 98 H185.5 C184.5 92 184.5 86 185 80 Z" fill={skinGroom} />
      <path d="M176 83 Q180 86 184.5 83" stroke="#c28863" strokeWidth="1.2" fill="none" />
      <path d="M173.5 94 C176 95.6 184 95.6 186.5 94 L188.5 101.5 C183 103.6 177 103.6 171.5 101.5 Z" fill="#f3ead6" stroke="#d8c8a2" strokeWidth=".8" />
      <path d="M173.5 94 C176 95.6 184 95.6 186.5 94" stroke="#e0b45f" strokeWidth="1.6" fill="none" />
      <ellipse cx="179" cy="66" rx="12.5" ry="15.5" fill={skinGroom} />
      <path d="M168 62 Q163 68 168 70 Z" fill={skinGroom} />
      <ellipse cx="190" cy="67" rx="3" ry="4.5" fill={skinGroom} />
      <path d="M187 56 C192 60 193 70 190 76 L187 74 C189 68 189 61 185 58 Z" fill={hair} />
      <path d="M166 58 q3.5 -1.8 7 0" stroke={hair} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M167 64 q3 1.8 6 0" stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M168 74.5 q3 1.6 5.5 -0.2" stroke="#8a4b2a" strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* green safa with kalgi */}
      <path d="M199 49 C213 58 216 84 210 106 L203 104 C207 88 205 68 196 57 Z" fill={url('safa')} />
      <path d="M163 57 C158 40 168 28 181 27 C195 27 204 38 201 57 C193 49 171 49 163 57 Z" fill={url('safa')} />
      <path d="M164 51 C175 41 190 39 201 48 M163 56 C176 45 191 44 201 53" stroke="#4d7022" strokeWidth="1.5" fill="none" />
      <path d="M163 56 C174 50 189 50 200 56" stroke="#e0b45f" strokeWidth="2.2" fill="none" />
      <path d="M166 52 Q172 58 180 52" stroke="#fffaf0" strokeWidth="1.4" fill="none" strokeDasharray="0.1 3" strokeLinecap="round" />
      <path d="M171 36 C166 22 172 11 181 5 C176 16 176 26 175 36 Z" fill="#fffaf0" stroke="#e7d9b8" strokeWidth=".8" />
      <circle cx="172" cy="40" r="3.6" fill="#e0b45f" />
      <circle cx="172" cy="40" r="1.5" fill="#c8102e" />

      {/* right arm holding the varmala out */}
      <path d="M198 110 C204 126 204 142 196 152" stroke="#efe5cf" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M196 152 C184 156 170 152 160 146" stroke="#efe5cf" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M166 143 L164 152" stroke="#e0b45f" strokeWidth="3" strokeLinecap="round" />
      <circle cx="156" cy="145" r="5" fill={skinGroom} />

      {/* rose varmala */}
      {garland.map(([x, y], i) => (
        <ellipse key={`leaf-${i}`} cx={x + (i % 2 ? 4.5 : -4.5)} cy={y + 2} rx="4.2" ry="2" fill={i % 2 ? '#3f6212' : '#4d7c0f'} transform={`rotate(${i * 47} ${x} ${y})`} />
      ))}
      {garland.map(([x, y], i) =>
        i % 4 === 2 ? (
          <g key={`flower-${i}`}>
            <circle cx={x} cy={y} r="4.2" fill="#fffaf0" stroke="#e7d9b8" strokeWidth=".6" />
            <circle cx={x} cy={y} r="1.4" fill="#fcd34d" />
          </g>
        ) : (
          <g key={`flower-${i}`}>
            <circle cx={x} cy={y} r="5.6" fill="#9f1239" />
            <circle cx={x - 0.6} cy={y - 0.6} r="3.9" fill="#e11d48" />
            <path d={`M${x - 2} ${y} a2 2 0 1 1 2 2`} stroke="#9f1239" strokeWidth="1" fill="none" />
          </g>
        )
      )}
      <path d="M146 232 v8 M143 233 l-2 7 M149 233 l2 7" stroke="#e0b45f" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="146" cy="232" r="2.6" fill="#e0b45f" />
    </svg>
  );
};

// Cusped arch pearls, sampled along the inner curve
const pearls = Array.from({ length: 11 }, (_, i) => bezier([40, 196], [40, 122], [106, 84], [160, 54], 0.06 + i * 0.085));

const ladi = (x, len) =>
  Array.from({ length: len }, (_, i) => (
    <circle key={`${x}-${i}`} cx={x} cy={150 + i * 8} r={i === len - 1 ? 4 : 3.2} fill={i % 3 === 1 ? '#c8102e' : '#f59e0b'} />
  ));

// The couple beneath a cusped gold arch with marigold strings, for the hero and timeline
export const CoupleArch = (props) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 320 430" role="img" aria-label="Himanshu and Samiksha at the jaimala beneath a floral arch" {...props}>
      <defs>
        <linearGradient id={`arch-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7ea" />
          <stop offset="1" stopColor="#fde4c8" />
        </linearGradient>
        {/* feathered edges so a photo's own background melts into the arch */}
        <linearGradient id={`fade-x-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset=".14" stopColor="#fff" />
          <stop offset=".86" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <linearGradient id={`fade-y-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset=".18" stopColor="#fff" />
          <stop offset=".94" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`photo-x-${uid}`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#fade-x-${uid})`} />
        </mask>
        <mask id={`photo-y-${uid}`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#fade-y-${uid})`} />
        </mask>
        <radialGradient id={`glow-${uid}`} cx=".5" cy=".55" r=".5">
          <stop offset="0" stopColor="#fde68a" stopOpacity=".55" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d="M28 420 V192 C28 114 100 74 160 40 C220 74 292 114 292 192 V420 Z" fill={`url(#arch-${uid})`} stroke="#c9a24b" strokeWidth="3" />
      <path d="M40 420 V196 C40 122 106 84 160 54 C214 84 280 122 280 196 V420" fill="none" stroke="#c9a24b" strokeWidth="1.2" strokeDasharray="3 4" />
      {pearls.map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="2.6" fill="#e0b45f" />
          <circle cx={320 - x} cy={y} r="2.6" fill="#e0b45f" />
        </g>
      ))}
      <ellipse cx="160" cy="250" rx="130" ry="150" fill={`url(#glow-${uid})`} />
      <Kalash x="144" y="2" width="32" height="42" />

      {ladi(52, 9)}
      {ladi(64, 6)}
      {ladi(268, 9)}
      {ladi(256, 6)}

      {wedding.images.couple ? (
        <g mask={`url(#photo-y-${uid})`} style={{ mixBlendMode: 'multiply' }}>
          <image
            href={wedding.images.couple}
            x="40" y="100" width="240" height="312"
            preserveAspectRatio="xMidYMax meet"
            mask={`url(#photo-x-${uid})`}
            style={{ filter: 'brightness(1.06) saturate(1.05)' }}
          />
        </g>
      ) : (
        <JaimalaCouple x="34" y="62" width="252" height="350" />
      )}

      <Lotus x="16" y="398" width="40" height="30" />
      <Lotus x="264" y="398" width="40" height="30" />
    </svg>
  );
};

const feather = 'radial-gradient(ellipse 62% 64% at 50% 54%, #000 62%, transparent 100%)';

// The couple on its own: your image when one is set, otherwise the drawing
export const CoupleFigure = ({ className, ...props }) =>
  wedding.images.couple ? (
    <img
      src={wedding.images.couple}
      alt=""
      className={`${className ?? ''} object-contain mix-blend-multiply`}
      style={{ maskImage: feather, WebkitMaskImage: feather }}
    />
  ) : (
    <JaimalaCouple className={className} {...props} />
  );

export default JaimalaCouple;
