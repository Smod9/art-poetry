import { useMemo, useState } from 'react';
import { ExamplePoem, ThemeName } from './types';
import { EXAMPLE_POEMS } from './data/examples';
import { MAGIC_WORDS, PROMPTS } from './data/magicWords';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { RetroFrame } from './components/RetroFrame';
import { TitleScreen } from './components/TitleScreen';
import { PromptPanel } from './components/PromptPanel';
import { PoetryEditor } from './components/PoetryEditor';
import { MagicWordList } from './components/MagicWordList';
import { PoemStage } from './components/PoemStage';
import { ExamplePoems } from './components/ExamplePoems';

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
  const [screen, setScreen] = useState<'title' | 'editor'>('title');
  const [theme, setTheme] = useState<ThemeName>('computer-lab');
  const [poem, setPoem] = useState(EXAMPLE_POEMS[0].text);
  const [stagedPoem, setStagedPoem] = useState('');
  const [playVersion, setPlayVersion] = useState(0);
  const [rewardMessage, setRewardMessage] = useState(READY_MESSAGE);
  const [promptIndex, setPromptIndex] = useState(getPromptOfTheDay());
  const reducedMotion = usePrefersReducedMotion();

  const themeLabel = useMemo(
    () => (theme === 'computer-lab' ? 'Computer Lab' : 'Rainbow Terminal'),
    [theme],
  );

  function handleLoadPoem(example: ExamplePoem) {
    setPoem(example.text);
    setRewardMessage(READY_MESSAGE);
  }

  function handlePoemChange(value: string) {
    setPoem(value);
    setRewardMessage(READY_MESSAGE);
  }

  function handlePlay() {
    setStagedPoem(poem);
    setPlayVersion((value) => value + 1);
  }

  function handleClear() {
    setPoem('');
    setStagedPoem('');
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
        <TitleScreen onStart={() => setScreen('editor')} />
      ) : (
        <main className="app-grid">
          <header className="topbar">
            <div>
              <p className="topbar__tiny">MAGIC WORDS</p>
              <h1 className="topbar__title">Poetry Notebook</h1>
            </div>
            <button className="button button--secondary" onClick={() => setScreen('title')} type="button">
              Title Screen
            </button>
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
              />
              <ExamplePoems poems={EXAMPLE_POEMS} onLoadPoem={handleLoadPoem} />
            </div>

            <aside className="app-grid__right">
              <MagicWordList words={MAGIC_WORDS.slice(0, 10)} />
              <PoemStage
                poem={stagedPoem}
                playVersion={playVersion}
                reducedMotion={reducedMotion}
                onPlaybackDone={setRewardMessage}
              />
            </aside>
          </div>
        </main>
      )}
    </RetroFrame>
  );
}
