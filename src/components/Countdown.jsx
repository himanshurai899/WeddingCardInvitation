import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../config/wedding';

const target = new Date(wedding.muhurat).getTime();

const remaining = (now) => {
  const distance = Math.max(0, target - now);
  return {
    done: distance === 0,
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  };
};

const pad = (n) => String(n).padStart(2, '0');

const TimerUnit = ({ value, label }) => (
  <div className="flex flex-col items-center min-w-0">
    <span className="font-serif text-[clamp(2rem,10vw,3.5rem)] font-semibold text-maroon-deep tabular-nums leading-none">{pad(value)}</span>
    <span className="mt-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-ink-soft font-bold">
      {label}
    </span>
  </div>
);

const Rule = () => <span className="w-px self-stretch bg-gold/40" aria-hidden="true" />;

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(() => remaining(Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const next = remaining(Date.now());
      setTimeLeft(next);
      if (next.done) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-20 px-5 bg-cream-card flex flex-col items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full max-w-md text-center"
      >
        <p className="deva text-marigold-deep text-lg">बैंड बाजा बारात</p>
        <h3 className="text-maroon script-font text-5xl leading-tight">Counting down</h3>
        <p className="text-[11px] tracking-[0.3em] uppercase font-bold text-ink-soft mb-5">to the shubh vivah</p>
        <div role="timer" aria-label="Countdown to the wedding" className="rounded-2xl border border-gold/60 bg-[#fff6e3] px-3 py-5 sm:py-6 shadow-lg">
          {timeLeft.done ? (
            <p className="font-serif italic text-3xl text-maroon">Aaj shaadi hai!</p>
          ) : (
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-4">
              <TimerUnit value={timeLeft.days} label="Days" />
              <Rule />
              <TimerUnit value={timeLeft.hours} label="Hours" />
              <Rule />
              <TimerUnit value={timeLeft.minutes} label="Mins" />
              <Rule />
              <TimerUnit value={timeLeft.seconds} label="Secs" />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Countdown;
