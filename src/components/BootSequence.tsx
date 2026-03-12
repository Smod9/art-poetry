import { useEffect, useState } from 'react';
import { playBootLoadingSound } from '../utils/sound';

interface BootSequenceProps {
  onDone: () => void;
  soundEnabled: boolean;
}

const BOOT_LINES = [
  'Magic Words Poetry System v1.9',
  'Loading rainbow crayons...',
  'Polishing moonbeams...',
  'Waking tiny splashes...',
];

export function BootSequence({ onDone, soundEnabled }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(1);

  useEffect(() => {
    if (soundEnabled) {
      playBootLoadingSound();
    }

    const timers = BOOT_LINES.map((_, index) =>
      window.setTimeout(() => setVisibleLines(index + 1), index * 260),
    );
    const doneTimer = window.setTimeout(onDone, 1400);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(doneTimer);
    };
  }, [onDone, soundEnabled]);

  return (
    <section className="boot-screen panel" aria-live="polite">
      <p className="title-screen__eyebrow">STARTING UP</p>
      <div className="boot-screen__monitor">
        {BOOT_LINES.map((line, index) => (
          <p className="boot-screen__line" key={line}>
            {index < visibleLines ? line : '\u00A0'}
          </p>
        ))}
        <div className="boot-screen__bar">
          <span style={{ width: `${(visibleLines / BOOT_LINES.length) * 100}%` }} />
        </div>
      </div>
      <p className="title-screen__hint">Please wait. Your poem machine is waking up.</p>
    </section>
  );
}
