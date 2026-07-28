import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, Sparkles, Calendar } from "lucide-react";
import { PASSWORD } from "../data";
import { ButterflyTransition } from "./Butterflies";

function StarField({ count = 70 }) {
  const parts = useRef(
    Array.from({ length: count }).map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      s: Math.random() * 2.2 + 0.6, d: Math.random() * 4 + 2, delay: Math.random() * 4,
    }))
  ).current;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {parts.map((p) => (
        <motion.span key={p.id} className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, boxShadow: "0 0 6px #fff" }}
          animate={{ opacity: [0.1, 1, 0.1] }} transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

function Nebula() {
  return (
    <>
      <motion.div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle,rgba(139,92,246,0.5),transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle,rgba(236,72,153,0.4),transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], y: [0, -40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.3),transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      {["🌸", "🌺", "🎈", "🎀", "🌷", "💫"].map((e, i) => (
        <motion.span key={i} className="absolute text-3xl" style={{ left: `${8 + i * 15}%`, top: `${15 + (i % 3) * 25}%`, filter: "drop-shadow(0 0 10px rgba(244,114,182,0.5))" }}
          animate={{ y: [0, -24, 0], rotate: [-8, 8, -8] }} transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}>{e}</motion.span>
      ))}
    </>
  );
}

