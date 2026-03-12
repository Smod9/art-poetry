interface HelperBuddyProps {
  helperMessage: string;
  meterValue: number;
  meterLabel: string;
}

export function HelperBuddy({
  helperMessage,
  meterValue,
  meterLabel,
}: HelperBuddyProps) {
  return (
    <section className="panel helper-buddy">
      <div className="helper-buddy__top">
        <div className="helper-buddy__avatar" aria-hidden="true">
          <span>*</span>
        </div>
        <div>
          <p className="panel__label">Pixel Helper</p>
          <p className="helper-buddy__message">{helperMessage}</p>
        </div>
      </div>

      <div className="magic-meter" aria-label={meterLabel}>
        <div className="magic-meter__bar">
          <span style={{ width: `${meterValue}%` }} />
        </div>
        <p className="helper-text">{meterLabel}</p>
      </div>
    </section>
  );
}
