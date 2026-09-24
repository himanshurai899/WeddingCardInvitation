import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { wedding, directionsUrl } from '../config/wedding';
import { MadhubaniBand } from './art/Motifs';

const Side = ({ label, hindi, person, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="luxury-card px-4 py-6 text-center"
  >
    <p className="deva text-lg text-marigold">{hindi}</p>
    <p className="text-[10px] tracking-[0.25em] uppercase font-extrabold text-ink-soft">{label}</p>
    <h3 className="font-serif text-2xl font-bold text-maroon-deep mt-2">{person.family}</h3>
    {person.parents && <p className="mt-2 text-sm leading-relaxed text-ink">{person.parents}</p>}
    {person.address ? (
      <>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">{person.address.address}</p>
        <a
          href={directionsUrl(person.address.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/60 px-3 py-1.5 text-xs font-extrabold text-maroon"
        >
          <Navigation className="w-3.5 h-3.5" /> Directions
        </a>
      </>
    ) : person.home && <p className="mt-1 text-xs text-ink-soft">{person.home}</p>}
  </motion.div>
);

// Nimantrak: the families who invite you, and the kids' request
const Families = () => {
  const { balManuhar } = wedding;
  return (
    <section className="py-16 px-5 paper overflow-hidden">
      <div className="flex items-end justify-center gap-2 sm:gap-6">
        <img src={wedding.paintings.elephantFamilies} alt="" loading="lazy" className="w-24 sm:w-36 h-auto flex-none drop-shadow-md" />
        <header className="text-center pb-2">
          <p className="text-[11px] tracking-[0.3em] uppercase font-extrabold text-sindoor">With love from</p>
          <h2 className="deva text-4xl sm:text-5xl text-maroon-deep mt-1">दर्शनाभिलाषी</h2>
          <p className="font-serif italic text-ink-soft">Waiting to see you</p>
        </header>
        <img src={wedding.paintings.elephantFamilies} alt="" loading="lazy" className="w-24 sm:w-36 h-auto flex-none -scale-x-100 drop-shadow-md" />
      </div>

      <MadhubaniBand className="max-w-md mx-auto block my-6" />

      <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
        <Side label="Groom's family" hindi="वर पक्ष" person={wedding.groom} delay={0} />
        <Side label="Bride's family" hindi="वधू पक्ष" person={wedding.bride} delay={0.15} />
      </div>

      <p className="text-center mt-6 font-serif text-lg text-ink">
        समस्त {wedding.groom.familyHindi} एवं {wedding.bride.familyHindi} परिवार
        <span className="block text-sm italic text-ink-soft">and all our friends and well-wishers</span>
      </p>

      {balManuhar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.8, type: 'spring' }}
          viewport={{ once: true }}
          className="relative max-w-xs mx-auto mt-10 rounded-3xl bg-haldi/90 px-6 py-5 text-center shadow-lg"
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sindoor px-3 py-0.5 text-[10px] font-extrabold tracking-[0.2em] uppercase text-cream">
            Bal Manuhar
          </span>
          <p className="deva text-xl text-maroon-deep leading-snug">{balManuhar.hindi}</p>
          <p className="mt-1 text-sm text-maroon">{balManuhar.english}</p>
          <p className="mt-2 text-[11px] italic text-maroon/80">{balManuhar.from}</p>
        </motion.div>
      )}
    </section>
  );
};

export default Families;
