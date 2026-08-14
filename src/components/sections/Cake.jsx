import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { BIRTHDAY_WISH } from "../../data";
import { Header } from "./Story";
import { useCursorPos } from "../../hooks/useCursorPos";

const SPARK_COLORS = ["#f5c451", "#ffffff", "#f9a8d4", "#c4b5fd", "#ffcaa4", "#a4d4fc"];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---- Premium typewriter: Playfair Display, tighter leading, 40% faster ---- */
function WishTypewriter({ text }) {
  const [shown, setShown] = useState("");
  const [typing, setTyping] = useState(false);
  const cursorRef = useRef(null);
  const wrapRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const pid = useRef(0);
  const { getPos, observe } = useCursorPos(wrapRef, cursorRef);

  const emit = () => {
    const pos = getPos();
    if (!pos) return;
    const { x, y } = pos;
    const id = pid.current++;
    const color = SPARK_COLORS[id % SPARK_COLORS.length];
    const drift = (Math.random() - 0.5) * 22;
    const rise = 24 + Math.random() * 40;
    const life = 0.8 + Math.random() * 0.6;
    const size = 2 + Math.random() * 2;
    setParticles((p) => [...p.slice(-18), { id, x, y, color, drift, rise, life, size }]);
    setTimeout(() => setParticles((p) => p.filter((pt) => pt.id !== id)), life * 1000 + 80);
  };

  const compactText = text.replace(/\n\n/g, "\n");

  useEffect(() => {
    setShown("");
    setParticles([]);
    setTyping(true);
    let i = 0;
    const step = 1;
    const id = setInterval(() => {
      i += step;
      setShown(compactText.slice(0, i));
      if (i < compactText.length && i % 3 === 0) emit();
      if (i >= compactText.length) {
        clearInterval(id);
        setTyping(false);
      }
    }, 18);
    const cleanupRO = observe();
    return () => { clearInterval(id); cleanupRO && cleanupRO(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compactText]);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <span
        className="font-serif-display italic font-medium text-xl md:text-2xl leading-[1.05] whitespace-pre-line tracking-wide typing-flow"
        style={{ color: "#f0e6d2", textShadow: "0 0 18px rgba(245,196,81,0.35), 0 2px 8px rgba(0,0,0,0.4)" }}
      >
        {shown}
        <motion.span
          ref={cursorRef}
          className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5 rounded-full"
          style={{ background: "#f5c451", boxShadow: "0 0 8px #f5c451, 0 0 16px rgba(245,196,81,0.6)" }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.45, 0.5, 1], ease: "linear" }}
        />
      </span>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: typing ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.x, top: p.y, width: p.size, height: p.size,
              marginLeft: -p.size / 2, marginTop: -p.size / 2,
              background: p.color, boxShadow: `0 0 6px ${p.color}, 0 0 3px ${p.color}`,
            }}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.3, 0.2], x: p.drift, y: -p.rise }}
            transition={{ duration: p.life, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ---- Section-scoped celebration: fireworks, skyshots, glitters ----
     Rendered only while the Cake section is visible via IntersectionObserver.
     When the user leaves the section, the component unmounts and all
     animations/particles are removed from the DOM. ---- */
function Celebration() {
  const fireworks = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        x: rand(10, 90),
        y: rand(12, 58),
        color: SPARK_COLORS[i % SPARK_COLORS.length],
        delay: i * 0.3 + rand(0, 0.25),
        rays: 12 + (i % 3) * 2,
        size: 100 + (i % 4) * 30,
      })),
    []
  );

  const skyshots = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: i,
        x: rand(12, 88),
        delay: i * 0.4 + rand(0, 0.3),
        dur: 1.3 + (i % 2) * 0.3,
        color: SPARK_COLORS[(i + 2) % SPARK_COLORS.length],
        peak: `-${rand(38, 58)}vh`,
      })),
    []
  );

  const shootingStars = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, i) => ({
        id: i,
        startX: rand(5, 35),
        startY: rand(5, 25),
        delay: 1 + i * 0.9 + rand(0, 0.3),
        color: SPARK_COLORS[(i + 4) % SPARK_COLORS.length],
      })),
    []
  );

  const dust = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: rand(0, 100),
        y: rand(0, 100),
        s: rand(1.5, 4),
        delay: rand(0, 3),
        dur: rand(4, 8),
        color: SPARK_COLORS[i % SPARK_COLORS.length],
      })),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: rand(20, 80),
        y: rand(25, 75),
        s: rand(2, 5),
        delay: rand(0, 2),
        dur: rand(2.5, 4.5),
        color: SPARK_COLORS[i % SPARK_COLORS.length],
        drift: rand(-40, 40),
        rise: rand(30, 80),
      })),
    []
  );

  return (
    <motion.div
      className="absolute inset-0 z-[80] pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 35%, rgba(245,196,81,0.18), rgba(139,92,246,0.08) 40%, transparent 75%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 0.4] }}
        transition={{ duration: 5, times: [0, 0.15, 0.5, 1], ease: "easeOut" }}
      />

      {dust.map((d) => (
        <motion.span
          key={`d${d.id}`}
          className="absolute rounded-full"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, background: d.color, boxShadow: `0 0 8px ${d.color}`, willChange: "transform, opacity" }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -80], x: [0, rand(-30, 30)], scale: [0.5, 1.2, 0.4] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {particles.map((p) => (
        <motion.span
          key={`p${p.id}`}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: p.color, boxShadow: `0 0 8px ${p.color}, 0 0 3px #fff`, willChange: "transform, opacity" }}
          initial={{ opacity: 0, scale: 0.3, y: 0, x: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1.2, 0.2], y: -p.rise, x: p.drift }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {shootingStars.map((s) => (
        <motion.div
          key={`ss${s.id}`}
          className="absolute"
          style={{ left: `${s.startX}%`, top: `${s.startY}%`, willChange: "transform, opacity" }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], x: [0, "35vw"], y: [0, "22vh"] }}
          transition={{ duration: 1.1, delay: s.delay, repeat: Infinity, repeatDelay: 3.5, ease: "easeOut" }}
        >
          <div style={{ width: 70, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)`, borderRadius: 2, boxShadow: `0 0 10px ${s.color}` }} />
        </motion.div>
      ))}

      {skyshots.map((s) => (
        <div key={`s${s.id}`} className="absolute bottom-0" style={{ left: `${s.x}%` }}>
          <motion.span
            className="absolute block w-1.5 h-1.5 rounded-full"
            style={{ background: s.color, boxShadow: `0 0 10px ${s.color}, 0 0 4px #fff` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, s.peak, s.peak], opacity: [0, 1, 1] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
          />
          <motion.span
            className="absolute block"
            style={{ left: 0, width: 1.5, background: `linear-gradient(${s.color}, transparent)` }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: [0, 60, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
          />
        </div>
      ))}

      {fireworks.map((fw) => (
        <motion.div
          key={`fw${fw.id}`}
          className="absolute"
          style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0, 1, 0], scale: [0.4, 1, 0.6, 1, 0.3] }}
          transition={{ duration: 3.5, delay: fw.delay, repeat: Infinity, repeatDelay: 0.8, ease: "easeOut" }}
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
                  style={{ width: 3, height: 3, background: fw.color, boxShadow: `0 0 8px ${fw.color}, 0 0 3px #fff` }}
                  animate={{ x: [0, dx], y: [0, dy], opacity: [1, 0], scale: [1, 0.3] }}
                  transition={{ duration: 1.6, delay: fw.delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
                />
              );
            })}
            <motion.span
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{ width: 10, height: 10, marginLeft: -5, marginTop: -5, background: "#fff", boxShadow: `0 0 20px ${fw.color}, 0 0 10px #fff` }}
              animate={{ opacity: [1, 0], scale: [1, 0.2] }}
              transition={{ duration: 0.8, delay: fw.delay, repeat: Infinity, repeatDelay: 2.4, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeOut" }}
      >
        <div className="w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,196,81,0.5), rgba(236,72,153,0.25), transparent 70%)", filter: "blur(8px)" }} />
      </motion.div>
    </motion.div>
  );
}