function Curtain({ side, open }) {
  const strips = 9;
  return (
    <motion.div className="absolute top-0 bottom-0 w-[52%] z-30 flex" style={{ [side]: 0, transformOrigin: side }}
      initial={{ x: 0 }} animate={{ x: open ? (side === "left" ? "-108%" : "108%") : 0 }}
      transition={{ type: "spring", stiffness: 34, damping: 14, mass: 1.4, delay: 0.1 }}>
      {Array.from({ length: strips }).map((_, i) => (
        <motion.div key={i} className="h-full flex-1 relative"
          style={{ background: "linear-gradient(90deg, #3d0512 0%, #7a1226 35%, #a01a33 50%, #6e1022 65%, #3d0512 100%)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.55)" }}
          animate={open ? {} : { scaleX: [1, 0.94, 1.03, 1], skewY: [0, 0.6, -0.6, 0] }}
          transition={{ duration: 4 + i * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(255,215,120,0.06),transparent 40%,rgba(0,0,0,0.2))" }} />
        </motion.div>
      ))}
      <div className="absolute top-0 left-0 right-0 h-10" style={{ background: "linear-gradient(#f0d27a,#b8902f)", clipPath: "polygon(0 0,100% 0,100% 60%,92% 100%,84% 60%,76% 100%,68% 60%,60% 100%,52% 60%,44% 100%,36% 60%,28% 100%,20% 60%,12% 100%,4% 60%,0 100%)" }} />
      <div className={`absolute top-0 bottom-0 ${side === "left" ? "right-0" : "left-0"} w-2`} style={{ background: "linear-gradient(#f0d27a,#b8902f,#f0d27a)", boxShadow: "0 0 14px rgba(245,196,81,0.5)" }} />
    </motion.div>
  );
}

export default function Intro({ onUnlock, onMusicStart }) {
  const [stage, setStage] = useState("loader"); // loader | lock | name
  const [open, setOpen] = useState(false);
  const [butterflies, setButterflies] = useState(false);
  const [lockReady, setLockReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== "loader") return;
    const id = setInterval(() => {
      setProgress((p) => { if (p >= 100) { clearInterval(id); setTimeout(() => setStage("lock"), 400); return 100; } return p + 4; });
    }, 40);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage !== "lock") return;
    const t1 = setTimeout(() => setOpen(true), 1400);
    const t2 = setTimeout(() => setButterflies(true), 3200);
    return () => [t1, t2].forEach(clearTimeout);
  }, [stage]);

  const submit = (e) => {
    e.preventDefault();
    if (value.replace(/\D/g, "") === PASSWORD) {
      onMusicStart && onMusicStart();
      setTimeout(() => setStage("name"), 500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 900);
    }
  };

  return (
    <div className="fixed inset-0 z-[100]" style={{ background: "#05040f" }}>
      <AnimatePresence>
        {stage === "loader" && (
          <motion.div key="loader" className="absolute inset-0 flex flex-col items-center justify-center cosmic-bg" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
            <StarField count={50} /><Nebula />
            <motion.div className="relative w-24 h-24 mb-8" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#f472b6] border-r-[#c4b5fd] blur-[1px]" />
              <Sparkles className="absolute inset-0 m-auto text-[#f5c451]" size={26} />
            </motion.div>
            <p className="font-hand text-3xl grad-text mb-6">Preparing your surprise...</p>
            <div className="w-56 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#f472b6,#c4b5fd,#f5c451)" }} animate={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}

        {stage === "lock" && (
          <motion.div key="lock" className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <div className="absolute inset-0 cosmic-bg flex items-center justify-center p-6">
              <StarField count={80} /><Nebula />
              <motion.form onSubmit={submit}
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: lockReady ? 1 : 0, y: lockReady ? 0 : 20 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="glass glass-gold rounded-[2rem] px-8 py-10 w-full max-w-md text-center relative z-10" data-testid="password-card">
                <motion.div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center relative"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Lock className="text-white" size={26} />
                </motion.div>
                <h1 className="font-serif-display text-2xl sm:text-3xl grad-text mb-2">✨ A Little Birthday Surprise Awaits... ✨</h1>
                <p className="font-body text-sm text-[#c9c1ea] mb-7 px-2">
                  Enter your Date of Birth to unlock a special surprise made just for you. <Heart className="inline text-pink-400 fill-pink-400" size={14} />
                </p>
                <motion.div animate={error ? { x: [-10, 10, -8, 8, 0] } : {}} transition={{ duration: 0.5 }} className="relative">
                  <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused ? "text-[#f5c451]" : "text-[#8b7fb8]"}`} size={18} />
                  <label className={`absolute left-11 font-body pointer-events-none transition-all duration-300 ${focused || value ? "top-1 text-[10px] tracking-widest text-[#f5c451]" : "top-1/2 -translate-y-1/2 text-sm text-[#8b7fb8]"}`}>DATE OF BIRTH (DDMMYYYY)</label>
                  <input data-testid="password-input" value={value} onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} inputMode="numeric"
                    className={`w-full text-center tracking-[0.3em] font-body text-lg rounded-2xl pt-5 pb-2 pl-11 pr-4 bg-white/5 text-white outline-none transition-all duration-300 border ${error ? "border-red-400 shadow-[0_0_25px_rgba(248,113,113,0.5)]" : focused ? "border-[#f5c451] shadow-[0_0_28px_rgba(245,196,81,0.4)]" : "border-white/15"}`} />
                </motion.div>
                {error && <p className="text-pink-300 text-xs mt-2 font-body">Oops! That&apos;s not the magic date 🥺 try again</p>}
                <motion.button data-testid="unlock-button" type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="mt-6 w-full py-3.5 rounded-2xl font-body font-semibold text-white relative overflow-hidden"
                  style={{ background: "linear-gradient(120deg,#8b5cf6,#ec4899,#f5c451)", boxShadow: "0 10px 30px rgba(139,92,246,0.5)" }}>
                  <motion.span className="absolute inset-0" style={{ background: "linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)" }}
                    animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
                  <span className="relative">Unlock My Surprise</span>
                </motion.button>
              </motion.form>
            </div>

            {!open && <StarField count={40} />}
            <Curtain side="left" open={open} />
            <Curtain side="right" open={open} />
            {butterflies && !lockReady && <ButterflyTransition onDone={() => setLockReady(true)} />}
          </motion.div>
        )}

        {stage === "name" && <NameReveal key="name" onDone={onUnlock} />}
      </AnimatePresence>
    </div>
  );
}

function NameReveal({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 1900),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 6300),
      setTimeout(() => onDone(), 7600),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);
  const rest = "RSHIA".split("");
  return (
    <motion.div className="absolute inset-0 cosmic-bg flex flex-col items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <StarField count={110} /><Nebula />
      {[0, 1, 2, 3].map((i) => (
        <motion.div key={i} className="absolute h-[2px] w-[70vw] blur-[1px]"
          style={{ background: "linear-gradient(90deg,transparent,#f5c451,#f472b6,#c4b5fd,transparent)", top: `${38 + i * 7}%` }}
          animate={{ x: ["-70%", "70%"], opacity: [0, 0.9, 0] }} transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      {phase >= 2 && Array.from({ length: 30 }).map((_, i) => (
        <motion.span key={i} className="absolute rounded-full"
          style={{ width: 5, height: 5, background: ["#f5c451", "#f472b6", "#c4b5fd", "#fff"][i % 4], boxShadow: "0 0 10px currentColor" }}
          initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: Math.cos(i) * 300, y: Math.sin(i) * 300, opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, delay: 0.1, ease: "easeOut" }} />
      ))}
      <motion.div className="relative flex items-center" animate={phase === 4 ? { scale: 1.5, opacity: 0, filter: "blur(24px)" } : { scale: 1 }} transition={{ duration: 1.4, ease: "easeInOut" }}>
        {phase === 3 && (
          <motion.div className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.9) 50%,transparent 60%)", mixBlendMode: "overlay" }}
            initial={{ x: "-120%" }} animate={{ x: "120%" }} transition={{ duration: 1, ease: "easeInOut" }} />
        )}
        <motion.span className="font-serif-display font-bold grad-gold"
          style={{ fontSize: "clamp(80px,18vw,240px)", textShadow: "0 0 90px rgba(245,196,81,0.9),0 0 40px rgba(244,114,182,0.6)" }}
          initial={{ scale: 3, opacity: 0, filter: "blur(30px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.7, ease: "easeOut" }}>A</motion.span>
        <div className="flex overflow-hidden">
          {rest.map((ch, i) => (
            <motion.span key={i} className="font-serif-display font-bold grad-gold"
              style={{ fontSize: "clamp(80px,18vw,240px)", textShadow: "0 0 80px rgba(244,114,182,0.8)" }}
              initial={{ opacity: 0, x: -90, scale: 0.3 }} animate={phase >= 1 ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.14 * i, type: "spring", stiffness: 90, damping: 14 }}>{ch}</motion.span>
          ))}
        </div>
      </motion.div>
      <motion.p className="font-hand text-2xl md:text-3xl text-[#f5c451] mt-8 text-center px-6 gold-glow relative z-10"
        initial={{ opacity: 0, y: 20 }} animate={phase >= 2 && phase < 4 ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ duration: 1 }}>
        ✨ Welcome to a little universe created especially for your birthday. ✨
      </motion.p>
    </motion.div>
  );
}
