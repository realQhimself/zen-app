import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Garden Items ---
const GARDEN_ITEMS = [
  {
    id: 'rock',
    name: '石',
    cost: 10,
    width: 40,
    height: 35,
    render: () => (
      <svg viewBox="0 0 40 35" fill="none">
        <ellipse cx="20" cy="22" rx="18" ry="12" fill="#7a7a72" />
        <ellipse cx="18" cy="20" rx="15" ry="10" fill="#8a8a82" />
        <ellipse cx="22" cy="18" rx="10" ry="7" fill="#9a9a92" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'moss',
    name: '苔',
    cost: 10,
    width: 35,
    height: 20,
    render: () => (
      <svg viewBox="0 0 35 20" fill="none">
        <circle cx="10" cy="14" r="5" fill="#6b7c5e" opacity="0.8" />
        <circle cx="20" cy="12" r="6" fill="#5a6b4e" opacity="0.7" />
        <circle cx="28" cy="14" r="4" fill="#6b7c5e" opacity="0.6" />
        <circle cx="15" cy="10" r="3" fill="#7a8b6e" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'pine',
    name: '松',
    cost: 15,
    width: 30,
    height: 50,
    render: () => (
      <svg viewBox="0 0 30 50" fill="none">
        <rect x="13" y="35" width="4" height="15" fill="#5c4033" />
        <polygon points="15,2 3,22 27,22" fill="#4a5c48" />
        <polygon points="15,10 5,28 25,28" fill="#3d4f3b" />
        <polygon points="15,18 7,35 23,35" fill="#344530" />
      </svg>
    ),
  },
  {
    id: 'bamboo',
    name: '竹',
    cost: 15,
    width: 25,
    height: 55,
    render: () => (
      <svg viewBox="0 0 25 55" fill="none">
        <rect x="7" y="5" width="3" height="50" rx="1" fill="#5a7a5a" />
        <rect x="15" y="10" width="3" height="45" rx="1" fill="#4a6a4a" />
        <line x1="5.5" y1="15" x2="8.5" y2="15" stroke="#4a6a4a" strokeWidth="2" />
        <line x1="5.5" y1="30" x2="8.5" y2="30" stroke="#4a6a4a" strokeWidth="2" />
        <path d="M10,8 Q15,3 20,6" stroke="#5a7a5a" strokeWidth="1.5" fill="none" />
        <path d="M18,12 Q22,8 25,10" stroke="#4a6a4a" strokeWidth="1.5" fill="none" />
        <path d="M10,20 Q4,16 1,18" stroke="#5a7a5a" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    id: 'lantern',
    name: '灯笼',
    cost: 20,
    width: 30,
    height: 50,
    render: () => (
      <svg viewBox="0 0 30 50" fill="none">
        <rect x="8" y="45" width="14" height="4" rx="1" fill="#888" />
        <rect x="12" y="30" width="6" height="15" fill="#999" />
        <rect x="6" y="20" width="18" height="10" rx="2" fill="#888" />
        <rect x="10" y="23" width="4" height="5" rx="1" fill="#665" opacity="0.5" />
        <polygon points="15,10 2,20 28,20" fill="#777" />
        <circle cx="15" cy="10" r="2" fill="#888" />
      </svg>
    ),
  },
];

// --- Little Monk SVG ---
const MonkSVG = () => (
  <svg viewBox="0 0 50 65" fill="none">
    {/* Head */}
    <circle cx="25" cy="15" r="10" fill="#e8d5b7" />
    {/* Eyes (closed, meditating) */}
    <path d="M20,15 Q22,17 24,15" stroke="#2c2c2c" strokeWidth="1" fill="none" />
    <path d="M26,15 Q28,17 30,15" stroke="#2c2c2c" strokeWidth="1" fill="none" />
    {/* Mouth (gentle smile) */}
    <path d="M22,19 Q25,21 28,19" stroke="#2c2c2c" strokeWidth="0.5" fill="none" />
    {/* Body (robes) */}
    <path d="M12,25 Q12,55 25,55 Q38,55 38,25 Q30,30 25,28 Q20,30 12,25Z" fill="#8a8a82" />
    {/* Inner robe fold */}
    <path d="M18,28 Q25,35 32,28" stroke="#6a6a62" strokeWidth="1" fill="none" />
    {/* Hands in lap */}
    <ellipse cx="25" cy="42" rx="6" ry="3" fill="#e8d5b7" />
  </svg>
);

// --- XP Helpers (reads unified profile) ---
const readProfile = () => {
  try { return JSON.parse(localStorage.getItem('zen_profile') || '{"totalXP":0,"spentXP":0}'); }
  catch { return { totalXP: 0, spentXP: 0 }; }
};
const writeProfile = (p) => localStorage.setItem('zen_profile', JSON.stringify(p));
const getBalance = () => { const p = readProfile(); return p.totalXP - p.spentXP; };
const addXP = (amount) => { const p = readProfile(); p.totalXP += amount; writeProfile(p); };
const spendXP = (amount) => { const p = readProfile(); p.spentXP += amount; writeProfile(p); };

// --- Default State ---
const DEFAULT_GARDEN = {
  cycleStartDate: new Date().toISOString().split('T')[0],
  checkIns: [],
  items: [],
};

// --- Garden State Hook ---
const useGardenState = () => {
  const [garden, setGarden] = useState(() => {
    const saved = localStorage.getItem('zen_garden');
    if (saved) {
      try { return JSON.parse(saved); }
      catch { return { ...DEFAULT_GARDEN }; }
    }
    return { ...DEFAULT_GARDEN };
  });
  const [balance, setBalance] = useState(getBalance);

  useEffect(() => {
    localStorage.setItem('zen_garden', JSON.stringify(garden));
  }, [garden]);

  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = garden.checkIns.includes(today);

  const cycleStart = new Date(garden.cycleStartDate);
  const now = new Date(today);
  const cycleDay = Math.min(30, Math.floor((now - cycleStart) / (1000 * 60 * 60 * 24)) + 1);

  const checkIn = () => {
    if (hasCheckedInToday) return;
    addXP(10);
    setBalance(getBalance() + 10);
    setGarden(prev => ({
      ...prev,
      checkIns: [...prev.checkIns, today],
    }));
  };

  const placeItem = (type, x, y) => {
    const itemDef = GARDEN_ITEMS.find(i => i.id === type);
    if (!itemDef || balance < itemDef.cost) return false;
    spendXP(itemDef.cost);
    setBalance(prev => prev - itemDef.cost);
    setGarden(prev => ({
      ...prev,
      items: [...prev.items, { id: `item_${Date.now()}`, type, x, y }],
    }));
    return true;
  };

  const removeItem = (itemId) => {
    setGarden(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId),
    }));
  };

  return { garden, balance, cycleDay, hasCheckedInToday, checkIn, placeItem, removeItem };
};

