import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEMORY_VIDEOS } from "../../data-videos";

const SPARK_COLORS = ["#f5c451", "#ffffff", "#f9a8d4", "#c4b5fd"];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---- Lightweight background decorations for the immersive page ---- */
function MemoryUniverse() {
  const stars = useRef(
    Array.from({ length: 80 }).map((_, i) => ({ id: i, x: rand(0, 100), y: rand(0, 100), s: rand(1, 3), dur: rand(2, 5), delay: rand(0, 4) }))
  ).current;

  const particles = useRef(
    Array.from({ length: 12 }).map((_, i) => ({ id: i, x: rand(5, 95), y: rand(5, 95), dur: rand(3, 6), delay: i * 0.4, color: SPARK_COLORS[i % SPARK_COLORS.length] }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(70% 60% at 30% 25%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(60% 55% at 80% 30%, rgba(236,72,153,0.28), transparent 62%), radial-gradient(80% 70% at 50% 95%, rgba(109,40,217,0.4), transparent 60%), linear-gradient(160deg, #06061a 0%, #120a2e 50%, #08081f 100%)" }}>
      {stars.map((s) => (
        <motion.span key={s.id} className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, boxShadow: "0 0 6px rgba(255,255,255,0.7)" }}
          animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      {particles.map((p) => (
        <motion.span key={p.id} className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: 3, height: 3, background: p.color, boxShadow: `0 0 8px ${p.color}` }}
          animate={{ opacity: [0, 1, 0], y: [0, -50], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      {/* nebula glow blobs */}
      <motion.div className="absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)" }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-1/3 -right-40 w-[460px] h-[460px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)" }}
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}

/* ---- Fast cinematic intro text ---- */
function CinematicIntro({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <motion.div className="absolute inset-0 z-[20] flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }}>
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.h2 key="a" className="font-serif-display text-3xl md:text-5xl font-bold text-[#f5edd6] text-center px-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            style={{ textShadow: "0 0 30px rgba(245,196,81,0.5), 0 2px 10px rgba(0,0,0,0.6)" }}>
            Created For Arshia ♡
          </motion.h2>
        )}
        {phase === 1 && (
          <motion.h2 key="b" className="font-hand text-2xl md:text-4xl text-[#f5c451] gold-glow text-center px-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}>
            A Little World Made Just For You
          </motion.h2>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---- Single video player with lazy loading + preload-next ---- */
function VideoPlayer({ video, index, total }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // Attempt autoplay (browsers may block unmuted autoplay without user gesture;
    // the user already clicked "Enter" so this typically succeeds)
    el.play().catch(() => {});
  }, [video.src]);

  const label = `${String(index + 1).padStart(2, "0")} — ${video.title}`;

  return (
    <motion.div
      key={video.src}
      className="w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* memory label */}
      <div className="text-center mb-4">
        <p className="font-body text-sm tracking-[0.3em] text-[#c4b5fd] uppercase">
          Memory {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="font-hand text-2xl md:text-3xl text-[#f5c451] gold-glow mt-1">{label}</h3>
      </div>

      {/* video container */}
      <div className="relative rounded-2xl overflow-hidden glass glass-gold mx-auto" style={{ maxWidth: "900px" }}>
        <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: "linear-gradient(90deg, transparent, rgba(245,196,81,0.6), rgba(244,114,182,0.5), transparent)" }} />
        <video
          ref={videoRef}
          src={video.src}
          controls
          playsInline
          preload="auto"
          className="w-full block"
          style={{ aspectRatio: "9 / 16", objectFit: "cover", background: "#0a0a1f" }}
        />
      </div>
    </motion.div>
  );
}

/* ---- Full immersive experience (fullscreen overlay) ---- */
export default function MemoryExperience({ onClose, audioRef }) {
  const [index, setIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(null);
  const musicPausedRef = useRef(false);
  const musicTimeRef = useRef(0);
  const musicVolumeRef = useRef(0);
  const containerRef = useRef(null);

  // Pause website music on entry, preserve position + volume
  useEffect(() => {
    if (audioRef && audioRef.current) {
      const a = audioRef.current;
      musicTimeRef.current = a.currentTime;
      musicVolumeRef.current = a.volume;
      a.pause();
      musicPausedRef.current = true;
    }
    return () => {
      // Resume website music at exact position + volume on exit
      if (audioRef && audioRef.current && musicPausedRef.current) {
        const a = audioRef.current;
        a.currentTime = musicTimeRef.current;
        a.volume = musicVolumeRef.current;
        a.play().catch(() => {});
        musicPausedRef.current = false;
      }
    };
  }, [audioRef]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % MEMORY_VIDEOS.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + MEMORY_VIDEOS.length) % MEMORY_VIDEOS.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!introDone) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introDone, goNext, goPrev, onClose]);

  // Touch swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  // Preload next video via <link rel=preload>
  useEffect(() => {
    if (!introDone) return;
    const nextIdx = (index + 1) % MEMORY_VIDEOS.length;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "fetch";
    link.href = MEMORY_VIDEOS[nextIdx].src;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [index, introDone]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[200]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <MemoryUniverse />

      {/* Back button */}
      <motion.button
        onClick={onClose}
        data-testid="back-to-birthday"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="absolute top-5 left-5 z-[60] flex items-center gap-2 px-5 py-3 rounded-xl glass font-body text-sm text-[#f5edd6] tracking-wide"
      >
        <motion.span animate={{ x: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>←</motion.span>
        Back to Birthday ♡
      </motion.button>

      {/* Progress dots */}
      <div className="absolute top-6 right-5 z-[60] flex gap-1.5">
        {MEMORY_VIDEOS.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
            style={{ background: i === index ? "#f5c451" : "rgba(196,181,253,0.3)", boxShadow: i === index ? "0 0 8px #f5c451" : "none", transform: i === index ? "scale(1.4)" : "scale(1)" }} />
        ))}
      </div>

      {!introDone && <CinematicIntro onDone={() => setIntroDone(true)} />}

      {/* Video content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-20 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <VideoPlayer key={MEMORY_VIDEOS[index].src} video={MEMORY_VIDEOS[index]} index={index} total={MEMORY_VIDEOS.length} />
        </AnimatePresence>

        {/* Navigation controls */}
        {introDone && (
          <motion.div
            className="flex items-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={goPrev}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-body text-sm text-[#f5edd6]"
            >
              <span>←</span> Previous
            </motion.button>

            <span className="font-body text-sm text-[#a99fce]">
              {String(index + 1).padStart(2, "0")} / {String(MEMORY_VIDEOS.length).padStart(2, "0")}
            </span>

            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass glass-gold font-body text-sm text-[#f5edd6]"
            >
              Next <span>→</span>
            </motion.button>
          </motion.div>
        )}

        {/* swipe hint on mobile */}
        {introDone && (
          <motion.p
            className="md:hidden font-body text-xs text-[#a99fce] mt-6 opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            swipe ← → to browse memories
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
