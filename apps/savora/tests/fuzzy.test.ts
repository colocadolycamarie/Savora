import { describe, it, expect } from 'vitest';
import { closestMatch } from '@/lib/fuzzy';

const NAMES = ['Wagyu Tartare', 'Heirloom Tomato', 'Aklan Oyster', 'Inasal Duck'];

describe('closestMatch', () => {
  it('suggests the closest name for a small typo', () => {
    expect(closestMatch('wagu tartare', NAMES)).toBe('Wagyu Tartare');
  });

  it('returns undefined for an empty query', () => {
    expect(closestMatch('', NAMES)).toBeUndefined();
  });

  it('returns undefined when nothing is close enough', () => {
    expect(closestMatch('spaceship', NAMES)).toBeUndefined();
  });

  it('does not suggest the query itself when it already matches exactly', () => {
    expect(closestMatch('Inasal Duck', NAMES)).toBeUndefined();
  });
});
