import { CurrentWordPreview } from '../types';

interface MagicTypingPreviewProps {
  currentWord: CurrentWordPreview | null;
}

export function MagicTypingPreview({ currentWord }: MagicTypingPreviewProps) {
  return (
    <section className="panel typing-preview">
      <p className="panel__label">Magic Typing</p>
      {currentWord ? (
        <>
          <div className="typing-preview__word">
            <span className={currentWord.trigger ? 'typing-preview__word--magic' : ''}>
              {currentWord.value}
            </span>
          </div>
          <p className="helper-text">{currentWord.hint}</p>
        </>
      ) : (
        <p className="helper-text">Start typing and the last word will preview here.</p>
      )}
    </section>
  );
}
