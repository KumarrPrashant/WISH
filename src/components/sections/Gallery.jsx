import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ASSETS } from "../../data";
import { Header } from "./Story";

export default function Gallery() {
  const [active, setActive] = useState(null);
  return (
    <section className="relative py-24 px-6" data-testid="gallery-section">
      <Header emoji="📸" title="Little Moments" subtitle="A scrapbook of smiles worth keeping forever." />

      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12">
        {ASSETS.photos.map((p, i) => (
          <motion.div key={i} className="relative"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 70, damping: 14 }}>
            {/* hanging pin + string */}
            <div className="absolute left-1/2 -top-8 -translate-x-1/2 flex flex-col items-center z-10">
              <div className="w-3 h-3 rounded-full" style={{ background: "radial-gradient(circle,#f5c451,#b8902f)", boxShadow: "0 0 8px #f5c451" }} />
              <div className="w-[2px] h-6" style={{ background: "linear-gradient(rgba(245,196,81,0.7),transparent)" }} />
            </div>
            <motion.div className="glass p-3 pb-10 rounded-2xl cursor-pointer" style={{ rotate: p.rotate }}
              animate={{ rotate: [p.rotate, p.rotate + 1.5, p.rotate - 1.5, p.rotate] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.07, rotate: 0, zIndex: 20, boxShadow: "0 24px 60px rgba(236,72,153,0.4)" }}
              onClick={() => setActive(p.src)}>
              <img src={p.src} alt={p.caption} className="w-44 sm:w-52 h-60 sm:h-72 object-cover rounded-lg" />
              <p className="font-hand text-xl text-center text-[#f5c451] absolute bottom-2 left-0 right-0">{p.caption}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.img src={active} alt="preview" className="max-h-[85vh] rounded-2xl"
              style={{ boxShadow: "0 0 80px rgba(236,72,153,0.5)" }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }} />
            <button className="absolute top-6 right-6 glass rounded-full p-3 text-white" data-testid="gallery-close"><X size={22} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
