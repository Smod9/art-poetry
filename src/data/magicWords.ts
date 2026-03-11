import { MagicWordDefinition, PromptItem } from '../types';

export const MAGIC_WORDS: MagicWordDefinition[] = [
  { word: 'splash', effect: 'splash', hint: 'little droplets and a ripple', stageBurst: true },
  { word: 'boom', effect: 'boom', hint: 'comic-style pop burst', stageBurst: true },
  { word: 'twinkle', effect: 'twinkle', hint: 'tiny stars sparkle' },
  { word: 'flutter', effect: 'flutter', hint: 'wiggles upward like a butterfly' },
  { word: 'rainbow', effect: 'rainbow', hint: 'a rainbow arc appears', stageBurst: true },
  { word: 'rain', effect: 'rain', hint: 'soft falling raindrops', stageBurst: true },
  { word: 'sun', effect: 'sun', hint: 'warm glowing sunburst' },
  { word: 'moon', effect: 'moon', hint: 'soft moon glow' },
  { word: 'jump', effect: 'jump', hint: 'a quick hop' },
  { word: 'spin', effect: 'spin', hint: 'spins once' },
  { word: 'fall', effect: 'fall', hint: 'drifts downward' },
  { word: 'whisper', effect: 'whisper', hint: 'fades and floats softly' },
  { word: 'echo', effect: 'echo', hint: 'leaves a ghost trail' },
  { word: 'wave', effect: 'wave', hint: 'wavy text motion' },
  { word: 'bounce', effect: 'bounce', hint: 'gentle bounce' },
  { word: 'snow', effect: 'snow', hint: 'snowflakes tumble down', stageBurst: true },
  { word: 'grow', effect: 'grow', hint: 'gets bigger for a moment' },
  { word: 'tiny', effect: 'tiny', hint: 'shrinks playfully' },
  { word: 'happy', effect: 'happy', hint: 'smiley sparkles and confetti' },
  { word: 'sleepy', effect: 'sleepy', hint: 'drifting Zs and soft dots' },
];

export const MAGIC_WORD_MAP = Object.fromEntries(
  MAGIC_WORDS.map((item) => [item.word, item]),
) as Record<string, MagicWordDefinition>;

export const PROMPTS: PromptItem[] = [
  { id: 'rain', text: 'Write about rain tapping on the window.' },
  { id: 'bedtime', text: 'Write about bedtime with moon, sleepy, and whisper.' },
  { id: 'dragon', text: 'Write about a dragon who can twinkle.' },
  { id: 'ocean', text: 'Write about the ocean using splash and wave.' },
  { id: 'three-line', text: 'Write a 3-line poem using splash, moon, and whisper.' },
  { id: 'sunny', text: 'Write about a rainbow under a happy sun.' },
];
