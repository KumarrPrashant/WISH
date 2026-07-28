import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { WHEEL } from "../../data";
import { Typewriter, ParticleBurst } from "../Ambience";
import { Header } from "./Story";

const N = WHEEL.length;
const SEG = 360 / N;

/* tiny magical particles emitted while the wheel is spinning */
function SpinParticles({ active }) {
  const parts = useRef(
    Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      angle: (i / 16) * Math.PI * 2,
      delay: (i % 4) * 0.12,
      dur: 1.6 + (i % 3) * 0.4,
      size: 2 + (i % 3),
      color: ["#f5c451", "#ffffff", "#f9a8d4", "#c4b5fd"][i % 4],
    }))
  ).current;
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {parts.map((p) => {
            const r = 130;
            const x = Math.cos(p.angle) * r;
            const y = Math.sin(p.angle) * r;
            return (
              <motion.span
                key={p.id}
                className="absolute top-1/2 left-1/2 rounded-full"
                style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 8px ${p.color}` }}
                animate={{
                  x: [x * 0.6, x, x * 0.6],
                  y: [y * 0.6, y, y * 0.6],
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.2, 0.4],
                }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Wheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const spin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    const idx = Math.floor(Math.random() * N);
    const turns = 5 + Math.floor(Math.random() * 3);
    const target = turns * 360 + (360 - (idx * SEG + SEG / 2));
    setRotation((r) => r - (r % 360) + target);
    setTimeout(() => {
      setSpinning(false);
      const seg = WHEEL[idx];
      setResult(seg);
      if (["Hidden Surprise", "Birthday Wish"].includes(seg.label)) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 4000);
      }
    }, 4200);
  };

  const gradient = `conic-gradient(${WHEEL.map((w, i) => `${w.color} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(",")})`;

  return (
    <section className="relative py-24 px-6" data-testid="wheel-section">
      {confetti && <Confetti recycle={false} numberOfPieces={220} colors={["#f472b6", "#8b5cf6", "#f5c451", "#c4b5fd"]} />}
      <Header emoji="🎡" title="Wheel of Little Surprises" subtitle="Every spin unlocks a tiny surprise made just for you. ✨" />

      <div className="max-w-md mx-auto flex flex-col items-center">
        <div className="relative">
          {/* pointer with glow */}
          <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 text-3xl"
            style={{ filter: "drop-shadow(0 0 8px rgba(245,196,81,0.8))" }}
            animate={spinning ? { y: [0, -3, 0] } : {}} transition={{ duration: 0.3, repeat: spinning ? Infinity : 0 }}>
            📍
          </motion.div>

          {/* outer ambient glow */}
          <div className="absolute -inset-12 rounded-full blur-3xl -z-10"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.45), rgba(236,72,153,0.3), transparent 70%)" }} />

          {/* metallic outer ring (static, does not rotate) */}
          <div className="absolute inset-0 rounded-full -z-[1]"
            style={{
              margin: -16,
              background: "conic-gradient(from 0deg, #f5c451, #fff8e0, #c9a23a, #f5c451, #8a6d1e, #f5c451, #fff8e0, #c9a23a, #f5c451)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.6), 0 0 50px rgba(245,196,81,0.35), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.4)",
            }} />

          {/* spinning wheel body with 3D depth + glass + reflections */}
          <motion.div
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-full relative"
            style={{
              background: gradient,
              boxShadow:
                "0 30px 70px rgba(0,0,0,0.65), 0 0 50px rgba(245,196,81,0.35), inset 0 4px 10px rgba(255,255,255,0.3), inset 0 -6px 14px rgba(0,0,0,0.35)",
              border: "6px solid rgba(245,232,176,0.9)",
            }}
            animate={{ rotate: rotation, scale: spinning ? 1 : [1, 1.015, 1] }}
            transition={spinning ? { duration: 4.2, ease: [0.16, 1, 0.3, 1] } : { scale: { duration: 4, repeat: Infinity } }}
          >
            {/* glossy glass highlight (top-left sheen) */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(35% 30% at 32% 22%, rgba(255,255,255,0.5), transparent 70%)" }} />
            {/* metallic reflection sweep */}
            <div className="absolute inset-0 rounded-full pointer-events-none opacity-50"
              style={{ background: "conic-gradient(from 200deg, transparent 0deg, rgba(255,255,255,0.22) 40deg, transparent 80deg, transparent 360deg)" }} />
            {/* inner dark rim for depth */}
            <div className="absolute inset-2 rounded-full pointer-events-none"
              style={{ boxShadow: "inset 0 0 14px rgba(0,0,0,0.3)" }} />

            {WHEEL.map((w, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 origin-left text-lg"
                style={{ transform: `rotate(${i * SEG + SEG / 2}deg) translateX(28px)`, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>
                {w.emoji}
              </div>
            ))}
          </motion.div>

          {/* magical particles while spinning */}
          <SpinParticles active={spinning} />

          {/* premium center button */}
          <motion.button
            data-testid="spin-button"
            onClick={spin}
            disabled={spinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full font-serif-display font-bold text-white z-20 flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #a78bfa 0%, #8b5cf6 40%, #ec4899 100%)",
              border: "3px solid rgba(255,255,255,0.45)",
              boxShadow: "0 10px 28px rgba(0,0,0,0.5), 0 0 26px rgba(139,92,246,0.65), inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.35)",
            }}
            whileHover={{ scale: spinning ? 1 : 1.08 }}
            whileTap={{ scale: spinning ? 1 : 0.94 }}
          >
            {/* glossy highlight on button */}
            <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-4 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.35)", filter: "blur(2px)" }} />
            <span className="relative text-sm tracking-wide" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              {spinning ? "•••" : "SPIN"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* magical floating cloud result */}
      <AnimatePresence>
        {result && (
          <motion.div className="fixed inset-0 z-[85] flex items-center justify-center p-4" onClick={() => setResult(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div onClick={(e) => e.stopPropagation()} className="relative"
              initial={{ x: "60vw", y: -40, opacity: 0, scale: 0.7 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              exit={{ x: "-60vw", y: -60, opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 55, damping: 16 }}>
              <ParticleBurst count={20} />
              {/* cloud shape */}
              <div className="relative px-10 py-10 max-w-md text-center"
                style={{ background: "#fff", borderRadius: "50% 50% 46% 46% / 60% 60% 42% 42%", boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 60px rgba(196,181,253,0.5)" }}>
                <span className="absolute -left-6 top-10 w-16 h-16 bg-white rounded-full" />
                <span className="absolute -right-6 top-12 w-20 h-20 bg-white rounded-full" />
                <span className="absolute left-10 -top-5 w-20 h-20 bg-white rounded-full" />
                <span className="absolute right-12 -top-3 w-16 h-16 bg-white rounded-full" />
                <div className="relative">
                  <p className="font-hand text-2xl text-[#b4318a] mb-3">{result.emoji} {result.label}</p>
                  <p className="font-body text-[#3a2e4d] whitespace-pre-line leading-relaxed">
                    <Typewriter text={result.messages[Math.floor(Math.random() * result.messages.length)]} speed={7} />
                  </p>
                  <button data-testid="wheel-close" onClick={() => setResult(null)} className="mt-5 px-6 py-2 rounded-full text-white text-sm font-body" style={{ background: "linear-gradient(120deg,#8b5cf6,#ec4899)" }}>Let it float away ☁️</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
