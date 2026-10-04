import { motion } from 'framer-motion';
import { wedding } from '../config/wedding';
import { Emblem, ThemeDivider } from './art/Symbols';

// The opening blessing for the chosen theme (see `shloka` in the config)
const Shloka = () => {
  return (
    <section id="blessing" className="py-16 sm:py-20 px-6 flex flex-col items-center justify-center paper text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-2xl flex flex-col items-center"
      >
        <Emblem className="w-9 h-24 mb-3" />
        <p className="deva text-marigold-deep text-lg tracking-wide mb-4">{wedding.shloka.salutation}</p>
        <p className="font-devaText text-[clamp(1.4rem,6vw,2.1rem)] text-maroon-deep leading-relaxed mb-5">
          {wedding.shloka.lines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </p>
        <p className="font-serif italic text-lg md:text-xl text-ink leading-relaxed max-w-md">
          {wedding.shloka.english}
        </p>
        {wedding.shloka.source && (
          <p className="mt-2 text-[10px] tracking-[0.3em] uppercase font-bold text-ink-soft">{wedding.shloka.source}</p>
        )}
      </motion.div>

      <ThemeDivider className="mt-10" />
    </section>
  );
};

export default Shloka;
