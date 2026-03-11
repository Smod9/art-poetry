import { useEffect, useMemo, useState } from 'react';
import { parsePoemLines, getMagicWord, buildRewardMessage } from '../utils/poem';
import { AnimatedWord } from './AnimatedWord';

interface PoemStageProps {
  poem: string;
  playVersion: number;
  reducedMotion: boolean;
  onPlaybackDone: (reward: string) => void;
}

export function PoemStage({
  poem,
  playVersion,
  reducedMotion,
  onPlaybackDone,
}: PoemStageProps) {
  const parsedLines = useMemo(() => parsePoemLines(poem), [poem]);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (playVersion === 0 && !poem.trim()) {
      setVisibleLines(0);
      return;
    }

    if (!poem.trim()) {
      setVisibleLines(0);
      onPlaybackDone(buildRewardMessage(poem));
      return;
    }

    setVisibleLines(0);
    let cancelled = false;
    const timers: number[] = [];
    const lineDelay = reducedMotion ? 180 : 500;

    parsedLines.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        if (!cancelled) {
          setVisibleLines(index + 1);
        }
      }, lineDelay * index + 80);

      timers.push(timer);
    });

    const endTimer = window.setTimeout(() => {
      if (!cancelled) {
        onPlaybackDone(buildRewardMessage(poem));
      }
    }, lineDelay * parsedLines.length + 250);

    timers.push(endTimer);

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onPlaybackDone, parsedLines, playVersion, poem, reducedMotion]);

  const stageEffects = useMemo(() => {
    const found = new Set<string>();

    parsedLines.flat().forEach((token) => {
      const trigger = getMagicWord(token.normalized);
      if (trigger?.stageBurst) {
        found.add(trigger.effect);
      }
    });

    return Array.from(found);
  }, [parsedLines]);

  return (
    <section className="panel poem-stage">
      <div className="panel__row">
        <p className="panel__label">Poem Player</p>
        <p className="poem-stage__status">
          {poem.trim() ? 'Press Play My Poem to replay anytime.' : 'Your poem will appear here.'}
        </p>
      </div>

      <div
        className={`poem-stage__screen ${reducedMotion ? 'poem-stage__screen--reduced' : ''}`}
        aria-live="polite"
      >
        {stageEffects.map((effect) => (
          <span
            key={`${effect}-${playVersion}`}
            className={`stage-burst stage-burst--${effect}`}
            aria-hidden="true"
          />
        ))}

        {poem.trim() ? (
          parsedLines.map((line, lineIndex) => (
            <p
              className={`poem-line ${lineIndex < visibleLines ? 'poem-line--visible' : ''}`}
              key={`${playVersion}-${lineIndex}`}
            >
              {lineIndex < visibleLines
                ? line.map((token, tokenIndex) => (
                    <AnimatedWord
                      key={`${playVersion}-${lineIndex}-${tokenIndex}-${token.value}`}
                      token={token}
                      trigger={getMagicWord(token.normalized)}
                      reducedMotion={reducedMotion}
                    />
                  ))
                : '\u00A0'}
            </p>
          ))
        ) : (
          <div className="poem-stage__placeholder">
            <p>Type a poem, then press Play My Poem.</p>
            <p>Magic words will sparkle right on the page.</p>
          </div>
        )}
      </div>
    </section>
  );
}
