export type HeroMotionOverride = 'on' | 'off' | 'auto' | null;

export interface HeroMotionState {
  shouldAnimate: boolean;
  override: HeroMotionOverride;
  prefersReducedMotion: boolean;
}

const readDatasetOverride = (): HeroMotionOverride => {
  if (typeof document === 'undefined') {
    return null;
  }

  const value = document.documentElement?.dataset?.heroMotion;
  if (!value) return null;

  if (value === 'on' || value === 'off' || value === 'auto') {
    return value;
  }

  return null;
};

const detectPrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/**
 * Determines whether hero motion effects should animate.
 * Allows overriding the OS preference via <body data-hero-motion="on|off|auto">.
 */
export const resolveHeroMotionPreference = (): HeroMotionState => {
  const override = readDatasetOverride();
  const prefersReducedMotion = detectPrefersReducedMotion();

  if (override === 'on') {
    return { shouldAnimate: true, override, prefersReducedMotion };
  }

  if (override === 'off') {
    return { shouldAnimate: false, override, prefersReducedMotion };
  }

  // Treat null and 'auto' the same: respect the OS preference.
  const shouldAnimate = !(prefersReducedMotion && override !== 'auto');

  return { shouldAnimate, override, prefersReducedMotion };
};
