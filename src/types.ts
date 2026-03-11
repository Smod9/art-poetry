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
