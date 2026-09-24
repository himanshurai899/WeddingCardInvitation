import { motion } from 'framer-motion';
import { wedding } from '../config/wedding';
import { FramedPainting, Vignette } from './art/Painting';
import { Diya } from './art/Motifs';

const Moment = ({ item, index }) => {
  const textLeft = index % 2 === 0;
  // Jaimala shows the couple themselves; every other moment has its own painting
  const src = item.name === 'Jaimala' ? wedding.images.couple : item.image;

  const text = (
    <div className={`min-w-0 ${textLeft ? 'text-right' : 'text-left'}`}>
      <p className="text-xs sm:text-sm font-extrabold tracking-[0.18em] text-marigold">{item.time}</p>
      <h3 className={`font-serif font-bold leading-tight uppercase tracking-wide ${item.highlight ? 'text-sindoor text-xl sm:text-2xl' : 'text-maroon-deep text-lg sm:text-xl'}`}>
        {item.name}
      </h3>
      <p className="deva text-ink-soft text-sm">{item.hindi}</p>
      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-ink">{item.about}</p>
    </div>
  );

  const picture = (
    <div className="flex justify-center">
      {src ? (
        <Vignette src={src} alt={item.name} fit={item.name === 'Jaimala' ? 'contain' : 'cover'} className="w-28 sm:w-36" />
      ) : (
        <Diya className="w-24 h-24" />
      )}
    </div>
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true, margin: '-30px' }}
      className="grid grid-cols-[1fr_28px_1fr] items-center gap-2 py-4"
    >
      {textLeft ? text : picture}
      <span className="relative flex justify-center" aria-hidden="true">
        <span className={`w-4 h-4 rounded-full border-[3px] ${item.highlight ? 'bg-gold-pale border-sindoor' : 'bg-cream-card border-marigold'}`} />
      </span>
      {textLeft ? picture : text}
    </motion.li>
  );
};

const WeddingNight = () => {
  return (
    <section id="timeline" className="relative py-16 px-4 overflow-hidden bg-gradient-to-b from-[#fdf3e2] via-cream-card to-[#fdf3e2]">
      <header className="text-center mb-8">
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor">Wednesday · 25 November 2026</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-maroon-deep mt-2">The Wedding Night</h2>
        <p className="deva text-xl text-marigold mt-1">विवाह की शुभ रात्रि</p>
      </header>

      <FramedPainting
        src={wedding.paintings.night.src}
        alt="A groom and bride ride under royal umbrellas in a night-time wedding procession"
        caption={wedding.paintings.night.caption}
        className="max-w-md mx-auto mb-10"
      />

      <ol className="relative max-w-2xl mx-auto">
        <span className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-maroon via-gold to-maroon" aria-hidden="true" />
        {wedding.weddingDay.map((item, i) => (
          <Moment key={item.name} item={item} index={i} />
        ))}
      </ol>
    </section>
  );
};

export default WeddingNight;
