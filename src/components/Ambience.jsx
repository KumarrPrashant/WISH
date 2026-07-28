import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ASSETS } from "../data";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---------------- Living cosmic background ---------------- */
const EMO = ["🌸", "🦋", "✨", "🎈", "🌷", "⭐", "🍃", "🎀"];

export function LivingBackground({ dense = true }) {
  const stars = useRef(
    Array.from({ length: dense ? 90 : 40 }).map((_, i) => ({
      id: i,
      x: rand(0, 100),
      y: rand(0, 100),
      s: rand(1, 2.6),
      delay: rand(0, 5),
      dur: rand(2, 5),
    }))
  ).current;

  const floaters = useRef(
    Array.from({ length: dense ? 18 : 10 }).map((_, i) => ({
      id: i,
      emoji: EMO[i % EMO.length],
      left: rand(0, 100),
      size: rand(14, 30),
      delay: rand(0, 10),
      dur: rand(20, 40),
      drift: rand(-40, 40),
      op: rand(0.3, 0.7),
    }))
  ).current;

  return (
    <div className="fixed inset-0 -z-20 cosmic-bg overflow-hidden pointer-events-none">
      {/* nebula blobs */}
      <motion.div
        className="absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.45), transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.35), transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, 70, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-[640px] h-[640px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.4), transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, -50, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* stars */}
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* floating decor */}
      {floaters.map((it) => (
        <motion.span
          key={`f${it.id}`}
          className="absolute select-none"
          style={{ left: `${it.left}%`, fontSize: it.size, opacity: it.op, bottom: -50, filter: "drop-shadow(0 0 8px rgba(180,160,255,0.5))" }}
          animate={{ y: [0, -(typeof window !== "undefined" ? window.innerHeight : 900) - 120], x: [0, it.drift, 0], rotate: [0, 25, -15, 0] }}
          transition={{ duration: it.dur, delay: it.delay, repeat: Infinity, ease: "linear" }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/* ---------------- Cinematic media flow (row-based motion tracks) ---------------- */
/* Videos in the background flow use poster frames (first frame) instead of
   live playback — they're blurred decorative elements, so full video
   playback here wastes GPU/memory and competes with the main Videos section. */
function Track({ items, y, dur, direction = 1, diagonal = false, size = 190, blur = 3, op = 0.3 }) {
  const doubled = [...items, ...items];
  return (
    <motion.div
      className="absolute flex gap-10"
      style={{ top: `${y}%`, left: 0, filter: `blur(${blur}px)`, opacity: op, willChange: "transform" }}
      animate={{ x: direction > 0 ? ["-50%", "0%"] : ["0%", "-50%"], y: diagonal ? [0, -40, 0] : 0 }}
      transition={{ x: { duration: dur, repeat: Infinity, ease: "linear" }, y: { duration: dur / 2, repeat: Infinity, ease: "easeInOut" } }}
    >
      {doubled.map((m, i) => (
        <div key={i} className="rounded-2xl overflow-hidden flex-shrink-0 bg-black/20"
          style={{ width: size, transform: `rotate(${diagonal ? (i % 2 ? 6 : -6) : 0}deg)`, boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
          <img src={m.src} alt="" loading="lazy" decoding="async" className="w-full h-44 object-cover" style={{ objectPosition: m.objectPos || "center 25%" }} />
        </div>
      ))}
    </motion.div>
  );
}

export function MediaFlow() {
  // Use only photos for the background flow — videos here are decorative
  // and blurred, so playing them wastes resources. Photos look identical
  // at blur(3-5px) opacity 0.2-0.26 and cost zero video decode overhead.
  const imgs = ASSETS.photos.map((p) => ({ type: "img", src: p.src, objectPos: p.objectPos }));
  const row1 = [imgs[0], imgs[2], imgs[4], imgs[1]];
  const row2 = [imgs[1], imgs[3], imgs[0], imgs[2]];
  const row3 = [imgs[2], imgs[4], imgs[1], imgs[3]];
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <Track items={row1} y={6} dur={65} direction={1} size={210} blur={4} op={0.26} />
      <Track items={row2} y={40} dur={80} direction={-1} diagonal size={180} blur={3} op={0.24} />
      <Track items={row3} y={72} dur={95} direction={1} size={200} blur={5} op={0.2} />
    </div>
  );
}

/* ---------------- Typewriter (fast, elegant) ---------------- */
export function Typewriter({ text, speed = 9, className = "", onDone }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const step = Math.max(1, Math.round(text.length / 400)); // reveal multiple chars for long text
    const id = setInterval(() => {
      i += step;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);
  return (
    <span className={className}>
      {shown}
      <span className="inline-block w-[2px] h-[1em] align-middle bg-current ml-0.5 animate-pulse" />
    </span>
  );
}

/* ---------------- Curved section divider ---------------- */
export function Divider({ flip = false, color = "rgba(139,92,246,0.12)" }) {
  return (
    <div className="w-full leading-[0] -mb-1 relative z-[1]" style={{ transform: flip ? "scaleY(-1)" : "none" }}>
      <svg viewBox="0 0 1440 120" className="w-full h-[70px]" preserveAspectRatio="none">
        <path
          d="M0,64 C240,120 480,0 720,48 C960,96 1200,20 1440,64 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/* ---------------- Magical particle burst (for focus effects) ---------------- */
export function ParticleBurst({ count = 16 }) {
  const parts = useRef(
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: rand(-120, 120),
      y: rand(-120, 120),
      s: rand(3, 7),
      d: rand(1.4, 2.8),
      delay: rand(0, 1),
      c: ["#f5c451", "#f472b6", "#c4b5fd", "#fff"][i % 4],
    }))
  ).current;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {parts.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.s, height: p.s, background: p.c, boxShadow: `0 0 10px ${p.c}` }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
