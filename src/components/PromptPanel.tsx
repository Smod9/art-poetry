import { PromptItem } from '../types';

interface PromptPanelProps {
  prompt: PromptItem;
  onSurpriseMe: () => void;
  onNextPrompt: () => void;
}

export function PromptPanel({ prompt, onSurpriseMe, onNextPrompt }: PromptPanelProps) {
  return (
    <section className="panel prompt-panel">
      <div>
        <p className="panel__label">Today&apos;s Magic Prompt</p>
        <p className="prompt-panel__text">{prompt.text}</p>
      </div>
      <div className="prompt-panel__actions">
        <button className="button" onClick={onSurpriseMe} type="button">
          <span className="button__icon" aria-hidden="true">🎁</span>
          <span>Surprise Me</span>
        </button>
        <button className="button button--secondary" onClick={onNextPrompt} type="button">
          <span className="button__icon" aria-hidden="true">↻</span>
          <span>Another Prompt</span>
        </button>
      </div>
    </section>
  );
}
