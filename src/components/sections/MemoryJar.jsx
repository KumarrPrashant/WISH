import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEMORIES } from "../../data";
import { ParticleBurst } from "../Ambience";
import { Header } from "./Story";
import { useCursorPos } from "../../hooks/useCursorPos";

const SPARK_COLORS = ["#f5c451", "#ffffff", "#f9a8d4", "#c4b5fd"];

/* ---- Crystal typewriter with synchronized magical sparkles + glitter ---- */
function CrystalTypewriter({ text }) {
  const [shown, setShown] = useState("");
  const [typing, setTyping] = useState(false);
  const [particles, setParticles] = useState([]);
  const [stars, setStars] = useState([]);
  const wrapRef = useRef(null);
  const cursorRef = useRef(null);
  const pid = useRef(0);
  const { getPos, observe } = useCursorPos(wrapRef, cursorRef);

  useEffect(() => {
    setShown("");
    setParticles([]);
    setStars([]);
    setTyping(true);
    let i = 0;
    const step = Math.max(1, Math.round(text.length / 400));
    const id = setInterval(() => {
      i += step;
      setShown(text.slice(0, i));
      if (i < text.length && i % 3 === 0) emitSparkle();
      if (i >= text.length) {
        clearInterval(id);
        setTyping(false);
      }
    }, 6);
    const cleanupRO = observe();
    return () => { clearInterval(id); cleanupRO && cleanupRO(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const emitSparkle = () => {
    const pos = getPos();
    if (!pos) return;
    const { x, y } = pos;

    const id = pid.current++;
    const color = SPARK_COLORS[id % SPARK_COLORS.length];
    const drift = (Math.random() - 0.5) * 26;
    const rise = 28 + Math.random() * 46;
    const life = 0.8 + Math.random() * 0.7;
    const size = 2 + Math.random() * 2.4;
    setParticles((p) => [...p.slice(-22), { id, x, y, color, drift, rise, life, size }]);

    let sid = null;
    if (Math.random() < 0.22) {
      sid = pid.current++;
      const sx = x + (Math.random() - 0.5) * 64;
      const sy = y + (Math.random() - 0.5) * 26;
      setStars((s) => [...s.slice(-8), { id: sid, x: sx, y: sy, life }]);
    }

    setTimeout(() => setParticles((p) => p.filter((pt) => pt.id !== id)), life * 1000 + 60);
    if (sid !== null) setTimeout(() => setStars((s) => s.filter((st) => st.id !== sid)), life * 1000 + 60);
  };

  return (
    <div ref={wrapRef} className="relative inline-block">
      <span className="font-hand text-lg md:text-xl text-[#f5edd6] leading-snug">
        {shown}
        <motion.span
          ref={cursorRef}
          className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5 rounded-full"
          style={{ background: "#f5c451", boxShadow: "0 0 6px #f5c451, 0 0 12px rgba(245,196,81,0.55)" }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.45, 0.5, 1], ease: "linear" }}
        />
      </span>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: typing ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              background: p.color,
              boxShadow: `0 0 6px ${p.color}, 0 0 3px ${p.color}`,
            }}
            initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.3, 0.3], x: p.drift, y: -p.rise }}
            transition={{ duration: p.life, ease: "easeOut" }}
          />
        ))}
        {stars.map((s) => (
          <motion.span
            key={s.id}
            className="absolute"
            style={{ left: s.x, top: s.y, marginLeft: -5, marginTop: -5, fontSize: 11, color: "#fff", textShadow: "0 0 6px #c4b5fd, 0 0 3px #fff" }}
            initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.2, 0.3], rotate: 90 }}
            transition={{ duration: s.life, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

/* ---- Subtle sparkles overlaid on crystal cards ---- */
function Sparkles() {
  const sparkles = useRef(
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: [8, 22, 45, 68, 88, 94][i],
      y: [15, 55, 30, 75, 20, 60][i],
      s: 2 + (i % 3),
      delay: i * 0.5,
    }))
  ).current;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {sparkles.map((sp) => (
        <motion.span
          key={sp.id}
          className="absolute rounded-full"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            width: sp.s,
            height: sp.s,
            background: "#fff",
            boxShadow: "0 0 6px #c4b5fd, 0 0 3px #fff",
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2.5, delay: sp.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ---- Premium crystal-glass card wrapper (not transparent) ---- */
function CrystalCard({ children }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1c1640 0%, #251a48 40%, #1a1235 100%)",
        border: "1px solid rgba(196,181,253,0.35)",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.25), inset 0 1px 1px rgba(255,255,255,0.1), inset 0 0 30px rgba(196,181,253,0.08)",
      }}
    >
      <Sparkles />
      {/* crystal sheen overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(196,181,253,0.08), transparent 40%, transparent 60%, rgba(244,114,182,0.06))",
        }}
      />
      {/* glowing top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(196,181,253,0.6), rgba(244,114,182,0.5), transparent)" }}
      />
      {children}
    </div>
  );
}

export default function MemoryJar() {
  const [count, setCount] = useState(0); // how many revealed
  const pull = () => setCount((c) => Math.min(c + 1, MEMORIES.length));
  const revealed = MEMORIES.slice(0, count);

  return (
    <section className="relative py-24 px-6" data-testid="memoryjar-section">
      <Header emoji="🫙" title="Memory Jar" subtitle="Little moments that became unforgettable memories..." />

      <div className="max-w-6xl mx-auto grid md:grid-cols-[280px_1fr] gap-10 items-start">
        {/* jar on the left */}
        <div className="flex flex-col items-center md:sticky md:top-24">
          <motion.button data-testid="memory-jar" onClick={pull} className="relative"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            animate={{ y: [0, -10, 0] }} transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}>
            <div className="absolute -inset-10 rounded-full blur-3xl -z-10" style={{ background: "radial-gradient(circle,rgba(139,92,246,0.5),rgba(236,72,153,0.25),transparent 70%)" }} />
            <ParticleBurst count={14} />
            <svg width="210" height="270" viewBox="0 0 210 270" className="relative">
              <defs>
                <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                  <stop offset="45%" stopColor="rgba(180,160,255,0.12)" />
                  <stop offset="100%" stopColor="rgba(139,92,246,0.18)" />
                </linearGradient>
                <radialGradient id="innerGlow" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="rgba(245,196,81,0.35)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect x="66" y="6" width="78" height="22" rx="7" fill="#5a4a2a" stroke="#f5c451" strokeWidth="1.5" />
              <rect x="70" y="26" width="70" height="10" rx="3" fill="rgba(245,196,81,0.35)" />
              <path d="M46 40 Q46 34 66 34 H144 Q164 34 164 40 V236 Q164 260 105 260 Q46 260 46 236 Z" fill="url(#glassG)" stroke="rgba(200,185,255,0.6)" strokeWidth="2" />
              <ellipse cx="105" cy="150" rx="55" ry="90" fill="url(#innerGlow)" />
              <path d="M60 50 Q54 150 62 244" stroke="rgba(255,255,255,0.5)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
              {[...Array(8)].map((_, i) => (
                <motion.g key={i} animate={{ y: [0, -6, 0], rotate: [0, 6, -5, 0] }} transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "center" }}>
                  <rect x={62 + (i % 3) * 26} y={70 + (i % 4) * 38} width="28" height="22" rx="3" fill={["#ffd9ec", "#e6d9ff", "#fff0cf", "#d9ecff"][i % 4]} opacity="0.9"
                    transform={`rotate(${(i * 27) % 40 - 20} ${76 + (i % 3) * 26} ${81 + (i % 4) * 38})`} />
                </motion.g>
              ))}
              {/* rising dust (animate transform, not cy) */}
              {[...Array(8)].map((_, i) => (
                <motion.circle key={`d${i}`} cx={64 + (i * 12) % 80} cy={200} r="1.6" fill="#fff"
                  animate={{ opacity: [0, 1, 0], y: [0, -120] }} transition={{ duration: 2.5 + (i % 3), repeat: Infinity, delay: i * 0.4 }} />
              ))}
            </svg>
            <span className="font-hand text-xl text-[#f5c451] block mt-2 gold-glow">
              {count === 0 ? "tap the jar 🌟" : count >= MEMORIES.length ? "that's all of them 🤍" : "tap to release the next 💌"}
            </span>
          </motion.button>
        </div>

        {/* stacked memories on the right */}
        <div className="space-y-5 min-h-[120px]">
          <AnimatePresence>
            {revealed.map((mem, i) => (
              <motion.div key={i} className="relative"
                initial={{ opacity: 0, scale: 0.82, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 10 }}
                transition={{ type: "spring", stiffness: 100, damping: 14 }}>
                {i === revealed.length - 1 && <ParticleBurst count={12} />}
                <CrystalCard>
                  <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold text-white relative z-10"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>{i + 1}</span>
                  <p className="relative z-10">
                    {i === revealed.length - 1 ? (
                      <CrystalTypewriter text={mem} />
                    ) : (
                      <span className="font-hand text-lg md:text-xl text-[#f5edd6] leading-snug">{mem}</span>
                    )}
                  </p>
                </CrystalCard>
              </motion.div>
            ))}
          </AnimatePresence>
          {count === 0 && <p className="font-body text-[#a99fce] text-center py-8">The jar is full of little memories... tap it to let them out. ✨</p>}
        </div>
      </div>
    </section>
  );
}
