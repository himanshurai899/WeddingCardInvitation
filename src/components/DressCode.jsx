import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';
import { wedding } from '../config/wedding';
import { Divider } from './art/Motifs';

// Card colour and label colour per `tone` in the config
const tones = {
  haldi: ['bg-gradient-to-br from-[#fde047] to-[#f59e0b] text-maroon-deep border-gold/60', 'text-maroon'],
  mehendi: ['bg-gradient-to-br from-mehendi to-[#1f3a0c] text-cream border-gold/60', 'text-gold-pale'],
  pastel: ['bg-gradient-to-br from-[#fdebe0] to-[#f6e7f4] text-maroon-deep border-gold/40', 'text-marigold'],
  sangeet: ['glitter-shimmer bg-gradient-to-br from-[#6b21a8] to-[#3b0764] text-cream border-gold/60', 'text-gold-pale'],
  vivah: ['bg-gradient-to-br from-maroon to-maroon-deep text-cream border-gold', 'text-gold-pale'],
};
const toneOf = (item) => tones[item.tone] ?? tones.pastel;

const DressCode = () => {
  return (
    <section id="dress" className="py-16 sm:py-20 px-5 bg-cream-card">
      <header className="text-center mb-8">
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor">What to wear</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-maroon-deep mt-2">Dress Code</h2>
        <Divider className="w-44 h-5 mx-auto my-3 text-gold" />
        <p className="font-serif italic text-lg text-ink-soft">Dress up, it&apos;s a shaadi!</p>
      </header>

      <div className="max-w-md sm:max-w-3xl lg:max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wedding.dressCode.map((item, i) => (
          <motion.article
            key={item.event}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            viewport={{ once: true }}
            className={`rounded-2xl border px-6 py-8 text-center shadow-md flex flex-col items-center ${toneOf(item)[0]}`}
          >
            <h3 className="font-serif text-3xl font-bold">{item.event}</h3>
            <p className={`mt-1 text-xs tracking-[0.25em] uppercase font-extrabold ${toneOf(item)[1]}`}>
              {item.label}
            </p>
            {item.chips && (
              <div className="mt-4 flex justify-center gap-2.5" aria-hidden="true">
                {item.chips.map((c) => (
                  <span key={c} className="w-7 h-7 rounded-full border-2 border-cream-card shadow-[0_0_0_1px_rgba(201,162,75,.5)]" style={{ background: c }} />
                ))}
              </div>
            )}
            <p className="mt-4 text-sm leading-relaxed opacity-90 max-w-[30ch] mx-auto">{item.note}</p>
          </motion.article>
        ))}

        <p className="flex items-start gap-3 self-center rounded-2xl border border-dashed border-gold/60 px-5 py-4 text-sm leading-relaxed text-ink-soft">
          <Shirt className="w-5 h-5 flex-none text-marigold mt-0.5" />
          <span><strong className="text-maroon-deep">None of this is a rule.</strong> Wear whatever you&apos;re comfortable in. You being there is the real shagun.</span>
        </p>
      </div>
    </section>
  );
};

export default DressCode;