function Cake3D({ blown }) {
  const candles = [0, 1, 2, 3, 4];
  return (
    <svg width="280" height="270" viewBox="0 0 280 270">
      <defs>
        <linearGradient id="frost1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff5fa" /><stop offset="100%" stopColor="#ffdcec" /></linearGradient>
        <linearGradient id="frost2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe3f0" /><stop offset="100%" stopColor="#f7c1d9" /></linearGradient>
        <linearGradient id="frost3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f6d9ff" /><stop offset="100%" stopColor="#e0b3f0" /></linearGradient>
        <radialGradient id="flameG" cx="50%" cy="70%"><stop offset="0%" stopColor="#fff3b0" /><stop offset="55%" stopColor="#ffb347" /><stop offset="100%" stopColor="#ff7e5f" /></radialGradient>
        <radialGradient id="halo" cx="50%" cy="50%"><stop offset="0%" stopColor="rgba(255,220,150,0.6)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
      </defs>

      {!blown && <ellipse cx="140" cy="50" rx="90" ry="40" fill="url(#halo)" />}

      {candles.map((c) => {
        const x = 88 + c * 26;
        return (
          <g key={c}>
            <rect x={x} y="66" width="8" height="34" rx="4" fill={c % 2 ? "#f472b6" : "#8b5cf6"} />
            <AnimatePresence>
              {!blown && (
                <motion.ellipse cx={x + 4} cy="58" rx="5" ry="11" fill="url(#flameG)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1, scaleY: [1, 1.25, 0.9, 1.15, 1], scaleX: [1, 0.9, 1.1, 0.95, 1] }}
                  exit={{ opacity: 0, y: -16 }} transition={{ scaleY: { duration: 0.6, repeat: Infinity }, scaleX: { duration: 0.5, repeat: Infinity } }}
                  style={{ transformOrigin: "center bottom" }} />
              )}
            </AnimatePresence>
            {blown && (
              <motion.path d={`M${x + 4} 58 q6 -14 -2 -26`} stroke="#cfc9c0" strokeWidth="2" fill="none"
                initial={{ opacity: 0.7, pathLength: 0 }} animate={{ opacity: 0, pathLength: 1, y: -30 }} transition={{ duration: 2 }} />
            )}
          </g>
        );
      })}

      <rect x="70" y="100" width="140" height="42" rx="14" fill="url(#frost1)" stroke="#f3b8d0" />
      <path d="M70 116 q14 14 24 0 q14 14 24 0 q14 14 24 0 q14 14 24 0 q14 14 24 0 v-16 H70 Z" fill="#fff" opacity="0.85" />
      <rect x="52" y="142" width="176" height="52" rx="16" fill="url(#frost2)" stroke="#e79fc0" />
      <path d="M52 160 q16 16 28 0 q16 16 28 0 q16 16 28 0 q16 16 28 0 q16 16 28 0 v-18 H52 Z" fill="#ffe3f0" opacity="0.9" />
      <rect x="34" y="194" width="212" height="56" rx="18" fill="url(#frost3)" stroke="#c99ad8" />
      <path d="M34 212 q18 18 30 0 q18 18 30 0 q18 18 30 0 q18 18 30 0 q18 18 30 0 q18 18 30 0 v-20 H34 Z" fill="#f6d9ff" opacity="0.9" />
      {[...Array(14)].map((_, i) => (
        <rect key={i} x={45 + (i * 15) % 190} y={205 + (i % 3) * 14} width="6" height="2.5" rx="1.2" fill={["#8b5cf6", "#ec4899", "#f5c451", "#60a5fa"][i % 4]} transform={`rotate(${(i * 40) % 90} ${48 + (i * 15) % 190} ${206 + (i % 3) * 14})`} />
      ))}
      <ellipse cx="140" cy="252" rx="120" ry="12" fill="#e6c6a8" />
      <ellipse cx="140" cy="249" rx="120" ry="8" fill="#f3e2c8" />
    </svg>
  );
}

