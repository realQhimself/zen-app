import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SUTRAS } from '../../data/sutras/index';
import { loadSutraProgress } from '../../utils/sutraProgress';

export default function SutraSelection({ onSelect }) {
  const progress = loadSutraProgress();

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/sutra-paper.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f5f5f0',
      }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 bg-zen-bg/80 backdrop-blur-lg border-b border-zen-sand/50"
        style={{ WebkitBackdropFilter: 'blur(16px)' }}>
        <Link to="/" className="p-2 text-zen-stone rounded-full hover:bg-zen-sand/50 transition">
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-lg font-serif font-bold text-zen-ink">选择经典</h2>
        <div className="w-10" />
      </div>

      {/* Sutra List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {SUTRAS.map((sutra) => {
          const idx = progress[sutra.id] || 0;
          const total = sutra.text.length;
          const completed = idx >= total;
          const inProgress = idx > 0 && !completed;
          const pct = total > 0 ? Math.min((idx / total) * 100, 100) : 0;

          return (
            <motion.button
              key={sutra.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(sutra.id, { completed, inProgress })}
              className="zen-card w-full p-4 text-left relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif font-bold text-zen-ink truncate">
                      {sutra.name}
                    </h3>
                    {completed && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-zen-moss/80 text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zen-stone mt-0.5">{sutra.author}</p>
                  <p className="text-xs text-zen-stone/70 mt-1">{sutra.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs text-zen-stone">{total} 字</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zen-sand/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-zen-red/60 to-zen-gold/40 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-zen-stone whitespace-nowrap">
                  已抄 {Math.min(idx, total)} / {total} 字
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
