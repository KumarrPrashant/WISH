import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEMORY_VIDEOS } from "../../data-videos";
import { Header } from "./Story";

const SPARK_COLORS = ["#f5c451", "#ffffff", "#f9a8d4", "#c4b5fd"];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---- Lightweight floating decorations (CSS-driven, GPU-friendly) ---- */
function DecorField({ count = 14 }) {
  const items = useRef(
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: rand(2, 98),
      y: rand(5, 95),
      s: rand(2, 5),
      dur: rand(3, 7),
      delay: rand(0, 4),
      emoji: ["✦", "♡", "⭐", "·", "✧"][i % 5],
    }))
  ).current;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((it) => (
        <motion.span
          key={it.id}
          className="absolute"
          style={{ left: `${it.x}%`, top: `${it.y}%`, fontSize: it.s + 8, color: SPARK_COLORS[it.id % SPARK_COLORS.length], textShadow: `0 0 8px ${SPARK_COLORS[it.id % SPARK_COLORS.length]}` }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -30, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{ duration: it.dur, delay: it.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/* ---- Main website section (decorated CTA card) ---- */
export default function CreatedForArshia({ onEnter }) {
  return (
    <section className="relative py-24 px-6" data-testid="created-for-arshia-section">
      <Header emoji="♡" title="Created For Arshia, With Love" subtitle="10 little moments, made just for you." />

      <div className="max-w-3xl mx-auto relative">
        <DecorField count={16} />

        <motion.div
          className="relative crystal-glass rounded-3xl px-8 py-14 md:px-16 md:py-20 text-center overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* glowing border accents */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(245,196,81,0.6), rgba(244,114,182,0.5), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,181,253,0.5), rgba(245,196,81,0.5), transparent)" }} />

          {/* soft glow behind */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-50" style={{ background: "radial-gradient(circle at 50% 40%, rgba(139,92,246,0.3), rgba(236,72,153,0.2), transparent 70%)" }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-2xl">✦</span>
          </motion.div>

          <h3 className="font-serif-display text-3xl md:text-5xl font-bold mb-3 grad-text">
            Created For Arshia, With Love ♡
          </h3>
          <p className="font-hand text-2xl md:text-3xl text-[#f5c451] gold-glow mb-10">
            10 little moments, made just for you.
          </p>

          {/* preview thumbnails strip */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap max-w-md mx-auto">
            {MEMORY_VIDEOS.slice(0, 5).map((v, i) => (
              <motion.div
                key={i}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl glass glass-gold flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" } }}
                animate={{ y: [0, -6, 0] }}
              >
                <span className="font-body text-xs text-[#c4b5fd]">0{i + 1}</span>
              </motion.div>
            ))}
          </div>

          {/* Enter CTA */}
          <motion.button
            onClick={onEnter}
            data-testid="enter-memories"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(139,92,246,0.5), 0 0 40px rgba(236,72,153,0.3)" }}
            whileTap={{ scale: 0.96 }}
            className="relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl glass glass-gold font-body text-lg text-[#f5edd6] tracking-wide"
            animate={{ boxShadow: ["0 10px 40px rgba(139,92,246,0.25), 0 0 30px rgba(245,196,81,0.15)", "0 10px 40px rgba(139,92,246,0.4), 0 0 40px rgba(245,196,81,0.25)", "0 10px 40px rgba(139,92,246,0.25), 0 0 30px rgba(245,196,81,0.15)"] }}
            transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          >
            <span className="text-xl">✦</span>
            Enter The Memories
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
