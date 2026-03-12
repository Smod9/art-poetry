import { useEffect, useMemo, useState } from 'react';
import { ExamplePoem, ThemeName } from './types';
import { EXAMPLE_POEMS } from './data/examples';
import { MAGIC_WORDS, PROMPTS } from './data/magicWords';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { RetroFrame } from './components/RetroFrame';
import { TitleScreen } from './components/TitleScreen';
import { PromptPanel } from './components/PromptPanel';
import { PoetryEditor } from './components/PoetryEditor';
import { MagicWordList } from './components/MagicWordList';
import { ExamplePoems } from './components/ExamplePoems';
import { PlaybackModal } from './components/PlaybackModal';
import { BootSequence } from './components/BootSequence';
import { analyzePoem } from './utils/poem';
import { startRetroMusicLoop, stopRetroMusicLoop } from './utils/sound';

const READY_MESSAGE = 'Press Play My Poem to watch the magic.';

function getPromptOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const day = Math.floor(diff / 86400000);
  return day % PROMPTS.length;
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export default function App() {
  const [screen, setScreen] = useState<'title' | 'boot' | 'editor'>('title');
  const [theme, setTheme] = useState<ThemeName>('computer-lab');
  const [poem, setPoem] = useState(EXAMPLE_POEMS[0].text);
  const [stagedPoem, setStagedPoem] = useState('');
  const [playVersion, setPlayVersion] = useState(0);
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rewardMessage, setRewardMessage] = useState(READY_MESSAGE);
  const [promptIndex, setPromptIndex] = useState(getPromptOfTheDay());
  const reducedMotion = usePrefersReducedMotion();
  const poemAnalysis = useMemo(() => analyzePoem(poem), [poem]);
  const stagedAnalysis = useMemo(() => analyzePoem(stagedPoem), [stagedPoem]);

  const themeLabel = useMemo(
    () => (theme === 'computer-lab' ? 'Computer Lab' : 'Rainbow Terminal'),
    [theme],
  );

  useEffect(() => {
    if (!soundEnabled) {
      stopRetroMusicLoop();
      return;
    }

    startRetroMusicLoop();

    const unlockMusic = () => startRetroMusicLoop();

    window.addEventListener('pointerdown', unlockMusic);
    window.addEventListener('keydown', unlockMusic);
    window.addEventListener('touchstart', unlockMusic, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockMusic);
      window.removeEventListener('keydown', unlockMusic);
      window.removeEventListener('touchstart', unlockMusic);
      stopRetroMusicLoop();
    };
  }, [soundEnabled]);

  function handleLoadPoem(example: ExamplePoem) {
    setPoem(example.text);
    setRewardMessage(READY_MESSAGE);
  }

  function handlePoemChange(value: string) {
    setPoem(value);
    setRewardMessage(READY_MESSAGE);
  }

  function handlePlay() {
    if (!poem.trim()) {
      setRewardMessage('Type a poem and press Play My Poem.');
      return;
    }

    setStagedPoem(poem);
    setIsPlaybackOpen(true);
    setPlayVersion((value) => value + 1);
  }

  function handleClear() {
    setPoem('');
    setStagedPoem('');
    setIsPlaybackOpen(false);
    setRewardMessage('Type a poem and press Play My Poem.');
  }

  function handleTryExample() {
    handleLoadPoem(getRandomItem(EXAMPLE_POEMS));
  }

  function handleSurpriseMe() {
    handleLoadPoem(getRandomItem(EXAMPLE_POEMS));
  }

  function handleNextPrompt() {
    setPromptIndex((value) => (value + 1) % PROMPTS.length);
  }

  return (
    <RetroFrame theme={theme}>
      {screen === 'title' ? (
        <TitleScreen onStart={() => setScreen('boot')} />
      ) : screen === 'boot' ? (
        <BootSequence onDone={() => setScreen('editor')} />
      ) : (
        <main className="app-grid">
          <header className="topbar">
            <div>
              <p className="topbar__tiny">MAGIC WORDS</p>
              <h1 className="topbar__title">Poetry Notebook</h1>
            </div>
            <div className="topbar__actions">
              <button
                className="button button--secondary button--speaker"
                onClick={() => setSoundEnabled((value) => !value)}
                type="button"
              >
                <span className="button__icon" aria-hidden="true">{soundEnabled ? '🔊' : '🔈'}</span>
                <span>{soundEnabled ? 'Speaker On' : 'Speaker Off'}</span>
              </button>
              <button className="button button--secondary" onClick={() => setScreen('title')} type="button">
                <span className="button__icon" aria-hidden="true">⌂</span>
                <span>Title Screen</span>
              </button>
            </div>
          </header>

          <div className="app-grid__main">
            <div className="app-grid__left">
              <PromptPanel
                prompt={PROMPTS[promptIndex]}
                onSurpriseMe={handleSurpriseMe}
                onNextPrompt={handleNextPrompt}
              />
              <PoetryEditor
                poem={poem}
                onPoemChange={handlePoemChange}
                onPlay={handlePlay}
                onClear={handleClear}
                onTryExample={handleTryExample}
                rewardMessage={rewardMessage}
                themeLabel={themeLabel}
                onToggleTheme={() =>
                  setTheme((value) =>
                    value === 'computer-lab' ? 'rainbow-terminal' : 'computer-lab',
                  )
                }
                helperMessage={poemAnalysis.helperMessage}
                meterValue={poemAnalysis.meterValue}
                meterLabel={poemAnalysis.meterLabel}
                currentWord={poemAnalysis.currentWord}
              />
              <ExamplePoems poems={EXAMPLE_POEMS} onLoadPoem={handleLoadPoem} />
            </div>

            <aside className="app-grid__right">
              <MagicWordList words={MAGIC_WORDS} />
              <section className="panel playback-preview">
                <p className="panel__label">Poem Theater</p>
                <p className="helper-text">
                  Press <strong>Play My Poem</strong> to open a big reading screen with all the
                  animations.
                </p>
                <p className="reward-banner playback-preview__message" role="status">
                  {rewardMessage}
                </p>
              </section>
            </aside>
          </div>
        </main>
      )}
      <PlaybackModal
        open={isPlaybackOpen}
        poem={stagedPoem}
        playVersion={playVersion}
        reducedMotion={reducedMotion}
        rewardMessage={rewardMessage}
        analysis={stagedAnalysis}
        onReplay={() => setPlayVersion((value) => value + 1)}
        onClose={() => setIsPlaybackOpen(false)}
        onPlaybackDone={setRewardMessage}
      />
    </RetroFrame>
  );
}
