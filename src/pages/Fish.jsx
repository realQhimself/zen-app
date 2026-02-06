import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Sound Engine (Advanced Synthesis) ---
const useInstrumentSound = () => {
  const ctxRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  const initAudio = () => {
    if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
    }
  };

  const playSound = (type) => {
    if (!enabled) return;
    initAudio();
    const ctx = ctxRef.current;
    const t = ctx.currentTime;

    if (type === 'muyu') {
        // Wooden Fish: Impulse -> Resonant Filter
        // Simulates a hollow wooden cavity
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Fundamental pitch of a woodblock
        osc.frequency.value = 100; // Dummy freq, we use the filter for pitch
        osc.type = 'square'; // Rich harmonics

        // High Q (Resonance) Bandpass creates the "tonk" sound
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, t); // Main wood pitch
        filter.Q.value = 8; // High resonance

        // Short envelope
        gain.gain.setValueAtTime(1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

        // Click track (impact noise)
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.01, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.5;

        // Connect
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
        noise.start(t);

    } else if (type === 'bowl') {
        // Singing Bowl: Multiple sine waves with long decay
        const partials = [1, 2.4, 4.6, 6.8]; // Inharmonic partials of a bell
        const baseFreq = 380;

        partials.forEach((p, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.frequency.value = baseFreq * p;
            osc.type = 'sine';
            
            const duration = 2.5 - (i * 0.5); // Higher partials decay faster
            
            gain.gain.setValueAtTime(0.3 / partials.length, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(t);
            osc.stop(t + duration);
        });

    } else if (type === 'drum') {
        // Drum: Pitch sweep sine + filtered noise
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
        
        gain.gain.setValueAtTime(1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
    }
  };

  return { playSound, enabled, setEnabled, initAudio };
};

// --- Instrument Definitions ---
const INSTRUMENTS = [
  {
    id: 'muyu',
    name: '木鱼',
    color: '#8B4513',
    render: () => (
      <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
         <g filter="url(#filter0_d)">
            <path d="M20 100C20 55.8172 55.8172 20 100 20H140C184.183 20 220 55.8172 220 100V110C220 154.183 184.183 190 140 190H100C55.8172 190 20 154.183 20 110V100Z" fill="#8B4513"/>
            <path d="M40 100C40 66.8629 66.8629 40 100 40H140C173.137 40 200 66.8629 200 100V110C200 143.137 173.137 170 140 170H100C66.8629 170 40 143.137 40 110V100Z" fill="#A0522D"/>
            <path d="M160 105C160 113.284 153.284 120 145 120H95C86.7157 120 80 113.284 80 105C80 96.7157 86.7157 90 95 90H145C153.284 90 160 96.7157 160 105Z" fill="#3E1D0B"/>
         </g>
         <defs>
            <filter id="filter0_d" x="0" y="0" width="240" height="220" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="10"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
         </defs>
      </svg>
    )
  },
  {
    id: 'bowl',
    name: '颂钵',
    color: '#D4AF37', // Gold
    render: () => (
      <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
        <g filter="url(#glow)">
          {/* Bowl Shape */}
          <path d="M40 80 C40 160, 200 160, 200 80 L200 60 L40 60 Z" fill="url(#goldGradient)" />
          <ellipse cx="120" cy="60" rx="80" ry="15" fill="#B8860B" stroke="#8B6914" strokeWidth="2"/>
          {/* Shine */}
          <path d="M60 90 Q 80 140 120 140" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" fill="none"/>
        </g>
        <defs>
           <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#DAA520" />
             <stop offset="50%" stopColor="#FFD700" />
             <stop offset="100%" stopColor="#B8860B" />
           </linearGradient>
           <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
              </feMerge>
           </filter>
        </defs>
      </svg>
    )
  },
  {
    id: 'drum',
    name: '法鼓',
    color: '#800000', // Maroon
    render: () => (
      <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
         <g filter="url(#shadow)">
           {/* Drum Body */}
           <path d="M60 60 C60 40, 180 40, 180 60 V140 C180 160, 60 160, 60 140 Z" fill="#800000" />
           {/* Drum Top Skin */}
           <ellipse cx="120" cy="60" rx="60" ry="20" fill="#F5DEB3" stroke="#5c0000" strokeWidth="2"/>
           {/* Studs */}
           <circle cx="60" cy="70" r="3" fill="#DAA520"/>
           <circle cx="180" cy="70" r="3" fill="#DAA520"/>
           <circle cx="60" cy="130" r="3" fill="#DAA520"/>
           <circle cx="180" cy="130" r="3" fill="#DAA520"/>
           <path d="M70 60 C70 140 170 140 170 60" fill="none" stroke="#5c0000" strokeWidth="1" opacity="0.2"/>
         </g>
         <defs>
            <filter id="shadow">
                <feDropShadow dx="0" dy="10" stdDeviation="5" floodOpacity="0.3"/>
            </filter>
         </defs>
      </svg>
    )
  }
];

export default function Fish() {
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('zen_fish_count') || '0'));
  const [merits, setMerits] = useState([]);
  const [currentInstIdx, setCurrentInstIdx] = useState(0);
  const { playSound, enabled: soundEnabled, setEnabled: setSoundEnabled, initAudio } = useInstrumentSound();

  const currentInst = INSTRUMENTS[currentInstIdx];

  // Auto-init audio on first interaction (silent)
  useEffect(() => {
    const warmUp = () => initAudio();
    window.addEventListener('touchstart', warmUp, { once: true });
    window.addEventListener('click', warmUp, { once: true });
    return () => {
        window.removeEventListener('touchstart', warmUp);
        window.removeEventListener('click', warmUp);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zen_fish_count', count);
  }, [count]);

  const changeInstrument = (direction) => {
    if (direction === 'next') {
        setCurrentInstIdx((prev) => (prev + 1) % INSTRUMENTS.length);
    } else {
        setCurrentInstIdx((prev) => (prev - 1 + INSTRUMENTS.length) % INSTRUMENTS.length);
    }
  };

  const knock = (e) => {
    playSound(currentInst.id);
    
    // Haptic
    if (navigator.vibrate) navigator.vibrate(50);

    setCount(c => c + 1);

    // Add floating merit text
    const id = Date.now();
    const randomX = (Math.random() - 0.5) * 60; 
    setMerits(prev => [...prev, { id, x: randomX }]);
    setTimeout(() => setMerits(prev => prev.filter(m => m.id !== id)), 1000);
  };

  return (
    <div className="h-full bg-zen-bg flex flex-col items-center justify-center relative select-none overflow-hidden touch-manipulation">
      
      {/* Sound Toggle */}
      <button 
        onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
        className="absolute top-4 right-4 p-3 bg-white/50 rounded-full text-gray-600 z-20"
      >
        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Floating Merits */}
      <AnimatePresence>
        {merits.map(m => (
            <motion.div
                key={m.id}
                initial={{ opacity: 1, y: 0, x: m.x }}
                animate={{ opacity: 0, y: -150 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute font-serif font-bold text-xl pointer-events-none z-10"
                style={{ top: '40%', color: currentInst.color }}
            >
                功德 +1
            </motion.div>
        ))}
      </AnimatePresence>

      {/* Counter */}
      <div className="absolute top-20 text-center">
        <div className="text-gray-400 text-sm mb-1">今日功德</div>
        <div className="text-4xl font-mono font-bold text-zen-ink">{count}</div>
      </div>

      {/* Instrument Switcher */}
      <div className="absolute top-40 flex items-center gap-4 bg-white/60 backdrop-blur px-4 py-2 rounded-full shadow-sm z-20">
        <button onClick={() => changeInstrument('prev')} className="p-1 text-gray-500 hover:text-black">
            <ChevronLeft size={20} />
        </button>
        <span className="font-serif font-bold w-12 text-center text-sm">{currentInst.name}</span>
        <button onClick={() => changeInstrument('next')} className="p-1 text-gray-500 hover:text-black">
            <ChevronRight size={20} />
        </button>
      </div>

      {/* The Instrument (Visual) */}
      <motion.div
        key={currentInst.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.95, rotate: -2 }}
        onClick={knock}
        className="cursor-pointer relative z-0 mt-20"
      >
        {currentInst.render()}

        {/* Mallet hint */}
        <div className="absolute -right-4 -bottom-4 text-sm text-gray-400 opacity-50 pointer-events-none">
            (点击敲击)
        </div>
      </motion.div>

    </div>
  );
}
