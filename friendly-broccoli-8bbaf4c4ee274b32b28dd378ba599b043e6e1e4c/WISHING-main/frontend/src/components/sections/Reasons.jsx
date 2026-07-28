import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TWELVE_REASONS } from "../../data";
import { Typewriter, ParticleBurst } from "../Ambience";
import { Header } from "./Story";

const CARD_GRADS = [
  "linear-gradient(135deg,rgba(244,114,182,0.35),rgba(139,92,246,0.25))",
  "linear-gradient(135deg,rgba(139,92,246,0.35),rgba(96,165,250,0.25))",
  "linear-gradient(135deg,rgba(245,196,81,0.3),rgba(244,114,182,0.25))",
  "linear-gradient(135deg,rgba(96,165,250,0.3),rgba(196,181,253,0.25))",
];

export default function Reasons() {
  const [active, setActive] = useState(null);
  const reason = active !== null ? TWELVE_REASONS[active] : null;
  return (
    <section className="relative py-24 px-6" data-testid="reasons-section">
      <Header emoji="🌸" title="12 Reasons Why You're You" subtitle="Tap each little bloom to reveal a reason. 🌸" />

      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {TWELVE_REASONS.map((r, i) => (
          <motion.button key={i} data-testid={`reason-card-${i}`} onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 40, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ delay: (i % 4) * 0.06 + Math.floor(i / 4) * 0.05 }}
            whileHover={{ y: -8, scale: 1.05, boxShadow: "0 24px 50px rgba(236,72,153,0.4)" }}
            className="relative rounded-3xl p-6 aspect-square flex flex-col items-center justify-center glass overflow-hidden"
            style={{ background: CARD_GRADS[i % CARD_GRADS.length] }}>
            <span className="absolute top-2 left-3 text-xs opacity-70">✨</span>
            <span className="absolute bottom-2 right-3 text-sm opacity-70">🌷</span>
            <motion.span className="text-4xl mb-2" animate={{ y: [0, -5, 0] }} transition={{ duration: 3 + (i % 3), repeat: Infinity }}>{r.emoji}</motion.span>
            <span className="font-serif-display text-lg font-bold text-white text-center leading-tight">{r.trait}</span>
            <span className="font-body text-[11px] uppercase tracking-widest text-[#f5c451] mt-1">Reason #{i + 1}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {reason && (
          <motion.div className="fixed inset-0 z-[85] flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* full-screen close layer */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setActive(null)} data-testid="reasons-backdrop" />
            {/* glowing lights */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle,rgba(236,72,153,0.5),transparent 70%)" }} />
            <div className="pointer-events-none absolute inset-0"><ParticleBurst count={24} /></div>
            <motion.div onClick={(e) => e.stopPropagation()} className="relative z-10 text-center max-w-xl"
              initial={{ scale: 0.7, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}>
              <div className="text-6xl mb-4">{reason.emoji}</div>
              <p className="font-serif-display text-xs uppercase tracking-[0.3em] text-[#f5c451] mb-3">Reason #{active + 1} — {reason.trait}</p>
              <p className="font-serif-display text-2xl md:text-3xl text-white leading-relaxed text-glow">
                <Typewriter text={reason.text} speed={12} />
              </p>
              <button onClick={() => setActive(null)} data-testid="reasons-close" className="font-body text-xs text-[#a99fce] mt-8 underline underline-offset-4">tap anywhere to close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
