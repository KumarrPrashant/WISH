import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { FINALE_MESSAGE, FINALE_SIGNATURE } from "../../data";
import { ParticleBurst } from "../Ambience";

function GiftBox({ opened, onOpen }) {
  return (
    <motion.button data-testid="gift-box" onClick={onOpen} disabled={opened} className="relative"
      whileHover={!opened ? { scale: 1.05 } : {}} whileTap={!opened ? { scale: 0.95 } : {}}
      animate={!opened ? { y: [0, -10, 0] } : {}} transition={{ y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}>
      <div className="absolute -inset-10 rounded-full blur-3xl -z-10" style={{ background: "radial-gradient(circle,rgba(245,196,81,0.5),rgba(236,72,153,0.3),transparent 70%)" }} />
      {opened && <ParticleBurst count={26} />}
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="boxG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#db2777" /></linearGradient>
          <linearGradient id="lidG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f9a8d4" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
        </defs>
        {/* box body */}
        <rect x="45" y="90" width="110" height="90" rx="8" fill="url(#boxG)" />
        <rect x="92" y="90" width="16" height="90" fill="#f5c451" opacity="0.9" />
        {/* lid (lifts on open) */}
        <motion.g animate={opened ? { y: -60, rotate: -12, opacity: 0 } : { y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ transformOrigin: "100px 80px" }}>
          <rect x="38" y="66" width="124" height="30" rx="8" fill="url(#lidG)" />
          <rect x="92" y="66" width="16" height="30" fill="#f5c451" />
          {/* bow */}
          <circle cx="100" cy="62" r="7" fill="#f5c451" />
          <path d="M100 62 C80 45 70 60 88 66 Z" fill="#f5c451" />
          <path d="M100 62 C120 45 130 60 112 66 Z" fill="#f5c451" />
        </motion.g>
      </svg>
      {!opened && <p className="font-hand text-2xl text-[#f5c451] gold-glow mt-2">tap to open your gift 🎁</p>}
    </motion.button>
  );
}

function MiniCake() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="mx-auto">
      <rect x="24" y="26" width="6" height="16" rx="3" fill="#8b5cf6" />
      <motion.ellipse cx="27" cy="22" rx="3.5" ry="7" fill="#ffb347" animate={{ scaleY: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ transformOrigin: "center bottom" }} />
      <rect x="18" y="42" width="54" height="18" rx="6" fill="#ffe3f0" stroke="#f3b8d0" />
      <rect x="12" y="58" width="66" height="22" rx="8" fill="#f6d9ff" stroke="#c99ad8" />
      <ellipse cx="45" cy="82" rx="40" ry="5" fill="#e6c6a8" />
    </svg>
  );
}

function ChibiCouple() {
  return (
    <svg width="150" height="90" viewBox="0 0 150 90" className="mx-auto">
      {/* figure 1 */}
      <circle cx="55" cy="30" r="14" fill="#3a2a4d" />
      <path d="M40 82 Q40 52 55 52 Q70 52 70 82 Z" fill="#3a2a4d" />
      {/* figure 2 */}
      <circle cx="95" cy="30" r="14" fill="#4a2f5e" />
      <path d="M80 82 Q80 52 95 52 Q110 52 110 82 Z" fill="#4a2f5e" />
      {/* heart between */}
      <motion.text x="75" y="30" textAnchor="middle" fontSize="18" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ transformOrigin: "center" }}>❤️</motion.text>
    </svg>
  );
}

export default function Finale() {
  const [opened, setOpened] = useState(false);
  return (
    <section className="relative py-28 px-6 text-center overflow-hidden" data-testid="finale-section">
      {opened && <Confetti recycle={false} numberOfPieces={400} gravity={0.18} colors={["#f472b6", "#8b5cf6", "#f5c451", "#c4b5fd", "#fff"]} />}
      <motion.h2 className="font-serif-display text-4xl sm:text-6xl font-bold grad-gold gold-glow mb-3"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
        ✨ GRAND FINALE ✨
      </motion.h2>

      <div className="max-w-2xl mx-auto flex flex-col items-center mt-8">
        {!opened && <GiftBox opened={opened} onOpen={() => setOpened(true)} />}

        <AnimatePresence>
          {opened && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9 }}>
              {/* blooming flowers */}
              {["🌸", "🌺", "🌼", "🌷", "💐"].map((f, i) => (
                <motion.span key={i} className="absolute text-3xl" style={{ left: `${12 + i * 18}%`, top: `${20 + (i % 2) * 40}%` }}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: [0, 12, -12, 0] }} transition={{ delay: 0.2 + i * 0.12, duration: 1.4, repeat: Infinity, repeatType: "reverse" }}>{f}</motion.span>
              ))}
              <div className="glass glass-gold rounded-3xl p-8 md:p-10 relative">
                <p className="font-serif-display text-2xl md:text-3xl font-bold text-white text-glow whitespace-pre-line leading-relaxed">
                  {FINALE_MESSAGE}
                </p>
                <div className="my-6"><MiniCake /></div>
                <ChibiCouple />
                <p className="font-hand text-3xl text-[#f5c451] gold-glow mt-4">{FINALE_SIGNATURE}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
