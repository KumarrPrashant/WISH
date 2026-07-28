import { motion } from "framer-motion";
import { TIMELINE } from "../../data";

function Header({ title, subtitle, emoji }) {
  return (
    <motion.div className="text-center mb-16 px-4 relative z-[1]"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
      <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-white text-glow">
        <span className="mr-2">{emoji}</span>{title}
      </h2>
      <p className="font-hand text-2xl text-[#f5c451] mt-2 gold-glow">{subtitle}</p>
    </motion.div>
  );
}
export { Header };

export default function Story() {
  return (
    <section className="relative py-24 px-6" data-testid="story-section">
      <Header emoji="📖" title="The Story" subtitle="Every beautiful friendship has its own little timeline." />
      <div className="relative max-w-4xl mx-auto">
        <motion.div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] md:-translate-x-1/2 origin-top rounded-full"
          style={{ background: "linear-gradient(#f472b6,#8b5cf6,#f5c451)", boxShadow: "0 0 16px rgba(139,92,246,0.6)" }}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }} />
        <div className="space-y-12">
          {TIMELINE.map((t, i) => {
            const leftSide = i % 2 === 0;
            return (
              <motion.div key={i} className={`relative flex ${leftSide ? "md:justify-start" : "md:justify-end"} pl-12 md:pl-0`}
                initial={{ opacity: 0, x: leftSide ? -60 : 60, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.5 }} transition={{ type: "spring", stiffness: 60, damping: 15 }}>
                <motion.div className="absolute left-4 md:left-1/2 top-6 w-5 h-5 rounded-full md:-translate-x-1/2 z-10"
                  style={{ background: "radial-gradient(circle,#fff,#f472b6)", boxShadow: "0 0 20px #ec4899" }}
                  whileInView={{ scale: [0, 1.4, 1] }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
                <div className="glass rounded-3xl p-6 md:w-[45%]">
                  <p className="font-body text-xs uppercase tracking-widest text-[#f5c451] mb-1">{t.subtitle}</p>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-2">{t.title}</h3>
                  <p className="font-body text-[#c9c1ea]">{t.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
