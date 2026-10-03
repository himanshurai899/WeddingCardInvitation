import { motion } from 'framer-motion';
import { Navigation, Phone } from 'lucide-react';
import { wedding, directionsUrl, telUrl } from '../config/wedding';
import { MalaBand } from './art/Shiva';
import BalManuhar from './BalManuhar';

const Side = ({ label, hindi, person, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="luxury-card px-5 py-6 text-center"
  >
    <p className="deva text-lg text-marigold-deep">{hindi}</p>
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
const NameList = ({ title, english, names, tail }) => (
  <div className="text-center">
    <p className="deva text-lg text-sindoor">✻ {title} ✻</p>
    <p className="text-[10px] tracking-[0.25em] uppercase font-extrabold text-ink-soft">{english}</p>
    <p className="mt-2 font-devaText text-base leading-relaxed text-ink">
      {/* Each name stays on one line; the breaks fall between names */}
      {names.map((n, i) => (
        <span key={n}>
          <span className="whitespace-nowrap">{n}{i < names.length - 1 ? ',' : ''}</span>{' '}
        </span>
      ))}
      {tail && <span className="whitespace-nowrap">{tail}</span>}
    </p>
  </div>
);

const bannerFade = 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent), linear-gradient(to bottom, transparent, #000 22%, #000 70%, transparent)';

// Nimantrak: the families who invite you, the names printed on the card, and the kids' request
const Families = () => {
  return (
    <section className="py-16 sm:py-20 px-5 paper overflow-hidden">
      {/* Mahadev and Nandi on the hills, faded out on every side so it melts into the paper */}
      <img
        src={wedding.art.nandi.src}
        alt={wedding.art.nandi.alt}
        loading="lazy"
        decoding="async"
        className="block w-full max-w-2xl mx-auto -mt-6 aspect-[16/7] object-cover object-[50%_62%] mix-blend-multiply"
        style={{ maskImage: bannerFade, WebkitMaskImage: bannerFade, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }}
      />
      <header className="text-center mt-1">
        <p className="text-[11px] tracking-[0.3em] uppercase font-extrabold text-sindoor">With love from</p>
        <h2 className="deva text-4xl sm:text-5xl text-maroon-deep mt-1">निमंत्रक</h2>
        <p className="font-serif italic text-ink-soft">Your hosts</p>
      </header>

      <MalaBand className="max-w-md mx-auto block my-6" />

      <div className="max-w-md sm:max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
        <Side label="Groom's family" hindi="वर पक्ष" person={wedding.groom} delay={0} />
        <Side label="Bride's family" hindi="वधू पक्ष" person={wedding.bride} delay={0.1} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-md sm:max-w-2xl mx-auto mt-10 space-y-7"
      >
        <NameList title="स्वागतातुर" english="Eager to welcome you" names={wedding.swagatatur} />
        <NameList title="दर्शनाभिलाषी" english="Waiting to see you" names={wedding.darshanabhilashi} tail={`एवं समस्त ${wedding.groom.familyHindi} परिवार`} />

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

      <BalManuhar />
    </section>
  );
};

export default Families;
