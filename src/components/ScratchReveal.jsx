import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import SaveTheDate from './SaveTheDate';

// Pure pseudo-random so the floating petals stay put between renders
const seeded = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const Particles = () => (
  <div className="float-dots absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {Array.from({ length: 12 }, (_, i) => {
      const size = seeded(i, 1) * 18 + 10;
      const tint = i % 3 ? '232,130,30' : '200,16,46';
      return (
        <i
          key={i}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${seeded(i, 2) * 100}%`,
            left: `${seeded(i, 3) * 100}%`,
            background: `radial-gradient(circle, rgba(${tint},.45) 0%, rgba(${tint},0) 70%)`,
            animationDuration: `${seeded(i, 5) * 6 + 7}s`,
            animationDelay: `${seeded(i, 6) * 5}s`,
          }}
        />
      );
    })}
  </div>
);

// Paan (betel) leaf, offered at every Bihari shagun. Stem at the top, pointed tip below.
const LEAF = 'M50 22 C44 10 26 6 14 14 C2 22 2 42 8 54 C16 72 36 90 50 118 C64 90 84 72 92 54 C98 42 98 22 86 14 C74 6 56 10 50 22 Z';
const STEM = 'M50 22 C50 14 52 8 57 2';
const leafMask = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><path d="${LEAF}" fill="black"/><path d="${STEM}" stroke="black" stroke-width="3" fill="none"/></svg>`
)}")`;

const paintLeaf = (ctx, width, height) => {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#2f6b1f');
  grad.addColorStop(0.5, '#4d8b2a');
  grad.addColorStop(1, '#1f4d14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Veins: a midrib and curving side veins
  const sx = width / 100;
  const sy = height / 120;
  ctx.strokeStyle = 'rgba(190, 230, 140, .55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50 * sx, 22 * sy);
  ctx.quadraticCurveTo(51 * sx, 70 * sy, 50 * sx, 116 * sy);
  ctx.stroke();
  ctx.lineWidth = 1.2;
  [30, 44, 58, 72, 86].forEach((y) => {
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(50 * sx, y * sy);
      ctx.quadraticCurveTo((50 + dir * 22) * sx, (y - 4) * sy, (50 + dir * 38) * sx, (y - 14) * sy);
      ctx.stroke();
    });
  });

  // Gold speckle
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = i % 2 ? 'rgba(247, 226, 168, .12)' : 'rgba(0, 0, 0, .06)';
    ctx.fillRect(seeded(i, 7) * width, seeded(i, 8) * height, 1.4, 1.4);
  }

  ctx.fillStyle = 'rgba(255, 250, 240, .92)';
  ctx.textAlign = 'center';
  ctx.font = `600 ${Math.round(width / 15)}px "Nunito Sans", sans-serif`;
  ctx.fillText('SCRATCH TO REVEAL', width / 2, height * 0.43);
  ctx.font = `${Math.round(width / 11)}px "Yatra One", serif`;
  ctx.fillText('खुरचें', width / 2, height * 0.53);
};

const celebrate = () => {
  const colors = ['#e8821e', '#c8102e', '#e0b45f', '#f2b705', '#fffaf0'];
  confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors, disableForReducedMotion: true });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, disableForReducedMotion: true }), 250);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, disableForReducedMotion: true }), 400);
};

