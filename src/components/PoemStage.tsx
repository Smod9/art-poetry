import { useEffect, useMemo, useRef, useState } from 'react';
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
  loopPlayback?: boolean;
  paused?: boolean;
}

export function PoemStage({
  poem,
  playVersion,
  reducedMotion,
  onPlaybackDone,
  variant = 'inline',
  analysis,
  loopPlayback = false,
  paused = false,
}: PoemStageProps) {
  const parsedLines = useMemo(() => parsePoemLines(poem), [poem]);
  const poemAnalysis = useMemo(() => analysis ?? analyzePoem(poem), [analysis, poem]);
  const [visibleLines, setVisibleLines] = useState(0);
  const [cycleVersion, setCycleVersion] = useState(0);
  const completedCycleRef = useRef<string | null>(null);

  useEffect(() => {
    setVisibleLines(0);
    setCycleVersion(0);
    completedCycleRef.current = null;
  }, [playVersion, poem]);

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

    if (paused) {
      return;
    }

    const lineDelay = reducedMotion ? 320 : 920;
    const revealDelay = visibleLines === 0 ? 80 : lineDelay;
    const cycleKey = `${playVersion}-${cycleVersion}`;

    if (visibleLines < parsedLines.length) {
      const revealTimer = window.setTimeout(() => {
        setVisibleLines((current) => Math.min(current + 1, parsedLines.length));
      }, revealDelay);

      return () => window.clearTimeout(revealTimer);
    }

    if (completedCycleRef.current !== cycleKey) {
      completedCycleRef.current = cycleKey;
      onPlaybackDone(buildRewardMessage(poem));
    }

    if (!loopPlayback) {
      return;
    }

    const restartTimer = window.setTimeout(() => {
      completedCycleRef.current = null;
      setVisibleLines(0);
      setCycleVersion((value) => value + 1);
    }, reducedMotion ? 1000 : cycleVersion === 0 ? 3000 : 1600);

    return () => {
      window.clearTimeout(restartTimer);
    };
  }, [
    cycleVersion,
    loopPlayback,
    onPlaybackDone,
    parsedLines,
    paused,
    playVersion,
    poem,
    reducedMotion,
    visibleLines,
  ]);

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
    poemAnalysis.atmosphere.grass ? 'poem-stage__screen--garden' : '',
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

  const treeCount = Math.min(4, poemAnalysis.wordCounts.tree ?? 0);
  const flowerCount = Math.min(
    5,
    Math.max(
      poemAnalysis.atmosphere.bloom ? 1 : 0,
      (poemAnalysis.wordCounts.flower ?? 0) + (poemAnalysis.wordCounts.bloom ?? 0),
    ),
  );

  const treePositions = ['10%', '24%', '76%', '88%'];
  const flowerPositions = ['18%', '34%', '50%', '66%', '82%'];

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
          {poemAnalysis.atmosphere.rain || poemAnalysis.atmosphere.cloud ? (
            <span className="poem-stage__cloud poem-stage__cloud--left" />
          ) : null}
          {poemAnalysis.atmosphere.rain || poemAnalysis.atmosphere.cloud ? (
            <span className="poem-stage__cloud poem-stage__cloud--right" />
          ) : null}
          {poemAnalysis.atmosphere.twinkle || poemAnalysis.atmosphere.happy ? (
            <span className="poem-stage__stars" />
          ) : null}
          {poemAnalysis.atmosphere.rainbow ? <span className="poem-stage__arc" /> : null}
          {treeCount > 0
            ? Array.from({ length: treeCount }).map((_, index) => (
                <span
                  className="poem-stage__tree-item"
                  key={`tree-${index}`}
                  style={{ left: treePositions[index] }}
                >
                  <span className="poem-stage__tree-top" />
                  <span className="poem-stage__tree-trunk" />
                </span>
              ))
            : null}
          {poemAnalysis.atmosphere.grass ? <span className="poem-stage__grassline" /> : null}
          {flowerCount > 0
            ? Array.from({ length: flowerCount }).map((_, index) => (
                <span
                  className="poem-stage__flower-item"
                  key={`flower-${index}`}
                  style={{ left: flowerPositions[index] }}
                >
                  <span className="poem-stage__flower-petal poem-stage__flower-petal--top" />
                  <span className="poem-stage__flower-petal poem-stage__flower-petal--left" />
                  <span className="poem-stage__flower-petal poem-stage__flower-petal--right" />
                  <span className="poem-stage__flower-center" />
                  <span className="poem-stage__flower-stem" />
                </span>
              ))
            : null}
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
            key={`${effect}-${playVersion}-${cycleVersion}`}
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
              key={`${playVersion}-${cycleVersion}-${lineIndex}`}
            >
              {lineIndex < visibleLines
                ? line.map((token, tokenIndex) => (
                    <AnimatedWord
                      key={`${playVersion}-${cycleVersion}-${lineIndex}-${tokenIndex}-${token.value}`}
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
