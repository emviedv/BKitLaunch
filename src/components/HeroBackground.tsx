import React, { useEffect } from 'react';
import { debugService } from '@/lib/debugService';
import { heroScrollDebugEnabled } from './heroScrollProgress';

export interface HeroBackgroundProps {
  className?: string;
  variant?: 'color' | 'white';
}

let hasLoggedRemoval = false;

/**
 * HeroBackground is now a no-op placeholder so existing imports remain stable.
 * We log once (when DEBUG_FIX is enabled) to indicate the background has been removed.
 */
export const HeroBackground: React.FC<HeroBackgroundProps> = () => {
  useEffect(() => {
    if (heroScrollDebugEnabled() && !hasLoggedRemoval) {
      hasLoggedRemoval = true;
      debugService.info('hero-background:removed', { backgroundEnabled: false });
    }
  }, []);

  return null;
};

export default HeroBackground;