const ScratchReveal = () => {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let revealed = false;

    // Sized from the layout box (offsetWidth ignores the hover zoom), at high-DPI resolution.
    // Runs again if the leaf changes size, e.g. when a phone is turned sideways; that
    // repaints a fresh leaf, which beats scratches landing in the wrong place.
    const fit = () => {
      if (revealed || !canvas.offsetWidth) return;
      if (canvas.offsetWidth === width && canvas.offsetHeight === height) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintLeaf(ctx, width, height);
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);

    // Fonts may still be loading on a slow connection; repaint once they arrive
    document.fonts?.ready.then(() => { if (!revealed) paintLeaf(ctx, width, height); });

    let isDrawing = false;
    let last = null;

    // One continuous stroke from the previous point, so quick rubs don't leave gaps
    const scratch = ([x, y]) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 46;
      ctx.beginPath();
      ctx.moveTo(...(last ?? [x, y]));
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      last = [x, y];
    };

    // Measured once per stroke rather than on every move, which is cheaper on phones
    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      let totalChecked = 0;
      for (let i = 3; i < imageData.length; i += 64) {
        if (imageData[i] < 128) clearPixels++;
        totalChecked++;
      }
      // Corners outside the leaf never get scratched, so the bar sits a little lower
      if (clearPixels / totalChecked > 0.4 && !revealed) {
        revealed = true;
        setIsRevealed(true);
        celebrate();
      }
    };

    // Screen position to canvas position, undoing the hover zoom on the leaf
    const point = (e) => {
      const clientRect = canvas.getBoundingClientRect();
      return [
        (e.clientX - clientRect.left) * (width / clientRect.width),
        (e.clientY - clientRect.top) * (height / clientRect.height),
      ];
    };

    // The canvas allows vertical panning (touch-action: pan-y), so an up/down swipe
    // still scrolls the page (the browser sends pointercancel); rubbing sideways scratches.
    const handleStart = (e) => {
      // With a mouse, stop the drag from selecting text and keep the stroke even if it leaves the leaf
      if (e.pointerType === 'mouse') {
        e.preventDefault();
        canvas.setPointerCapture?.(e.pointerId);
      }
      isDrawing = true;
      last = point(e);
    };

    const handleMove = (e) => {
      if (!isDrawing) return;
      scratch(point(e));
    };

    const handleEnd = () => {
      if (!isDrawing) return;
      isDrawing = false;
      last = null;
      checkReveal();
    };

    canvas.addEventListener('pointerdown', handleStart);
    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerup', handleEnd);
    canvas.addEventListener('pointercancel', handleEnd);

    return () => {
      resize.disconnect();
      canvas.removeEventListener('pointerdown', handleStart);
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerup', handleEnd);
      canvas.removeEventListener('pointercancel', handleEnd);
    };
  }, []);

  return (
    <section className="relative py-16 px-6 paper flex flex-col items-center justify-center overflow-hidden">
      <Particles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        <p className="text-[11px] tracking-[0.35em] uppercase font-extrabold text-sindoor">Shagun ka paan</p>
        <h3 className="text-3xl md:text-4xl font-serif text-maroon-deep mt-2 mb-8 text-center font-bold">
          Scratch to see the date
        </h3>

        {/* Outer Glow & Hover Container */}
        <div className="relative w-full max-w-[300px] sm:max-w-[340px] aspect-[5/6] group select-none">

          <div className="absolute inset-6 bg-marigold blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-1000 rounded-full pointer-events-none" />

          {/* The Leaf Masked Container */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full h-full drop-shadow-2xl"
            style={{
              maskImage: leafMask,
              WebkitMaskImage: leafMask,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          >
            {/* What the leaf hides */}
            <div className="absolute inset-0 flex flex-col items-center pt-[25%] px-[14%] bg-gradient-to-b from-cream-card to-gold-pale text-center leading-tight">
              <span className="deva text-sindoor text-xl sm:text-2xl">शुभ मुहूर्त</span>
              <span className="text-maroon-deep font-serif text-[clamp(1.6rem,8vw,2.1rem)] font-bold mt-1">25 November</span>
              <span className="text-maroon-deep font-serif text-xl sm:text-2xl font-bold">2026</span>
              <span className="text-ink-soft text-[10px] sm:text-[11px] tracking-[0.15em] uppercase font-bold mt-2">
                Wednesday · 11 PM
              </span>
              {isRevealed && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="mt-1 text-maroon script-font text-[1.7rem] sm:text-3xl"
                >
                  Milte hain!
                </motion.span>
              )}
            </div>

            {/* Canvas Layer for scratching */}
            <canvas
              ref={canvasRef}
              aria-label="Scratch the paan leaf to reveal the wedding date"
              className={`absolute inset-0 w-full h-full cursor-pointer touch-pan-y transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            />
          </motion.div>

          {/* Gold outline drawn over the mask edge */}
          <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <path d={LEAF} fill="none" stroke="#c9a24b" strokeWidth="1.2" />
            <path d={STEM} fill="none" stroke="#3f6212" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {!isRevealed && (
          <p className="mt-5 text-xs font-semibold text-ink-soft">Rub the leaf side to side with your finger</p>
        )}

        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-[300px] mt-8"
          >
            <SaveTheDate tone="dark" />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ScratchReveal;
