import { Fragment } from 'react';
import { MagicWordDefinition, ParsedToken } from '../types';

interface AnimatedWordProps {
  token: ParsedToken;
  trigger: MagicWordDefinition | null;
  reducedMotion: boolean;
}

function renderDecorations(effect: string) {
  switch (effect) {
    case 'splash':
      return (
        <span className="fx fx--droplets" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      );
    case 'boom':
      return <span className="fx fx--burst" aria-hidden="true">POP!</span>;
    case 'twinkle':
    case 'happy':
      return (
        <span className="fx fx--sparkles" aria-hidden="true">
          <span>✦</span>
          <span>✧</span>
          <span>•</span>
        </span>
      );
    case 'flutter':
      return (
        <span className="fx fx--flutter" aria-hidden="true">
          <span />
          <span />
        </span>
      );
    case 'rainbow':
      return <span className="fx fx--rainbow" aria-hidden="true" />;
    case 'rain':
    case 'snow':
      return (
        <span className={`fx fx--${effect}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      );
    case 'sun':
      return <span className="fx fx--sun" aria-hidden="true" />;
    case 'moon':
      return <span className="fx fx--moon" aria-hidden="true" />;
    case 'echo':
      return (
        <span className="fx fx--echo" aria-hidden="true">
          {Array.from({ length: 2 }).map((_, index) => (
            <span key={index}>•</span>
          ))}
        </span>
      );
    case 'sleepy':
      return (
        <span className="fx fx--sleepy" aria-hidden="true">
          <span>Z</span>
          <span>z</span>
          <span>•</span>
        </span>
      );
    default:
      return null;
  }
}

export function AnimatedWord({ token, trigger, reducedMotion }: AnimatedWordProps) {
  if (token.type === 'space') {
    return <Fragment>{token.value}</Fragment>;
  }

  if (!trigger) {
    return <span className="poem-token">{token.value}</span>;
  }

  return (
    <span
      className={[
        'poem-token',
        'poem-token--magic',
        `effect--${trigger.effect}`,
        reducedMotion ? 'effect--reduced' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="poem-token__text">{token.value}</span>
      {renderDecorations(trigger.effect)}
    </span>
  );
}
