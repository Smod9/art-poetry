import { MAGIC_WORD_MAP } from '../data/magicWords';
import { MagicWordDefinition, ParsedToken } from '../types';

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
  if (!normalized) {
    return null;
  }

  return MAGIC_WORD_MAP[normalized] ?? null;
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
