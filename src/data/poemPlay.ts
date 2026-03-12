import { MagicCombo, RewardCard } from '../types';

export const MAGIC_COMBOS: MagicCombo[] = [
  {
    id: 'rainbow-sun',
    label: 'Sun + Rainbow',
    words: ['sun', 'rainbow'],
    hint: 'Try rainbow with sun for a bright sky surprise.',
  },
  {
    id: 'moon-whisper',
    label: 'Moon + Whisper',
    words: ['moon', 'whisper'],
    hint: 'Moon loves whisper. Put them together for bedtime magic.',
  },
  {
    id: 'rain-splash',
    label: 'Rain + Splash',
    words: ['rain', 'splash'],
    hint: 'Rain and splash make puddle magic.',
  },
  {
    id: 'twinkle-moon',
    label: 'Twinkle + Moon',
    words: ['twinkle', 'moon'],
    hint: 'Twinkle and moon make a sleepy night sky.',
  },
  {
    id: 'happy-rainbow',
    label: 'Happy + Rainbow',
    words: ['happy', 'rainbow'],
    hint: 'Try happy with rainbow for a cheering celebration.',
  },
];

export const REWARD_LIBRARY: RewardCard[] = [
  {
    badge: 'STAR POEM',
    title: 'Star Poem',
    subtitle: 'Your words lit up the screen.',
    stickers: ['Gold Star', 'Tiny Spark', 'Moon Pin'],
  },
  {
    badge: 'SPLASH CLUB',
    title: 'Splash Club',
    subtitle: 'That poem made the puddles dance.',
    stickers: ['Blue Drop', 'Boot Sticker', 'Ripple Ring'],
  },
  {
    badge: 'BEDTIME MAGIC',
    title: 'Bedtime Magic',
    subtitle: 'Soft words made a dreamy little show.',
    stickers: ['Moon Badge', 'Sleepy Z', 'Night Dot'],
  },
  {
    badge: 'RAINBOW SHOW',
    title: 'Rainbow Show',
    subtitle: 'Bright colors and happy lines everywhere.',
    stickers: ['Rainbow Arc', 'Sun Button', 'Happy Dot'],
  },
  {
    badge: 'POEM POWER',
    title: 'Poem Power',
    subtitle: 'You woke up lots of magic words.',
    stickers: ['Floppy Star', 'Glow Disk', 'Smile Pixel'],
  },
];
