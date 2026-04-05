import { useRef, useCallback } from 'react';

const AUTO_ADVANCE_THRESHOLD = 0.25;

export default function useCharRecognition() {
  const refCanvasRef = useRef(null);

  const buildReference = useCallback((char, width, height) => {
    const dpr = window.devicePixelRatio || 1;
    if (!refCanvasRef.current) {
      refCanvasRef.current = document.createElement('canvas');
    }
    const offscreen = refCanvasRef.current;
    offscreen.width = width * dpr;
    offscreen.height = height * dpr;

    const ctx = offscreen.getContext('2d');
    ctx.scale(dpr, dpr);

    const size = Math.min(width, height) * 0.75;
    ctx.font = `400 ${size * 0.8}px "Noto Serif SC", serif`;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, width / 2, height / 2);
  }, []);

  const calculateOverlap = useCallback((canvas) => {
    const offscreen = refCanvasRef.current;
    if (!canvas || !offscreen) return 0;

    const width = canvas.width;
    const height = canvas.height;

    const userData = canvas.getContext('2d').getImageData(0, 0, width, height).data;
    const refData = offscreen.getContext('2d').getImageData(0, 0, width, height).data;

    let refPixels = 0;
    let overlapPixels = 0;

    for (let i = 0; i < userData.length; i += 4) {
      const refAlpha = refData[i + 3];
      if (refAlpha > 128) {
        refPixels++;
        if (userData[i + 3] > 180 && userData[i] < 80) {
          overlapPixels++;
        }
      }
    }

    return refPixels === 0 ? 0 : overlapPixels / refPixels;
  }, []);

  const shouldAdvance = useCallback((canvas) => {
    return calculateOverlap(canvas) >= AUTO_ADVANCE_THRESHOLD;
  }, [calculateOverlap]);

  return { buildReference, calculateOverlap, shouldAdvance };
}
