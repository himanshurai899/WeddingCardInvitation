import { motion } from 'framer-motion';
import { Diya, FishDivider } from './art/Motifs';

// Mangal shloka, the blessing that opens most Hindu wedding cards
const Shloka = () => {
  return (
    <section id="blessing" className="py-16 px-8 flex flex-col items-center justify-center paper text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-2xl flex flex-col items-center"
      >
        <Diya className="w-14 h-14 mb-4" />
        <p className="font-devaText text-2xl md:text-3xl text-maroon-deep leading-relaxed mb-5">
          <span className="block">मंगलम् भगवान विष्णुः,</span>
          <span className="block">मंगलम् गरुड़ध्वजः ।</span>
          <span className="block">मंगलम् पुण्डरीकाक्षः,</span>
          <span className="block">मंगलाय तनो हरिः ॥</span>
        </p>
        <p className="font-serif italic text-lg md:text-xl text-ink leading-relaxed max-w-md">
          May Lord Vishnu bless us, he who flies with Garuda, the lotus-eyed one. Every good thing begins with Hari.
        </p>
      </motion.div>

      <FishDivider className="mt-10" />
    </section>
  );
};

export default Shloka;
