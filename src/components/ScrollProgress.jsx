import { motion, useScroll, useSpring } from 'framer-motion';

// The scrollbar is hidden site-wide, so a thin gold thread at the top shows how far along you are
const ScrollProgress = ({ visible }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      style={{ scaleX, top: 'env(safe-area-inset-top, 0px)' }}
      className="fixed left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-maroon via-gold-bright to-marigold pointer-events-none"
    />
  );
};

export default ScrollProgress;
