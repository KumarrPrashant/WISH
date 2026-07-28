import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { BIRTHDAY_WISH } from "../../data";
import { Typewriter } from "../Ambience";
import { Header } from "./Story";

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

      {/* candles */}
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

      {/* top tier */}
      <rect x="70" y="100" width="140" height="42" rx="14" fill="url(#frost1)" stroke="#f3b8d0" />
      <path d="M70 116 q14 14 24 0 q14 14 24 0 q14 14 24 0 q14 14 24 0 q14 14 24 0 v-16 H70 Z" fill="#fff" opacity="0.85" />
      {/* mid tier */}
      <rect x="52" y="142" width="176" height="52" rx="16" fill="url(#frost2)" stroke="#e79fc0" />
      <path d="M52 160 q16 16 28 0 q16 16 28 0 q16 16 28 0 q16 16 28 0 q16 16 28 0 v-18 H52 Z" fill="#ffe3f0" opacity="0.9" />
      {/* bottom tier */}
      <rect x="34" y="194" width="212" height="56" rx="18" fill="url(#frost3)" stroke="#c99ad8" />
      <path d="M34 212 q18 18 30 0 q18 18 30 0 q18 18 30 0 q18 18 30 0 q18 18 30 0 q18 18 30 0 v-20 H34 Z" fill="#f6d9ff" opacity="0.9" />
      {/* sprinkles */}
      {[...Array(14)].map((_, i) => (
        <rect key={i} x={45 + (i * 15) % 190} y={205 + (i % 3) * 14} width="6" height="2.5" rx="1.2" fill={["#8b5cf6", "#ec4899", "#f5c451", "#60a5fa"][i % 4]} transform={`rotate(${(i * 40) % 90} ${48 + (i * 15) % 190} ${206 + (i % 3) * 14})`} />
      ))}
      {/* plate */}
      <ellipse cx="140" cy="252" rx="120" ry="12" fill="#e6c6a8" />
      <ellipse cx="140" cy="249" rx="120" ry="8" fill="#f3e2c8" />
    </svg>
  );
}

export default function Cake() {
  const [blown, setBlown] = useState(false);
  return (
    <section className="relative py-24 px-6 overflow-hidden" data-testid="cake-section">
      {blown && <Confetti recycle={false} numberOfPieces={320} colors={["#f472b6", "#8b5cf6", "#f5c451", "#c4b5fd", "#fff"]} />}
      <Header emoji="🎂" title="Make a Birthday Wish" subtitle="Before blowing the candles... close your eyes and make one little wish. ✨" />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <motion.div className="flex flex-col items-center relative"
          animate={{ x: blown ? -6 : 0 }} transition={{ type: "spring", stiffness: 60, damping: 16 }}>
          <div className="absolute -inset-6 rounded-full blur-3xl -z-10" style={{ background: blown ? "radial-gradient(circle,rgba(255,220,150,0.6),transparent 70%)" : "radial-gradient(circle,rgba(236,72,153,0.4),transparent 70%)" }} />
          {/* flowers bloom on blow */}
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
              <p className="font-body whitespace-pre-line leading-relaxed text-xl md:text-2xl grad-gold gold-glow" style={{ fontWeight: 600 }}>
                <Typewriter text={BIRTHDAY_WISH} speed={6} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
