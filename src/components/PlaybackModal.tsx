import { useEffect } from 'react';
import { PoemAnalysis } from '../types';
import { PoemStage } from './PoemStage';

interface PlaybackModalProps {
  open: boolean;
  poem: string;
  playVersion: number;
  reducedMotion: boolean;
  rewardMessage: string;
  analysis: PoemAnalysis;
  onReplay: () => void;
  onClose: () => void;
  onPlaybackDone: (reward: string) => void;
}

export function PlaybackModal({
  open,
  poem,
  playVersion,
  reducedMotion,
  rewardMessage,
  analysis,
  onReplay,
  onClose,
  onPlaybackDone,
}: PlaybackModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="playback-modal"
      onClick={onClose}
      role="dialog"
      aria-label="Poem playback"
    >
      <div className="playback-modal__backdrop" />
      <div className="playback-modal__window panel" onClick={(event) => event.stopPropagation()}>
        <div className="panel__row playback-modal__header">
          <div>
            <p className="panel__label">Now Playing</p>
            <p className="poem-stage__status">Big-screen poem magic.</p>
          </div>
          <div className="playback-modal__actions">
            <button className="button button--secondary" onClick={onReplay} type="button">
              Read It Again
            </button>
            <button className="button" onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>

        <PoemStage
          poem={poem}
          playVersion={playVersion}
          reducedMotion={reducedMotion}
          onPlaybackDone={onPlaybackDone}
          variant="modal"
          analysis={analysis}
        />

        <section className="playback-modal__footer">
          <div className="reward-card" role="status">
            <p className="reward-card__badge">{analysis.reward.badge}</p>
            <h2 className="reward-card__title">{analysis.reward.title}</h2>
            <p className="reward-card__text">{rewardMessage}</p>
            <p className="reward-card__text">{analysis.reward.subtitle}</p>
          </div>

          <div className="sticker-shelf" aria-label="Poem stickers">
            {analysis.reward.stickers.map((sticker) => (
              <span className="sticker-shelf__item" key={sticker}>
                {sticker}
              </span>
            ))}
            {analysis.combos.map((combo) => (
              <span className="sticker-shelf__item sticker-shelf__item--combo" key={combo.id}>
                {combo.label}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
