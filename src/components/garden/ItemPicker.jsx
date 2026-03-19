import React from 'react';
import { motion } from 'framer-motion';
import { GARDEN_ITEMS } from './gardenData';

export default function ItemPicker({ balance, onSelect, onClose }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute left-0 right-0 bg-white/85 backdrop-blur-xl rounded-t-2xl pt-4 px-4 z-40 shadow-2xl border-t border-white/50"
        style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="text-center mb-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
          <h3 className="font-serif font-bold text-zen-ink text-sm">选择物品</h3>
          <p className="text-[10px] text-zen-stone mt-0.5">
            选择后点击花园放置 · 功德: <span className="font-mono">{balance}</span>
          </p>
        </div>
        <div className="flex justify-around items-end pb-3">
          {GARDEN_ITEMS.map(item => {
            const canAfford = balance >= item.cost;
            return (
              <motion.button
                key={item.id}
                whileTap={canAfford ? { scale: 0.9 } : {}}
                onClick={() => canAfford && onSelect(item.id)}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition ${
                  canAfford ? 'active:bg-gray-100' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <span className="text-[10px] font-serif leading-tight">{item.name}</span>
                <span className="text-[10px] text-zen-stone font-mono leading-tight">{item.cost}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
