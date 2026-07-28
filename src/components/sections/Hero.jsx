import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ASSETS } from "../../data";

function HangingPhoto({ src, caption, delay, swing }) {
  return (
    <motion.div className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: "spring", stiffness: 50, damping: 12 }}>
      {/* pin */}
      <div className="w-3 h-3 rounded-full z-10" style={{ background: "radial-gradient(circle,#f5c451,#b8902f)", boxShadow: "0 0 10px #f5c451" }} />
      {/* thread + swinging frame */}
      <motion.div className="flex flex-col items-center origin-top"
        animate={{ rotate: [swing, -swing, swing] }} transition={{ duration: 4 + Math.abs(swing), repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}>
        <div className="w-[2px] h-10" style={{ background: "linear-gradient(rgba(245,196,81,0.8),rgba(245,196,81,0.3))" }} />
        <motion.div className="glass p-2.5 pb-8 rounded-2xl" whileHover={{ scale: 1.06, boxShadow: "0 24px 60px rgba(236,72,153,0.4)" }}>
          <img src={src} alt={caption} loading="lazy" decoding="async" className="w-32 sm:w-40 md:w-44 h-40 sm:h-48 md:h-56 object-cover rounded-lg" />
          <p className="font-hand text-lg text-center text-[#f5c451] mt-1">{caption}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const p = ASSETS.photos;
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-16 overflow-hidden" data-testid="hero-section">
      {["🎈", "🎈", "🎀"].map((b, i) => (
        <motion.div key={i} className="absolute text-4xl md:text-5xl opacity-80"
          style={{ left: `${8 + i * 32}%`, top: `${10 + (i % 2) * 20}%`, filter: "drop-shadow(0 0 12px rgba(244,114,182,0.5))" }}
          animate={{ y: [0, -22, 0], rotate: [-4, 4, -4] }} transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}>{b}</motion.div>
      ))}

      {/* hanging photos */}
      <div className="relative z-10 flex items-start justify-center gap-4 sm:gap-10 mb-12">
        <div className="mt-8"><HangingPhoto src={p[1].src} caption={p[1].caption} delay={0.4} swing={4} /></div>
        <div className="-mt-2 z-20"><HangingPhoto src={p[0].src} caption={p[0].caption} delay={0.2} swing={2.5} /></div>
        <div className="mt-10"><HangingPhoto src={p[2].src} caption={p[2].caption} delay={0.6} swing={-4} /></div>
      </div>

      {/* heading */}
      <motion.div className="relative z-10 text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1 }}>
        <motion.p className="font-hand text-2xl md:text-3xl text-[#f5c451] mb-1 gold-glow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>A surprise, made with love</motion.p>
        <h1 className="relative font-serif-display font-bold leading-[0.95] text-5xl sm:text-6xl lg:text-7xl inline-block"
          style={{ color: "#fff", WebkitTextStroke: "0.5px rgba(245,196,81,0.5)", textShadow: "0 0 40px rgba(245,196,81,0.4), 0 0 80px rgba(244,114,182,0.25)" }}>
          Happy <span className="grad-text">Birthday,</span>
          <br /> Kiddo! <span className="text-pink-400">❤️</span>
          {/* golden shine sweep */}
          <motion.span className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(105deg,transparent 40%,rgba(255,240,190,0.85) 50%,transparent 60%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", mixBlendMode: "overlay" }}
            animate={{ backgroundPositionX: ["-200%", "200%"] }} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }} />
        </h1>
        <motion.p className="font-body text-base md:text-lg text-[#c9c1ea] mt-6 max-w-xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1 }}>
          A little surprise made with lots of memories, smiles, and best wishes... just for you. ✨
        </motion.p>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#f5c451]" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <span className="font-body text-xs tracking-widest uppercase mb-1">scroll to begin</span>
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
