import { ExamplePoem } from '../types';

interface ExamplePoemsProps {
  poems: ExamplePoem[];
  onLoadPoem: (poem: ExamplePoem) => void;
}

export function ExamplePoems({ poems, onLoadPoem }: ExamplePoemsProps) {
  return (
    <section className="panel">
      <p className="panel__label">Starter Poems</p>
      <div className="example-list">
        {poems.map((poem) => (
          <button
            className="example-card"
            key={poem.id}
            onClick={() => onLoadPoem(poem)}
            type="button"
          >
            <span className="example-card__title">✦ {poem.title}</span>
            <span className="example-card__preview">{poem.text.split('\n')[0]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
