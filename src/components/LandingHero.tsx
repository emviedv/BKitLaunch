import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  HERO_PRIMARY_BUTTON_CLASS,
  HERO_SECONDARY_BUTTON_CLASS,
  buildHeroHeadlineSegments,
  splitHeroHeadline,
} from './heroConstants';
import { LANDING_TITLE_GRADIENT_CLASS } from './heroTitleGradient';
import { logHeroHeadlineSplit } from './heroInstrumentation';
import { HERO_ACTORS } from './heroCursorActors';
import { debugService } from '@/lib/debugService';
import {
  LANDING_FEATURES_ID,
  LANDING_PRICING_ID,
  LANDING_WAITLIST_ID,
} from '@/config/sectionAnchors';
import { MousePointer2, ArrowRight } from '@/lib/iconUtils';
import FluidBackground from './FluidBackground';

export type LandingHeroContent = {
  title?: string | null;
  subtitle?: string | null;
  description?: React.ReactNode | null;
  primaryButton?: string | null;
  primaryButtonLink?: string | null;
  secondaryButton?: string | null;
  secondaryButtonLink?: string | null;
  badgeLabel?: string | null;
  align?: 'left' | 'center';
};

const LANDING_TITLE_CLASS = 'text-[84px] font-semibold leading-[1.05] tracking-tight text-white';
const HERO_ACCENT_WORDS = ['faster', 'products'];

// Origami layout configuration
const ORIGAMI_LAYOUT = {
  blob1: { x: 10, y: 15, scale: 1 },   // Note Card (Top Left)
  blob2: { x: 40, y: 40, scale: 1 },   // Diamond (Center)
  blob3: { x: 80, y: 20, scale: 1 },   // Media Card (Right)
  blob4: { x: 25, y: 75, scale: 1 },   // Sticky Note (Bottom Left)
  content: { x: 32, y: 46, scale: 1 }  // Text Content (Left side, vertically balanced)
};

