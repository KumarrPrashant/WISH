import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LETTERS, SECRET_LETTER } from "../../data";
import { Typewriter, ParticleBurst } from "../Ambience";
import { Header } from "./Story";

/* Storybook fairytale paper used by letters + secret letter */
function StorybookPaper({ children, title, emoji, color, wide = false }) {
  return (
    <div className={`relative rounded-[1.5rem] p-7 md:p-9 ${wide ? "max-w-2xl" : "max-w-lg"} w-full`}
      style={{ background: "radial-gradient(120% 120% at 50% 0%, #fffdf6 0%, #fdf3e6 55%, #f7e7d4 100%)", border: "1px solid #e8cfa6", boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(245,196,81,0.3)" }}>
      {/* floral border corners */}
      <div className="pointer-events-none absolute inset-2 rounded-[1.2rem]" style={{ border: "1.5px dashed rgba(199,142,90,0.5)" }} />
      <span className="absolute -top-3 -left-2 text-2xl">🌸</span>
      <span className="absolute -top-3 -right-2 text-2xl">🌷</span>
      <span className="absolute -bottom-3 -left-2 text-2xl">🌿</span>
      <span className="absolute -bottom-3 -right-2 text-2xl">🌼</span>
      {/* ribbon */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-body tracking-widest"
        style={{ background: "linear-gradient(120deg,#ec4899,#8b5cf6)", boxShadow: "0 6px 16px rgba(0,0,0,0.3)" }}>💌 LETTER</div>
      {title && (
        <div className="text-center mb-3 mt-2">
          {emoji && <div className="mx-auto w-11 h-11 rounded-full flex items-center justify-center text-xl mb-2" style={{ background: `linear-gradient(135deg,${color || "#f9a8d4"},#fff)` }}>{emoji}</div>}
          <h3 className="font-serif-display text-2xl font-bold text-[#5a3a1e]">{title}</h3>
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

function LuxEnvelope({ letter }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass"
      style={{ background: `linear-gradient(135deg, ${letter.color}33, rgba(28,20,58,0.55))` }}>
      <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 120%, ${letter.color}66, transparent 60%)` }} />
      {/* body lines */}
      <div className="absolute inset-x-3 bottom-3 top-1/2" style={{ background: `linear-gradient(${letter.color}22, transparent)`, borderRadius: 10 }} />
      {/* flap */}
      <div className="absolute inset-x-0 top-0 h-1/2 z-10" style={{ clipPath: "polygon(0 0,100% 0,50% 100%)", background: `linear-gradient(${letter.color}77, ${letter.color}33)`, borderBottom: "1px solid rgba(245,196,81,0.4)" }} />
      {/* wax seal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-lg z-20"
        style={{ background: "radial-gradient(circle,#e07d8c,#8f3d4c)", boxShadow: "0 4px 14px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)" }}>{letter.emoji}</div>
      <span className="absolute top-2 left-3 text-xs">✨</span>
      <span className="absolute bottom-2 right-3 text-xs">🌸</span>
      <p className="absolute bottom-3 left-0 right-0 font-hand text-lg text-[#f5c451] px-2 gold-glow z-20 text-center">{letter.label}</p>
    </div>
  );
}

export default function Letters() {
  const [open, setOpen] = useState(null);
  const letter = LETTERS.find((l) => l.id === open);
  return (
    <section className="relative py-24 px-6" data-testid="letters-section">
      <Header emoji="💌" title="Letters For Every Mood" subtitle="No matter what you're feeling, there's always a little letter waiting for you. 🤍" />

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {LETTERS.map((l, i) => (
          <motion.button key={l.id} data-testid={`envelope-${l.id}`} onClick={() => setOpen(l.id)}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.06 }} whileHover={{ y: -10, scale: 1.04, boxShadow: "0 26px 55px rgba(236,72,153,0.4)" }}
            className="rounded-2xl">
            <LuxEnvelope letter={l} />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {letter && (
          <motion.div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/65 backdrop-blur-lg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <ParticleBurst count={20} />
            <motion.div onClick={(e) => e.stopPropagation()} className="max-h-[86vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.4, y: 120, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, y: 120, rotate: 10 }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}>
              <StorybookPaper title={letter.title} emoji={letter.emoji} color={letter.color}>
                <p className="font-body text-[#3a2a15] whitespace-pre-line leading-relaxed text-[15px] md:text-base">
                  <Typewriter text={letter.body} speed={6} />
                </p>
                <button onClick={() => setOpen(null)} data-testid="close-letter"
                  className="mt-6 mx-auto block px-6 py-2.5 rounded-full font-body text-white text-sm"
                  style={{ background: "linear-gradient(120deg,#8b5cf6,#ec4899)" }}>Close Letter 🤍</button>
              </StorybookPaper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function SecretLetter() {
  const [revealed, setRevealed] = useState(false);
  return (
    <section className="relative py-24 px-6" data-testid="secret-section">
      <Header emoji="💖" title="Secret Letter" subtitle="Only open when you're ready... ❤️" />
      <div className="max-w-2xl mx-auto flex justify-center">
        {!revealed ? (
          <motion.button onClick={() => setRevealed(true)} data-testid="open-secret" className="relative"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} animate={{ y: [0, -10, 0] }} transition={{ y: { duration: 4, repeat: Infinity } }}>
            <div className="glass glass-gold rounded-3xl px-12 py-14 text-center relative">
              <div className="absolute -inset-3 rounded-[2rem] blur-2xl -z-10" style={{ background: "radial-gradient(circle,rgba(236,72,153,0.5),transparent 70%)" }} />
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3" style={{ background: "radial-gradient(circle,#e07d8c,#8f3d4c)" }}>💌</div>
              <p className="font-hand text-2xl text-[#f5c451] gold-glow">tap to unseal</p>
            </div>
          </motion.button>
        ) : (
          <motion.div className="relative w-full flex justify-center" initial={{ opacity: 0, scale: 0.7, y: 60, rotate: -8 }} animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 65, damping: 15 }}>
            <ParticleBurst count={18} />
            <StorybookPaper title="A Little Secret" emoji="💖" color="#f9a8d4" wide>
              <p className="font-body text-[#3a2a15] whitespace-pre-line leading-relaxed">
                <Typewriter text={SECRET_LETTER} speed={6} />
              </p>
            </StorybookPaper>
          </motion.div>
        )}
      </div>
    </section>
  );
}
