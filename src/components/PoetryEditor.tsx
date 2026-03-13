import type { KeyboardEvent } from 'react';
import { CurrentWordPreview } from '../types';
import { HelperBuddy } from './HelperBuddy';
import { MagicTypingPreview } from './MagicTypingPreview';

interface PoetryEditorProps {
  poem: string;
  onPoemChange: (value: string) => void;
  onPlay: () => void;
  onClear: () => void;
  onTryExample: () => void;
  rewardMessage: string;
  themeLabel: string;
  onToggleTheme: () => void;
  helperMessage: string;
  meterValue: number;
  meterLabel: string;
  currentWord: CurrentWordPreview | null;
}

export function PoetryEditor({
  poem,
  onPoemChange,
  onPlay,
  onClear,
  onTryExample,
  rewardMessage,
  themeLabel,
  onToggleTheme,
  helperMessage,
  meterValue,
  meterLabel,
  currentWord,
}: PoetryEditorProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      onPlay();
    }
  }

  return (
    <section className="panel editor-panel">
      <div className="panel__row">
        <div>
          <p className="panel__label">Poetry Notebook</p>
          <p className="helper-text">
            Try words like splash, twinkle, boom, flutter, rainbow...
          </p>
        </div>
      </div>

      <label className="sr-only" htmlFor="poem-input">
        Write your poem
      </label>
      <textarea
        className="poem-input"
        id="poem-input"
        onChange={(event) => onPoemChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={'moon says hello\nrain taps the roof\nsplash goes my boot'}
        rows={7}
        value={poem}
      />

      <div className="editor-panel__actions">
        <button className="button button--hero" onClick={onPlay} type="button">
          <span className="button__icon" aria-hidden="true">▶</span>
          <span>Play My Poem</span>
        </button>
        <button className="button" onClick={onClear} type="button">
          <span className="button__icon" aria-hidden="true">⌫</span>
          <span>Clear</span>
        </button>
        <button className="button button--secondary" onClick={onTryExample} type="button">
          <span className="button__icon" aria-hidden="true">✨</span>
          <span>Try an Example</span>
        </button>
      </div>

      <div className="editor-panel__extras">
        <MagicTypingPreview currentWord={currentWord} />

        <div className="helper-buddy helper-buddy--inline">
          <HelperBuddy
            helperMessage={helperMessage}
            meterValue={meterValue}
            meterLabel={meterLabel}
          />

          <div className="editor-panel__mini-actions">
            <button className="button button--secondary" onClick={onToggleTheme} type="button">
              <span className="button__icon" aria-hidden="true">🎨</span>
              <span>Theme: {themeLabel}</span>
            </button>
          </div>
        </div>
      </div>

      <p className="reward-banner" role="status">
        {rewardMessage}
      </p>
    </section>
  );
}
