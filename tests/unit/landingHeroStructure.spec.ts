import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../src/components/LandingHero.tsx', import.meta.url), 'utf8');

test('Landing hero mirrors UXBiblio layout tokens', () => {
  const expectedTokens = [
    'landing-hero-gradient section-hero relative -mt-16 overflow-hidden pt-24 pb-0',
    'section-hero relative -mt-16 overflow-hidden pt-24 pb-0',
    'relative z-10 mx-auto w-11/12 px-6 text-center sm:w-5/6 sm:px-8 md:w-[70%] md:px-10',
    'mx-auto flex max-w-4xl flex-col items-center justify-center space-y-8',
    'inline-flex items-center gap-2 rounded-full border border-[#6580E1] bg-white/10 px-4 py-2 text-sm font-medium text-white supports-[backdrop-filter]:bg-white/20',
    'text-[72px] font-bold leading-[1.05] tracking-tight',
    'buildHeroHeadlineSegments({',
    "const isSubtitle = segment.key === 'subtitle'",
    "const baseClass = isSubtitle",
    'mx-auto max-w-2xl ${HERO_DESCRIPTION_CLASS}',
    'relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'
  ];

  for (const token of expectedTokens) {
    assert.ok(
      SOURCE.includes(token),
      `Landing hero markup should contain "${token}"`
    );
  }
});
