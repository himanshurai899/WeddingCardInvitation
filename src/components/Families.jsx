import { motion } from 'framer-motion';
import { Navigation, Phone } from 'lucide-react';
import { wedding, directionsUrl, telUrl } from '../config/wedding';
import { MadhubaniBand } from './art/Motifs';

const Side = ({ label, hindi, person, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="luxury-card px-5 py-6 text-center"
  >
    <p className="deva text-lg text-marigold">{hindi}</p>
    <p className="text-[10px] tracking-[0.25em] uppercase font-extrabold text-ink-soft">{label}</p>
    <h3 className="font-serif text-2xl font-bold text-maroon-deep mt-2">{person.family}</h3>
    {person.parents && <p className="mt-2 text-sm leading-relaxed text-ink">{person.parents}</p>}
    {person.native && <p className="mt-1 text-xs text-ink-soft">Roots in {person.native}</p>}
    {person.address && (
      <>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">{person.address.address}</p>
        <a
          href={directionsUrl(person.address.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/60 px-3 py-1.5 text-xs font-extrabold text-maroon"
        >
          <Navigation className="w-3.5 h-3.5" /> Directions
        </a>
      </>
    )}
  </motion.div>
);

// A titled list of names, set the way the printed card sets them
const NameList = ({ title, english, names }) => (
  <div className="text-center">
    <p className="deva text-lg text-sindoor">✻ {title} ✻</p>
    <p className="text-[10px] tracking-[0.25em] uppercase font-extrabold text-ink-soft">{english}</p>
    <p className="mt-2 font-devaText text-base leading-relaxed text-ink">
      {names.map((n, i) => (
        <span key={n} className="whitespace-nowrap">
          {n}{i < names.length - 1 ? ', ' : ''}{' '}
        </span>
      ))}
    </p>
  </div>
);

// Nimantrak: the families who invite you, the names printed on the card, and the kids' request
const Families = () => {
  const { balManuhar } = wedding;
  return (
    <section className="py-16 px-5 paper overflow-hidden">
      <div className="flex items-end justify-center gap-2 sm:gap-6">
        <img src={wedding.paintings.elephantFamilies} alt="" loading="lazy" className="w-24 sm:w-36 h-auto flex-none drop-shadow-md" />
        <header className="text-center pb-2">
          <p className="text-[11px] tracking-[0.3em] uppercase font-extrabold text-sindoor">With love from</p>
          <h2 className="deva text-4xl sm:text-5xl text-maroon-deep mt-1">निमंत्रक</h2>
          <p className="font-serif italic text-ink-soft">Your hosts</p>
        </header>
        <img src={wedding.paintings.elephantFamilies} alt="" loading="lazy" className="w-24 sm:w-36 h-auto flex-none -scale-x-100 drop-shadow-md" />
      </div>

      <MadhubaniBand className="max-w-md mx-auto block my-6" />

      <div className="max-w-md mx-auto grid grid-cols-1 gap-3">
        <Side label="Groom's family" hindi="वर पक्ष" person={wedding.groom} delay={0} />
        <Side label="Bride's family" hindi="वधू पक्ष" person={wedding.bride} delay={0.1} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto mt-8 space-y-6"
      >
        <NameList title="स्वागतातुर" english="Eager to welcome you" names={wedding.swagatatur} />
        <NameList title="दर्शनाभिलाषी" english="Waiting to see you" names={[...wedding.darshanabhilashi, `एवं समस्त ${wedding.groom.familyHindi} परिवार`]} />

        <div className="text-center">
          <p className="deva text-lg text-sindoor">✻ विनीत ✻</p>
          <p className="text-[10px] tracking-[0.25em] uppercase font-extrabold text-ink-soft">With folded hands</p>
          <p className="mt-2 font-devaText text-lg text-ink">{wedding.vineet.join(' • ')}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {wedding.phones.map((phone) => (
              <a
                key={phone}
                href={telUrl(phone)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-cream-card px-3 py-1.5 text-xs font-extrabold text-maroon"
              >
                <Phone className="w-3.5 h-3.5" /> {phone}
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      <p className="text-center mt-8 font-serif text-lg text-ink">
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
