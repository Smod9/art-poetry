import { MAGIC_WORD_MAP } from '../data/magicWords';
import { MAGIC_COMBOS, REWARD_LIBRARY } from '../data/poemPlay';
import {
  CurrentWordPreview,
  MagicCombo,
  MagicWordDefinition,
  ParsedToken,
  PoemAnalysis,
  RewardCard,
} from '../types';

const TOKEN_REGEX = /(\s+|[\p{L}]+(?:'[\p{L}]+)?|[^\s\p{L}]+)/gu;

export function parsePoemLines(poem: string): ParsedToken[][] {
  return poem.split(/\r?\n/).map((line) => tokenizeLine(line));
}

export function tokenizeLine(line: string): ParsedToken[] {
  const matches = line.match(TOKEN_REGEX) ?? [];

  return matches.map((token) => {
    if (/^\s+$/u.test(token)) {
      return { value: token, type: 'space', normalized: null };
    }

    if (/^[\p{L}]+(?:'[\p{L}]+)?$/u.test(token)) {
      return {
        value: token,
        type: 'word',
        normalized: token.toLowerCase(),
      };
    }

    return { value: token, type: 'punctuation', normalized: null };
  });
}

export function getMagicWord(normalized: string | null): MagicWordDefinition | null {
  const match = getMagicWordKey(normalized);
  return match ? MAGIC_WORD_MAP[match] : null;
}

export function getMagicWordKey(normalized: string | null): string | null {
  if (!normalized) {
    return null;
  }

  if (MAGIC_WORD_MAP[normalized]) {
    return normalized;
  }

  const match = Object.keys(MAGIC_WORD_MAP)
    .filter((word) => normalized.includes(word))
    .sort((left, right) => right.length - left.length)[0];

  return match ?? null;
}

export function countMagicWords(poem: string): number {
  return parsePoemLines(poem).reduce((count, line) => {
    return (
      count +
      line.filter((token) => token.type === 'word' && getMagicWord(token.normalized)).length
    );
  }, 0);
}

export function buildRewardMessage(poem: string): string {
  const magicCount = countMagicWords(poem);

  if (!poem.trim()) {
    return 'Type a poem and press Play My Poem.';
  }

  if (magicCount === 0) {
    return 'Lovely poem! Try a magic word to add tiny surprises.';
  }

  if (magicCount === 1) {
    return 'Lovely poem! Magic words found: 1';
  }

  return `Lovely poem! Magic words found: ${magicCount}`;
}

export function getWordCounts(poem: string): Record<string, number> {
  return parsePoemLines(poem)
    .flat()
    .reduce<Record<string, number>>((counts, token) => {
      if (token.type !== 'word' || !token.normalized) {
        return counts;
      }

      const countKey = getMagicWordKey(token.normalized) ?? token.normalized;
      counts[countKey] = (counts[countKey] ?? 0) + 1;
      return counts;
    }, {});
}

export function getCurrentWordPreview(poem: string): CurrentWordPreview | null {
  const match = poem.match(/([\p{L}']+)$/u);

  if (!match) {
    return null;
  }

  const value = match[1];
  const normalized = value.toLowerCase();
  const trigger = getMagicWord(normalized);

  if (trigger) {
    return {
      value,
      trigger,
      hint: `${trigger.word} is ready for ${trigger.hint}.`,
    };
  }

  return {
    value,
    trigger: null,
    hint: 'Keep typing. A magic word can wake up the page.',
  };
}

export function findMagicCombos(wordCounts: Record<string, number>): MagicCombo[] {
  return MAGIC_COMBOS.filter((combo) => combo.words.every((word) => (wordCounts[word] ?? 0) > 0));
}

function buildMeterLabel(magicCount: number): string {
  if (magicCount === 0) {
    return 'Magic meter: sleeping';
  }

  if (magicCount < 3) {
    return 'Magic meter: warming up';
  }

  if (magicCount < 6) {
    return 'Magic meter: sparkling';
  }

  return 'Magic meter: glowing';
}

function chooseReward(
  wordCounts: Record<string, number>,
  combos: MagicCombo[],
  magicCount: number,
): RewardCard {
  if (
    (wordCounts.flower ?? 0) > 0 ||
    (wordCounts.grass ?? 0) > 0 ||
    (wordCounts.seed ?? 0) > 0 ||
    combos.some((combo) => combo.id === 'seed-grow' || combo.id === 'flower-sun')
  ) {
    return REWARD_LIBRARY[5];
  }

  if ((wordCounts.rain ?? 0) > 0 && (wordCounts.splash ?? 0) > 0) {
    return REWARD_LIBRARY[1];
  }

  if ((wordCounts.moon ?? 0) > 0 && ((wordCounts.whisper ?? 0) > 0 || (wordCounts.sleepy ?? 0) > 0)) {
    return REWARD_LIBRARY[2];
  }

  if ((wordCounts.rainbow ?? 0) > 0 || (wordCounts.happy ?? 0) > 0 || combos.length > 0) {
    return REWARD_LIBRARY[3];
  }

  if (magicCount >= 5) {
    return REWARD_LIBRARY[4];
  }

  return REWARD_LIBRARY[0];
}

function buildHelperMessage(
  poem: string,
  magicCount: number,
  currentWord: CurrentWordPreview | null,
  wordCounts: Record<string, number>,
  combos: MagicCombo[],
): string {
  if (!poem.trim()) {
    return 'I am Pixel, your poem pal. Try a tiny 3-line poem with moon, splash, flower, or twinkle.';
  }

  if (currentWord?.trigger) {
    return `${currentWord.value} is one of the magic words. Press Play My Poem to wake it up.`;
  }

  if (combos.length > 0) {
    return `You found ${combos[0].label}. Press play for the big-screen show.`;
  }

  const partialCombo = MAGIC_COMBOS.find((combo) =>
    combo.words.some((word) => (wordCounts[word] ?? 0) > 0) &&
    !combo.words.every((word) => (wordCounts[word] ?? 0) > 0),
  );

  if (partialCombo) {
    return partialCombo.hint;
  }

  if (magicCount === 0) {
    return 'Try adding splash, flower, grass, whisper, rainbow, or boom for extra reactions.';
  }

  return 'Nice poem. Add one more magic word or press Play My Poem.';
}

export function analyzePoem(poem: string): PoemAnalysis {
  const wordCounts = getWordCounts(poem);
  const magicWords = Object.keys(wordCounts).filter((word) => getMagicWord(word));
  const magicCount = magicWords.reduce((total, word) => total + (wordCounts[word] ?? 0), 0);
  const currentWord = getCurrentWordPreview(poem);
  const combos = findMagicCombos(wordCounts);

  return {
    magicCount,
    uniqueMagicCount: magicWords.length,
    wordCounts,
    combos,
    currentWord,
    meterLabel: buildMeterLabel(magicCount),
    meterValue: Math.min(100, Math.round((magicCount / 6) * 100)),
    reward: chooseReward(wordCounts, combos, magicCount),
    helperMessage: buildHelperMessage(poem, magicCount, currentWord, wordCounts, combos),
    atmosphere: {
      rain: (wordCounts.rain ?? 0) > 0 || combos.some((combo) => combo.id === 'rain-splash'),
      snow: (wordCounts.snow ?? 0) > 0,
      sun: (wordCounts.sun ?? 0) > 0,
      moon: (wordCounts.moon ?? 0) > 0,
      rainbow: (wordCounts.rainbow ?? 0) > 0,
      twinkle: (wordCounts.twinkle ?? 0) > 0,
      happy: (wordCounts.happy ?? 0) > 0,
      sleepy: (wordCounts.sleepy ?? 0) > 0 || (wordCounts.whisper ?? 0) > 0,
      boom: (wordCounts.boom ?? 0) > 0,
      grass:
        (wordCounts.grass ?? 0) > 0 ||
        combos.some((combo) => combo.id === 'seed-grow' || combo.id === 'grass-rain'),
      cloud: (wordCounts.cloud ?? 0) > 0 || combos.some((combo) => combo.id === 'cloud-rainbow'),
      tree: (wordCounts.tree ?? 0) > 0,
      bloom:
        (wordCounts.bloom ?? 0) > 0 ||
        (wordCounts.flower ?? 0) > 0 ||
        combos.some((combo) => combo.id === 'flower-sun'),
    },
  };
}
