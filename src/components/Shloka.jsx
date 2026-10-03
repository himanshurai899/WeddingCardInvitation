import { motion } from 'framer-motion';
import { ShivDivider, Trishul } from './art/Shiva';

// Kalidasa's salutation to Parvati and Parameshwara (Raghuvamsham 1.1):
// the pair who belong together like a word and its meaning
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
        <Trishul className="w-9 h-24 mb-3" />
        <p className="deva text-marigold text-lg tracking-wide mb-4">॥ ॐ नमः शिवाय ॥</p>
        <p className="font-devaText text-[clamp(1.4rem,6vw,2.1rem)] text-maroon-deep leading-relaxed mb-5">
          <span className="block">वागर्थाविव सम्पृक्तौ</span>
          <span className="block">वागर्थप्रतिपत्तये ।</span>
          <span className="block">जगतः पितरौ वन्दे</span>
          <span className="block">पार्वतीपरमेश्वरौ ॥</span>
        </p>
        <p className="font-serif italic text-lg md:text-xl text-ink leading-relaxed max-w-md">
          We bow to Parvati and Mahadev, the mother and father of the whole world, who belong
          together like a word and its meaning.
        </p>
        <p className="mt-2 text-[10px] tracking-[0.3em] uppercase font-bold text-ink-soft">Kalidasa, Raghuvamsham</p>
      </motion.div>

      <ShivDivider className="mt-10" />
    </section>
  );
};

export default Shloka;
