import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PALETTE = [
  ["#f9a8d4", "#ec4899"],
  ["#c4b5fd", "#8b5cf6"],
  ["#fde68a", "#f5c451"],
  ["#a5b4fc", "#6366f1"],
];

/* One large elegant butterfly with glowing edges */
export function Butterfly({ size = 120, colors = PALETTE[0], flapDur = 0.42 }) {
  const [c1, c2] = colors;
  const gid = `bw${c2.slice(1)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120"
      style={{ filter: `drop-shadow(0 0 14px ${c1}) drop-shadow(0 0 4px #fff)` }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="40%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      <motion.g animate={{ scaleX: [1, 0.28, 1] }} transition={{ duration: flapDur, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "60px 60px" }}>
        {/* left */}
        <path d="M60 60 C24 8 -6 30 18 54 C-6 66 30 92 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.96" />
        <path d="M60 60 C30 78 12 100 38 108 C56 112 60 82 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.9" />
        {/* right */}
        <path d="M60 60 C96 8 126 30 102 54 C126 66 90 92 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.96" />
        <path d="M60 60 C90 78 108 100 82 108 C64 112 60 82 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.9" />
        {/* wing sparkle dots */}
        <circle cx="34" cy="40" r="3" fill="#fff" opacity="0.8" />
        <circle cx="86" cy="40" r="3" fill="#fff" opacity="0.8" />
      </motion.g>
      <ellipse cx="60" cy="62" rx="3.4" ry="20" fill="#2a1a3d" />
      <circle cx="60" cy="40" r="5" fill="#2a1a3d" />
      <path d="M60 36 C56 26 52 24 50 26" stroke="#2a1a3d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M60 36 C64 26 68 24 70 26" stroke="#2a1a3d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/*
 Premium cinematic butterfly transition:
 - a few LARGE butterflies gracefully fly across
 - the final butterfly flies toward the camera and zooms until wings fill the screen
 - fades into the next scene (acts as a mask). Calls onDone at the end.
*/
export function ButterflyTransition({ onDone }) {
  const [phase, setPhase] = useState("fly"); // fly -> zoom -> done

  const flyers = [
    { colors: PALETTE[0], size: 130, startY: 24, endY: 40, fromLeft: true, dur: 2.6, delay: 0, wobble: 60 },
    { colors: PALETTE[1], size: 150, startY: 62, endY: 48, fromLeft: false, dur: 2.8, delay: 0.4, wobble: 80 },
    { colors: PALETTE[2], size: 120, startY: 44, endY: 30, fromLeft: true, dur: 2.6, delay: 0.9, wobble: 70 },
  ];

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {phase === "fly" && flyers.map((f, i) => (
          <motion.div key={i} className="absolute" style={{ top: `${f.startY}%`, left: f.fromLeft ? "-12%" : "112%", filter: "blur(0.4px)" }}
            initial={{ opacity: 0 }}
            animate={{ x: f.fromLeft ? ["0vw", "124vw"] : ["0vw", "-124vw"], y: [0, -f.wobble, f.wobble * 0.6, 0], opacity: [0, 1, 1, 0.9] }}
            transition={{ duration: f.dur, delay: f.delay, ease: "easeInOut" }}>
            <motion.div style={{ transform: f.fromLeft ? "none" : "scaleX(-1)" }}
              animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
              <Butterfly size={f.size} colors={f.colors} />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* final butterfly zooms into camera as a mask */}
      <motion.div className="absolute left-1/2 top-1/2"
        initial={{ x: "-50%", y: "-50%", scale: 0.2, opacity: 0 }}
        animate={{ x: "-50%", y: "-50%", scale: [0.2, 1.1, 22], opacity: [0, 1, 1] }}
        transition={{ duration: 2.4, delay: 1.6, times: [0, 0.4, 1], ease: [0.6, 0, 0.4, 1] }}
        onAnimationComplete={() => { setPhase("done"); onDone && onDone(); }}
        style={{ filter: "blur(0.5px)" }}>
        <Butterfly size={220} colors={PALETTE[3]} flapDur={0.5} />
      </motion.div>

      {/* soft glow bloom near the end to smooth the fade */}
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(196,181,253,0.9), rgba(139,92,246,0.5) 40%, transparent 75%)" }}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 0.85, 0] }}
        transition={{ duration: 2.4, delay: 1.6, times: [0, 0.6, 0.85, 1] }} />
    </div>
  );
}
