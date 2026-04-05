import { useRef, useCallback } from 'react';

const BASE_WIDTH = 12;
const MIN_WIDTH = 4;
const MAX_WIDTH = 16;
const TAPER_POINTS = 5;
const INK_FADE_RATE = 0.003;
const INK_MIN_ALPHA = 0.55;
const INK_INITIAL_ALPHA = 1.0;

export default function useBrushEngine() {
  const brushRef = useRef({
    prevX: 0,
    prevY: 0,
    prevTime: 0,
    pointCount: 0,
    prevWidth: MIN_WIDTH,
    inkAlpha: INK_INITIAL_ALPHA,
  });

  const audioRef = useRef(null);

  const getPos = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const getPressure = useCallback((e) => {
    if (e.pressure !== undefined && e.pressure > 0 && e.pressure < 1) return e.pressure;
    if (e.touches?.[0]?.force > 0) return e.touches[0].force;
    return -1;
  }, []);

  const calcBrushWidth = useCallback((speed, pressure, pointCount) => {
    let width;
    if (pressure >= 0) {
      width = MIN_WIDTH + pressure * (MAX_WIDTH - MIN_WIDTH);
    } else {
      const speedFactor = 1.3 - Math.min(speed * 0.5, 1.0);
      width = BASE_WIDTH * speedFactor;
    }
    width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
    if (pointCount < TAPER_POINTS) {
      const t = pointCount / TAPER_POINTS;
      width = MIN_WIDTH + t * (width - MIN_WIDTH);
    }
    return width;
  }, []);

  const startStroke = useCallback((e, canvas) => {
    if (e.type.startsWith('touch') && e.cancelable) e.preventDefault();
    const { x, y } = getPos(e, canvas);
    const ctx = canvas.getContext('2d');

    brushRef.current = {
      prevX: x,
      prevY: y,
      prevTime: Date.now(),
      pointCount: 0,
      prevWidth: MIN_WIDTH,
      inkAlpha: INK_INITIAL_ALPHA,
    };

    ctx.fillStyle = `rgba(44, 44, 44, ${brushRef.current.inkAlpha})`;
    ctx.beginPath();
    ctx.arc(x, y, MIN_WIDTH / 2, 0, Math.PI * 2);
    ctx.fill();

    playBrushSound();
  }, [getPos]);

  const continueStroke = useCallback((e, canvas) => {
    if (e.type.startsWith('touch') && e.cancelable) e.preventDefault();
    const { x, y } = getPos(e, canvas);
    const now = Date.now();
    const brush = brushRef.current;

    const dx = x - brush.prevX;
    const dy = y - brush.prevY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;

    const dt = Math.max(now - brush.prevTime, 1);
    const speed = dist / dt;

    brush.pointCount++;

    const pressure = getPressure(e);
    const targetWidth = calcBrushWidth(speed, pressure, brush.pointCount);
    const smoothWidth = brush.prevWidth + (targetWidth - brush.prevWidth) * 0.35;

    brush.inkAlpha = Math.max(INK_MIN_ALPHA, brush.inkAlpha - INK_FADE_RATE);

    const speedAlpha = 1.0 - Math.min(speed * 0.15, 0.25);
    const finalAlpha = brush.inkAlpha * Math.max(0.75, Math.min(1.0, speedAlpha));

    const ctx = canvas.getContext('2d');
    const steps = Math.max(1, Math.floor(dist / 2.5));

    ctx.fillStyle = `rgba(44, 44, 44, ${finalAlpha})`;

    for (let i = 0; i <= steps; i++) {
      const t = steps > 0 ? i / steps : 0;
      const px = brush.prevX + dx * t;
      const py = brush.prevY + dy * t;
      const pwidth = brush.prevWidth + (smoothWidth - brush.prevWidth) * t;
      ctx.beginPath();
      ctx.arc(px, py, pwidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    brush.prevX = x;
    brush.prevY = y;
    brush.prevTime = now;
    brush.prevWidth = smoothWidth;
  }, [getPos, getPressure, calcBrushWidth]);

  const endStroke = useCallback(() => {
    stopBrushSound();
  }, []);

  const playBrushSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/brush-stroke.mp3`);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {
      // Audio not available, silent fail
    }
  }, []);

  const stopBrushSound = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } catch {
      // silent
    }
  }, []);

  return { startStroke, continueStroke, endStroke };
}
