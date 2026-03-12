interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <section className="title-screen panel">
      <p className="title-screen__eyebrow">HOME COMPUTER POETRY TOY</p>
      <h1 className="title-screen__title">Magic Words</h1>
      <p className="title-screen__subtitle">
        Type a tiny poem. Watch special words wake up.
      </p>

      <div className="title-screen__marquee" aria-hidden="true">
        <span>TWINKLE</span>
        <span>SPLASH</span>
        <span>RAINBOW</span>
        <span>WHISPER</span>
      </div>

      <div className="title-screen__computer">
        <div className="title-screen__screen">
          <div className="title-screen__demo-line">moon and rainbow</div>
          <div className="title-screen__demo-line">splash in the rain</div>
          <div className="title-screen__demo-line">twinkle again</div>
        </div>
      </div>

      <button className="button button--hero" onClick={onStart} type="button">
        <span className="button__icon" aria-hidden="true">▶</span>
        <span>Press Start</span>
      </button>
      <p className="title-screen__hint">Big buttons. No login. Just poems and tiny magic.</p>
    </section>
  );
}
