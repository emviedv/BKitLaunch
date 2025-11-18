import React, { useEffect, useMemo, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Confetti, type ConfettiRef } from '@/components/ui/confetti';
import {
  HERO_DESCRIPTION_CLASS,
  HERO_PRIMARY_BUTTON_CLASS,
  buildHeroHeadlineSegments,
  splitHeroHeadline,
} from './heroConstants';
import { LANDING_TITLE_GRADIENT_CLASS } from './heroTitleGradient';
import { logHeroHeadlineSplit } from './heroInstrumentation';
import { debugService } from '@/lib/debugService';
import {
  LANDING_FEATURES_ID,
  LANDING_PRICING_ID,
  LANDING_WAITLIST_ID,
} from '@/config/sectionAnchors';
import { cn } from '@/lib/utils';

export type LandingHeroContent = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  primaryButton?: string | null;
  primaryButtonLink?: string | null;
  secondaryButton?: string | null;
  secondaryButtonLink?: string | null;
  badgeLabel?: string | null;
  align?: 'left' | 'center';
};

const LANDING_TITLE_CLASS = 'text-[72px] font-bold leading-[1.05] tracking-tight text-white';

export interface LandingHeroProps {
  hero: LandingHeroContent | null | undefined;
  compact?: boolean;
}

const heroGradientDiagnosticsEnabled = () => {
  if (typeof process !== 'undefined') {
    const envValue = process.env?.DEBUG_LANDING_HERO ?? process.env?.DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  if (typeof import.meta !== 'undefined') {
    const envValue = (import.meta as any)?.env?.VITE_DEBUG_LANDING_HERO ?? (import.meta as any)?.env?.VITE_DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  return false;
};

const sanitizeBadgeLabel = (label?: string | null): string => {
  if (!label) {
    return '';
  }

  return label.replace(/^[\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}\s]+/gu, '').trim();
};

const scrollTargetMap: Record<string, string> = {
  features: LANDING_FEATURES_ID,
  pricing: LANDING_PRICING_ID,
  waitlist: LANDING_WAITLIST_ID,
};

const scrollToSection = (id: string) => {
  const normalizedKey = id.replace(/^#/, '');
  const resolvedId = scrollTargetMap[normalizedKey] || normalizedKey;
  const target = document.getElementById(resolvedId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleAnchorNavigation = (event: React.MouseEvent, href?: string | null) => {
  if (!href || !href.startsWith('#')) {
    return;
  }

  event.preventDefault();
  const sectionId = href.slice(1);
  if (sectionId) {
    scrollToSection(sectionId);
  }
};

const resolveTarget = (href?: string | null) => (href && href.startsWith('http') ? '_blank' : undefined);

const resolveRel = (href?: string | null) => (href && href.startsWith('http') ? 'noopener noreferrer' : undefined);

const LandingHero: React.FC<LandingHeroProps> = ({ hero, compact }) => {
  const confettiRef = useRef<ConfettiRef>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const gradientLayerRef = useRef<HTMLDivElement | null>(null);

  const title = hero?.title?.trim();
  if (!title) {
    return null;
  }

  const subtitle = hero?.subtitle ?? undefined;
  const description = hero?.description ?? undefined;
  const primaryButton = hero?.primaryButton ?? undefined;
  const primaryButtonLink = hero?.primaryButtonLink ?? undefined;
  const secondaryButton = hero?.secondaryButton ?? undefined;
  const secondaryButtonLink = hero?.secondaryButtonLink ?? undefined;
  const alignment: 'left' | 'center' = hero?.align === 'left' ? 'left' : 'center';

  const { firstSentence, remainder } = splitHeroHeadline(title);
  const headlineSegments = useMemo(
    () =>
      buildHeroHeadlineSegments({
        subtitle,
        title,
      }),
    [subtitle, title]
  );

  const badgeLabel = useMemo(() => sanitizeBadgeLabel(hero?.badgeLabel), [hero?.badgeLabel]);

  useEffect(() => {
    logHeroHeadlineSplit({
      component: 'LandingHero',
      title,
      firstSentence,
      remainderLength: remainder.length,
    });
  }, [firstSentence, remainder.length, title]);

  useEffect(() => {
    if (!heroGradientDiagnosticsEnabled()) {
      return;
    }

    const sectionEl = sectionRef.current;
    const layerEl = gradientLayerRef.current;

    if (!sectionEl || !layerEl) {
      debugService.warn('landing-hero:gradient-layer-missing', {
        hasSection: Boolean(sectionEl),
        hasLayer: Boolean(layerEl),
      });
      return;
    }

    const measure = () => {
      const sectionRect = sectionEl.getBoundingClientRect();
      const layerRect = layerEl.getBoundingClientRect();
      const sectionStyles = window.getComputedStyle(sectionEl);
      const layerStyles = window.getComputedStyle(layerEl);
      const sectionAspectRatio = sectionRect.height > 0 ? sectionRect.width / sectionRect.height : null;
      const layerAspectRatio = layerRect.height > 0 ? layerRect.width / layerRect.height : null;

      debugService.debug('landing-hero:gradient-diagnostics', {
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        sectionBox: {
          width: sectionRect.width,
          height: sectionRect.height,
          aspectRatio: sectionAspectRatio,
          borderRadius: sectionStyles.borderRadius,
          paddingTop: sectionStyles.paddingTop,
          paddingBottom: sectionStyles.paddingBottom,
        },
        layerBox: {
          width: layerRect.width,
          height: layerRect.height,
          aspectRatio: layerAspectRatio,
          borderRadius: layerStyles.borderRadius,
          transform: layerStyles.transform,
          filter: layerStyles.filter,
        },
      });

      if (layerAspectRatio && Math.abs(layerAspectRatio - 1) > 0.05) {
        debugService.warn('landing-hero:gradient-aspect-warning', {
          aspectRatio: layerAspectRatio,
          sectionAspectRatio,
        });
      }
    };

    const handleResize = () => {
      window.requestAnimationFrame(measure);
    };

    window.requestAnimationFrame(measure);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden ${compact ? 'landing-hero-compact-tight' : ''}`}
    >
      <div ref={gradientLayerRef} className="landing-hero-gradient__layer" aria-hidden="true" />
      <div className="landing-hero-column-lines" aria-hidden="true" />
      <div className="landing-hero-noise" aria-hidden="true" />
      <div className="landing-hero-contrast" aria-hidden="true" />
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-[1] h-full w-full pointer-events-none"
        manualstart
      />
      <div
        className={`relative z-10 mx-auto w-11/12 px-6 sm:w-5/6 sm:px-8 md:w-[70%] md:px-10 ${alignment === 'left' ? 'text-left' : 'text-center'}`}
      >
        <div
          className={`mx-auto flex max-w-4xl flex-col justify-center space-y-8 ${
            alignment === 'left' ? 'items-start' : 'items-center'
          }`}
        >
          {badgeLabel && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 shadow-[0_0_30px_rgba(250,174,255,0.25)] supports-[backdrop-filter]:bg-white/10">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#F1A0FF]" />
              <span>{badgeLabel}</span>
            </span>
          )}

          <div className="space-y-4">
            {headlineSegments.length > 0 ? (
              <h1 className={LANDING_TITLE_CLASS}>
                {headlineSegments.map((segment) => {
                  const isSubtitle = segment.key === 'subtitle';
                  const baseClass =
                    segment.gradient || isSubtitle ? LANDING_TITLE_GRADIENT_CLASS : 'text-white';
                  return (
                    <span
                      key={segment.key}
                      className={`${baseClass} block${segment.gradient && !isSubtitle ? ' pb-4' : ''}`.trim()}
                    >
                      {segment.text}
                    </span>
                  );
                })}
              </h1>
            ) : (
              <h1 className={LANDING_TITLE_CLASS}>
                {title}
              </h1>
            )}
          </div>

          {description && (
            <p
              className={cn(
                'max-w-3xl text-white/75',
                HERO_DESCRIPTION_CLASS,
                alignment === 'left' ? 'text-left' : 'mx-auto text-center'
              )}
            >
              {description}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {primaryButton && (
                primaryButtonLink ? (
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      HERO_PRIMARY_BUTTON_CLASS
                    )}
                    onClick={(event) => handleAnchorNavigation(event, primaryButtonLink)}
                    onMouseEnter={() => {
                      confettiRef.current?.fire({});
                    }}
                    aria-label={`${primaryButton} - Primary action`}
                  >
                    <a
                      href={primaryButtonLink}
                      target={resolveTarget(primaryButtonLink)}
                      rel={resolveRel(primaryButtonLink)}
                    >
                      {primaryButton}
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className={cn(
                      HERO_PRIMARY_BUTTON_CLASS
                    )}
                    onClick={() => scrollToSection(LANDING_FEATURES_ID)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        scrollToSection(LANDING_FEATURES_ID);
                      }
                    }}
                    onMouseEnter={() => {
                      confettiRef.current?.fire({});
                    }}
                    aria-label={`${primaryButton} - Primary action`}
                  >
                    {primaryButton}
                  </Button>
                )
              )}

              {secondaryButton && (
                secondaryButtonLink ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className={cn(
                      'w-full min-w-[12rem] sm:w-auto rounded-full border-white/30 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
                      'backdrop-blur-md transition-colors duration-200'
                    )}
                    onClick={(event) => handleAnchorNavigation(event, secondaryButtonLink)}
                    aria-label={`${secondaryButton} - Secondary action`}
                  >
                    <a
                      href={secondaryButtonLink}
                      target={resolveTarget(secondaryButtonLink)}
                      rel={resolveRel(secondaryButtonLink)}
                    >
                      {secondaryButton}
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      'w-full min-w-[12rem] sm:w-auto rounded-full border-white/30 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
                      'backdrop-blur-md transition-colors duration-200'
                    )}
                    onClick={() => scrollToSection(LANDING_PRICING_ID)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        scrollToSection(LANDING_PRICING_ID);
                      }
                    }}
                    aria-label={`${secondaryButton} - Secondary action`}
                  >
                    {secondaryButton}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 md:h-64 z-0 bg-gradient-to-b from-transparent via-[#0C041C]/80 to-[#04000A]"
        aria-hidden="true"
      />
    </section>
  );
};

export default LandingHero;
