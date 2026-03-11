interface PoetryEditorProps {
  poem: string;
  onPoemChange: (value: string) => void;
  onPlay: () => void;
  onClear: () => void;
  onTryExample: () => void;
  rewardMessage: string;
  themeLabel: string;
  onToggleTheme: () => void;
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
}: PoetryEditorProps) {
  return (
    <section className="panel editor-panel">
      <div className="panel__row">
        <div>
          <p className="panel__label">Poetry Notebook</p>
          <p className="helper-text">
            Try words like splash, twinkle, boom, flutter, rainbow...
          </p>
        </div>
        <button className="button button--secondary" onClick={onToggleTheme} type="button">
          Theme: {themeLabel}
        </button>
      </div>

      <label className="sr-only" htmlFor="poem-input">
        Write your poem
      </label>
      <textarea
        className="poem-input"
        id="poem-input"
        onChange={(event) => onPoemChange(event.target.value)}
        placeholder={'moon says hello\nrain taps the roof\nsplash goes my boot'}
        rows={7}
        value={poem}
      />

      <div className="editor-panel__actions">
        <button className="button button--hero" onClick={onPlay} type="button">
          Play My Poem
        </button>
        <button className="button" onClick={onClear} type="button">
          Clear
        </button>
        <button className="button button--secondary" onClick={onTryExample} type="button">
          Try an Example
        </button>
      </div>

      <p className="reward-banner" role="status">
        {rewardMessage}
      </p>
    </section>
  );
}
