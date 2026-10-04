import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { wedding, routeUrl } from '../config/wedding';
import { Chandra } from './art/Shiva';

// One moment of the night on a gold rail: a marker, then the time and what happens
const Moment = ({ item }) => (
  <motion.li
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55 }}
    viewport={{ once: true, margin: '-30px' }}
    className="relative pl-10 sm:pl-12 py-4"
  >
    <span
      className={`absolute left-[9px] sm:left-[13px] top-[22px] w-[18px] h-[18px] rounded-full border-[3px] ${item.highlight ? 'bg-gold-pale border-sindoor shadow-[0_0_14px_rgba(248,113,113,.7)]' : 'bg-neel-ink border-gold-bright'}`}
      aria-hidden="true"
    />
    <p className="text-xs sm:text-[13px] font-extrabold tracking-[0.18em] uppercase text-gold-bright">{item.time}</p>
    <h3 className={`font-serif font-bold leading-tight uppercase tracking-wide mt-0.5 ${item.highlight ? 'text-[#ffb4a8] text-2xl' : 'text-cream text-xl'}`}>
      {item.name}
      <span className="deva normal-case tracking-normal font-normal text-gold-pale/90 text-base ml-2">{item.hindi}</span>
    </h3>
    {item.route && (
      <a href={routeUrl(item.route)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-start gap-1 text-[13px] font-semibold text-gold-pale underline decoration-gold/60 underline-offset-2">
        <MapPin className="w-4 h-4 flex-none mt-px text-gold-bright" />{item.route.label}
      </a>
    )}
    <p className="mt-1 text-sm leading-relaxed text-neel-pale">{item.about}</p>
  </motion.li>
);

const WeddingNight = () => {
  return (
    <section id="timeline" className="night-sky py-16 sm:py-20 px-5 overflow-clip text-cream">
      <header className="relative text-center mb-10">
        <Chandra className="w-12 h-8 mx-auto mb-2" />
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-gold-bright">Wednesday · 25 November 2026</p>
        <p className="deva text-xs text-gold-pale/90 mt-1">मार्गशीर्ष कृष्ण प्रतिपदा</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-2 bg-gradient-to-b from-[#fff6e0] to-gold-bright bg-clip-text text-transparent">The Wedding Night</h2>
        <p className="deva text-xl text-marigold-soft mt-1">विवाह की शुभ रात्रि</p>
      </header>

      <div className="relative max-w-md md:max-w-5xl mx-auto md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 lg:gap-16 md:items-start">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto w-[min(100%,330px)] md:w-full md:sticky md:top-24 mb-8 md:mb-0"
        >
          <div className="rounded-t-full rounded-b-2xl bg-gradient-to-b from-gold-pale via-gold to-gold-dark p-[3px] shadow-[0_0_50px_rgba(224,180,95,.25)]">
            <img
              src={wedding.art.night.src}
              alt={wedding.art.night.alt}
              loading="lazy"
              decoding="async"
              className="block w-full aspect-[3/4] object-cover object-center rounded-t-full rounded-b-[13px]"
            />
          </div>
          <figcaption className="mt-3 text-center font-serif italic text-gold-pale/90">
            Shiv ji took his baraat to Parvati&apos;s door by torchlight too
          </figcaption>
        </motion.figure>

        <ol className="relative">
          <span className="absolute left-[17px] sm:left-[21px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-gold/20 via-gold-bright to-gold/20" aria-hidden="true" />
          {wedding.weddingDay.map((item) => (
            <Moment key={item.name} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default WeddingNight;
