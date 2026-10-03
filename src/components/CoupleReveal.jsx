import { motion } from 'framer-motion';
import { wedding, formatDate } from '../config/wedding';
import { Fish, Lotus } from './art/Motifs';

const Person = ({ person, delay }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay }}
    viewport={{ once: true }}
    className="max-w-md mx-auto"
  >
    <p className="deva text-lg text-marigold">{person.nameHindi}</p>
    <h2 className="script-font text-6xl md:text-8xl text-maroon-deep leading-tight">
      {person.name}
    </h2>
    {person.parents && (
      <p className="mt-2 font-serif text-lg text-ink leading-snug">
        <span className="text-ink-soft italic">{person.relation}</span> {person.parents}
      </p>
    )}
    {person.grandparents && (
      <p className="mt-1 font-serif text-base text-ink-soft leading-snug">
        <span className="italic">Grandson of</span> {person.grandparents}
      </p>
    )}
    {person.home && (
      <p className="text-[11px] tracking-[0.25em] uppercase text-ink-soft mt-2">{person.home}</p>
    )}
    {person.native && (
      <p className="text-xs text-ink-soft mt-0.5">Roots in {person.native}</p>
    )}
  </motion.div>
);

const CoupleReveal = () => {
  return (
    <section className="py-16 px-4 flex flex-col items-center justify-center bg-cream-card relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor mb-6">
          With the blessings of our elders
        </p>

        <Person person={wedding.groom} delay={0.1} />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="my-8 flex items-center justify-center gap-2"
          aria-hidden="true"
        >
          <Fish className="w-16 h-8" />
          <div className="flex flex-col items-center">
            <Lotus className="w-10 h-8" />
            <span className="deva text-3xl text-sindoor -mt-1">संग</span>
          </div>
          <Fish className="w-16 h-8" flip />
        </motion.div>

        <Person person={wedding.bride} delay={0.2} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 font-serif italic text-xl text-ink max-w-md mx-auto leading-snug"
        >
          are getting married, and we'd love for you to be there
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-maroon tracking-[0.4em] uppercase text-xs font-bold"
        >
          Sagai {formatDate(wedding.engagement.date, { day: 'numeric', month: 'short', year: 'numeric' })} • Vivah 25.11.2026
        </motion.p>
      </motion.div>
    </section>
  );
};

export default CoupleReveal;
