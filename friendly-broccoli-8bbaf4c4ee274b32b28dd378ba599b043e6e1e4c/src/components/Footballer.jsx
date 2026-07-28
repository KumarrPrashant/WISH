import { motion } from "framer-motion";

/* Stylized animated footballer (Messi-inspired) — SVG character with idle + kick */
export function Footballer({ kicking }) {
  return (
    <div className="relative w-[220px] h-[300px] select-none" data-testid="footballer">
      {/* soft ground shadow */}
      <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full bg-black/40 blur-md"
        animate={{ scaleX: kicking ? [1, 1.2, 0.9] : [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} />

      {/* glow behind character */}
      <div className="absolute inset-0 blur-3xl -z-10 rounded-full" style={{ background: "radial-gradient(circle at 50% 40%, rgba(139,92,246,0.4), transparent 70%)" }} />

      <motion.svg width="220" height="300" viewBox="0 0 220 300"
        animate={{ y: kicking ? [0, -4, 0] : [0, -6, 0] }}
        transition={{ duration: kicking ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}>
        <defs>
          <linearGradient id="jersey" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8ec5ff" />
            <stop offset="20%" stopColor="#e8f3ff" />
            <stop offset="40%" stopColor="#8ec5ff" />
            <stop offset="60%" stopColor="#e8f3ff" />
            <stop offset="80%" stopColor="#8ec5ff" />
            <stop offset="100%" stopColor="#e8f3ff" />
          </linearGradient>
        </defs>

        {/* back leg (kicks) */}
        <motion.g style={{ transformOrigin: "108px 210px" }}
          animate={kicking ? { rotate: [0, -55, 20] } : { rotate: [0, 4, 0] }}
          transition={{ duration: kicking ? 0.6 : 3, repeat: kicking ? 0 : Infinity, ease: "easeInOut" }}>
          <rect x="100" y="205" width="16" height="60" rx="8" fill="#2a3547" />
          <ellipse cx="106" cy="270" rx="15" ry="8" fill="#111827" />
        </motion.g>
        {/* front leg */}
        <g>
          <rect x="118" y="205" width="16" height="62" rx="8" fill="#33405a" />
          <ellipse cx="126" cy="272" rx="15" ry="8" fill="#111827" />
        </g>

        {/* body (breathing) */}
        <motion.g animate={{ scaleY: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "115px 160px" }}>
          <path d="M92 130 Q115 122 138 130 L142 205 Q115 214 88 205 Z" fill="url(#jersey)" stroke="#6da5e0" strokeWidth="1" />
          <text x="115" y="180" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e3a5f" fontFamily="Outfit">10</text>
        </motion.g>

        {/* left arm (waves) */}
        <motion.g style={{ transformOrigin: "92px 138px" }}
          animate={kicking ? { rotate: [0, -20, 10] } : { rotate: [0, 18, 0, 18, 0] }}
          transition={{ duration: kicking ? 0.6 : 2.4, repeat: kicking ? 0 : Infinity, ease: "easeInOut" }}>
          <rect x="74" y="134" width="14" height="52" rx="7" fill="#e2a878" />
          <circle cx="80" cy="188" r="7" fill="#eab892" />
        </motion.g>
        {/* right arm */}
        <motion.g style={{ transformOrigin: "138px 138px" }}
          animate={kicking ? { rotate: [0, 26, -6] } : { rotate: [0, -8, 0] }}
          transition={{ duration: kicking ? 0.6 : 3, repeat: kicking ? 0 : Infinity, ease: "easeInOut" }}>
          <rect x="132" y="134" width="14" height="52" rx="7" fill="#e2a878" />
          <circle cx="139" cy="188" r="7" fill="#eab892" />
        </motion.g>

        {/* head */}
        <motion.g animate={{ rotate: kicking ? [0, -3, 3] : [0, 2, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "115px 100px" }}>
          {/* hair */}
          <path d="M92 92 Q94 66 115 64 Q136 66 138 92 Q140 78 128 70 Q120 62 115 63 Q100 62 96 74 Q90 82 92 92 Z" fill="#3a2417" />
          {/* face */}
          <ellipse cx="115" cy="100" rx="21" ry="24" fill="#eab892" />
          {/* beard hint */}
          <path d="M97 108 Q115 128 133 108 Q130 122 115 124 Q100 122 97 108 Z" fill="#3a2417" opacity="0.5" />
          {/* eyes (blink) */}
          <motion.g animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4, times: [0, 0.9, 0.95, 1], repeat: Infinity }} style={{ transformOrigin: "115px 98px" }}>
            <ellipse cx="107" cy="98" rx="3" ry="3.6" fill="#2a1a0f" />
            <ellipse cx="123" cy="98" rx="3" ry="3.6" fill="#2a1a0f" />
          </motion.g>
          {/* smile */}
          <path d="M106 110 Q115 118 124 110" stroke="#8a4b2f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </motion.g>
      </motion.svg>
    </div>
  );
}
