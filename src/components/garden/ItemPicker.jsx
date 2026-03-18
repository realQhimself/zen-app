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
        className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl rounded-t-2xl p-6 pb-safe z-40 shadow-2xl border-t border-white/50"
      >
        <div className="text-center mb-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <h3 className="font-serif font-bold text-zen-ink">选择物品</h3>
          <p className="text-xs text-zen-stone mt-1">
            选择后点击花园放置 · 功德: <span className="font-mono">{balance}</span>
          </p>
        </div>
        <div className="flex justify-around items-end">
          {GARDEN_ITEMS.map(item => {
            const canAfford = balance >= item.cost;
            return (
              <motion.button
                key={item.id}
                whileTap={canAfford ? { scale: 0.9 } : {}}
                onClick={() => canAfford && onSelect(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                  canAfford ? 'active:bg-gray-100' : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <span className="text-xs font-serif">{item.name}</span>
                <span className="text-xs text-zen-stone font-mono">{item.cost}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