export interface LandingHeroProps {
  hero: LandingHeroContent | null | undefined;
  compact?: boolean;
  titleClampLines?: number;
  descriptionMaxWidthClassName?: string;
  descriptionClassName?: string;
  titleClassName?: string;
  contentMaxWidthClassName?: string;
  disableCursorEffects?: boolean;
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

const TRUSTED_HERO_LOGOS_COL1 = [
  { name: 'Figma', url: '/clients/figma.svg' },
  { name: 'Linear', url: '/clients/linear.svg' },
  { name: 'Webflow', url: '/clients/webflow.svg' },
  { name: 'Stripe', url: '/clients/stripe.svg' },
];

const HERO_AVATAR_ITEMS = [
  { id: 'avatar-1', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', alt: 'Product designer' },
  { id: 'avatar-2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', alt: 'UI designer' },
  { id: 'avatar-3', src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', alt: 'Design systems lead' },
  { id: 'avatar-4', src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', alt: 'Design operations specialist' },
];

const TRUSTED_HERO_LOGOS_COL2 = [
  { name: 'Dropbox', url: '/clients/dropbox.svg' },
  { name: 'Atlassian', url: '/clients/atlassian.svg' },
  { name: 'Zapier', url: '/clients/zapier.svg' },
  { name: 'OpenAI', url: '/clients/openai.svg' },
];

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

const LandingHero: React.FC<LandingHeroProps> = ({
  hero,
  compact,
  titleClampLines,
  descriptionMaxWidthClassName,
  descriptionClassName,
  titleClassName,
  contentMaxWidthClassName,
  disableCursorEffects,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gradientLayerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const shouldShowCursorEffects = !disableCursorEffects;

  const title = hero?.title?.trim() || '';
  const subtitle = hero?.subtitle ?? undefined;
  const description = hero?.description ?? undefined;
  const primaryButton = hero?.primaryButton ?? undefined;
  const primaryButtonLink = hero?.primaryButtonLink ?? undefined;
  const secondaryButton = hero?.secondaryButton ?? undefined;
  const secondaryButtonLink = hero?.secondaryButtonLink ?? undefined;
  const alignment: 'left' | 'center' = hero?.align === 'left' ? 'left' : 'center';
  const resolvedClampLines = typeof titleClampLines === 'number' && titleClampLines > 0
    ? Math.floor(titleClampLines)
    : null;
  const shouldClampTitle = Boolean(resolvedClampLines);
  const resolvedTitleClassName = titleClassName?.trim() || LANDING_TITLE_CLASS;
  const heroContentWidthClass = shouldClampTitle
    ? 'w-full max-w-[calc(100vw-5rem)] sm:max-w-4xl'
    : 'max-w-4xl';
  const resolvedContentWidthClassName = contentMaxWidthClassName?.trim() || heroContentWidthClass;
  const resolvedDescriptionMaxWidthClassName = descriptionMaxWidthClassName ?? 'max-w-xl';
  const resolvedDescriptionClassName = descriptionClassName?.trim() ?? '';

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

  const renderHeroAccentWords = (text: string, _keyPrefix: string) => {
    return text;
  };

  // Mouse handling for interactive cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!shouldShowCursorEffects) {
      return;
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const pos = ORIGAMI_LAYOUT;

  useEffect(() => {
    if (!title) return;
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

  if (!title) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (shouldShowCursorEffects) {
          setShowCursor(true);
        }
      }}
      onMouseLeave={() => {
        if (shouldShowCursorEffects) {
          setShowCursor(false);
        }
      }}
      className={`landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden ${compact ? 'landing-hero-compact-tight' : ''}`}
    >
      <div ref={gradientLayerRef} className="landing-hero-gradient__layer" aria-hidden="true" />
      <div className="landing-hero-noise" aria-hidden="true" />
      <div className="landing-hero-contrast" aria-hidden="true" />
      <FluidBackground />

      {/* Cursor Overlay Layer */}
      {shouldShowCursorEffects ? (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ contain: 'layout style paint' }}>
        {/* User Cursor (You) */}
        <div
          className={`absolute top-0 left-0 transition-opacity duration-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
        >
          <MousePointer2 className="w-5 h-5 text-blue-600 fill-blue-600 stroke-white stroke-[2px] drop-shadow-lg" />
          <div className="ml-3 mt-1 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm inline-block">
            {HERO_ACTORS.user}
          </div>
        </div>

        {/* Bot 1 - Designer, moves deliberately with pauses */}
        <div className="absolute top-0 left-0 animate-cursor-designer">
          <div className="animate-cursor-click-1">
            <MousePointer2 className="w-5 h-5 text-orange-500 fill-orange-500 stroke-white stroke-[2px] drop-shadow-lg" />
          </div>
          <div className="ml-3 mt-1 px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm inline-block animate-cursor-label-pulse-1">
            {HERO_ACTORS.bot1}
          </div>
        </div>

        {/* Bot 2 - Developer, fast and precise */}
        <div className="absolute top-0 left-0 animate-cursor-developer">
          <div className="animate-cursor-click-2">
            <MousePointer2 className="w-5 h-5 text-emerald-500 fill-emerald-500 stroke-white stroke-[2px] drop-shadow-lg" />
          </div>
          <div className="ml-3 mt-1 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm inline-block animate-cursor-label-pulse-2">
            {HERO_ACTORS.bot2}
          </div>
        </div>

        {/* Bot 3 - Reviewer, methodical scanning */}
        <div className="absolute top-0 left-0 animate-cursor-reviewer">
          <div className="animate-cursor-click-3">
            <MousePointer2 className="w-5 h-5 text-[hsl(var(--primary))] fill-[hsl(var(--primary))] stroke-white stroke-[2px] drop-shadow-lg" />
          </div>
          <div className="ml-3 mt-1 px-2.5 py-1 bg-[hsl(var(--primary))] text-primary-foreground text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm inline-block animate-cursor-label-pulse-3">
            {HERO_ACTORS.bot3}
          </div>
        </div>

        {/* Bot 4 - Explorer, curious wandering */}
        <div className="absolute top-0 left-0 animate-cursor-explorer">
          <div className="animate-cursor-click-4">
            <MousePointer2 className="w-5 h-5 text-rose-500 fill-rose-500 stroke-white stroke-[2px] drop-shadow-lg" />
          </div>
          <div className="ml-3 mt-1 px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm inline-block animate-cursor-label-pulse-4">
            {HERO_ACTORS.bot4}
          </div>
        </div>

        {/* Bot 5 - Miriam */}
        <div className="absolute top-0 left-0 animate-cursor-miriam">
          <div className="animate-cursor-click-5">
            <MousePointer2 className="w-5 h-5 text-cyan-500 fill-cyan-500 stroke-white stroke-[2px] drop-shadow-lg" />
          </div>
          <div className="ml-3 mt-1 px-2.5 py-1 bg-cyan-500 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm inline-block animate-cursor-label-pulse-5">
            {HERO_ACTORS.bot5}
          </div>
        </div>
      </div>
      ) : null}

      {/* Main Canvas Area */}
      <div className="absolute inset-0 w-full h-full">
        <div className="section-content relative h-full">
          {/* Centered Text Content */}
          <div
            className={`absolute z-20 transition-all duration-75 ease-linear ${resolvedContentWidthClassName} flex flex-col ${
              alignment === 'left' ? 'items-start text-left' : 'items-center text-center'
            }`}
            style={{
              top: `${pos.content.y}%`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Avatar strip + badge */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="flex items-center -space-x-2">
                {HERO_AVATAR_ITEMS.map((avatar) => (
                  <img
                    key={avatar.id}
                    src={avatar.src}
                    alt={avatar.alt}
                    className="h-9 w-9 rounded-full border-2 border-[#0b0c0f] bg-[#10121a] object-cover shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                    width={36}
                    height={36}
                    loading="eager"
                    decoding="async"
                  />
                ))}
              </div>
              {badgeLabel && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-white/75 backdrop-blur-sm">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#F1A0FF]" />
                  <span>{badgeLabel}</span>
                </span>
              )}
            </div>

            <div className="landing-hero-headline-capture mb-6">
              <h1 className={`${resolvedTitleClassName}`}>
                {headlineSegments.length > 0 ? (
                  headlineSegments.map((segment) => {
                    const isSubtitle = segment.key === 'subtitle';
                    const baseClass = segment.gradient || isSubtitle ? LANDING_TITLE_GRADIENT_CLASS : 'text-white';
                    const shouldClampSegment = shouldClampTitle && segment.key.startsWith('title');
                    const headlineSegmentStyle: React.CSSProperties = {};

                    if (shouldClampSegment) {
                      Object.assign(headlineSegmentStyle, {
                        display: '-webkit-box',
                        WebkitLineClamp: resolvedClampLines ?? undefined,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      });
                    }

                    return (
                      <span
                        key={segment.key}
                        className={`${baseClass} block ${shouldClampTitle ? 'whitespace-normal' : 'whitespace-nowrap'}${
                          segment.gradient && !isSubtitle ? ' pb-4' : ''
                        }`.trim()}
                        style={headlineSegmentStyle}
                      >
                        {renderHeroAccentWords(segment.text, segment.key)}
                      </span>
                    );
                  })
                ) : (
                  title
                )}
              </h1>
            </div>

            {description && (
              <p
                className={`text-lg text-white/70 ${resolvedDescriptionMaxWidthClassName} leading-relaxed text-center mx-auto mb-10 ${resolvedDescriptionClassName}`}
              >
                {typeof description === 'string'
                  ? description.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))
                  : description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pointer-events-auto justify-center">
              {primaryButton && (
                <Button
                  size="lg"
                  className={HERO_PRIMARY_BUTTON_CLASS}
                  onClick={(event) => {
                    if (primaryButtonLink) {
                      handleAnchorNavigation(event, primaryButtonLink);
                      if (primaryButtonLink.startsWith('#')) {
                        scrollToSection(primaryButtonLink);
                      }
                    }
                    if (!primaryButtonLink) {
                      scrollToSection(LANDING_FEATURES_ID);
                    }
                  }}
                  aria-label={`${primaryButton} - Primary action`}
                >
                  {primaryButton}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              {secondaryButton && (
                <Button
                  size="lg"
                  variant="ghost"
                  className={HERO_SECONDARY_BUTTON_CLASS}
                  onClick={secondaryButtonLink ? (event) => handleAnchorNavigation(event, secondaryButtonLink) : () => scrollToSection(LANDING_PRICING_ID)}
                  asChild={secondaryButtonLink && !secondaryButtonLink.startsWith('#')}
                >
                  {secondaryButtonLink && !secondaryButtonLink.startsWith('#') ? (
                    <a href={secondaryButtonLink}>
                      {secondaryButton}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  ) : (
                    <span>
                      {secondaryButton}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              )}
            </div>
            {primaryButton && (
              <div className="relative mt-12 h-7 overflow-hidden pointer-events-none opacity-60">
                {/* Vertical slider of horizontal logo rows */}
                <div className="logo-row-slide flex flex-col">
                  {/* Row 1 */}
                  <div className="flex justify-center gap-10 h-7 shrink-0">
                    {TRUSTED_HERO_LOGOS_COL1.map((logo) => (
                      <span
                        key={`row1-${logo.name}`}
                        className="flex h-7 w-20 shrink-0 items-center justify-center"
                      >
                        <img
                          src={logo.url}
                          alt={`${logo.name} logo`}
                          className="max-h-6 w-auto object-contain brightness-0 invert opacity-80"
                          loading="lazy"
                        />
                      </span>
                    ))}
                  </div>
                  {/* Row 2 */}
                  <div className="flex justify-center gap-10 h-7 shrink-0">
                    {TRUSTED_HERO_LOGOS_COL2.map((logo) => (
                      <span
                        key={`row2-${logo.name}`}
                        className="flex h-7 w-20 shrink-0 items-center justify-center"
                      >
                        <img
                          src={logo.url}
                          alt={`${logo.name} logo`}
                          className="max-h-6 w-auto object-contain brightness-0 invert opacity-80"
                          loading="lazy"
                        />
                      </span>
                    ))}
                  </div>
                  {/* Duplicate Row 1 for seamless loop */}
                  <div className="flex justify-center gap-10 h-7 shrink-0">
                    {TRUSTED_HERO_LOGOS_COL1.map((logo) => (
                      <span
                        key={`row1-dup-${logo.name}`}
                        className="flex h-7 w-20 shrink-0 items-center justify-center"
                      >
                        <img
                          src={logo.url}
                          alt={`${logo.name} logo`}
                          className="max-h-6 w-auto object-contain brightness-0 invert opacity-80"
                          loading="lazy"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 md:h-64 z-0"
        aria-hidden="true"
      />

      <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        /* Isometric Rotation: Rotate X for tilt, Rotate Z for angle */
        .rotate-isometric {
          transform: rotateX(55deg) rotateZ(-45deg);
        }
        @keyframes hover-gentle {
          0%, 100% { transform: rotateX(55deg) rotateZ(-45deg) translateY(0px); }
          50% { transform: rotateX(55deg) rotateZ(-45deg) translateY(-20px); }
        }
        .animate-hover-gentle {
          animation: hover-gentle 6s ease-in-out infinite;
        }

        /* Vertical row slide - shows row 1, then row 2, loops back */
        @keyframes logo-row-slide {
          0%, 40% { transform: translateY(0); }
          50%, 90% { transform: translateY(-28px); }
          100% { transform: translateY(-56px); }
        }
        .logo-row-slide {
          animation: logo-row-slide 6s ease-in-out infinite;
        }

        .landing-hero-headline-capture {
          position: relative;
          display: inline-block;
          width: fit-content;
          max-width: 100%;
        }

        .landing-hero-headline-capture-overlay {
          position: absolute;
          inset: -22px -24px -22px -24px;
          z-index: 4;
          pointer-events: none;
        }

        @keyframes landing-hero-headline-screenshot-reveal {
          0% {
            clip-path: inset(0 100% 100% 0);
            opacity: 0.28;
          }
          8% {
            clip-path: inset(0 78% 80% 0);
            opacity: 0.6;
          }
          32% {
            clip-path: inset(0 44% 46% 0);
            opacity: 0.82;
          }
          100% {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        @keyframes landing-hero-headline-selection-box {
          0% {
            opacity: 0.9;
            width: 12%;
            height: 14%;
            transform: translate3d(0, 0, 0);
          }
          20% {
            width: 44%;
            height: 46%;
            transform: translate3d(0, 0, 0);
          }
          60% {
            width: 82%;
            height: 74%;
            transform: translate3d(0, 0, 0);
          }
          100% {
            opacity: 0.9;
            width: 100%;
            height: 100%;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes landing-hero-headline-selection-cursor {
          0% {
            opacity: 1;
            left: 0%;
            top: 0%;
            transform: scale(1);
          }
          24% {
            opacity: 1;
            left: 30%;
            top: 34%;
            transform: scale(0.99);
          }
          60% {
            opacity: 1;
            left: 64%;
            top: 66%;
            transform: scale(0.97);
          }
          100% {
            opacity: 1;
            left: calc(100% - 20px);
            top: calc(100% - 20px);
            transform: scale(0.95);
          }
        }

        @keyframes landing-hero-headline-selection-flash {
          0%, 72%, 100% {
            opacity: 0;
            transform: scale(0.68);
          }
          80% {
            opacity: 0.78;
            transform: scale(1);
          }
        }

        .landing-hero-headline-surface {
          display: inline-block;
          width: max-content;
          max-width: 100%;
          opacity: 0.22;
          clip-path: inset(0 100% 100% 0);
          will-change: clip-path, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
          animation: landing-hero-headline-screenshot-reveal 3.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .landing-hero-headline-selection-box {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          border-radius: 12px;
          border: 1.5px solid #ff2f87;
          background: linear-gradient(130deg, rgb(255 47 135 / 0.24), transparent 72%);
          box-shadow:
            inset 0 0 0 1px rgb(255 47 135 / 0.45),
            0 16px 40px rgb(255 47 135 / 0.25);
          z-index: 5;
          will-change: width, height, opacity, transform;
          animation: landing-hero-headline-selection-box 3.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .landing-hero-headline-selection-cursor {
          position: absolute;
          left: 0;
          top: 0;
          filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.35));
          z-index: 6;
          will-change: left, top, transform, opacity;
          animation: landing-hero-headline-selection-cursor 3.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .landing-hero-headline-selection-flash {
          position: absolute;
          right: 2%;
          top: 74%;
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgb(255 47 135 / 0.65) 0%, rgb(255 47 135 / 0.2) 42%, transparent 72%);
          animation: landing-hero-headline-selection-flash 3.2s ease-out forwards;
        }

        /* Designer cursor - deliberate movements with creative pauses */
        @keyframes cursor-designer {
          0%, 8% { transform: translate(65vw, 18vh) scale(1.2); }
          10% { transform: translate(67vw, 16vh) scale(1.2); }
          18%, 26% { transform: translate(72vw, 22vh) scale(1.2); }
          30% { transform: translate(70vw, 28vh) scale(1.2); }
          38%, 46% { transform: translate(62vw, 32vh) scale(1.2); }
          50% { transform: translate(58vw, 26vh) scale(1.2); }
          58%, 66% { transform: translate(55vw, 20vh) scale(1.2); }
          70% { transform: translate(60vw, 15vh) scale(1.2); }
          78%, 86% { transform: translate(68vw, 12vh) scale(1.2); }
          100% { transform: translate(65vw, 18vh) scale(1.2); }
        }

        /* Developer cursor - quick precise movements */
        @keyframes cursor-developer {
          0%, 3% { transform: translate(25vw, 65vh) scale(1.2); }
          5% { transform: translate(30vw, 62vh) scale(1.2); }
          8%, 11% { transform: translate(35vw, 68vh) scale(1.2); }
          15% { transform: translate(28vw, 72vh) scale(1.2); }
          18%, 21% { transform: translate(22vw, 70vh) scale(1.2); }
          25% { transform: translate(18vw, 65vh) scale(1.2); }
          28%, 31% { transform: translate(24vw, 58vh) scale(1.2); }
          35% { transform: translate(32vw, 55vh) scale(1.2); }
          38%, 41% { transform: translate(38vw, 60vh) scale(1.2); }
          45% { transform: translate(35vw, 68vh) scale(1.2); }
          48%, 51% { transform: translate(28vw, 75vh) scale(1.2); }
          55% { transform: translate(20vw, 72vh) scale(1.2); }
          58%, 61% { transform: translate(15vw, 68vh) scale(1.2); }
          65% { transform: translate(18vw, 62vh) scale(1.2); }
          68%, 71% { transform: translate(25vw, 58vh) scale(1.2); }
          75% { transform: translate(30vw, 62vh) scale(1.2); }
          78%, 81% { transform: translate(26vw, 68vh) scale(1.2); }
          85% { transform: translate(22vw, 70vh) scale(1.2); }
          88%, 91% { transform: translate(24vw, 66vh) scale(1.2); }
          100% { transform: translate(25vw, 65vh) scale(1.2); }
        }

        /* Reviewer cursor - methodical horizontal scanning */
        @keyframes cursor-reviewer {
          0%, 12% { transform: translate(12vw, 25vh) scale(1.2); }
          15% { transform: translate(18vw, 25vh) scale(1.2); }
          18%, 30% { transform: translate(25vw, 26vh) scale(1.2); }
          33% { transform: translate(20vw, 32vh) scale(1.2); }
          36%, 48% { transform: translate(14vw, 35vh) scale(1.2); }
          51% { transform: translate(10vw, 30vh) scale(1.2); }
          54%, 66% { transform: translate(8vw, 22vh) scale(1.2); }
          69% { transform: translate(15vw, 18vh) scale(1.2); }
          72%, 84% { transform: translate(22vw, 20vh) scale(1.2); }
          87% { transform: translate(16vw, 24vh) scale(1.2); }
          100% { transform: translate(12vw, 25vh) scale(1.2); }
        }

        /* Explorer cursor - curious wandering with loops */
        @keyframes cursor-explorer {
          0%, 5% { transform: translate(78vw, 55vh) scale(1.2); }
          8% { transform: translate(82vw, 50vh) scale(1.2); }
          12%, 17% { transform: translate(85vw, 45vh) scale(1.2); }
          20% { transform: translate(80vw, 42vh) scale(1.2); }
          25%, 30% { transform: translate(75vw, 48vh) scale(1.2); }
          33% { transform: translate(78vw, 55vh) scale(1.2); }
          38%, 43% { transform: translate(82vw, 62vh) scale(1.2); }
          46% { transform: translate(85vw, 58vh) scale(1.2); }
          50%, 55% { transform: translate(88vw, 52vh) scale(1.2); }
          58% { transform: translate(84vw, 48vh) scale(1.2); }
          62%, 67% { transform: translate(78vw, 52vh) scale(1.2); }
          70% { transform: translate(72vw, 58vh) scale(1.2); }
          75%, 80% { transform: translate(70vw, 62vh) scale(1.2); }
          83% { transform: translate(74vw, 58vh) scale(1.2); }
          88%, 93% { transform: translate(76vw, 52vh) scale(1.2); }
          100% { transform: translate(78vw, 55vh) scale(1.2); }
        }

        /* Miriam cursor - steady sweep across the center */
        @keyframes cursor-miriam {
          0%, 8% { transform: translate(46vw, 42vh) scale(1.2); }
          12% { transform: translate(52vw, 38vh) scale(1.2); }
          20%, 30% { transform: translate(58vw, 44vh) scale(1.2); }
          34% { transform: translate(54vw, 50vh) scale(1.2); }
          42%, 52% { transform: translate(46vw, 48vh) scale(1.2); }
          58% { transform: translate(40vw, 44vh) scale(1.2); }
          66%, 74% { transform: translate(38vw, 38vh) scale(1.2); }
          80% { transform: translate(42vw, 34vh) scale(1.2); }
          88%, 96% { transform: translate(48vw, 36vh) scale(1.2); }
          100% { transform: translate(46vw, 42vh) scale(1.2); }
        }

        /* Click animation - subtle scale bounce */
        @keyframes cursor-click {
          0%, 90%, 100% { transform: scale(1); }
          93% { transform: scale(0.85); }
          96% { transform: scale(1.05); }
        }

        /* Label pulse for activity indication */
        @keyframes cursor-label-pulse {
          0%, 85%, 100% { opacity: 1; transform: scale(1); }
          90% { opacity: 0.9; transform: scale(0.95); }
          95% { opacity: 1; transform: scale(1.02); }
        }

        /* GPU-accelerated cursor animations */
        .animate-cursor-designer,
        .animate-cursor-developer,
        .animate-cursor-reviewer,
        .animate-cursor-explorer,
        .animate-cursor-miriam {
          will-change: transform;
          backface-visibility: hidden;
        }

        .animate-cursor-designer { animation: cursor-designer 24s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-cursor-developer { animation: cursor-developer 16s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
        .animate-cursor-reviewer { animation: cursor-reviewer 22s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-cursor-explorer { animation: cursor-explorer 20s cubic-bezier(0.33, 0, 0.67, 1) infinite; }
        .animate-cursor-miriam { animation: cursor-miriam 21s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        .animate-cursor-click-1 { animation: cursor-click 4s ease-in-out infinite; animation-delay: 0.5s; }
        .animate-cursor-click-2 { animation: cursor-click 3s ease-in-out infinite; animation-delay: 1.2s; }
        .animate-cursor-click-3 { animation: cursor-click 5s ease-in-out infinite; animation-delay: 2s; }
        .animate-cursor-click-4 { animation: cursor-click 3.5s ease-in-out infinite; animation-delay: 0.8s; }
        .animate-cursor-click-5 { animation: cursor-click 4.4s ease-in-out infinite; animation-delay: 1.6s; }

        .animate-cursor-label-pulse-1 { animation: cursor-label-pulse 4s ease-in-out infinite; animation-delay: 0.5s; }
        .animate-cursor-label-pulse-2 { animation: cursor-label-pulse 3s ease-in-out infinite; animation-delay: 1.2s; }
        .animate-cursor-label-pulse-3 { animation: cursor-label-pulse 5s ease-in-out infinite; animation-delay: 2s; }
        .animate-cursor-label-pulse-4 { animation: cursor-label-pulse 3.5s ease-in-out infinite; animation-delay: 0.8s; }
        .animate-cursor-label-pulse-5 { animation: cursor-label-pulse 4.4s ease-in-out infinite; animation-delay: 1.6s; }

        /* Disable animations for users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .landing-hero-headline-surface,
          .landing-hero-headline-selection-box,
          .landing-hero-headline-selection-cursor,
          .landing-hero-headline-selection-flash,
          .animate-cursor-designer,
          .animate-cursor-developer,
          .animate-cursor-reviewer,
          .animate-cursor-explorer,
          .animate-cursor-miriam,
          .animate-cursor-click-1,
          .animate-cursor-click-2,
          .animate-cursor-click-3,
          .animate-cursor-click-4,
          .animate-cursor-click-5,
          .animate-cursor-label-pulse-1,
          .animate-cursor-label-pulse-2,
          .animate-cursor-label-pulse-3,
          .animate-cursor-label-pulse-4,
          .animate-cursor-label-pulse-5,
          .animate-hover-gentle,
          .logo-row-slide {
            animation: none !important;
          }

          .landing-hero-headline-surface {
            opacity: 1 !important;
            clip-path: inset(0 0 0 0) !important;
            transform: none !important;
            filter: none !important;
          }

          .landing-hero-headline-capture-overlay {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LandingHero;
