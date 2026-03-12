import { useEffect, useMemo, useState } from 'react';
import { PoemAnalysis } from '../types';
import { parsePoemLines, getMagicWord, buildRewardMessage, analyzePoem } from '../utils/poem';
import { AnimatedWord } from './AnimatedWord';

interface PoemStageProps {
  poem: string;
  playVersion: number;
  reducedMotion: boolean;
  onPlaybackDone: (reward: string) => void;
  variant?: 'inline' | 'modal';
  analysis?: PoemAnalysis;
}

export function PoemStage({
  poem,
  playVersion,
  reducedMotion,
  onPlaybackDone,
  variant = 'inline',
  analysis,
}: PoemStageProps) {
  const parsedLines = useMemo(() => parsePoemLines(poem), [poem]);
  const poemAnalysis = useMemo(() => analysis ?? analyzePoem(poem), [analysis, poem]);
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

  const atmosphereClasses = [
    poemAnalysis.atmosphere.rain ? 'poem-stage__screen--rainy' : '',
    poemAnalysis.atmosphere.snow ? 'poem-stage__screen--snowy' : '',
    poemAnalysis.atmosphere.sun ? 'poem-stage__screen--sunny' : '',
    poemAnalysis.atmosphere.moon ? 'poem-stage__screen--moonlit' : '',
    poemAnalysis.atmosphere.rainbow ? 'poem-stage__screen--rainbow' : '',
    poemAnalysis.atmosphere.twinkle ? 'poem-stage__screen--starry' : '',
    poemAnalysis.atmosphere.sleepy ? 'poem-stage__screen--sleepy' : '',
    poemAnalysis.atmosphere.boom ? 'poem-stage__screen--boom' : '',
  ]
    .filter(Boolean)
    .join(' ');

  function getLineClasses(lineIndex: number) {
    const line = parsedLines[lineIndex];
    const words = line.map((token) => token.normalized).filter(Boolean);

    return [
      words.includes('wave') ? 'poem-line--wave-line' : '',
      words.includes('echo') ? 'poem-line--echo-line' : '',
      words.includes('boom') ? 'poem-line--boom-line' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  return (
    <section className={`poem-stage poem-stage--${variant}`}>
      {variant === 'inline' ? (
        <div className="panel__row">
          <p className="panel__label">Poem Player</p>
          <p className="poem-stage__status">
            {poem.trim() ? 'Press Play My Poem to replay anytime.' : 'Your poem will appear here.'}
          </p>
        </div>
      ) : null}
      <div
        className={[
          'poem-stage__screen',
          reducedMotion ? 'poem-stage__screen--reduced' : '',
          variant === 'modal' ? 'poem-stage__screen--modal' : '',
          atmosphereClasses,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-live="polite"
      >
        <div className="poem-stage__atmosphere" aria-hidden="true">
          {poemAnalysis.atmosphere.sun ? <span className="poem-stage__sun" /> : null}
          {poemAnalysis.atmosphere.moon ? <span className="poem-stage__moon" /> : null}
          {poemAnalysis.atmosphere.rain ? <span className="poem-stage__cloud poem-stage__cloud--left" /> : null}
          {poemAnalysis.atmosphere.rain ? <span className="poem-stage__cloud poem-stage__cloud--right" /> : null}
          {poemAnalysis.atmosphere.twinkle || poemAnalysis.atmosphere.happy ? (
            <span className="poem-stage__stars" />
          ) : null}
          {poemAnalysis.atmosphere.rainbow ? <span className="poem-stage__arc" /> : null}
        </div>

        {poemAnalysis.combos.length > 0 ? (
          <div className="poem-stage__combo-strip" aria-hidden="true">
            {poemAnalysis.combos.slice(0, 2).map((combo) => (
              <span className="poem-stage__combo-badge" key={combo.id}>
                {combo.label}
              </span>
            ))}
          </div>
        ) : null}

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
              className={[
                'poem-line',
                lineIndex < visibleLines ? 'poem-line--visible' : '',
                getLineClasses(lineIndex),
              ]
                .filter(Boolean)
                .join(' ')}
              key={`${playVersion}-${lineIndex}`}
            >
              {lineIndex < visibleLines
                ? line.map((token, tokenIndex) => (
                    <AnimatedWord
                      key={`${playVersion}-${lineIndex}-${tokenIndex}-${token.value}`}
                      token={token}
                      trigger={getMagicWord(token.normalized)}
                      reducedMotion={reducedMotion}
                      repeatCount={
                        token.normalized ? poemAnalysis.wordCounts[token.normalized] ?? 1 : 1
                      }
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
