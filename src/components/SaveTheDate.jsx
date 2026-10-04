import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import { googleCalendarUrl } from '../lib/calendar';

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="3" fill="#fff" stroke="#4285f4" strokeWidth="1.6" />
    <path d="M3 9h18" stroke="#4285f4" strokeWidth="1.6" />
    <text x="12" y="18.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#34a853" fontFamily="Arial, sans-serif">25</text>
  </svg>
);

const AppleMark = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="4.5" fill="#fff" stroke="#d1d5db" strokeWidth="1.2" />
    <text x="12" y="9.5" textAnchor="middle" fontSize="5" fontWeight="700" fill="#ef4444" fontFamily="Arial, sans-serif">WED</text>
    <text x="12" y="18" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#111827" fontFamily="Arial, sans-serif">25</text>
  </svg>
);

const option = 'flex items-center gap-3 w-full rounded-xl border border-gold/40 bg-white px-4 py-3 text-left font-bold text-sm text-ink hover:border-gold transition-colors';

// Adds the wedding to the guest's own calendar, with the invitation link in the notes
const SaveTheDate = ({ tone = 'light', className = '' }) => {
  const [open, setOpen] = useState(false);

  const trigger = tone === 'dark'
    ? 'bg-gradient-to-br from-maroon to-maroon-deep text-cream border border-gold shadow-lg shadow-maroon/30'
    : 'bg-cream text-maroon-deep border-[1.5px] border-gold/60';

  return (
    <div className={`w-full ${className}`}>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-extrabold text-sm tracking-wide ${trigger}`}
      >
        <CalendarPlus className="w-4 h-4" /> Save the Date
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-col gap-2">
              <a className={option} href="/wedding.ics" download="himanshu-samiksha-shubh-vivah.ics" onClick={() => setOpen(false)}>
                <AppleMark /> Apple Calendar <span className="ml-auto text-xs font-semibold text-ink-soft">iPhone, Mac</span>
              </a>
              <a className={option} href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                <GoogleMark /> Google Calendar <span className="ml-auto text-xs font-semibold text-ink-soft">Android, Gmail</span>
              </a>
              <p className="text-[11px] text-ink-soft text-center">The invitation link is saved in the event notes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaveTheDate;
