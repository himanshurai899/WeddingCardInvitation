import { useId } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { wedding, formatDate, directionsUrl, routeUrl } from '../config/wedding';

// The Ganga coming down from Mahadev's jata, winding down the page past each rasam.
// Drawn in a 100 × 1000 box stretched over the rail; outlines use non-scaling strokes.
const H = 1000;
const samples = Array.from({ length: 101 }, (_, i) => {
  const y = (i / 100) * H;
  const t = y / H;
  const center = 50 + 22 * Math.sin(t * Math.PI * 3.2 + 0.6);
  const half = 9 + 16 * Math.abs(Math.cos(t * Math.PI * 3.2 + 0.2));
  return { y, left: center - half, right: center + half, center, half };
});
const edge = (fn) => samples.map((s) => `${fn(s).toFixed(2)},${s.y.toFixed(1)}`).join(' ');
const water = `M${edge((s) => s.left)} L${samples.slice().reverse().map((s) => `${s.right.toFixed(2)},${s.y.toFixed(1)}`).join(' ')} Z`;
const fade = 'linear-gradient(transparent, #000 5%, #000 95%, transparent)';

const Ganga = ({ className }) => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <svg
      viewBox={`0 0 100 ${H}`}
      preserveAspectRatio="none"
      className={`absolute inset-y-0 -translate-x-1/2 h-full pointer-events-none ${className}`}
      style={{ maskImage: fade, WebkitMaskImage: fade }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`ganga-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#a9c3ec" />
          <stop offset=".45" stopColor="#e3edfb" />
          <stop offset=".6" stopColor="#cddcf5" />
          <stop offset="1" stopColor="#9db8e6" />
        </linearGradient>
      </defs>
      <path d={water} fill={`url(#ganga-${id})`} fillOpacity=".9" />
      <polyline points={edge((s) => s.center + s.half * 0.15)} fill="none" stroke="#ffffff" strokeOpacity=".8" strokeWidth="5" vectorEffect="non-scaling-stroke" />
      <polyline points={edge((s) => s.center - s.half * 0.5)} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="0.1 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <polyline points={edge((s) => s.center + s.half * 0.5)} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="0.1 16" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {['left', 'right'].map((side) => (
        <polyline key={side} points={edge((s) => s[side])} fill="none" stroke="#7d9bd3" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
};

// The date on a gold-ringed disc that sits on the river
const DateMedallion = ({ date, highlight }) => (
  <div
    className={`relative z-10 w-14 h-14 md:w-[76px] md:h-[76px] rounded-full grid place-items-center text-center border-2 border-gold-bright shadow-[0_6px_16px_rgba(23,37,90,.3)] ${highlight ? 'bg-gradient-to-b from-sindoor to-maroon-deep' : 'bg-gradient-to-b from-neel to-neel-ink'}`}
  >
    <span className="absolute inset-[3px] rounded-full border border-gold/40" aria-hidden="true" />
    <span className="leading-none">
      <span className="block font-serif text-2xl md:text-[32px] font-bold text-gold-pale">{formatDate(date, { day: 'numeric' })}</span>
      <span className="block text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-extrabold text-gold-bright mt-0.5">
        {formatDate(date, { month: 'short' })}
      </span>
    </span>
  </div>
);

const FunctionRow = ({ fn, index }) => {
  const left = index % 2 === 0;
  const link = fn.route ? routeUrl(fn.route) : fn.mapsQuery ? directionsUrl(fn.mapsQuery) : null;
  const card = fn.highlight
    ? 'bg-gradient-to-br from-maroon to-maroon-deep text-cream border-gold'
    : 'bg-cream-card text-ink border-gold/45';
  const soft = fn.highlight ? 'text-gold-pale/85' : 'text-ink-soft';

  return (
    <li className="relative grid grid-cols-[56px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] items-start md:items-center gap-x-4 md:gap-x-0 py-3 md:py-5">
      <div className="row-start-1 col-start-1 md:col-start-2 flex justify-center pt-4 md:pt-0">
        <DateMedallion date={fn.date} highlight={fn.highlight} />
      </div>

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-40px' }}
        className={`row-start-1 col-start-2 ${left ? 'md:col-start-1' : 'md:col-start-3'} min-w-0 rounded-2xl border px-5 py-5 shadow-[0_8px_24px_rgba(92,20,32,.1)] ${card}`}
      >
        <p className={`text-[11px] tracking-[0.2em] uppercase font-extrabold ${fn.highlight ? 'text-gold-bright' : 'text-marigold'}`}>
          {formatDate(fn.date, { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {fn.tithi && <p className={`deva text-xs leading-snug ${soft}`}>{fn.tithi}</p>}
        <h3 className={`deva leading-tight mt-2 text-[26px] sm:text-3xl ${fn.highlight ? 'text-gold-pale' : 'text-maroon'}`}>{fn.hindi}</h3>
        <p className={`script-font leading-none text-[30px] ${fn.highlight ? 'text-cream' : 'text-ink'}`}>{fn.name}</p>

        {fn.time && (
          <p className="mt-3 flex items-start gap-1.5 text-[13px] font-semibold">
            <Clock className={`w-4 h-4 flex-none mt-px ${fn.highlight ? 'text-gold-bright' : 'text-marigold'}`} />{fn.time}
          </p>
        )}
        {fn.venue && (
          <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-semibold">
            <MapPin className={`w-4 h-4 flex-none mt-px ${fn.highlight ? 'text-gold-bright' : 'text-marigold'}`} />
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="underline decoration-gold/60 underline-offset-2">
                {fn.venue}
              </a>
            ) : fn.venue}
          </p>
        )}
        {fn.rituals && (
          <p className={`mt-3 font-devaText text-[13px] leading-relaxed ${fn.highlight ? 'text-gold-pale' : 'text-maroon'}`}>{fn.rituals.join(' • ')}</p>
        )}
        <p className={`mt-2 text-sm leading-relaxed ${soft}`}>{fn.about}</p>
      </motion.article>
    </li>
  );
};

const FunctionsTimeline = () => {
  return (
    <section id="rituals" className="relative py-16 sm:py-20 px-4 paper overflow-hidden">
      <header className="text-center mb-8">
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor">The wedding week</p>
        <h2 className="deva text-5xl text-maroon-deep mt-2">रस्में</h2>
        <p className="font-serif italic text-lg text-ink-soft mt-1 max-w-md mx-auto">Four busy days at home and then the big night. Come for as many as you can!</p>
      </header>

      <div className="relative max-w-md md:max-w-4xl mx-auto">
        {/* down the left on phones, down the middle once there's room for a zigzag */}
        <Ganga className="left-[28px] w-[46px] md:left-1/2 md:w-[150px]" />
        <ol className="relative">
          {wedding.functions.map((fn, i) => (
            <FunctionRow key={fn.key} fn={fn} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default FunctionsTimeline;
