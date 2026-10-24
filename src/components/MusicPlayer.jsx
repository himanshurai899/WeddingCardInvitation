import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

// Plays the card's tracks one after another. Only tracks whose file is really there make the list (and one that
// still fails to play drops out), so the skip button only shows while there's somewhere to skip to, and the whole
// player hides if nothing plays.
const MusicPlayer = ({ tracks }) => {
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const audioRef = useRef(null);
  // Whether the guest wants music on, so the next track starts by itself
  const wanted = useRef(false);
  const titleTimer = useRef(null);
  const track = list[index % list.length];

  useEffect(() => {
    const audio = audioRef.current;

    // Pause audio when the guest switches tabs or locks the phone
    let resumeOnReturn = false;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        resumeOnReturn = !audio.paused;
        audio.pause();
      } else if (resumeOnReturn) {
        audio.play().catch(() => { });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      audio.pause();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(titleTimer.current);
    };
  }, []);

  // A missing file comes back as a 404 (or, on the dev server, as the page itself), never as audio
  useEffect(() => {
    let live = true;
    const isAudio = (t) =>
      fetch(t.src, { method: 'HEAD' }).then((r) => r.ok && r.headers.get('content-type')?.startsWith('audio/'), () => false);
    Promise.all(tracks.map(isAudio)).then((ok) => live && setList(tracks.filter((_, i) => ok[i])));
    return () => { live = false; };
  }, [tracks]);

  // A new track loads paused; carry on playing if the music was on
  useEffect(() => {
    if (wanted.current) audioRef.current.play().catch(() => { });
  }, [track?.src]);

  const flashTitle = () => {
    setShowTitle(true);
    clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => setShowTitle(false), 2500);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play().catch(() => { });
      flashTitle();
    } else {
      wanted.current = false;
      audio.pause();
    }
  };

  const next = () => {
    wanted.current = true;
    setIndex((i) => (i + 1) % list.length);
    // Same track again when the list is down to one (it loops)
    if (list.length === 1) audioRef.current.play().catch(() => { });
    flashTitle();
  };

  const drop = (src) => setList((l) => l.filter((t) => t.src !== src));

  return (
    <>
      {/* Off until the guest taps play */}
      <audio
        ref={audioRef}
        src={track?.src}
        preload="auto"
        loop={list.length === 1}
        onPlay={() => { wanted.current = true; setIsPlaying(true); }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIndex((i) => (i + 1) % list.length)}
        onError={() => track && drop(track.src)}
      />


      {/* No track uploaded yet, so stay out of the way */}
      {track && (
        <div className="fixed right-4 z-50 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-28 flex flex-col items-end gap-2">
          {list.length > 1 && (
            <motion.button
              type="button"
              onClick={next}
              whileTap={{ scale: 0.9 }}
              aria-label={`Next song: ${list[(index + 1) % list.length].title}`}
              className="mr-1.5 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-gold/60 backdrop-blur-md bg-cream-card/90 text-maroon"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          )}

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {showTitle && (
                <motion.span
                  key={track.src}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  role="status"
                  className="rounded-full border border-gold/60 bg-cream-card/95 px-3 py-1.5 text-xs font-bold text-maroon shadow-lg whitespace-nowrap"
                >
                  ♪ {track.title}
                </motion.span>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
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
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
