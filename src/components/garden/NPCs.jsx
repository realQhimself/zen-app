import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GARDEN_NPCS = [
  { id: 'buddha', name: '佛像', x: 50, y: 22 },
  { id: 'muyu',   name: '木鱼', x: 75, y: 40 },
];
export const NPC_INTERACTION_RADIUS = 15;

export const BuddhaStatueSVG = ({ glowing }) => (
  <svg viewBox="0 0 80 100" className="select-none" style={{
    width: 80, height: 100,
    filter: glowing ? 'drop-shadow(0 0 16px rgba(196,168,98,0.7))' : 'none',
    transition: 'filter 0.6s ease',
  }}>
    {glowing && (
      <circle cx="40" cy="28" r="28" fill="none" stroke="rgba(196,168,98,0.2)" strokeWidth="1" className="npc-halo" />
    )}
    <ellipse cx="40" cy="11" rx="5" ry="6" fill="#d4b96a" />
    <ellipse cx="40" cy="22" rx="12" ry="14" fill="#c4a862" />
    <ellipse cx="27" cy="24" rx="3" ry="6" fill="#b89d58" />
    <ellipse cx="53" cy="24" rx="3" ry="6" fill="#b89d58" />
    <path d="M34 21 Q36 23 38 21" fill="none" stroke="#7a6a3a" strokeWidth="1" strokeLinecap="round" />
    <path d="M42 21 Q44 23 46 21" fill="none" stroke="#7a6a3a" strokeWidth="1" strokeLinecap="round" />
    <path d="M37 27 Q40 29 43 27" fill="none" stroke="#7a6a3a" strokeWidth="0.8" strokeLinecap="round" />
    <rect x="36" y="34" width="8" height="4" fill="#b39755" rx="2" />
    <path d="M20 44 Q28 37 40 36 Q52 37 60 44 L62 72 Q40 77 18 72 Z" fill="#b39755" />
    <path d="M28 46 Q36 54 38 64" fill="none" stroke="#a08845" strokeWidth="0.7" opacity="0.6" />
    <path d="M52 46 Q44 54 42 64" fill="none" stroke="#a08845" strokeWidth="0.7" opacity="0.6" />
    <path d="M24 55 Q40 60 56 55" fill="none" stroke="#a08845" strokeWidth="0.6" opacity="0.4" />
    <ellipse cx="40" cy="60" rx="12" ry="5" fill="#c4a862" opacity="0.9" />
    <ellipse cx="40" cy="72" rx="24" ry="6" fill="#a08845" />
    <path d="M10 86 Q18 78 26 80 Q33 75 40 80 Q47 75 54 80 Q62 78 70 86 Q62 90 54 88 Q47 92 40 88 Q33 92 26 88 Q18 90 10 86Z" fill="#dcc88a" />
    <path d="M14 86 Q22 82 30 83 Q35 79 40 83 Q45 79 50 83 Q58 82 66 86" fill="none" stroke="#c4b078" strokeWidth="0.5" />
  </svg>
);

export const MuyuDrumSVG = ({ hitting }) => (
  <svg viewBox="0 0 80 80" className="select-none" style={{
    width: 72, height: 72,
    transform: hitting ? 'scale(0.9)' : 'scale(1)',
    transition: 'transform 0.08s ease',
  }}>
    <path d="M28 65 L52 65" stroke="#4A2810" strokeWidth="3" strokeLinecap="round" />
    <rect x="36" y="52" width="3.5" height="14" fill="#5D3318" rx="1" />
    <rect x="40.5" y="52" width="3.5" height="14" fill="#5D3318" rx="1" />
    <ellipse cx="40" cy="68" rx="18" ry="3" fill="rgba(0,0,0,0.08)" />
    <ellipse cx="40" cy="34" rx="30" ry="24" fill="#8B4513" />
    <ellipse cx="40" cy="34" rx="27" ry="21" fill="#A0522D" />
    <ellipse cx="40" cy="34" rx="24" ry="18" fill="#B5633A" />
    <path d="M22 28 Q30 34 22 38" fill="none" stroke="#8B4513" strokeWidth="0.8" opacity="0.4" />
    <path d="M28 24 Q36 30 28 34" fill="none" stroke="#8B4513" strokeWidth="0.8" opacity="0.4" />
    <path d="M52 24 Q44 30 52 34" fill="none" stroke="#8B4513" strokeWidth="0.8" opacity="0.4" />
    <path d="M58 28 Q50 34 58 38" fill="none" stroke="#8B4513" strokeWidth="0.8" opacity="0.4" />
    <ellipse cx="40" cy="42" rx="7" ry="3.5" fill="#3D1F0A" />
    <circle cx="30" cy="30" r="3" fill="#3D1F0A" />
    <circle cx="50" cy="30" r="3" fill="#3D1F0A" />
    <circle cx="30.5" cy="29.5" r="1.2" fill="#5D3318" />
    <circle cx="50.5" cy="29.5" r="1.2" fill="#5D3318" />
    <ellipse cx="35" cy="26" rx="10" ry="5" fill="rgba(255,255,255,0.08)" />
    <line x1="64" y1="16" x2="52" y2="28" stroke="#5D3318" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="66" cy="14" r="5" fill="#8B4513" />
    <circle cx="66" cy="14" r="3.5" fill="#A0522D" />
    {hitting && <ellipse cx="48" cy="30" rx="8" ry="6" fill="rgba(255,255,200,0.4)" />}
  </svg>
);

export function BuddhaNPC({ npcProximity, onTap }) {
  return (
    <div
      className="absolute"
      style={{ left: '50%', top: '22%', transform: 'translate(-50%, -50%)', zIndex: 22 }}
    >
      <BuddhaStatueSVG glowing={npcProximity.has('buddha')} />
      {npcProximity.has('buddha') && <div className="npc-proximity-ring" />}
      <AnimatePresence>
        {npcProximity.has('buddha') && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={(e) => { e.stopPropagation(); onTap(); }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full font-serif text-xs font-bold text-white shadow-lg active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, rgba(196,168,98,0.9), rgba(138,59,59,0.9))',
              boxShadow: '0 3px 12px rgba(196,168,98,0.3)',
            }}
          >
            参拜禅修
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MuyuNPC({ npcProximity, muyuHitting, onTap }) {
  return (
    <div
      className="absolute"
      data-garden-item="true"
      style={{ left: '75%', top: '40%', transform: 'translate(-50%, -50%)', zIndex: 40 }}
    >
      <div
        onClick={(e) => {
          if (npcProximity.has('muyu')) {
            e.stopPropagation();
            onTap();
          }
        }}
        style={{ cursor: npcProximity.has('muyu') ? 'pointer' : 'default' }}
      >
        <MuyuDrumSVG hitting={muyuHitting} />
      </div>
      {npcProximity.has('muyu') && <div className="npc-proximity-ring" />}
      <AnimatePresence>
        {npcProximity.has('muyu') && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={(e) => { e.stopPropagation(); onTap(); }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full font-serif text-xs font-bold text-white shadow-lg active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, rgba(139,69,19,0.9), rgba(160,82,45,0.9))',
              boxShadow: '0 3px 12px rgba(139,69,19,0.3)',
            }}
          >
            敲木鱼
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
