/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Force fresh module per test to avoid module-level state leaking
let safeLoad, safeSave, KEYS, RANKS;
let readProfile, writeProfile, getBalance, addXP, spendXP, refundXP;
let getRank, getNextRank;

beforeEach(async () => {
  localStorage.clear();
  vi.resetModules();
  const mod = await import('./zen.js');
  safeLoad = mod.safeLoad;
  safeSave = mod.safeSave;
  KEYS = mod.KEYS;
  RANKS = mod.RANKS;
  readProfile = mod.readProfile;
  writeProfile = mod.writeProfile;
  getBalance = mod.getBalance;
  addXP = mod.addXP;
  spendXP = mod.spendXP;
  refundXP = mod.refundXP;
  getRank = mod.getRank;
  getNextRank = mod.getNextRank;
});

// --- safeLoad / safeSave ---

describe('safeLoad', () => {
  it('returns fallback when key does not exist', () => {
    expect(safeLoad('missing', 42)).toBe(42);
  });

  it('parses stored JSON', () => {
    localStorage.setItem('test', JSON.stringify({ a: 1 }));
    expect(safeLoad('test', null)).toEqual({ a: 1 });
  });

  it('returns fallback on corrupt JSON', () => {
    localStorage.setItem('bad', '{not json');
    expect(safeLoad('bad', 'default')).toBe('default');
  });
});

describe('safeSave', () => {
  it('saves value as JSON', () => {
    safeSave('key', { x: 1 });
    expect(localStorage.getItem('key')).toBe('{"x":1}');
  });
});

// --- Profile functions ---

describe('readProfile', () => {
  it('returns default when empty', () => {
    expect(readProfile()).toEqual({ totalXP: 0, spentXP: 0 });
  });

  it('reads stored profile', () => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify({ totalXP: 100, spentXP: 20, habits: [] }));
    const p = readProfile();
    expect(p.totalXP).toBe(100);
    expect(p.spentXP).toBe(20);
  });
});

describe('addXP', () => {
  it('adds XP to empty profile', () => {
    addXP(50);
    expect(readProfile().totalXP).toBe(50);
    expect(readProfile().spentXP).toBe(0);
  });

  it('accumulates XP', () => {
    addXP(30);
    addXP(20);
    expect(readProfile().totalXP).toBe(50);
  });
});

describe('spendXP', () => {
  it('deducts from balance', () => {
    addXP(100);
    const ok = spendXP(40);
    expect(ok).toBe(true);
    expect(readProfile().spentXP).toBe(40);
  });

  it('refuses when insufficient balance', () => {
    addXP(10);
    const ok = spendXP(20);
    expect(ok).toBe(false);
    expect(readProfile().spentXP).toBe(0);
  });

  it('allows spending exact balance', () => {
    addXP(50);
    expect(spendXP(50)).toBe(true);
    expect(getBalance()).toBe(0);
  });
});

describe('refundXP', () => {
  it('reduces spentXP', () => {
    addXP(100);
    spendXP(60);
    refundXP(25);
    expect(readProfile().spentXP).toBe(35);
  });

  it('does not go below zero', () => {
    addXP(10);
    spendXP(5);
    refundXP(999);
    expect(readProfile().spentXP).toBe(0);
  });
});

describe('getBalance', () => {
  it('returns totalXP - spentXP', () => {
    addXP(100);
    spendXP(30);
    expect(getBalance()).toBe(70);
  });
});

describe('writeProfile', () => {
  it('preserves extra fields', () => {
    const profile = { totalXP: 50, spentXP: 10, habits: ['a'] };
    writeProfile(profile);
    const loaded = readProfile();
    expect(loaded.habits).toEqual(['a']);
  });
});

// --- Rank helpers ---

describe('getRank', () => {
  it('returns first rank at 0 XP', () => {
    expect(getRank(0).name).toBe('凡夫');
  });

  it('returns correct rank at boundary', () => {
    expect(getRank(100).name).toBe('信心');
  });

  it('returns highest rank at max XP', () => {
    expect(getRank(999999).name).toBe('妙觉');
  });
});

describe('getNextRank', () => {
  it('returns second rank for 0 XP', () => {
    expect(getNextRank(0).name).toBe('信心');
  });

  it('returns null at max rank', () => {
    expect(getNextRank(999999)).toBeNull();
  });
});

// --- RANKS data integrity ---

describe('RANKS', () => {
  it('has 13 ranks', () => {
    expect(RANKS).toHaveLength(13);
  });

  it('is sorted by XP ascending', () => {
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].xp).toBeGreaterThan(RANKS[i - 1].xp);
    }
  });
});
