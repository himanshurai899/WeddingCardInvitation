import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { House, Mail, MapPin, Shirt, Sparkles } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'rituals', label: 'Rasmein', Icon: Sparkles },
  { id: 'venue', label: 'Venue', Icon: MapPin },
  { id: 'dress', label: 'Dress', Icon: Shirt },
  { id: 'rsvp', label: 'RSVP', Icon: Mail },
];

// Bottom tab bar (after the reference invitation). Highlights whichever section crosses mid-screen
const SectionNav = ({ visible }) => {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    tabs.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      aria-label="Sections"
      initial={false}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-md pb-[env(safe-area-inset-bottom)] bg-gradient-to-b from-cream-card to-[#f5e6c2] border-t-[1.5px] border-gold/50 shadow-[0_-6px_24px_rgba(92,20,32,.12)] sm:bottom-3 sm:rounded-2xl sm:border"
    >
      <ul className="grid grid-cols-5 h-16">
        {tabs.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={on ? 'true' : undefined}
                className={`relative h-full flex flex-col items-center justify-center gap-1 transition-colors ${on ? 'text-maroon' : 'text-ink-soft'}`}
              >
                <Icon className={`w-5 h-5 transition-transform ${on ? '-translate-y-0.5' : ''}`} strokeWidth={1.8} />
                <span className="text-[9.5px] font-extrabold tracking-wider uppercase">{label}</span>
                <span className={`absolute bottom-0 h-[3px] w-11 rounded-t bg-gradient-to-r from-maroon to-marigold transition-transform ${on ? 'scale-x-100' : 'scale-x-0'}`} />
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

export default SectionNav;
