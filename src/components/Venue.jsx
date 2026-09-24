import { motion } from 'framer-motion';
import { House, Navigation, Sparkles } from 'lucide-react';
import { wedding, mapsUrl, mapsEmbedUrl, directionsUrl } from '../config/wedding';
import SaveTheDate from './SaveTheDate';
import { Divider } from './art/Motifs';

const Venue = () => {
  return (
    <section id="venue" className="py-16 px-5 paper">
      <header className="text-center mb-8">
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor">Venue</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-maroon-deep mt-2">Where to come</h2>
        <Divider className="w-44 h-5 mx-auto my-3 text-gold" />
        <p className="deva text-xl text-marigold">विवाह स्थल</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="luxury-card overflow-hidden max-w-md mx-auto"
      >
        <iframe
          title={`Map of ${wedding.venue.name}`}
          src={mapsEmbedUrl}
          className="w-full h-56 border-0 saturate-[.9]"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <div className="p-6 text-center">
          <h3 className="font-serif text-2xl font-bold text-maroon-deep">{wedding.venue.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{wedding.venue.address}</p>

          <div className="mt-6 flex flex-col gap-3">
            <motion.a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-gradient-to-br from-maroon to-maroon-deep text-cream font-extrabold text-sm tracking-wide border border-gold shadow-lg shadow-maroon/30"
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </motion.a>
            <SaveTheDate />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="luxury-card max-w-md mx-auto mt-5 p-5 flex items-start gap-4"
      >
        <span className="flex-none w-11 h-11 rounded-full bg-gold-pale grid place-items-center text-maroon">
          <House className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-bold text-maroon-deep">Rai family home</h3>
          <p className="text-xs font-bold tracking-wide text-marigold">
            {wedding.functions.filter((f) => f.mapsQuery === wedding.home.mapsQuery).map((f) => f.name.split(' & ')[0]).join(' and ')} happen here
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{wedding.home.address}</p>
          <a
            href={directionsUrl(wedding.home.mapsQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/60 px-4 py-2 text-xs font-extrabold text-maroon"
          >
            <Navigation className="w-3.5 h-3.5" /> Directions
          </a>
        </div>
      </motion.div>

      <p className="max-w-md mx-auto mt-5 flex items-start gap-3 rounded-2xl border border-dashed border-gold/60 bg-cream-card px-4 py-3 text-sm leading-relaxed text-ink-soft">
        <Sparkles className="w-5 h-5 flex-none text-marigold mt-0.5" />
        Coming from out of town? Just call us and we&apos;ll help with travel and stay.
      </p>
    </section>
  );
};

export default Venue;
