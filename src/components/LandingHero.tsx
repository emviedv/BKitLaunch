import React, { useEffect, useMemo, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Confetti, type ConfettiRef } from '@/components/ui/confetti';
import {
  HERO_DESCRIPTION_CLASS,
  HERO_HEADLINE_GRADIENT_CLASS,
  HERO_PRIMARY_BUTTON_CLASS,
  buildHeroHeadlineSegments,
  splitHeroHeadline,
} from './heroConstants';
import { logHeroHeadlineSplit } from './heroInstrumentation';
import { debugService } from '@/lib/debugService';

export type LandingHeroContent = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  primaryButton?: string | null;
  primaryButtonLink?: string | null;
  secondaryButton?: string | null;
  secondaryButtonLink?: string | null;
  badgeLabel?: string | null;
};

const LANDING_TITLE_CLASS = 'text-[72px] font-bold leading-[1.05] tracking-tight';

export interface LandingHeroProps {
  hero: LandingHeroContent | null | undefined;
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

const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
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

const LandingHero: React.FC<LandingHeroProps> = ({ hero }) => {
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
      className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden"
    >
      <div ref={gradientLayerRef} className="landing-hero-gradient__layer" aria-hidden="true" />
      <div className="landing-hero-noise" aria-hidden="true" />
      <div className="landing-hero-contrast" aria-hidden="true" />
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-[1] h-full w-full pointer-events-none"
        manualstart
      />
      <div className="relative z-10 mx-auto w-11/12 px-6 text-center sm:w-5/6 sm:px-8 md:w-[70%] md:px-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-8">
          {badgeLabel && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6580E1] bg-white/10 px-4 py-2 text-sm font-medium text-white supports-[backdrop-filter]:bg-white/20">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#6580E1]" />
              <span>{badgeLabel}</span>
            </span>
          )}

          <div className="space-y-4">
            {headlineSegments.length > 0 ? (
              <h1 className={LANDING_TITLE_CLASS}>
                {headlineSegments.map((segment) => {
                  const isSubtitle = segment.key === 'subtitle';
                  const baseClass = isSubtitle
                    ? 'text-[#1B1622]'
                    : segment.gradient
                      ? HERO_HEADLINE_GRADIENT_CLASS
                      : 'text-foreground';
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
            <p className={`mx-auto max-w-2xl ${HERO_DESCRIPTION_CLASS}`}>
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
                    className={HERO_PRIMARY_BUTTON_CLASS}
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
                    className={HERO_PRIMARY_BUTTON_CLASS}
                    onClick={() => scrollToSection('features')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        scrollToSection('features');
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
                    className="w-full min-w-[12rem] sm:w-auto"
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
                    className="w-full min-w-[12rem] sm:w-auto"
                    onClick={() => scrollToSection('pricing')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        scrollToSection('pricing');
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
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 md:h-64 z-0 bg-gradient-to-b from-transparent via-background/80 to-background"
        aria-hidden="true"
      />
    </section>
  );
};

export default LandingHero;
