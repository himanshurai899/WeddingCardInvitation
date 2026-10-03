import { useId } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { wedding, formatDate, directionsUrl, routeUrl } from '../config/wedding';
import { Dholak, HaldiBowl, KalashIcon, MatkorPot, MehendiHands, ReceptionStage, TilakThali } from './art/Icons';
import { CoupleArch } from './art/Couple';
import { Vignette } from './art/Painting';

const icons = {
  mandap: KalashIcon,
  mehendi: MehendiHands,
  tilak: TilakThali,
  vivah: CoupleArch,
  haldi: HaldiBowl,
  sangeet: Dholak,
  matkor: MatkorPot,
  reception: ReceptionStage,
};

// A sheer dupatta with a zari border, drifting and twisting down the page.
// Drawn in a 100 × 1000 box stretched over the centre column; outlines use non-scaling strokes.
const H = 1000;
const samples = Array.from({ length: 101 }, (_, i) => {
  const y = (i / 100) * H;
  const t = y / H;
  const center = 50 + 22 * Math.sin(t * Math.PI * 3.2 + 0.6);
  const half = 9 + 16 * Math.abs(Math.cos(t * Math.PI * 3.2 + 0.2));
  return { y, left: center - half, right: center + half, center, half };
});
const edge = (fn) => samples.map((s) => `${fn(s).toFixed(2)},${s.y.toFixed(1)}`).join(' ');
const fabric = `M${edge((s) => s.left)} L${samples.slice().reverse().map((s) => `${s.right.toFixed(2)},${s.y.toFixed(1)}`).join(' ')} Z`;

const Dupatta = () => {
  const id = useId();
  return (
    <svg
      viewBox={`0 0 100 ${H}`}
      preserveAspectRatio="none"
      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[120px] sm:w-[200px] h-full pointer-events-none"
      style={{ maskImage: 'linear-gradient(transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(transparent, #000 6%, #000 94%, transparent)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`silk-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#f3c1ad" />
          <stop offset=".45" stopColor="#fde4d8" />
          <stop offset=".6" stopColor="#fbd3c2" />
          <stop offset="1" stopColor="#efb49e" />
        </linearGradient>
      </defs>
      <path d={fabric} fill={`url(#silk-${id})`} fillOpacity=".85" />
      <polyline points={edge((s) => s.center + s.half * 0.15)} fill="none" stroke="#ffffff" strokeOpacity=".55" strokeWidth="6" vectorEffect="non-scaling-stroke" />
      <polyline points={edge((s) => s.center - s.half * 0.5)} fill="none" stroke="#d4a24c" strokeWidth="3" strokeDasharray="0.1 14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <polyline points={edge((s) => s.center + s.half * 0.5)} fill="none" stroke="#d4a24c" strokeWidth="3" strokeDasharray="0.1 14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {['left', 'right'].map((side) => (
        <g key={side}>
          <polyline points={edge((s) => s[side])} fill="none" stroke="#c9953a" strokeWidth="3.5" vectorEffect="non-scaling-stroke" />
          <polyline points={edge((s) => s[side] + (side === 'left' ? 3 : -3) * Math.min(1, s.half / 14))} fill="none" stroke="#e0b45f" strokeWidth="1.2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
};

const FunctionRow = ({ fn, index }) => {
  const Icon = icons[fn.icon] ?? KalashIcon;
  const textFirst = index % 2 === 0;

  const text = (
    <motion.div
      initial={{ opacity: 0, x: textFirst ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-40px' }}
      className={`min-w-0 ${textFirst ? 'text-right pr-2' : 'text-left pl-2'}`}
    >
      <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-extrabold text-marigold">
        {formatDate(fn.date, { weekday: 'short', day: 'numeric', month: 'short' })}
      </p>
      {fn.tithi && <p className="deva text-[11px] text-ink-soft leading-tight">{fn.tithi}</p>}
      <p className={`deva leading-tight mt-1 ${fn.highlight ? 'text-sindoor text-3xl' : 'text-maroon text-2xl'}`}>{fn.hindi}</p>
      <h3 className={`script-font leading-none text-ink ${fn.highlight ? 'text-[34px]' : 'text-[28px]'}`}>{fn.name}</h3>
      {fn.time && (
        <p className="mt-2 text-[11px] sm:text-xs font-semibold text-ink">
          <Clock className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-marigold" />{fn.time}
        </p>
      )}
      {fn.venue && (
        <p className="mt-1 text-[11px] sm:text-xs font-semibold text-ink">
          <MapPin className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-marigold" />
          {fn.route || fn.mapsQuery ? (
            <a href={fn.route ? routeUrl(fn.route) : directionsUrl(fn.mapsQuery)} target="_blank" rel="noopener noreferrer" className="underline decoration-gold/60 underline-offset-2">
              {fn.venue}
            </a>
          ) : fn.venue}
        </p>
      )}
      {fn.rituals && (
        <p className="mt-2 font-devaText text-[11px] sm:text-xs leading-relaxed text-maroon">{fn.rituals.join(' • ')}</p>
      )}
      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft">{fn.about}</p>
    </motion.div>
  );

  const art = (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true, margin: '-40px' }}
      className="flex justify-center"
    >
      {fn.image ? (
        <Vignette src={fn.image} alt={fn.name} className="w-full max-w-[140px]" />
      ) : (
        <Icon className={`${fn.icon === 'vivah' ? 'w-full max-w-[180px]' : 'w-full max-w-[140px]'} h-auto drop-shadow-md animate-float`} style={{ animationDelay: `${index * 0.7}s` }} />
      )}
    </motion.div>
  );

  return (
    <div className="grid grid-cols-[1fr_84px_1fr] sm:grid-cols-[1fr_150px_1fr] items-center py-8 sm:py-10">
      {textFirst ? text : art}
      <span aria-hidden="true" />
      {textFirst ? art : text}
    </div>
  );
};

const FunctionsTimeline = () => {
  return (
    <section id="rituals" className="relative py-16 px-4 paper overflow-hidden">
      <header className="text-center mb-6">
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor">The wedding week</p>
        <h2 className="deva text-5xl text-maroon-deep mt-2">रस्में</h2>
        <p className="font-serif italic text-lg text-ink-soft mt-1">Four busy days at home and then the big night. Come for as many as you can!</p>
      </header>

      <div className="relative max-w-2xl mx-auto">
        <Dupatta />
        <div className="relative">
          {wedding.functions.map((fn, i) => (
            <FunctionRow key={fn.key} fn={fn} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunctionsTimeline;
