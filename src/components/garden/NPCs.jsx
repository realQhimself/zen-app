import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = import.meta.env.BASE_URL;
const SPRITE = `${BASE}images/garden/new-sprites/`;

export const GARDEN_NPCS = [
  { id: 'buddha', name: '佛像', x: 50, y: 22 },
  { id: 'muyu',   name: '木鱼', x: 75, y: 40 },
];
export const NPC_INTERACTION_RADIUS = 15;

export const BuddhaStatueSVG = ({ glowing }) => (
  <img
    src={`${SPRITE}npc-buddha.png`}
    alt="佛像"
    className="w-16 h-16 select-none"
    style={{
      imageRendering: 'pixelated',
      filter: glowing ? 'drop-shadow(0 0 16px rgba(196,168,98,0.7))' : 'none',
      transition: 'filter 0.6s ease',
    }}
    draggable={false}
  />
);

export const MuyuDrumSVG = ({ hitting }) => (
  <img
    src={`${SPRITE}npc-muyu.png`}
    alt="木鱼"
    className="w-16 h-16 select-none"
    style={{
      imageRendering: 'pixelated',
      transform: hitting ? 'scale(0.9)' : 'scale(1)',
      transition: 'transform 0.08s ease',
    }}
    draggable={false}
  />
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
