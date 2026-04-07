import React, { useState, useCallback } from 'react';
import SutraSelection from '../components/sutra/SutraSelection';
import SutraDedication from '../components/sutra/SutraDedication';
import SutraWriter from '../components/sutra/SutraWriter';
import SutraCompletion from '../components/sutra/SutraCompletion';
import { saveSutraProgress, loadSutraProgress } from '../utils/sutraProgress';
import { clearStrokes } from '../utils/sutraDb';
import { getSutraById } from '../data/sutras/index';
import { safeLoad, safeSave, KEYS } from '../utils/zen';

// Stages: select → dedicate → write → complete
export default function Sutra() {
  const [stage, setStage] = useState('select');
  const [sutraId, setSutraId] = useState(null);
  const [dedication, setDedication] = useState('');
  const [completionStats, setCompletionStats] = useState(null);

  const handleSelect = useCallback((id, { completed, inProgress }) => {
    setSutraId(id);
    if (inProgress) {
      // Resume writing — restore saved dedication
      const saved = safeLoad(KEYS.SUTRA_DEDICATION, {})[id] || '';
      setDedication(saved);
      setStage('write');
    } else {
      setStage('dedicate');
    }
  }, []);

  const handleStartWriting = useCallback((dedicationText) => {
    // Reset progress for re-copy only when user commits to start
    const sutra = getSutraById(sutraId);
    const currentIdx = loadSutraProgress()[sutraId] || 0;
    if (currentIdx >= sutra.text.length) {
      saveSutraProgress(sutraId, 0);
      clearStrokes(sutraId).catch(() => {});
    }
    setDedication(dedicationText);
    // Persist dedication so it survives pause/resume
    const dedications = safeLoad(KEYS.SUTRA_DEDICATION, {});
    dedications[sutraId] = dedicationText;
    safeSave(KEYS.SUTRA_DEDICATION, dedications);
    setStage('write');
  }, [sutraId]);

  const handleWritingComplete = useCallback((stats) => {
    setCompletionStats(stats);
    setStage('complete');
  }, []);

  const handleExit = useCallback(() => {
    setSutraId(null);
    setDedication('');
    setStage('select');
  }, []);

  const handleDone = useCallback(() => {
    // Clean up saved dedication
    if (sutraId) {
      const dedications = safeLoad(KEYS.SUTRA_DEDICATION, {});
      delete dedications[sutraId];
      safeSave(KEYS.SUTRA_DEDICATION, dedications);
    }
    setSutraId(null);
    setDedication('');
    setCompletionStats(null);
    setStage('select');
  }, [sutraId]);

  switch (stage) {
    case 'select':
      return <SutraSelection onSelect={handleSelect} />;
    case 'dedicate':
      return (
        <SutraDedication
          sutraId={sutraId}
          onStart={handleStartWriting}
          onBack={handleExit}
        />
      );
    case 'write':
      return (
        <SutraWriter
          sutraId={sutraId}
          onComplete={handleWritingComplete}
          onExit={handleExit}
        />
      );
    case 'complete':
      return (
        <SutraCompletion
          sutraId={sutraId}
          dedication={dedication}
          stats={completionStats}
          onDone={handleDone}
        />
      );
    default:
      return <SutraSelection onSelect={handleSelect} />;
  }
}
