import { motion } from 'framer-motion';
import { wedding } from '../config/wedding';
import { Chandra } from './art/Shiva';
import { Fish } from './art/Motifs';

const Person = ({ person, delay }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay }}
    viewport={{ once: true }}
    className="max-w-md mx-auto lg:mx-0 lg:w-full"
  >
    <p className="deva text-lg text-marigold-deep">{person.nameHindi}</p>
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
        <span className="italic">{person.grandRelation}</span> {person.grandparents}
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
    <section className="py-16 sm:py-20 px-5 flex flex-col items-center justify-center bg-cream-card relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full text-center"
      >
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor mb-6">
          With the blessings of our elders
        </p>

        <div className="lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-14 max-w-5xl mx-auto">
          <Person person={wedding.groom} delay={0.1} />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="my-8 lg:my-0 flex lg:flex-col items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="h-px w-10 lg:w-px lg:h-12 bg-gradient-to-r lg:bg-gradient-to-b from-transparent to-gold" />
            <Fish className="w-14 h-7 lg:rotate-90 lg:my-3" />
            <div className="flex flex-col items-center">
              <Chandra className="w-10 h-7" />
              <span className="deva text-3xl text-sindoor -mt-1">संग</span>
            </div>
            <Fish className="w-14 h-7 lg:rotate-90 lg:my-3" flip />
            <span className="h-px w-10 lg:w-px lg:h-12 bg-gradient-to-l lg:bg-gradient-to-t from-transparent to-gold" />
          </motion.div>

          <Person person={wedding.bride} delay={0.2} />
        </div>

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
          className="mt-8 text-maroon tracking-[0.3em] sm:tracking-[0.4em] uppercase text-xs font-bold leading-loose"
        >
          Shubh Vivah • 25.11.2026
        </motion.p>
      </motion.div>
    </section>
  );
};

export default CoupleReveal;
