import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;
    // Exposed so the WelcomeOverlay tap can start playback inside the user gesture
    window.weddingAudio = audio;

    let resumeOnReturn = false;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setAvailable(false);

    // Pause audio when the guest switches tabs or locks the phone
    const handleVisibilityChange = () => {
      if (document.hidden) {
        resumeOnReturn = !audio.paused;
        audio.pause();
      } else if (resumeOnReturn) {
        audio.play().catch(() => { });
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (window.weddingAudio === audio) delete window.weddingAudio;
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => { });
    } else {
      audio.pause();
    }
  };

  // No track uploaded yet, so stay out of the way
  if (!available) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 sm:bottom-28">
      <motion.button
        type="button"
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl border border-gold/60 backdrop-blur-md transition-colors ${isPlaying ? 'bg-maroon text-gold-pale' : 'bg-cream-card text-maroon'
          }`}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <VolumeX className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Ring when playing */}
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-marigold/50"
          />
        )}
      </motion.button>
    </div>
  );
};

export default MusicPlayer;
