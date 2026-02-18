import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { usePublishedContent } from "@/hooks/usePublishedContent";
import {
  HERO_DESCRIPTION_CLASS,
  HERO_HEADLINE_GRADIENT_CLASS,
  HERO_PRIMARY_BUTTON_CLASS,
  buildHeroHeadlineSegments,
  splitHeroHeadline,
  type HeroHeadlineSegment,
} from "./heroConstants";
import { logHeroHeadlineSplit, logLandingHeroBackgroundState } from "./heroInstrumentation";
import { LANDING_HERO_ID, LANDING_WAITLIST_ANCHOR } from "@/config/sectionAnchors";

const heroDebugEnabled = () => {
  if (typeof process !== 'undefined' && process.env?.DEBUG_FIX) {
    return process.env.DEBUG_FIX !== '0';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
    return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
  }
  return false;
};

const Hero: React.FC = () => {
  const { content } = usePublishedContent();
  const comingSoonEnabled = Boolean((content.settings as any)?.comingSoonEnabled);

  const hero = content.hero || {};
  const { firstSentence: heroTitleFirstSentence, remainder: heroTitleRemainder } = splitHeroHeadline(hero.title);
  const headlineSegments: HeroHeadlineSegment[] = buildHeroHeadlineSegments({
    subtitle: hero.subtitle,
    title: hero.title,
  });

  const hasHeroContent = Boolean(
    hero.title ||
      hero.subtitle ||
      hero.description ||
      hero.primaryButton ||
      hero.secondaryButton,
  );

  const handleAnchorClick = (event: React.MouseEvent, href?: string) => {
    if (!href || !href.startsWith("#")) return;
    event.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const normalizedHref = (href?: string) => {
    if (!href) return undefined;
    return href.startsWith("#") ? `/${href}` : href;
  };

  useEffect(() => {
    logLandingHeroBackgroundState({
      hasHeroContent,
      comingSoonEnabled,
      backgroundEnabled: false,
    });
  }, [hasHeroContent, comingSoonEnabled]);

  useEffect(() => {
    logHeroHeadlineSplit({
      component: 'Hero',
      title: hero.title,
      firstSentence: heroTitleFirstSentence,
      remainderLength: heroTitleRemainder.length,
    });
  }, [hero.title, heroTitleFirstSentence, heroTitleRemainder]);

  useEffect(() => {
    if (heroDebugEnabled()) {
      console.debug('[hero-layout] headline-segments', {
        segments: headlineSegments,
        subtitle: hero.subtitle,
      });
    }
  }, [headlineSegments, hero.subtitle]);

  if (content.settings?.visibility?.hero === false) {
    return null;
  }

  if (!hasHeroContent) {
    return null;
  }

  return (
    <section id={LANDING_HERO_ID} className="landing-hero-section section-hero relative -mt-16 overflow-hidden">
      <div className="landing-hero-content section-content relative z-10 py-16 sm:py-20 lg:py-28">
        <div className="landing-hero-body mx-auto flex max-w-3xl flex-col items-center gap-6 text-center lg:mx-0 lg:max-w-4xl lg:items-start lg:text-left">
          {hero.badgeLabel && (
            <span className="inline-flex items-center rounded-full border border-[#6580E1] bg-primary/10 px-4 py-1.5 text-sm font-medium text-[#6580E1]">
              {hero.badgeLabel}
            </span>
          )}

          {headlineSegments.length > 0 && (
            <h1 className="w-full text-3xl font-bold leading-[1.35] tracking-tight text-title-darkest sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              {headlineSegments.map((segment, segmentIndex) => {
                const headlineRevealDelaySeconds = segmentIndex * 0.14;
                const headlineFloatDelaySeconds = headlineRevealDelaySeconds + 0.9;
                return (
                  <span
                    key={segment.key}
                    className={`${segment.gradient ? HERO_HEADLINE_GRADIENT_CLASS : ''} coming-soon-hero-headline-line block${
                      segment.gradient ? ' pb-3' : ''
                    }`.trim()}
                    style={{
                      animationDelay: `${headlineRevealDelaySeconds}s, ${headlineFloatDelaySeconds}s`,
                    }}
                  >
                    {segment.text}
                  </span>
                );
              })}
            </h1>
          )}

          {hero.description ? (
            <p className={`${HERO_DESCRIPTION_CLASS} max-w-2xl`}>{hero.description}</p>
          ) : null}

          {(hero.primaryButton || hero.secondaryButton || comingSoonEnabled) && (
            <div className="landing-hero-ctas mt-4 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start lg:gap-4">
              {comingSoonEnabled ? (
                <Button
                  size="lg"
                  className={HERO_PRIMARY_BUTTON_CLASS}
                  onClick={(event) => handleAnchorClick(event, LANDING_WAITLIST_ANCHOR)}
                >
                  Get Beta Access
                </Button>
              ) : hero.primaryButton ? (
                <Button
                  asChild={Boolean(hero.primaryButtonLink)}
                  size="lg"
                  className="w-full min-w-[12rem] sm:w-auto"
                  onClick={(event) => handleAnchorClick(event, hero.primaryButtonLink)}
                  aria-label={hero.primaryButton}
                >
                  {hero.primaryButtonLink ? (
                    <a
                      href={normalizedHref(hero.primaryButtonLink) ?? "#"}
                      target={
                        hero.primaryButtonLink?.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        hero.primaryButtonLink?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {hero.primaryButton}
                    </a>
                  ) : (
                    <span>{hero.primaryButton}</span>
                  )}
                </Button>
              ) : null}

              {hero.secondaryButton ? (
                <Button
                  asChild={Boolean(hero.secondaryButtonLink)}
                  size="lg"
                  variant="outline"
                  className="w-full min-w-[12rem] sm:w-auto"
                  onClick={(event) => handleAnchorClick(event, hero.secondaryButtonLink)}
                  aria-label={hero.secondaryButton}
                >
                  {hero.secondaryButtonLink ? (
                    <a
                      href={normalizedHref(hero.secondaryButtonLink) ?? "#"}
                      target={
                        hero.secondaryButtonLink?.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        hero.secondaryButtonLink?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {hero.secondaryButton}
                    </a>
                  ) : (
                    <span>{hero.secondaryButton}</span>
                  )}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-transparent via-background/70 to-background"
        aria-hidden="true"
      />
      <style>{`
        @keyframes coming-soon-hero-headline-reveal {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes coming-soon-hero-headline-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .coming-soon-hero-headline-line {
          opacity: 0;
          will-change: transform, opacity, filter;
          transform-origin: center top;
          animation:
            coming-soon-hero-headline-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards,
            coming-soon-hero-headline-float 3.1s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .coming-soon-hero-headline-line {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
