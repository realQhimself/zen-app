import { useState, useEffect, useRef, useCallback } from 'react';
import { safeLoad, safeSave, KEYS } from '../utils/zen';
import { GARDEN_NPCS, NPC_INTERACTION_RADIUS } from '../components/garden/NPCs';
import { MONK_SPEED, INTERACTION_RADIUS, BOUNDS } from '../components/garden/gardenData';

// --- Device Detection ---
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints >= 1 && window.innerWidth < 1024);
  });
  useEffect(() => {
    const check = () => {
      setIsMobile(
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth < 1024)
      );
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// --- Keyboard Controls (Desktop) ---
export function useKeyboardControls(joystickRef, enabled) {
  const keysRef = useRef(new Set());

  useEffect(() => {
    if (!enabled) return;
    const onDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
        updateJoystick();
      }
    };
    const onUp = (e) => {
      const key = e.key.toLowerCase();
      keysRef.current.delete(key);
      updateJoystick();
    };
    const updateJoystick = () => {
      const keys = keysRef.current;
      let dx = 0, dy = 0;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;
      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
      joystickRef.current = { dx, dy };
    };
    const onBlur = () => { keysRef.current.clear(); joystickRef.current = { dx: 0, dy: 0 }; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [enabled, joystickRef]);
}

// --- Monk Movement + Proximity Detection ---
export function useMonkMovement(joystickRef, gardenItems) {
  const [monkPos, setMonkPos] = useState(() => {
    const saved = safeLoad(KEYS.MONK_POS, null);
    return (saved && saved.x && saved.y) ? saved : { x: 50, y: 50 };
  });
  const [monkDirection, setMonkDirection] = useState('idle');
  const [activeInteractions, setActiveInteractions] = useState(new Set());
  const [npcProximity, setNpcProximity] = useState(new Set());
  const monkPosRef = useRef(monkPos);
  const animFrameRef = useRef(null);

  // Tap-to-move target
  const targetRef = useRef(null);
  const [moveTarget, setMoveTarget] = useState(null); // for visual indicator

  const setTarget = useCallback((x, y) => {
    const clampedX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, x));
    const clampedY = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, y));
    targetRef.current = { x: clampedX, y: clampedY };
    setMoveTarget({ x: clampedX, y: clampedY });
  }, []);

  const clearTarget = useCallback(() => {
    targetRef.current = null;
    setMoveTarget(null);
  }, []);

  const ARRIVAL_THRESHOLD = 1.5; // close enough to stop

  const gameLoop = useCallback(() => {
    const { dx: keyDx, dy: keyDy } = joystickRef.current;
    const hasKeyboardInput = Math.abs(keyDx) > 0.1 || Math.abs(keyDy) > 0.1;

    // Keyboard input overrides tap target
    if (hasKeyboardInput) {
      targetRef.current = null;
      setMoveTarget(null);
    }

    // Determine movement: keyboard or tap-to-move
    let dx = 0, dy = 0, isMoving = false;

    if (hasKeyboardInput) {
      dx = keyDx;
      dy = keyDy;
      isMoving = true;
    } else if (targetRef.current) {
      const pos = monkPosRef.current;
      const tdx = targetRef.current.x - pos.x;
      const tdy = targetRef.current.y - pos.y;
      const dist = Math.sqrt(tdx * tdx + tdy * tdy);

      if (dist < ARRIVAL_THRESHOLD) {
        // Arrived at target
        targetRef.current = null;
        setMoveTarget(null);
      } else {
        // Normalize direction, apply speed
        dx = (tdx / dist);
        dy = (tdy / dist);
        // Slow down when close for smooth stop
        const speedMult = Math.min(1, dist / 5);
        dx *= speedMult;
        dy *= speedMult;
        isMoving = true;
      }
    }

    if (isMoving) {
      const pos = monkPosRef.current;
      const newX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, pos.x + dx * MONK_SPEED));
      const newY = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, pos.y + dy * MONK_SPEED));
      const newPos = { x: newX, y: newY };
      monkPosRef.current = newPos;
      setMonkPos(newPos);

      if (Math.abs(dx) > 0.15) {
        setMonkDirection(dx < 0 ? 'left' : 'right');
      }
    } else {
      setMonkDirection(prev => prev !== 'idle' ? 'idle' : prev);
    }

    // Item proximity
    const newInteractions = new Set();
    for (const item of gardenItems) {
      const dist = Math.sqrt(
        Math.pow(monkPosRef.current.x - item.x, 2) +
        Math.pow(monkPosRef.current.y - item.y, 2)
      );
      if (dist < INTERACTION_RADIUS) newInteractions.add(item.id);
    }
    setActiveInteractions(prev => {
      if (prev.size !== newInteractions.size || [...prev].some(id => !newInteractions.has(id))) {
        return newInteractions;
      }
      return prev;
    });

    // NPC proximity
    const newNpcProximity = new Set();
    for (const npc of GARDEN_NPCS) {
      const dist = Math.sqrt(
        Math.pow(monkPosRef.current.x - npc.x, 2) +
        Math.pow(monkPosRef.current.y - npc.y, 2)
      );
      if (dist < NPC_INTERACTION_RADIUS) newNpcProximity.add(npc.id);
    }
    setNpcProximity(prev => {
      if (prev.size !== newNpcProximity.size || [...prev].some(id => !newNpcProximity.has(id))) {
        return newNpcProximity;
      }
      return prev;
    });

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gardenItems, joystickRef]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      safeSave(KEYS.MONK_POS, monkPosRef.current);
    };
  }, [gameLoop]);

  // Periodic save
  useEffect(() => {
    const interval = setInterval(() => {
      safeSave(KEYS.MONK_POS, monkPosRef.current);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return { monkPos, monkDirection, activeInteractions, npcProximity, setTarget, clearTarget, moveTarget };
}
