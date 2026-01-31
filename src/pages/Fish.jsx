import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

// Simple Woodblock Sound Synthesizer using Web Audio API
// This avoids loading external MP3s which might fail or be slow
const useWoodenFishSound = () => {
  const audioContextRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  const initAudio = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }
  };

  const play = () => {
    if (!enabled) return;
    initAudio();
    const ctx = audioContextRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Woodblock characteristic: sharp attack, quick decay, hollow pitch
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  return { play, enabled, setEnabled, initAudio };
};

export default function Fish() {
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('zen_fish_count') || '0'));
  const [merits, setMerits] = useState([]);
  const { play, enabled: soundEnabled, setEnabled: setSoundEnabled, initAudio } = useWoodenFishSound();

  useEffect(() => {
    localStorage.setItem('zen_fish_count', count);
  }, [count]);

  const knock = (e) => {
    // Prevent double tap zooming
    // e.preventDefault(); 
    
    play();
    
    // Haptic
    if (navigator.vibrate) navigator.vibrate(50);

    setCount(c => c + 1);

    // Add floating merit text
    const id = Date.now();
    // Randomize position slightly
    const randomX = (Math.random() - 0.5) * 60; 
    setMerits(prev => [...prev, { id, x: randomX }]);

    // Cleanup text
    setTimeout(() => {
        setMerits(prev => prev.filter(m => m.id !== id));
    }, 1000);
  };

  return (
    <div 
        className="h-full bg-zen-bg flex flex-col items-center justify-center relative select-none overflow-hidden touch-manipulation"
        onClick={knock} // Tap anywhere
    >
      
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
                className="absolute text-zen-ink font-serif font-bold text-xl pointer-events-none z-10"
                style={{ top: '40%' }}
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

      {/* The Wooden Fish (Visual) */}
      <motion.div
        whileTap={{ scale: 0.95, rotate: -2 }}
        className="cursor-pointer relative z-0 mt-10"
      >
        {/* SVG Drawing of a Wooden Fish */}
        <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d)">
                {/* Main Body */}
                <path d="M20 100C20 55.8172 55.8172 20 100 20H140C184.183 20 220 55.8172 220 100V110C220 154.183 184.183 190 140 190H100C55.8172 190 20 154.183 20 110V100Z" fill="#8B4513"/>
                {/* Highlight */}
                <path d="M40 100C40 66.8629 66.8629 40 100 40H140C173.137 40 200 66.8629 200 100V110C200 143.137 173.137 170 140 170H100C66.8629 170 40 143.137 40 110V100Z" fill="#A0522D"/>
                {/* Eye / Slot */}
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

        {/* Mallet hint */}
        <div className="absolute -right-4 -bottom-4 text-sm text-gray-400 opacity-50 pointer-events-none">
            (点击敲击)
        </div>
      </motion.div>

    </div>
  );
}
