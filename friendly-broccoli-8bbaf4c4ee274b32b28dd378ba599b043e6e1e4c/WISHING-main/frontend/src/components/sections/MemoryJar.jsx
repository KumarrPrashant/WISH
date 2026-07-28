import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEMORIES } from "../../data";
import { Typewriter, ParticleBurst } from "../Ambience";
import { Header } from "./Story";

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
                initial={{ opacity: 0, x: -80, scale: 0.7, rotate: -4 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}>
                {i === revealed.length - 1 && <ParticleBurst count={12} />}
                <div className="rounded-2xl p-6 relative" style={{ background: "linear-gradient(#fbf3e0,#f3e6c8)", boxShadow: "0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(245,196,81,0.2)", border: "1px solid #e6cfa0" }}>
                  <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>{i + 1}</span>
                  <p className="font-body text-[15px] md:text-lg text-[#3a2e18] leading-relaxed">
                    {i === revealed.length - 1 ? <Typewriter text={mem} speed={7} /> : mem}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {count === 0 && <p className="font-body text-[#a99fce] text-center py-8">The jar is full of little memories... tap it to let them out. ✨</p>}
        </div>
      </div>
    </section>
  );
}
