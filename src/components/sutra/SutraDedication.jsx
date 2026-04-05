import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { DEDICATIONS } from '../../data/dedications';
import { getSutraById } from '../../data/sutras/index';
import { getSessions } from '../../utils/sutraProgress';

export default function SutraDedication({ sutraId, onStart, onBack }) {
  const sutra = getSutraById(sutraId);
  const [selected, setSelected] = useState(DEDICATIONS[0]?.id || null);
  const [custom, setCustom] = useState('');

  const completedCount = getSessions().filter(
    (s) => s.sutraId === sutraId
  ).length;

  const dedication = custom.trim() || DEDICATIONS.find((d) => d.id === selected)?.label || '';

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: '#f5f0e8' }}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4">
        <button
          onClick={onBack}
          className="p-2 text-zen-stone rounded-full hover:bg-zen-sand/50 transition"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-sm text-zen-stone tracking-[4px] mb-6">发 愿</p>
        <h2 className="text-2xl font-serif font-bold text-zen-ink mb-2">
          {sutra.name}
        </h2>
        <p className="text-sm text-zen-stone mb-8">
          第 {completedCount + 1} 次抄写 · 共 {sutra.text.length} 字
        </p>

        {/* Dedication selection */}
        <div className="w-full max-w-sm bg-white/60 backdrop-blur rounded-xl p-5 mb-6"
          style={{ WebkitBackdropFilter: 'blur(12px)' }}>
          <p className="text-xs text-zen-stone mb-3">今日回向</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {DEDICATIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => { setSelected(d.id); setCustom(''); }}
                className={`px-3.5 py-1.5 rounded-full text-sm transition ${
                  selected === d.id && !custom.trim()
                    ? 'bg-zen-gold text-white'
                    : 'bg-zen-gold/10 text-zen-gold border border-zen-gold/20'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="或自定义回向..."
            className="w-full px-3.5 py-2.5 border border-zen-sand rounded-lg text-sm text-zen-ink bg-white focus:outline-none focus:border-zen-gold/50"
          />
        </div>

        {/* Start button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onStart(dedication)}
          className="w-full max-w-sm py-3.5 bg-zen-red text-white rounded-xl text-base tracking-[6px] font-serif"
        >
          开始抄经
        </motion.button>
      </div>
    </div>
  );
}