// --- Garden Page ---
export default function Garden() {
  const { garden, balance, cycleDay, hasCheckedInToday, checkIn, placeItem, removeItem } = useGardenState();
  const [tapPos, setTapPos] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const gardenRef = useRef(null);

  const handleGardenTap = (e) => {
    if (e.target.closest('[data-garden-item]') || e.target.closest('[data-monk]')) return;

    const rect = gardenRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(90, ((clientY - rect.top) / rect.height) * 100));

    setTapPos({ x, y });
    setShowPicker(true);
  };

  const handleItemSelect = (itemType) => {
    if (!tapPos) return;
    const success = placeItem(itemType, tapPos.x, tapPos.y);
    if (success && navigator.vibrate) navigator.vibrate(30);
    setShowPicker(false);
    setTapPos(null);
  };

  const handleCheckIn = () => {
    if (hasCheckedInToday) return;
    checkIn();
    if (navigator.vibrate) navigator.vibrate(50);
    const id = Date.now();
    setFloatingPoints(prev => [...prev, { id }]);
    setTimeout(() => setFloatingPoints(prev => prev.filter(p => p.id !== id)), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col relative overflow-hidden select-none touch-manipulation"
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-20">
        <span className="text-sm text-gray-500 font-serif">
          第 {cycleDay} 天 / 30
        </span>
        <div className="flex items-center gap-1 bg-white/60 backdrop-blur px-3 py-1 rounded-full">
          <span className="text-zen-red text-sm">●</span>
          <span className="text-sm font-mono font-bold text-zen-ink">{balance}</span>
        </div>
      </div>

      {/* Garden Surface */}
      <div
        ref={gardenRef}
        onClick={handleGardenTap}
        className="flex-1 relative"
        style={{
          backgroundColor: '#e8e4dc',
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 8px,
            rgba(0,0,0,0.03) 8px,
            rgba(0,0,0,0.03) 9px
          )`,
        }}
      >
        {/* Garden border */}
        <div className="absolute inset-3 border border-gray-300/50 rounded-sm pointer-events-none" />

        {/* Placed Items */}
        {garden.items.map((item) => {
          const def = GARDEN_ITEMS.find(d => d.id === item.type);
          if (!def) return null;
          return (
            <motion.div
              key={item.id}
              data-garden-item="true"
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                width: def.width,
                height: def.height,
              }}
            >
              {def.render()}
            </motion.div>
          );
        })}

        {/* Monk */}
        <motion.div
          data-monk="true"
          className="absolute"
          style={{
            left: '50%',
            top: '72%',
            transform: 'translate(-50%, -50%)',
            width: 48,
            height: 62,
          }}
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <MonkSVG />
        </motion.div>

        {/* Tap ripple */}
        <AnimatePresence>
          {tapPos && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute w-8 h-8 rounded-full border-2 border-zen-red/30 pointer-events-none"
              style={{
                left: `${tapPos.x}%`,
                top: `${tapPos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Check-in Button */}
      <div className="absolute bottom-20 right-4 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); handleCheckIn(); }}
          disabled={hasCheckedInToday}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center font-serif text-sm font-bold ${
            hasCheckedInToday
              ? 'bg-gray-300 text-gray-500'
              : 'bg-zen-red text-white active:bg-red-900'
          }`}
        >
          {hasCheckedInToday ? '已签' : '打卡'}
        </motion.button>

        {/* Floating +10 */}
        <AnimatePresence>
          {floatingPoints.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-zen-red font-bold text-sm pointer-events-none whitespace-nowrap"
            >
              +10 功德
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Item Picker Bottom Sheet */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 z-30"
              onClick={() => { setShowPicker(false); setTapPos(null); }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 pb-safe z-40 shadow-2xl"
            >
              <div className="text-center mb-4">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                <h3 className="font-serif font-bold text-zen-ink">选择物品</h3>
                <p className="text-xs text-gray-400 mt-1">
                  功德: <span className="font-mono">{balance}</span>
                </p>
              </div>
              <div className="flex justify-around items-end">
                {GARDEN_ITEMS.map(item => {
                  const canAfford = balance >= item.cost;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={canAfford ? { scale: 0.9 } : {}}
                      onClick={() => canAfford && handleItemSelect(item.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                        canAfford ? 'active:bg-gray-100' : 'opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        {item.render()}
                      </div>
                      <span className="text-xs font-serif">{item.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{item.cost}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
