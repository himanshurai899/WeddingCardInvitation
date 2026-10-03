import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { wedding, coupleShort } from '../config/wedding';
import { Divider } from './art/Motifs';

const field = 'w-full rounded-xl border-[1.5px] border-maroon/25 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/80 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/25';
const label = 'text-[11px] font-extrabold tracking-[0.16em] uppercase text-maroon';

// The RSVP goes out as a pre-filled WhatsApp message, so no backend is needed on Vercel's free tier
const Rsvp = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    if (!name) return;
    const attending = data.get('attend') === 'yes';
    const message = String(data.get('message') ?? '').trim();

    const lines = [
      `*RSVP for ${coupleShort}'s wedding*`,
      '',
      `Name: ${name}`,
      `Coming: ${attending ? "Yes, I'll be there 🙏" : "Sorry, can't make it"}`,
      attending ? `Guests: ${data.get('guests')}` : null,
      message ? `Message: ${message}` : null,
    ].filter((l) => l !== null);

    const to = wedding.rsvpWhatsApp.replace(/\D/g, '');
    window.open(`https://wa.me/${to}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    setSent(true);
  };

  return (
    <section id="rsvp" className="py-16 px-5 bg-cream-card">
      <header className="text-center mb-8">
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor">Let us know</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-maroon-deep mt-2">RSVP</h2>
        <Divider className="w-44 h-5 mx-auto my-3 text-gold" />
        <p className="text-ink-soft max-w-xs mx-auto">Tell us if you&apos;re coming so we can plan the food (and the chairs).</p>
      </header>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card max-w-md mx-auto p-8 text-center"
        >
          <p className="script-font text-5xl text-maroon">Dhanyavaad!</p>
          <p className="mt-3 text-ink">WhatsApp should have opened with your reply typed out. Just hit send.</p>
          <button type="button" onClick={() => setSent(false)} className="mt-5 text-sm font-bold text-marigold-deep underline underline-offset-4">
            Send another response
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="luxury-card max-w-md mx-auto p-6 flex flex-col gap-5" noValidate>
          <label className="flex flex-col gap-2">
            <span className={label}>Your name</span>
            <input name="name" type="text" required autoComplete="name" placeholder="Full name" className={field} />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className={`${label} mb-2`}>Will you attend?</legend>
            {[['yes', "Yes, I'll be there"], ['no', "Sorry, can't make it"]].map(([value, text]) => (
              <label key={value} className="flex items-center gap-3 rounded-xl border-[1.5px] border-maroon/15 bg-cream px-4 py-3 cursor-pointer has-[:checked]:border-gold has-[:checked]:bg-gold-pale">
                <input type="radio" name="attend" value={value} defaultChecked={value === 'yes'} className="w-[18px] h-[18px] accent-maroon" />
                <span className="font-semibold text-ink">{text}</span>
              </label>
            ))}
          </fieldset>

          <label className="flex flex-col gap-2">
            <span className={label}>Number of guests</span>
            <select name="guests" defaultValue="2" className={field}>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className={label}>A note for the couple (optional)</span>
            <textarea name="message" rows={3} placeholder="Blessings, when you arrive, food preferences..." className={`${field} resize-y`} />
          </label>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 bg-gradient-to-br from-maroon to-maroon-deep text-cream font-extrabold tracking-wide border border-gold shadow-lg shadow-maroon/30"
          >
            <Send className="w-4 h-4" /> Send RSVP on WhatsApp
          </motion.button>
        </form>
      )}
    </section>
  );
};

export default Rsvp;
