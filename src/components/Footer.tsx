import { useState, memo } from "react";
import { Instagram, Facebook, Mail } from "lucide-react";
import PolicyModal from "@/components/ui/PolicyModal";
import type { PolicyType } from "@/services/api/types";

const OLIVE_DEEPER = "#2d3815";
const NEON = "#aeb30a";

const products = ["Ragi Flour", "Jowar Flour", "Bajra Flour", "Kangni Flour", "Kutki Flour", "Rice Flour"];

const Footer = memo(() => {
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  return (
    <footer className="relative overflow-hidden" style={{ background: OLIVE_DEEPER }}>
      {/* Marquee strip — food & grain icons only, no text */}
      <div className="relative overflow-hidden border-b border-white/10 py-3">
        <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
          {[0, 1].map((setIdx) => (
            <div key={setIdx} className="flex items-center gap-10 flex-shrink-0">
              {/* 1 — Wheat ear */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <line x1="12" y1="22" x2="12" y2="2" stroke={NEON} strokeWidth="1.4"/>
                <path d="M12 10 C9 10 7 8 7 6 C9 6 11 8 12 10Z" fill={NEON} opacity="0.4"/>
                <path d="M12 10 C15 10 17 8 17 6 C15 6 13 8 12 10Z" fill={NEON} opacity="0.4"/>
                <path d="M12 14 C9 14 7 12 7 10 C9 10 11 12 12 14Z" fill={NEON} opacity="0.4"/>
                <path d="M12 14 C15 14 17 12 17 10 C15 10 13 12 12 14Z" fill={NEON} opacity="0.4"/>
                <path d="M12 18 C9 18 7 16 7 14 C9 14 11 16 12 18Z" fill={NEON} opacity="0.4"/>
                <path d="M12 18 C15 18 17 16 17 14 C15 14 13 16 12 18Z" fill={NEON} opacity="0.4"/>
              </svg>
              {/* 2 — Mortar & pestle */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M4 14 Q4 20 12 20 Q20 20 20 14 L18 10 H6 Z" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <path d="M14 6 Q18 4 20 6" />
                <line x1="16" y1="6" x2="12" y2="12" />
              </svg>
              {/* 3 — Grain bowl */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M4 11 Q4 19 12 19 Q20 19 20 11 Z" />
                <line x1="3" y1="11" x2="21" y2="11" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <circle cx="9" cy="8" r="1" fill={NEON} stroke="none" opacity="0.5"/>
                <circle cx="13" cy="7" r="1" fill={NEON} stroke="none" opacity="0.5"/>
                <circle cx="16" cy="9" r="0.8" fill={NEON} stroke="none" opacity="0.5"/>
              </svg>
              {/* 4 — Leaf */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M6 20 C6 20 4 12 9 7 C14 2 20 4 20 4 C20 4 18 10 13 15 C8 20 6 20 6 20Z" />
                <line x1="6" y1="20" x2="13" y2="11" />
              </svg>
              {/* 5 — Spoon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <ellipse cx="12" cy="6" rx="3.5" ry="4.5" />
                <line x1="12" y1="10.5" x2="12" y2="21" />
              </svg>
              {/* 6 — Seed cluster */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill={NEON} stroke="none" style={{ opacity: 0.4 }}>
                <ellipse cx="12" cy="12" rx="2.2" ry="3.2" />
                <ellipse cx="7" cy="10" rx="1.8" ry="2.8" transform="rotate(-30 7 10)" />
                <ellipse cx="17" cy="10" rx="1.8" ry="2.8" transform="rotate(30 17 10)" />
                <ellipse cx="9" cy="16" rx="1.6" ry="2.5" transform="rotate(-15 9 16)" />
                <ellipse cx="15" cy="16" rx="1.6" ry="2.5" transform="rotate(15 15 16)" />
              </svg>
              {/* 7 — Clay pot */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M8 4 H16 Q18 4 18 7 L17 15 Q16 19 12 19 Q8 19 7 15 L6 7 Q6 4 8 4Z" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <ellipse cx="12" cy="4" rx="4" ry="1.2" />
              </svg>
              {/* 8 — Millet stalk */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <line x1="12" y1="22" x2="12" y2="6" />
                <line x1="12" y1="6" x2="9" y2="3" />
                <circle cx="9" cy="8" r="1.5" fill={NEON} stroke="none" opacity="0.5"/>
                <circle cx="14" cy="6" r="1.5" fill={NEON} stroke="none" opacity="0.5"/>
                <circle cx="10" cy="11" r="1.5" fill={NEON} stroke="none" opacity="0.5"/>
                <circle cx="14" cy="14" r="1.5" fill={NEON} stroke="none" opacity="0.5"/>
                <circle cx="10" cy="17" r="1.5" fill={NEON} stroke="none" opacity="0.5"/>
              </svg>
              {/* 9 — Sun */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.55 }}>
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
                <line x1="4.9" y1="4.9" x2="7" y2="7" /><line x1="17" y1="17" x2="19.1" y2="19.1" />
                <line x1="19.1" y1="4.9" x2="17" y2="7" /><line x1="7" y1="17" x2="4.9" y2="19.1" />
              </svg>
              {/* 10 — Rolling pin */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <rect x="5" y="9" width="14" height="6" rx="3" />
                <line x1="2" y1="7" x2="5" y2="9" /><line x1="2" y1="17" x2="5" y2="15" />
                <line x1="19" y1="9" x2="22" y2="7" /><line x1="19" y1="15" x2="22" y2="17" />
              </svg>
              {/* 11 — Water drop */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.55 }}>
                <path d="M12 2 C12 2 5 10 5 15 A7 7 0 0 0 19 15 C19 10 12 2 12 2Z" />
              </svg>
              {/* 12 — Sickle */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M6 18 Q6 8 14 6 Q20 5 20 10 Q20 16 12 17" />
                <line x1="6" y1="18" x2="4" y2="22" />
              </svg>
              {/* 13 — Three seeds */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill={NEON} stroke="none" style={{ opacity: 0.4 }}>
                <ellipse cx="12" cy="8" rx="2" ry="3" />
                <ellipse cx="7.5" cy="15" rx="2" ry="3" transform="rotate(-20 7.5 15)" />
                <ellipse cx="16.5" cy="15" rx="2" ry="3" transform="rotate(20 16.5 15)" />
              </svg>
              {/* 14 — Grinding stone */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <ellipse cx="12" cy="14" rx="8" ry="4" />
                <ellipse cx="12" cy="12" rx="8" ry="4" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              {/* 15 — Herb sprig */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <line x1="12" y1="22" x2="12" y2="6" />
                <path d="M12 10 Q8 8 8 5 Q11 5 12 10Z" />
                <path d="M12 10 Q16 8 16 5 Q13 5 12 10Z" />
                <path d="M12 15 Q8 13 8 10 Q11 10 12 15Z" />
                <path d="M12 15 Q16 13 16 10 Q13 10 12 15Z" />
              </svg>
              {/* 16 — Flame */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M12 22 C7 22 5 18 5 15 C5 11 8 9 8 6 C10 8 10 11 12 11 C12 8 14 5 14 3 C17 6 19 11 19 15 C19 18 17 22 12 22Z" />
              </svg>
              {/* 17 — Flat bread */}
              <svg viewBox="0 0 24 24" className="w-7 h-5 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <ellipse cx="12" cy="14" rx="9" ry="4" />
                <path d="M3 14 Q5 8 12 7 Q19 8 21 14" />
              </svg>
              {/* 18 — Sprouting seed */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <line x1="12" y1="22" x2="12" y2="10" />
                <path d="M12 16 Q8 14 8 10 Q12 10 12 16Z" />
                <path d="M12 13 Q16 11 16 7 Q12 8 12 13Z" />
                <ellipse cx="12" cy="20" rx="3" ry="1.5" />
              </svg>
              {/* 19 — Cooking pot */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M6 10 H18 L17 19 Q16 21 12 21 Q8 21 7 19 Z" />
                <line x1="6" y1="10" x2="18" y2="10" />
                <line x1="9" y1="10" x2="9" y2="7" /><line x1="15" y1="10" x2="15" y2="7" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <path d="M3 12 Q2 10 4 10" /><path d="M21 12 Q22 10 20 10" />
              </svg>
              {/* 20 — Ragi grain circles */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.55 }}>
                <circle cx="9" cy="10" r="3" /><circle cx="15" cy="8" r="2.5" />
                <circle cx="11" cy="15" r="2.5" /><circle cx="16" cy="14" r="2" />
                <circle cx="7" cy="16" r="1.8" />
              </svg>
              {/* 21 — Woven basket */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M4 10 Q4 19 12 19 Q20 19 20 10 Z" />
                <line x1="4" y1="10" x2="20" y2="10" />
                <line x1="8" y1="10" x2="6" y2="19" /><line x1="12" y1="10" x2="12" y2="19" /><line x1="16" y1="10" x2="18" y2="19" />
                <path d="M8 5 Q12 3 16 5" /><line x1="12" y1="3" x2="12" y2="10" />
              </svg>
              {/* 22 — Wheat bundle */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <line x1="12" y1="20" x2="12" y2="10" /><line x1="9" y1="20" x2="9" y2="12" /><line x1="15" y1="20" x2="15" y2="12" />
                <path d="M9 12 Q9 8 12 7 Q15 8 15 12" />
                <line x1="9" y1="20" x2="15" y2="20" /><path d="M12 7 Q12 4 12 3" />
              </svg>
              {/* 23 — Star anise */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <circle cx="12" cy="12" r="2" />
                <line x1="12" y1="3" x2="12" y2="10" /><line x1="12" y1="14" x2="12" y2="21" />
                <line x1="3" y1="12" x2="10" y2="12" /><line x1="14" y1="12" x2="21" y2="12" />
                <line x1="5.6" y1="5.6" x2="10" y2="10" /><line x1="14" y1="14" x2="18.4" y2="18.4" />
                <line x1="18.4" y1="5.6" x2="14" y2="10" /><line x1="10" y1="14" x2="5.6" y2="18.4" />
              </svg>
              {/* 24 — Chakki mill wheel */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" />
                <line x1="12" y1="4" x2="12" y2="10" /><line x1="12" y1="14" x2="12" y2="20" />
                <line x1="4" y1="12" x2="10" y2="12" /><line x1="14" y1="12" x2="20" y2="12" />
              </svg>
              {/* 25 — Tulsi leaf */}
              <svg viewBox="0 0 24 24" className="w-5 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M12 22 Q6 16 6 10 Q6 4 12 4 Q18 4 18 10 Q18 16 12 22Z" />
                <line x1="12" y1="22" x2="12" y2="4" />
                <path d="M12 9 Q9 9 9 12 Q12 12 12 9Z" /><path d="M12 9 Q15 9 15 12 Q12 12 12 9Z" />
              </svg>
              {/* 26 — Harvest moon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.55 }}>
                <path d="M21 12.8 A9 9 0 1 1 11.2 3 A7 7 0 0 0 21 12.8Z" />
              </svg>
              {/* 27 — Ear of corn */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M10 20 Q8 14 9 8 Q12 4 15 8 Q16 14 14 20 Z" />
                <line x1="9" y1="11" x2="15" y2="11" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="17" x2="15" y2="17" />
                <path d="M10 8 Q8 5 7 3" /><path d="M14 8 Q16 5 17 3" />
              </svg>
              {/* 28 — Grain cylinder */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <ellipse cx="12" cy="8" rx="7" ry="3" /><ellipse cx="12" cy="16" rx="7" ry="3" />
                <line x1="5" y1="8" x2="5" y2="16" /><line x1="19" y1="8" x2="19" y2="16" />
                <line x1="12" y1="5" x2="12" y2="3" />
              </svg>
              {/* 29 — Five-petal flower */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill={NEON} stroke="none" style={{ opacity: 0.32 }}>
                <ellipse cx="12" cy="5" rx="2.5" ry="4" />
                <ellipse cx="12" cy="5" rx="2.5" ry="4" transform="rotate(72 12 12)" />
                <ellipse cx="12" cy="5" rx="2.5" ry="4" transform="rotate(144 12 12)" />
                <ellipse cx="12" cy="5" rx="2.5" ry="4" transform="rotate(216 12 12)" />
                <ellipse cx="12" cy="5" rx="2.5" ry="4" transform="rotate(288 12 12)" />
                <circle cx="12" cy="12" r="3" fill="#2d3815" />
              </svg>
              {/* 30 — Dew drops */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.55 }}>
                <circle cx="8" cy="15" r="2.5" /><circle cx="15" cy="12" r="2" />
                <circle cx="12" cy="18" r="1.5" /><circle cx="17" cy="17" r="1.2" /><circle cx="6" cy="10" r="1.2" />
              </svg>
              {/* 31 — Ladle */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M5 20 L12 12" /><circle cx="14.5" cy="9.5" r="4.5" />
              </svg>
              {/* 32 — Infinity / heritage */}
              <svg viewBox="0 0 32 16" className="w-8 h-5 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.45 }}>
                <path d="M16 8 C16 4 12 2 9 4 C6 6 6 10 9 12 C12 14 16 12 16 8 C16 4 20 2 23 4 C26 6 26 10 23 12 C20 14 16 12 16 8Z" />
              </svg>
              {/* 33 — Honeycomb */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <polygon points="12 3 19 7 19 15 12 19 5 15 5 7" />
                <polygon points="12 7 16 9 16 14 12 16 8 14 8 9" />
              </svg>
              {/* 34 — Mountain */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <polyline points="3 20 9 8 13 14 16 10 21 20" />
                <line x1="3" y1="20" x2="21" y2="20" />
              </svg>
              {/* 35 — Berry sprig */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <line x1="12" y1="22" x2="12" y2="8" />
                <line x1="12" y1="12" x2="8" y2="9" /><line x1="12" y1="16" x2="16" y2="13" />
                <circle cx="7" cy="8" r="2.5" fill={NEON} stroke="none" opacity="0.4"/>
                <circle cx="17" cy="12" r="2" fill={NEON} stroke="none" opacity="0.4"/>
                <circle cx="12" cy="6" r="1.8" fill={NEON} stroke="none" opacity="0.4"/>
              </svg>
              {/* 36 — Grain wave */}
              <svg viewBox="0 0 28 16" className="w-7 h-5 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.5 }}>
                <path d="M2 8 Q5 3 8 8 Q11 13 14 8 Q17 3 20 8 Q23 13 26 8" />
              </svg>
              {/* 37 — Tongs */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <path d="M8 21 L8 8 Q8 4 12 4 Q16 4 16 8 L16 21" />
                <path d="M8 16 Q12 18 16 16" />
              </svg>
              {/* 38 — Pestle rod */}
              <svg viewBox="0 0 24 24" className="w-5 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                <line x1="12" y1="3" x2="12" y2="18" />
                <ellipse cx="12" cy="20" rx="4" ry="2" />
                <ellipse cx="12" cy="5" rx="3" ry="1.5" />
              </svg>
              {/* 39 — Spiral / growth */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" style={{ opacity: 0.5 }}>
                <path d="M12 12 m0 -6 a6 6 0 1 1 -0.01 0 M12 12 m0 -3 a3 3 0 1 0 0.01 0" />
              </svg>
              {/* 40 — Diamond purity mark */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.45 }}>
                <polygon points="12 3 20 9 12 21 4 9" />
                <line x1="4" y1="9" x2="20" y2="9" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Our Promise section */}
      <div className="max-w-4xl mx-auto px-6 py-12 border-b border-white/10">
        <h3 className="font-display font-black text-2xl text-center mb-6" style={{ color: NEON }}>
          Our Promise
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-white/70 font-body text-sm">
          <span>✓ Fresh in 48hrs</span>
          <span>✓ Zero additives</span>
          <button onClick={() => setActivePolicy("shippingPolicy")} className="hover:text-white hover:underline transition-colors">✓ Shipping Policy</button>
          <button onClick={() => setActivePolicy("refundPolicy")} className="hover:text-white hover:underline transition-colors">✓ Refund & Exchange Policy</button>
        </div>
        <div className="text-center">
          <p className="font-body text-sm text-white/80">Questions? WhatsApp: +91-93217-31372</p>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="font-display font-black text-2xl mb-2" style={{ color: NEON }}>
              Liimra
            </div>
            <p className="font-body text-sm leading-relaxed text-white/80 mb-4">
              Family business. Fresh flour. Pure care.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} className="text-white" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} className="text-white" />
              </a>
              <a
                href="mailto:hello@liimra.com"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.15em] uppercase mb-4 text-white/70">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {products.map((p) => (
                <li key={p}>
                  <a
                    href="#our-millets"
                    className="font-body text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn links */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.15em] uppercase mb-4 text-white/70">
              Learn
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#our-millets" className="font-body text-sm text-white/70 hover:text-white transition-colors">
                  The Science
                </a>
              </li>
              <li>
                <a href="#recipes" className="font-body text-sm text-white/70 hover:text-white transition-colors">
                  Recipe Ideas
                </a>
              </li>
              <li>
                <a href="#reviews" className="font-body text-sm text-white/70 hover:text-white transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#faq" className="font-body text-sm text-white/70 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Trust badges */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.15em] uppercase mb-4 text-white/70">
              Trust
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="font-body text-sm text-white/70">FSSAI Certified</span>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                <span className="font-body text-sm text-white/70">Ships in 48 Hours</span>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <span className="font-body text-sm text-white/70">Made in India</span>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke={NEON} strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="font-body text-sm text-white/70">Zero Additives</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="font-body text-xs text-white/60">
            © {new Date().getFullYear()} Liimra Naturals. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActivePolicy("privacyPolicy")} className="font-body text-xs text-white/60 hover:text-white/90 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setActivePolicy("termsOfService")} className="font-body text-xs text-white/60 hover:text-white/90 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal Injection */}
      <PolicyModal 
        isOpen={activePolicy !== null} 
        onClose={() => setActivePolicy(null)}
        policyType={activePolicy || "refundPolicy"} 
      />
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
