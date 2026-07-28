import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { WHEEL } from "../../data";
import { Typewriter, ParticleBurst } from "../Ambience";
import { Header } from "./Story";

const N = WHEEL.length;
const SEG = 360 / N;

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
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 text-3xl drop-shadow">📍</div>
          <div className="absolute -inset-4 rounded-full blur-2xl -z-10" style={{ background: "radial-gradient(circle,rgba(236,72,153,0.5),transparent 70%)" }} />
          <motion.div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full relative"
            style={{ background: gradient, border: "10px solid rgba(245,196,81,0.6)", boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(245,196,81,0.3)" }}
            animate={{ rotate: rotation, scale: spinning ? 1 : [1, 1.02, 1] }}
            transition={spinning ? { duration: 4.2, ease: [0.16, 1, 0.3, 1] } : { scale: { duration: 4, repeat: Infinity } }}>
            {WHEEL.map((w, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 origin-left text-lg" style={{ transform: `rotate(${i * SEG + SEG / 2}deg) translateX(28px)` }}>{w.emoji}</div>
            ))}
          </motion.div>
          <button data-testid="spin-button" onClick={spin} disabled={spinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full font-serif-display font-bold text-white z-10 glass glass-gold"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>{spinning ? "..." : "SPIN"}</button>
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
