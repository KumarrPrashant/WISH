import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { FINALE_MESSAGE, FINALE_SIGNATURE } from "../../data";

const CELEB_COLORS = ["#f5c451", "#ffffff", "#f9a8d4", "#c4b5fd", "#ffcaa4", "#a4d4fc", "#f472b6"];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---- Premium typewriter for the finale message ---- */
function FinaleTypewriter({ text }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 22);
    return () => clearInterval(id);
  }, [text]);

  return (
    <span className="font-serif-display italic font-medium typing-flow" style={{ textShadow: "0 0 20px rgba(245,196,81,0.4), 0 2px 8px rgba(0,0,0,0.4)" }}>
      {shown}
      {!done && (
        <span className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5 rounded-full"
          style={{ background: "#f5c451", boxShadow: "0 0 8px #f5c451, 0 0 16px rgba(245,196,81,0.6)", animation: "twinkle 0.9s linear infinite" }} />
      )}
    </span>
  );
}

/* ---- Grand celebration: fireworks from bottom, continuous skyshots,
       golden glitter, magical sparkles, floating particles, soft bloom ---- */
function GrandCelebration() {
  const fireworks = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: rand(8, 92),
        y: rand(10, 60),
        color: CELEB_COLORS[i % CELEB_COLORS.length],
        delay: i * 0.25 + rand(0, 0.2),
        rays: 14 + (i % 3) * 2,
        size: 120 + (i % 4) * 35,
      })),
    []
  );

  const skyshots = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x: rand(8, 92),
        delay: i * 0.3 + rand(0, 0.2),
        dur: 1.2 + (i % 2) * 0.3,
        color: CELEB_COLORS[(i + 2) % CELEB_COLORS.length],
        peak: `-${rand(35, 60)}vh`,
      })),
    []
  );

  const goldenGlitter = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        x: rand(0, 100),
        y: rand(0, 100),
        s: rand(1.5, 4.5),
        delay: rand(0, 4),
        dur: rand(3, 7),
        color: i % 3 === 0 ? "#f5c451" : i % 3 === 1 ? "#fde8a8" : "#fff",
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        x: rand(15, 85),
        y: rand(20, 80),
        s: rand(3, 6),
        delay: rand(0, 2.5),
        dur: rand(2, 4),
        color: CELEB_COLORS[i % CELEB_COLORS.length],
        drift: rand(-50, 50),
        rise: rand(40, 100),
      })),
    []
  );

  const floatingParts = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: rand(10, 90),
        y: rand(15, 85),
        s: rand(4, 8),
        delay: rand(0, 3),
        dur: rand(4, 7),
        color: CELEB_COLORS[i % CELEB_COLORS.length],
        drift: rand(-60, 60),
      })),
    []
  );

  return (
    <motion.div
      className="absolute inset-0 z-[60] pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* soft bloom lighting */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, rgba(245,196,81,0.22), rgba(236,72,153,0.12) 35%, rgba(139,92,246,0.08) 55%, transparent 80%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.7, 0.5] }}
        transition={{ duration: 6, times: [0, 0.12, 0.5, 1], ease: "easeOut" }}
      />

      {/* golden glitter — continuous floating gold dust */}
      {goldenGlitter.map((g) => (
        <motion.span
          key={`g${g.id}`}
          className="absolute rounded-full"
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.s, height: g.s, background: g.color, boxShadow: `0 0 8px ${g.color}`, willChange: "transform, opacity" }}
          animate={{ opacity: [0, 0.9, 0], y: [0, -100], x: [0, rand(-35, 35)], scale: [0.4, 1.3, 0.3] }}
          transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* floating particles — larger glowing orbs */}
      {floatingParts.map((f) => (
        <motion.span
          key={`f${f.id}`}
          className="absolute rounded-full"
          style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.s, height: f.s, background: f.color, boxShadow: `0 0 12px ${f.color}, 0 0 4px #fff`, willChange: "transform, opacity" }}
          initial={{ opacity: 0, scale: 0.3, y: 0, x: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.3, 1.1, 0.2], y: -80, x: f.drift }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* magical sparkles — rising bursts */}
      {sparkles.map((sp) => (
        <motion.span
          key={`sp${sp.id}`}
          className="absolute rounded-full"
          style={{ left: `${sp.x}%`, top: `${sp.y}%`, width: sp.s, height: sp.s, background: sp.color, boxShadow: `0 0 10px ${sp.color}, 0 0 4px #fff`, willChange: "transform, opacity" }}
          initial={{ opacity: 0, scale: 0.2, y: 0, x: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1.3, 0.1], y: -sp.rise, x: sp.drift }}
          transition={{ duration: sp.dur, delay: sp.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* continuous skyshots launching from bottom */}
      {skyshots.map((s) => (
        <div key={`s${s.id}`} className="absolute bottom-0" style={{ left: `${s.x}%` }}>
          <motion.span
            className="absolute block w-1.5 h-1.5 rounded-full"
            style={{ background: s.color, boxShadow: `0 0 12px ${s.color}, 0 0 5px #fff` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, s.peak, s.peak], opacity: [0, 1, 1] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, repeatDelay: 1, ease: "easeOut" }}
          />
          <motion.span
            className="absolute block"
            style={{ left: 0, width: 1.5, background: `linear-gradient(${s.color}, transparent)` }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: [0, 70, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, repeatDelay: 1, ease: "easeOut" }}
          />
        </div>
      ))}

      {/* firework bursts from bottom */}
      {fireworks.map((fw) => (
        <motion.div
          key={`fw${fw.id}`}
          className="absolute"
          style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0, 1, 0], scale: [0.3, 1, 0.5, 1, 0.2] }}
          transition={{ duration: 3, delay: fw.delay, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" }}
        >
          <div className="relative" style={{ width: fw.size, height: fw.size, marginLeft: -fw.size / 2, marginTop: -fw.size / 2 }}>
            {Array.from({ length: fw.rays }).map((_, r) => {
              const ang = (r / fw.rays) * Math.PI * 2;
              const dx = Math.cos(ang) * fw.size * 0.5;
              const dy = Math.sin(ang) * fw.size * 0.5;
              return (
                <motion.span
                  key={r}
                  className="absolute top-1/2 left-1/2 rounded-full"
                  style={{ width: 3.5, height: 3.5, background: fw.color, boxShadow: `0 0 10px ${fw.color}, 0 0 4px #fff` }}
                  animate={{ x: [0, dx], y: [0, dy], opacity: [1, 0], scale: [1, 0.2] }}
                  transition={{ duration: 1.5, delay: fw.delay, repeat: Infinity, repeatDelay: 1, ease: "easeOut" }}
                />
              );
            })}
            <motion.span
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{ width: 12, height: 12, marginLeft: -6, marginTop: -6, background: "#fff", boxShadow: `0 0 25px ${fw.color}, 0 0 12px #fff` }}
              animate={{ opacity: [1, 0], scale: [1, 0.15] }}
              transition={{ duration: 0.7, delay: fw.delay, repeat: Infinity, repeatDelay: 2.2, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}

      {/* central bloom — soft pulsing glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.6, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
      >
        <div className="w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,196,81,0.45), rgba(236,72,153,0.2), transparent 70%)", filter: "blur(10px)" }} />
      </motion.div>
    </motion.div>
  );
}

/* ---- Premium 3D birthday cake with improved frosting, colors, lighting ---- */
function PremiumCake3D() {
  const candles = [0, 1, 2, 3, 4, 5];
  return (
    <svg width="320" height="320" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="topTier" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#fff8fc" />
          <stop offset="50%" stopColor="#ffe3f0" />
          <stop offset="100%" stopColor="#f0b8d8" />
        </linearGradient>
        <linearGradient id="midTier" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#fff0f6" />
          <stop offset="50%" stopColor="#ffd0e6" />
          <stop offset="100%" stopColor="#e8a0c8" />
        </linearGradient>
        <linearGradient id="botTier" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#fbe8ff" />
          <stop offset="50%" stopColor="#f0c8f8" />
          <stop offset="100%" stopColor="#d4a0e8" />
        </linearGradient>
        <radialGradient id="flameG2" cx="50%" cy="65%">
          <stop offset="0%" stopColor="#fff8d0" />
          <stop offset="40%" stopColor="#ffc04e" />
          <stop offset="100%" stopColor="#ff7e3f" />
        </radialGradient>
        <radialGradient id="halo2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(255,220,150,0.55)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="plateG" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#f5e8d0" />
          <stop offset="100%" stopColor="#d4c0a0" />
        </radialGradient>
        <linearGradient id="frostDrip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#ffe8f2" />
        </linearGradient>
      </defs>

      <ellipse cx="160" cy="48" rx="100" ry="42" fill="url(#halo2)" />

      {/* candles with flames */}
      {candles.map((c) => {
        const x = 78 + c * 28;
        return (
          <g key={c}>
            <rect x={x} y="66" width="9" height="38" rx="4.5" fill={c % 2 ? "#f472b6" : "#a78bfa"} />
            <rect x={x + 1} y="66" width="3" height="38" rx="1.5" fill="rgba(255,255,255,0.3)" />
            <motion.ellipse cx={x + 4.5} cy="58" rx="5.5" ry="12" fill="url(#flameG2)"
              animate={{ scaleY: [1, 1.3, 0.85, 1.2, 1], scaleX: [1, 0.88, 1.12, 0.92, 1] }}
              transition={{ scaleY: { duration: 0.5, repeat: Infinity }, scaleX: { duration: 0.4, repeat: Infinity } }}
              style={{ transformOrigin: "center bottom" }} />
            <ellipse cx={x + 4.5} cy="56" rx="2.5" ry="6" fill="#fff8d0" opacity="0.7" />
          </g>
        );
      })}

      {/* top tier */}
      <rect x="86" y="104" width="148" height="44" rx="16" fill="url(#topTier)" stroke="#f3a8c8" strokeWidth="1" />
      <path d="M86 122 q15 15 26 0 q15 15 26 0 q15 15 26 0 q15 15 26 0 q15 15 26 0 v-18 H86 Z" fill="url(#frostDrip)" opacity="0.92" />

      {/* mid tier */}
      <rect x="64" y="148" width="192" height="56" rx="18" fill="url(#midTier)" stroke="#e090c0" strokeWidth="1" />
      <path d="M64 168 q17 17 30 0 q17 17 30 0 q17 17 30 0 q17 17 30 0 q17 17 30 0 q17 17 30 0 v-20 H64 Z" fill="url(#frostDrip)" opacity="0.9" />

      {/* bottom tier */}
      <rect x="40" y="204" width="240" height="64" rx="20" fill="url(#botTier)" stroke="#c890d8" strokeWidth="1" />
      <path d="M40 226 q20 20 34 0 q20 20 34 0 q20 20 34 0 q20 20 34 0 q20 20 34 0 q20 20 34 0 q20 20 34 0 v-22 H40 Z" fill="url(#frostDrip)" opacity="0.88" />

      {/* premium decorations — gold dots and gems */}
      {[
        { cx: 90, cy: 124, r: 3, fill: "#f5c451" },
        { cx: 120, cy: 124, r: 3, fill: "#f472b6" },
        { cx: 160, cy: 124, r: 3, fill: "#a78bfa" },
        { cx: 200, cy: 124, r: 3, fill: "#60a5fa" },
        { cx: 230, cy: 124, r: 3, fill: "#f5c451" },
        { cx: 72, cy: 172, r: 3.5, fill: "#f5c451" },
        { cx: 108, cy: 172, r: 3.5, fill: "#ec4899" },
        { cx: 148, cy: 172, r: 3.5, fill: "#c4b5fd" },
        { cx: 188, cy: 172, r: 3.5, fill: "#f5c451" },
        { cx: 224, cy: 172, r: 3.5, fill: "#60a5fa" },
        { cx: 252, cy: 172, r: 3.5, fill: "#ec4899" },
      ].map((d, i) => (
        <circle key={`dot${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} style={{ filter: "brightness(1.3)" }} opacity="0.95" />
      ))}

      {/* sprinkles on bottom tier */}
      {[...Array(18)].map((_, i) => (
        <rect key={`spr${i}`} x={50 + (i * 13) % 220} y={214 + (i % 3) * 16} width="7" height="3" rx="1.5"
          fill={["#f472b6", "#a78bfa", "#f5c451", "#60a5fa", "#ec4899"][i % 5]}
          transform={`rotate(${(i * 37) % 90} ${52 + (i * 13) % 220} ${215 + (i % 3) * 16})`}
          opacity="0.85" />
      ))}

      {/* premium plate */}
      <ellipse cx="160" cy="272" rx="135" ry="14" fill="url(#plateG)" />
      <ellipse cx="160" cy="269" rx="135" ry="9" fill="#f5ead0" />
      <ellipse cx="160" cy="268" rx="128" ry="5" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

function GiftBox({ opened, onOpen }) {
  return (
    <motion.button data-testid="gift-box" onClick={onOpen} disabled={opened} className="relative"
      whileHover={!opened ? { scale: 1.05 } : {}} whileTap={!opened ? { scale: 0.95 } : {}}
      animate={!opened ? { y: [0, -10, 0] } : {}} transition={{ y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}>
      <div className="absolute -inset-10 rounded-full blur-3xl -z-10" style={{ background: "radial-gradient(circle,rgba(245,196,81,0.5),rgba(236,72,153,0.3),transparent 70%)" }} />
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="boxG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#db2777" /></linearGradient>
          <linearGradient id="lidG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f9a8d4" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
        </defs>
        <rect x="45" y="90" width="110" height="90" rx="8" fill="url(#boxG)" />
        <rect x="92" y="90" width="16" height="90" fill="#f5c451" opacity="0.9" />
        <motion.g animate={opened ? { y: -60, rotate: -12, opacity: 0 } : { y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ transformOrigin: "100px 80px" }}>
          <rect x="38" y="66" width="124" height="30" rx="8" fill="url(#lidG)" />
          <rect x="92" y="66" width="16" height="30" fill="#f5c451" />
          <circle cx="100" cy="62" r="7" fill="#f5c451" />
          <path d="M100 62 C80 45 70 60 88 66 Z" fill="#f5c451" />
          <path d="M100 62 C120 45 130 60 112 66 Z" fill="#f5c451" />
        </motion.g>
      </svg>
      {!opened && <p className="font-hand text-2xl text-[#f5c451] gold-glow mt-2">tap to open your gift 🎁</p>}
    </motion.button>
  );
}

export default function Finale() {
  const [opened, setOpened] = useState(false);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { setInView(entries[0].isIntersecting); },
      { threshold: 0, rootMargin: "-5% 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showCelebration = opened && inView;

  return (
    <section ref={sectionRef} className="relative py-28 px-6 text-center overflow-hidden" data-testid="finale-section">
      <AnimatePresence>
        {showCelebration && (
          <Confetti recycle={true} numberOfPieces={600} colors={["#f472b6", "#8b5cf6", "#f5c451", "#c4b5fd", "#fff", "#ffcaa4", "#fde8a8"]} gravity={0.2} />
        )}
      </AnimatePresence>
      <AnimatePresence>{showCelebration && <GrandCelebration />}</AnimatePresence>

      <motion.h2 className="font-serif-display text-4xl sm:text-6xl font-bold grad-gold gold-glow mb-3"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
        ✨ GRAND FINALE ✨
      </motion.h2>

      <div className="max-w-2xl mx-auto flex flex-col items-center mt-8 relative z-[5]">
        {!opened && <GiftBox opened={opened} onOpen={() => setOpened(true)} />}

        <AnimatePresence>
          {opened && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9 }}>
              {["🌸", "🌺", "🌼", "🌷", "💐"].map((f, i) => (
                <motion.span key={i} className="absolute text-3xl" style={{ left: `${12 + i * 18}%`, top: `${20 + (i % 2) * 40}%` }}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: [0, 12, -12, 0] }} transition={{ delay: 0.2 + i * 0.12, duration: 1.4, repeat: Infinity, repeatType: "reverse" }}>{f}</motion.span>
              ))}

              {/* Crystal glass card with premium typography */}
              <div className="crystal-glass rounded-3xl p-8 md:p-10 relative">
                <p className="text-xl md:text-2xl leading-[1.15] whitespace-pre-line">
                  <FinaleTypewriter text={FINALE_MESSAGE} />
                </p>

                {/* Premium 3D cake with gentle floating */}
                <div className="my-8 flex justify-center">
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, 1, -1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PremiumCake3D />
                  </motion.div>
                </div>

                <p className="font-hand text-3xl text-[#f5c451] gold-glow mt-4">{FINALE_SIGNATURE}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
