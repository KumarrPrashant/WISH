import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ASSETS } from "../../data";
import { Header } from "./Story";
import LazyVideo from "../LazyVideo";
import { ButterflyTransition } from "../Butterflies";

const SHAPES = [
  { name: "blob", radius: "60% 40% 55% 45% / 50% 60% 40% 50%" },
  { name: "cloud", radius: "50% 50% 45% 45% / 62% 62% 40% 40%" },
  { name: "rounded", radius: "26px" },
  { name: "petal", radius: "45% 45% 45% 45% / 55% 55% 45% 45%" },
];

function HangingFrame({ v, i, threadLen, swing, show }) {
  const shape = SHAPES[i % SHAPES.length];
  return (
    <motion.div className="relative flex flex-col items-center flex-shrink-0"
      initial={{ opacity: 0, y: -60 }} animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, type: "spring", stiffness: 55, damping: 12 }}>
      <div className="w-2.5 h-2.5 rounded-full z-10" style={{ background: "radial-gradient(circle,#f5c451,#b8902f)", boxShadow: "0 0 10px #f5c451" }} />
      <motion.div className="flex flex-col items-center"
        animate={{ rotate: [swing, -swing, swing] }} transition={{ duration: 4.5 + i, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}>
        <div style={{ width: 2, height: threadLen, background: "linear-gradient(rgba(245,196,81,0.85),rgba(245,196,81,0.25))" }} />
        <motion.div className="p-2.5 glass glass-gold" style={{ borderRadius: shape.radius }}
          whileHover={{ scale: 1.06, boxShadow: "0 26px 60px rgba(236,72,153,0.45)" }}>
          <div className="overflow-hidden w-[200px] sm:w-[220px]" style={{ borderRadius: shape.radius }}>
            <LazyVideo src={v.src} className="w-full h-[310px]" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Videos() {
  const sentinel = useRef(null);
  const inView = useInView(sentinel, { once: true, amount: 0.6 });
  const [revealed, setRevealed] = useState(false);
  const [showBT, setShowBT] = useState(false);

  // start butterfly transition when scrolled near
  useEffect(() => {
    if (inView && !showBT && !revealed) setShowBT(true);
  }, [inView, showBT, revealed]);

  const upper = ASSETS.videos.slice(0, 2);
  const lower = ASSETS.videos.slice(2, 4);

  return (
    <section className="relative py-24 px-6 overflow-hidden" data-testid="videos-section">
      <div ref={sentinel} className="absolute -top-40 h-1 w-1" />
      {showBT && !revealed && <ButterflyTransition onDone={() => setRevealed(true)} />}

      <Header emoji="🎬" title="Moving Memories" subtitle="Some memories are even better in motion." />
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex justify-center gap-10 sm:gap-16 flex-wrap">
          {upper.map((v, i) => (<HangingFrame key={i} v={v} i={i} threadLen={44} swing={3.5} show={revealed} />))}
        </div>
        <div className="flex justify-center gap-10 sm:gap-16 flex-wrap mt-2">
          {lower.map((v, i) => (<HangingFrame key={i} v={v} i={i + 2} threadLen={70} swing={-3} show={revealed} />))}
        </div>
      </div>
    </section>
  );
}
