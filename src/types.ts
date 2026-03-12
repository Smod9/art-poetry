export type ThemeName = 'computer-lab' | 'rainbow-terminal';

export type TriggerEffect =
  | 'splash'
  | 'boom'
  | 'twinkle'
  | 'flutter'
  | 'rainbow'
  | 'rain'
  | 'sun'
  | 'moon'
  | 'jump'
  | 'spin'
  | 'fall'
  | 'whisper'
  | 'echo'
  | 'wave'
  | 'bounce'
  | 'snow'
  | 'grow'
  | 'tiny'
  | 'happy'
  | 'sleepy';

export interface MagicWordDefinition {
  word: string;
  effect: TriggerEffect;
  hint: string;
  stageBurst?: boolean;
}

export interface ExamplePoem {
  id: string;
  title: string;
  text: string;
}

export interface PromptItem {
  id: string;
  text: string;
}

export interface ParsedToken {
  value: string;
  type: 'word' | 'space' | 'punctuation';
  normalized: string | null;
}

export interface MagicCombo {
  id: string;
  label: string;
  words: string[];
  hint: string;
}

export interface RewardCard {
  badge: string;
  title: string;
  subtitle: string;
  stickers: string[];
}

export interface CurrentWordPreview {
  value: string;
  trigger: MagicWordDefinition | null;
  hint: string;
}

export interface PoemAnalysis {
  magicCount: number;
  uniqueMagicCount: number;
  wordCounts: Record<string, number>;
  combos: MagicCombo[];
  helperMessage: string;
  currentWord: CurrentWordPreview | null;
  meterLabel: string;
  meterValue: number;
  reward: RewardCard;
  atmosphere: {
    rain: boolean;
    snow: boolean;
    sun: boolean;
    moon: boolean;
    rainbow: boolean;
    twinkle: boolean;
    happy: boolean;
    sleepy: boolean;
    boom: boolean;
  };
}
