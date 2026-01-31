import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Settings, X } from 'lucide-react';

const PHASES = {
  IDLE: 'idle',
  INHALE: 'inhale',
  HOLD: 'hold',
  EXHALE: 'exhale',
};

export default function Meditation() {
  const [status, setStatus] = useState('idle'); // idle, running
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Settings (Seconds)
  const [config, setConfig] = useState({
    inhale: 4,
    hold: 7,
    exhale: 8,
  });
  const [showSettings, setShowSettings] = useState(false);

  // Animation variants
  const variants = {
    [PHASES.IDLE]: { scale: 1, opacity: 0.8 },
    [PHASES.INHALE]: { scale: 1.5, opacity: 1, transition: { duration: config.inhale, ease: "easeInOut" } },
    [PHASES.HOLD]: { scale: 1.5, opacity: 1, transition: { duration: config.hold, ease: "linear" } },
    [PHASES.EXHALE]: { scale: 1, opacity: 0.8, transition: { duration: config.exhale, ease: "easeInOut" } },
  };

  const phaseText = {
    [PHASES.IDLE]: "准备",
    [PHASES.INHALE]: "吸气",
    [PHASES.HOLD]: "止息",
    [PHASES.EXHALE]: "呼气",
  };

  const phaseColor = {
    [PHASES.IDLE]: "text-gray-400",
    [PHASES.INHALE]: "text-blue-300",
    [PHASES.HOLD]: "text-yellow-200", // 'Daniel' pause highlight
    [PHASES.EXHALE]: "text-gray-400",
  };

  // Haptic Feedback Helper
  const vibrate = (pattern) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    let timer;
    if (status === 'running') {
      if (phase === PHASES.IDLE) {
        setPhase(PHASES.INHALE);
        setTimeLeft(config.inhale);
        vibrate(50); // Short blip for start
      } else {
        if (timeLeft > 0) {
          timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else {
          // Phase transition
          switch (phase) {
            case PHASES.INHALE:
              setPhase(PHASES.HOLD);
              setTimeLeft(config.hold);
              vibrate(100); // Pulse for Hold
              break;
            case PHASES.HOLD:
              setPhase(PHASES.EXHALE);
              setTimeLeft(config.exhale);
              vibrate([50, 50, 50]); // Double pulse for Exhale
              break;
            case PHASES.EXHALE:
              setPhase(PHASES.INHALE); // Loop back
              setTimeLeft(config.inhale);
              vibrate(50); // Short blip for Inhale
              break;
          }
        }
      }
    } else {
        setPhase(PHASES.IDLE);
        setTimeLeft(0);
    }
    return () => clearTimeout(timer);
  }, [status, phase, timeLeft, config]);

  const toggleStatus = () => {
    if (status === 'running') {
      setStatus('idle');
    } else {
      setStatus('running');
    }
  };

  return (
    <div className="h-full flex flex-col bg-zen-dark text-white relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-zen-dark opacity-50"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        
        {/* Breathing Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
            {/* Outer Glow */}
            <motion.div 
                className="absolute inset-0 rounded-full bg-white blur-3xl opacity-10"
                animate={phase === PHASES.INHALE || phase === PHASES.HOLD ? { opacity: 0.2, scale: 1.2 } : { opacity: 0.1, scale: 1 }}
                transition={{ duration: 2 }}
            />
            
            {/* Core Circle */}
            <motion.div
                className="w-40 h-40 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center"
                variants={variants}
                initial={PHASES.IDLE}
                animate={phase}
            >
                <div className="text-zen-dark font-serif text-2xl font-bold">
                    {status === 'running' ? timeLeft : "禅"}
                </div>
            </motion.div>
        </div>

        <div className={`text-3xl font-serif font-light tracking-[0.5em] mb-4 ${phaseColor[phase]}`}>
            {phaseText[phase]}
        </div>
        
        <p className="text-gray-500 text-sm mb-12">
           {phase === PHASES.HOLD ? "保持静止，感受当下" : "跟随呼吸的节奏"}
        </p>

        {/* Controls */}
        <div className="flex gap-8 items-center">
            <button 
                onClick={() => setShowSettings(true)}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
            >
                <Settings size={24} />
            </button>

            <button 
                onClick={toggleStatus}
                className={`p-6 rounded-full transition shadow-lg ${status === 'running' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white text-zen-dark hover:bg-gray-100'}`}
            >
                {status === 'running' ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
        </div>

      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
                <div className="bg-zen-dark border border-gray-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">呼吸节奏</h3>
                        <button onClick={() => setShowSettings(false)}><X /></button>
                    </div>
                    
                    {[
                        { key: 'inhale', label: '吸气 (秒)' },
                        { key: 'hold', label: '止息 (秒)' },
                        { key: 'exhale', label: '呼气 (秒)' }
                    ].map(({ key, label }) => (
                        <div key={key} className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2 flex justify-between">
                                <span>{label}</span>
                                <span className="text-white font-mono">{config[key]}s</span>
                            </label>
                            <input 
                                type="range" min="1" max="15" step="1"
                                value={config[key]}
                                onChange={(e) => setConfig({...config, [key]: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>
                    ))}
                    
                    <button 
                        onClick={() => setShowSettings(false)}
                        className="w-full py-3 bg-white text-zen-dark rounded-xl font-bold mt-2"
                    >
                        完成
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
