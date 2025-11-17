import { debugService } from '../lib/debugService.ts';
import { heroScrollDebugEnabled } from './heroScrollProgress.ts';

export interface HeroBackgroundLogPayload {
  hasHeroContent: boolean;
  comingSoonEnabled: boolean;
  backgroundEnabled: boolean;
}

export type HeroBackgroundLogger = (message: string, data: HeroBackgroundLogPayload) => void;

/**
 * Logs hero background state; default logger is always invoked so instrumentation
 * remains visible without requiring DEBUG_FIX toggles.
 */
export const logLandingHeroBackgroundState = (
  payload: HeroBackgroundLogPayload,
  logger: HeroBackgroundLogger = (message, data) => {
    debugService.info(message, data);
  }
) => {
  logger('hero:landing-background-active', payload);
};

export interface HeroHeadlineLogPayload {
  component: 'Hero' | 'LandingHero' | 'ProductHero';
  title?: string | null;
  firstSentence: string;
  remainderLength: number;
}

export const logHeroHeadlineSplit = (payload: HeroHeadlineLogPayload) => {
  if (!heroScrollDebugEnabled()) {
    return;
  }

  debugService.debug('hero:headline-gradient', payload);
};
