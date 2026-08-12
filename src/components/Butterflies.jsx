import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PALETTE = [
  ["#f9a8d4", "#ec4899"],
  ["#c4b5fd", "#8b5cf6"],
  ["#fde68a", "#f5c451"],
  ["#a5b4fc", "#6366f1"],
];

/* One large elegant butterfly with glowing edges.
   GPU-optimised: the only animated property is transform (scaleX)
   on a <g> element with will-change set. */
const Butterfly = memo(function Butterfly({ size = 120, colors = PALETTE[0], flapDur = 0.42 }) {
  const [c1, c2] = colors;
  const gid = useRef(`bw${c2.slice(1)}-${Math.random().toString(36).slice(2, 7)}`).current;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120"
      style={{ filter: `drop-shadow(0 0 14px ${c1}) drop-shadow(0 0 4px #fff)`, willChange: "transform" }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="40%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      {/* wings flap via scaleX only — GPU-composited transform */}
      <motion.g
        animate={{ scaleX: [1, 0.3, 1] }}
        transition={{ duration: flapDur, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "60px 60px", willChange: "transform" }}>
        {/* left upper */}
        <path d="M60 60 C24 8 -6 30 18 54 C-6 66 30 92 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.96" />
        {/* left lower */}
        <path d="M60 60 C30 78 12 100 38 108 C56 112 60 82 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.9" />
        {/* right upper */}
        <path d="M60 60 C96 8 126 30 102 54 C126 66 90 92 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.96" />
        {/* right lower */}
        <path d="M60 60 C90 78 108 100 82 108 C64 112 60 82 60 60" fill={`url(#${gid})`} stroke="#fff" strokeWidth="0.6" opacity="0.9" />
        {/* sparkle dots */}
        <circle cx="34" cy="40" r="3" fill="#fff" opacity="0.8" />
        <circle cx="86" cy="40" r="3" fill="#fff" opacity="0.8" />
      </motion.g>
      {/* body — static, no animation overhead */}
      <ellipse cx="60" cy="62" rx="3.4" ry="20" fill="#2a1a3d" />
      <circle cx="60" cy="40" r="5" fill="#2a1a3d" />
      <path d="M60 36 C56 26 52 24 50 26" stroke="#2a1a3d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M60 36 C64 26 68 24 70 26" stroke="#2a1a3d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
});

/*
  Premium cinematic butterfly transition (GPU-optimised, 60 FPS):
  - 3 large butterflies fly across with natural easing (bezier curves)
  - Each uses ONLY transform + opacity (GPU-composited, no layout thrash)
  - Final butterfly zooms toward camera with a smooth ease-out
  - Glow bloom smooths the cut
  - Calls onDone exactly once when the zoom completes
*/
const FLYERS = [
  { colors: PALETTE[0], size: 130, startY: 24, fromLeft: true,  dur: 1.52, delay: 0,    wobble: 60 },
  { colors: PALETTE[1], size: 150, startY: 62, fromLeft: false, dur: 1.61, delay: 0.22, wobble: 80 },
  { colors: PALETTE[2], size: 120, startY: 44, fromLeft: true,  dur: 1.52, delay: 0.49, wobble: 70 },
];

// Natural easing: slow start, graceful middle, gentle settle
const EASE_NATURAL = [0.25, 0.1, 0.25, 1];
// Deceleration easing for the zoom: fast approach, slow fill
const EASE_ZOOM = [0.33, 0.0, 0.0, 1];

export function ButterflyTransition({ onDone }) {
  const [phase, setPhase] = useState("fly"); // fly -> zoom -> done
  const doneRef = useRef(false);
  const timerRef = useRef(null);

  const fireDone = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("done");
    onDone && onDone();
  }, [onDone]);

  // Fire onDone slightly before the zoom completes so videos begin
  // fading in while the glow bloom is still visible — seamless overlap.
  useEffect(() => {
    timerRef.current = setTimeout(fireDone, 1780);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [fireDone]);

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {phase === "fly" && FLYERS.map((f, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${f.startY}%`,
              left: f.fromLeft ? "-12%" : "112%",
              willChange: "transform, opacity",
              filter: "blur(0.4px)",
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              x: f.fromLeft ? ["0vw", "124vw"] : ["0vw", "-124vw"],
              y: [0, -f.wobble, f.wobble * 0.6, 0],
              opacity: [0, 1, 1, 0.85],
            }}
            transition={{
              duration: f.dur,
              delay: f.delay,
              ease: EASE_NATURAL,
              times: [0, 0.15, 0.7, 1],
            }}>
            <motion.div
              style={{
                transform: f.fromLeft ? "none" : "scaleX(-1)",
                willChange: "transform",
              }}
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
              <Butterfly size={f.size} colors={f.colors} />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* final butterfly zooms into camera as a mask */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          willChange: "transform, opacity",
          filter: "blur(0.5px)",
          x: "-50%",
          y: "-50%",
        }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.1, 22], opacity: [0, 1, 1] }}
        transition={{
          duration: 1.34,
          delay: 0.89,
          times: [0, 0.4, 1],
          ease: EASE_ZOOM,
        }}
        onAnimationComplete={fireDone}>
        <Butterfly size={220} colors={PALETTE[3]} flapDur={0.5} />
      </motion.div>

      {/* soft glow bloom near the end to smooth the fade */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(196,181,253,0.9), rgba(139,92,246,0.5) 40%, transparent 75%)",
          willChange: "opacity",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.85, 0] }}
        transition={{
          duration: 1.34,
          delay: 0.89,
          times: [0, 0.4, 0.7, 1],
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
