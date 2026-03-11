import { ReactNode } from 'react';
import { ThemeName } from '../types';

interface RetroFrameProps {
  children: ReactNode;
  theme: ThemeName;
}

export function RetroFrame({ children, theme }: RetroFrameProps) {
  return (
    <div className={`app-shell theme-${theme}`}>
      <div className="crt-noise" aria-hidden="true" />
      <div className="retro-frame">
        <div className="retro-frame__bezel" />
        <div className="retro-frame__content">{children}</div>
      </div>
    </div>
  );
}
