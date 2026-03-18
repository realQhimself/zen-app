import React, { useState, useRef } from 'react';

export default function VirtualJoystick({ joystickRef }) {
  const stickRef = useRef(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const centerRef = useRef({ x: 0, y: 0 });
  const OUTER_R = 44;
  const KNOB_R = 20;

  const handleStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = stickRef.current.getBoundingClientRect();
    centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    setActive(true);
    handleMove(e);
  };

  const handleMove = (e) => {
    if (!active && !e.touches) return;
    e.preventDefault();
    const cx = centerRef.current.x;
    const cy = centerRef.current.y;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > OUTER_R) {
      dx = (dx / dist) * OUTER_R;
      dy = (dy / dist) * OUTER_R;
    }
    setKnobPos({ x: dx, y: dy });
    joystickRef.current = { dx: dx / OUTER_R, dy: dy / OUTER_R };
  };

  const handleEnd = (e) => {
    e.preventDefault();
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    joystickRef.current = { dx: 0, dy: 0 };
  };

  return (
    <div
      ref={stickRef}
      data-joystick="true"
      className="absolute left-4 z-30 touch-none"
      style={{
        width: OUTER_R * 2,
        height: OUTER_R * 2,
        bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px) + 8px)',
      }}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: active ? 'rgba(44,44,44,0.5)' : 'rgba(44,44,44,0.25)',
          background: active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: KNOB_R * 2,
          height: KNOB_R * 2,
          left: OUTER_R - KNOB_R + knobPos.x,
          top: OUTER_R - KNOB_R + knobPos.y,
          background: active ? 'rgba(44,44,44,0.6)' : 'rgba(44,44,44,0.35)',
          boxShadow: active ? '0 2px 8px rgba(0,0,0,0.25)' : '0 1px 4px rgba(0,0,0,0.12)',
          transition: active ? 'none' : 'all 0.15s ease',
        }}
      />
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4L14 24M4 14L24 14" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 4L10 8M14 4L18 8" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 24L10 20M14 24L18 20" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 14L8 10M4 14L8 18" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 14L20 10M24 14L20 18" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

export function KeyboardHint() {
  return (
    <div
      className="absolute left-4 z-30 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/40"
      style={{ bottom: 'calc(5rem + 8px)' }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <kbd className="w-6 h-6 bg-white/70 border border-zen-stone/20 rounded text-[10px] font-mono flex items-center justify-center text-zen-ink shadow-sm">W</kbd>
        <div className="flex gap-0.5">
          <kbd className="w-6 h-6 bg-white/70 border border-zen-stone/20 rounded text-[10px] font-mono flex items-center justify-center text-zen-ink shadow-sm">A</kbd>
          <kbd className="w-6 h-6 bg-white/70 border border-zen-stone/20 rounded text-[10px] font-mono flex items-center justify-center text-zen-ink shadow-sm">S</kbd>
          <kbd className="w-6 h-6 bg-white/70 border border-zen-stone/20 rounded text-[10px] font-mono flex items-center justify-center text-zen-ink shadow-sm">D</kbd>
        </div>
      </div>
      <span className="text-[10px] text-zen-stone font-serif">移动</span>
    </div>
  );
}
