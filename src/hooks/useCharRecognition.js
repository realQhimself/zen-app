import { useRef, useCallback } from 'react';
import STROKE_COUNTS from '../data/strokeCounts';

// Three-signal scoring weights
const W_OVERLAP = 0.35;
const W_ZONE = 0.35;
const W_STROKE = 0.30;

// Thresholds
const AUTO_ADVANCE_SCORE = 0.6;
const ZONE_COVERAGE_MIN = 0.25;   // min coverage per zone to count as "covered"
const ZONE_REQUIRED_RATIO = 0.55; // fraction of non-empty zones that must be covered
const STROKE_REQUIRED_RATIO = 0.75; // min fraction of expected strokes

export default function useCharRecognition() {
  const refCanvasRef = useRef(null);
  const charRef = useRef('');

  const buildReference = useCallback((char, width, height) => {
    charRef.current = char;
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

  // Pixel overlap + zone coverage in one pass (avoids scanning pixels twice)
  const analyzeCanvas = useCallback((canvas) => {
    const offscreen = refCanvasRef.current;
    if (!canvas || !offscreen) return { overlap: 0, zoneCoverage: 0 };

    const width = canvas.width;
    const height = canvas.height;

    const userData = canvas.getContext('2d').getImageData(0, 0, width, height).data;
    const refData = offscreen.getContext('2d').getImageData(0, 0, width, height).data;

    // 3x3 zone grid
    const ZONES = 3;
    const zoneRefCount = new Array(ZONES * ZONES).fill(0);
    const zoneOverlapCount = new Array(ZONES * ZONES).fill(0);

    const zoneW = width / ZONES;
    const zoneH = height / ZONES;

    let totalRef = 0;
    let totalOverlap = 0;

    for (let i = 0; i < userData.length; i += 4) {
      const refAlpha = refData[i + 3];
      if (refAlpha > 128) {
        const pixelIndex = i / 4;
        const px = pixelIndex % width;
        const py = Math.floor(pixelIndex / width);
        const zx = Math.min(Math.floor(px / zoneW), ZONES - 1);
        const zy = Math.min(Math.floor(py / zoneH), ZONES - 1);
        const zi = zy * ZONES + zx;

        totalRef++;
        zoneRefCount[zi]++;

        // User ink: dark and opaque (excludes guide lines and ghost character)
        if (userData[i + 3] > 180 && userData[i] < 80) {
          totalOverlap++;
          zoneOverlapCount[zi]++;
        }
      }
    }

    const overlap = totalRef === 0 ? 0 : totalOverlap / totalRef;

    // Zone coverage: how many non-empty zones are sufficiently covered
    let zonesWithContent = 0;
    let zonesCovered = 0;
    for (let z = 0; z < ZONES * ZONES; z++) {
      if (zoneRefCount[z] > 0) {
        zonesWithContent++;
        const ratio = zoneOverlapCount[z] / zoneRefCount[z];
        if (ratio >= ZONE_COVERAGE_MIN) {
          zonesCovered++;
        }
      }
    }
    const zoneCoverage = zonesWithContent === 0 ? 0 : zonesCovered / zonesWithContent;

    return { overlap, zoneCoverage };
  }, []);

  const shouldAdvance = useCallback((canvas, userStrokeCount) => {
    const { overlap, zoneCoverage } = analyzeCanvas(canvas);

    // Stroke count signal
    const expectedStrokes = STROKE_COUNTS[charRef.current] || 8;
    const strokeRatio = Math.min(userStrokeCount / expectedStrokes, 1.0);

    // Hard gate: must have drawn enough strokes
    if (strokeRatio < STROKE_REQUIRED_RATIO) return false;

    // Hard gate: must cover enough zones
    if (zoneCoverage < ZONE_REQUIRED_RATIO) return false;

    // Combined score
    const score = W_OVERLAP * overlap + W_ZONE * zoneCoverage + W_STROKE * strokeRatio;
    return score >= AUTO_ADVANCE_SCORE;
  }, [analyzeCanvas]);

  return { buildReference, shouldAdvance };
}
