import { MagicWordDefinition } from '../types';

interface MagicWordListProps {
  words: MagicWordDefinition[];
}

export function MagicWordList({ words }: MagicWordListProps) {
  return (
    <section className="panel">
      <p className="panel__label">Magic Word Bank</p>
      <p className="helper-text">
        Try words like splash, twinkle, boom, flutter, rainbow...
      </p>
      <div className="magic-word-bank" aria-label="Magic words to try">
        {words.map((item) => (
          <div className="magic-chip" key={item.word}>
            <strong>{item.word}</strong>
            <span>{item.hint}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