export default function Cake() {
  const [blown, setBlown] = useState(false);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { setInView(entries[0].isIntersecting); },
      { threshold: 0, rootMargin: "-10% 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showEffects = blown && inView;

  return (
    <section ref={sectionRef} className="relative py-24 px-6 overflow-hidden" data-testid="cake-section">
      <AnimatePresence>
        {showEffects && (
          <Confetti recycle={false} numberOfPieces={500} colors={["#f472b6", "#8b5cf6", "#f5c451", "#c4b5fd", "#fff", "#ffcaa4"]} gravity={0.22} />
        )}
      </AnimatePresence>
      <AnimatePresence>{showEffects && <Celebration />}</AnimatePresence>

      <Header emoji="🎂" title="Make a Birthday Wish" subtitle="Before blowing the candles... close your eyes and make one little wish. ✨" />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <motion.div className="flex flex-col items-center relative"
          animate={{ x: blown ? -6 : 0 }} transition={{ type: "spring", stiffness: 60, damping: 16 }}>
          <div className="absolute -inset-6 rounded-full blur-3xl -z-10" style={{ background: blown ? "radial-gradient(circle,rgba(255,220,150,0.6),transparent 70%)" : "radial-gradient(circle,rgba(236,72,153,0.4),transparent 70%)" }} />
          {blown && ["🌸", "🌺", "🌼", "🌷"].map((f, i) => (
            <motion.span key={i} className="absolute text-3xl" style={{ left: `${10 + i * 25}%`, top: `${i % 2 ? 70 : 10}%` }}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: [0, 15, -15, 0] }} transition={{ delay: 0.2 + i * 0.15, duration: 1.2, repeat: Infinity, repeatType: "reverse" }}>{f}</motion.span>
          ))}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}><Cake3D blown={blown} /></motion.div>
          {!blown && (
            <motion.button data-testid="blow-candles" onClick={() => setBlown(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              className="mt-6 px-8 py-3 rounded-full font-body font-semibold text-white"
              style={{ background: "linear-gradient(120deg,#8b5cf6,#ec4899,#f5c451)", boxShadow: "0 10px 30px rgba(139,92,246,0.5)" }}>Blow the Candles 🕯️</motion.button>
          )}
        </motion.div>

        <AnimatePresence>
          {blown && (
            <motion.div className="text-center md:text-left" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <WishTypewriter text={BIRTHDAY_WISH} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
