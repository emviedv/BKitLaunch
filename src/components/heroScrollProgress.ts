/**
 * Calculates a normalized scroll progress value for the hero animation.
 * Keeps the range slightly extended (-0.3..1.2) so parallax motion eases in/out.
 */
export interface HeroScrollMetrics {
  scrollY: number;
  heroTop: number;
  heroHeight: number;
}

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const calculateHeroScrollProgress = ({ scrollY, heroTop, heroHeight }: HeroScrollMetrics): number => {
  const safeHeight = heroHeight > 1 ? heroHeight : 1;
  const raw = (scrollY - heroTop) / safeHeight;
  // Allow a small negative window so the animation anticipates the scroll,
  // and a small overshoot for easing once the hero exits the viewport.
  return clamp(raw, -0.3, 1.2);
};

export const heroScrollDebugEnabled = (): boolean => {
  if (typeof process !== 'undefined' && process.env?.DEBUG_FIX) {
    return process.env.DEBUG_FIX !== '0';
  }

  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
    return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
  }

  return false;
};
