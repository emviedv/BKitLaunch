import React, { useEffect, useMemo, useRef, useState } from 'react';

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
import { HERO_ACTORS } from './heroCursorActors';
import OrigamiIllustration from './OrigamiIllustration';
import { debugService } from '@/lib/debugService';
import {
  LANDING_FEATURES_ID,
  LANDING_PRICING_ID,
  LANDING_WAITLIST_ID,
} from '@/config/sectionAnchors';
import { Zap, MousePointer2 } from 'lucide-react';

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

const LANDING_TITLE_CLASS = 'text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white';

// Origami layout configuration
const ORIGAMI_LAYOUT = {
  blob1: { x: 10, y: 15, scale: 1 },   // Note Card (Top Left)
  blob2: { x: 40, y: 40, scale: 1 },   // Diamond (Center)
  blob3: { x: 80, y: 20, scale: 1 },   // Media Card (Right)
  blob4: { x: 25, y: 75, scale: 1 },   // Sticky Note (Bottom Left)
  content: { x: 25, y: 50, scale: 1 }  // Text Content (Left side)
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

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

  // Mouse handling for interactive cursor
  const handleMouseMove = (e: React.MouseEvent) => {
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
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
      className={`landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden ${compact ? 'landing-hero-compact-tight' : ''}`}
    >
      <div ref={gradientLayerRef} className="landing-hero-gradient__layer" aria-hidden="true" />
      <div className="landing-hero-noise" aria-hidden="true" />
      <div className="landing-hero-contrast" aria-hidden="true" />

      {/* Cursor Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {/* User Cursor (You) */}
        <div
          className={`absolute top-0 left-0 transition-opacity duration-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
        >
          <MousePointer2 className="w-5 h-5 text-blue-600 fill-blue-600 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            {HERO_ACTORS.user}
          </div>
        </div>

        {/* Bot 1 */}
        <div className="absolute top-0 left-0 animate-cursor-float-1">
          <MousePointer2 className="w-5 h-5 text-orange-500 fill-orange-500 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            {HERO_ACTORS.bot1}
          </div>
        </div>

        {/* Bot 2 */}
        <div className="absolute top-0 left-0 animate-cursor-float-2">
          <MousePointer2 className="w-5 h-5 text-emerald-500 fill-emerald-500 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            {HERO_ACTORS.bot2}
          </div>
        </div>

        {/* Bot 3 */}
        <div className="absolute top-0 left-0 animate-cursor-float-3">
          <MousePointer2 className="w-5 h-5 text-[hsl(var(--primary))] fill-[hsl(var(--primary))] stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-[hsl(var(--primary))] text-primary-foreground text-[10px] font-bold rounded-full shadow-sm inline-block">
            {HERO_ACTORS.bot3}
          </div>
        </div>

        {/* Bot 4 */}
        <div className="absolute top-0 left-0 animate-cursor-float-4">
          <MousePointer2 className="w-5 h-5 text-rose-500 fill-rose-500 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            {HERO_ACTORS.bot4}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="absolute inset-0 w-full h-full">
        <div className="section-content relative h-full">
          {/* Left Side: Text Content */}
          <div
            className="absolute z-20 transition-all duration-75 ease-linear max-w-xl"
            style={{
              top: `${pos.content.y}%`,
              left: `${pos.content.x}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {badgeLabel && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 shadow-[0_0_30px_rgba(250,174,255,0.25)] supports-[backdrop-filter]:bg-white/10 mb-8">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#F1A0FF]" />
                <span>{badgeLabel}</span>
              </span>
            )}

            <h1 className={LANDING_TITLE_CLASS + " font-display mb-6 pointer-events-none select-none"}>
              {headlineSegments.length > 0 ? (
                headlineSegments.map((segment) => {
                  const isSubtitle = segment.key === 'subtitle';
                  const baseClass = segment.gradient || isSubtitle ? LANDING_TITLE_GRADIENT_CLASS : 'text-white';
                  return (
                    <span
                      key={segment.key}
                      className={`${baseClass} block${segment.gradient && !isSubtitle ? ' pb-4' : ''}`.trim()}
                    >
                      {segment.text}
                    </span>
                  );
                })
              ) : (
                title
              )}
            </h1>

            {description && (
              <p className="text-xl text-white/75 max-w-lg leading-relaxed mb-8">
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pointer-events-auto">
              {primaryButton && (
                <Button
                  size="lg"
                  className={HERO_PRIMARY_BUTTON_CLASS}
                  onClick={primaryButtonLink ? (event) => handleAnchorNavigation(event, primaryButtonLink) : () => scrollToSection(LANDING_FEATURES_ID)}
                  onMouseEnter={() => {
                    confettiRef.current?.fire({});
                  }}
                  aria-label={`${primaryButton} - Primary action`}
                >
                  {primaryButton}
                </Button>
              )}
              {secondaryButton && (
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-xl hover:border-[hsl(var(--primary)/0.25)] hover:bg-[hsl(var(--primary)/0.06)] transition-all flex items-center gap-2"
                  onClick={secondaryButtonLink ? (event) => handleAnchorNavigation(event, secondaryButtonLink) : () => scrollToSection(LANDING_PRICING_ID)}
                >
                  <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
                  {secondaryButton}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Right Side: Illustration Container */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-end pr-0 lg:pr-10 xl:pr-16">
        <div className="relative z-40 w-[700px] h-[700px] max-w-full transform-style-3d rotate-isometric animate-hover-gentle">
          <OrigamiIllustration showCursors={false} className="pointer-events-none w-full h-full" />
        </div>
      </div>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-[1] h-full w-full pointer-events-none"
        manualstart
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 md:h-64 z-0"
        aria-hidden="true"
      />

      <style jsx>{`
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

        /* Cursor Animations */
        @keyframes cursor-float-1 {
          0% { transform: translate(60vw, 20vh); }
          25% { transform: translate(65vw, 35vh); }
          50% { transform: translate(55vw, 40vh); }
          75% { transform: translate(58vw, 25vh); }
          100% { transform: translate(60vw, 20vh); }
        }
        @keyframes cursor-float-2 {
          0% { transform: translate(75vw, 60vh); }
          33% { transform: translate(85vw, 55vh); }
          66% { transform: translate(70vw, 70vh); }
          100% { transform: translate(75vw, 60vh); }
        }
        @keyframes cursor-float-3 {
          0% { transform: translate(30vw, 60vh); }
          40% { transform: translate(40vw, 75vh); }
          70% { transform: translate(25vw, 65vh); }
          100% { transform: translate(30vw, 60vh); }
        }
        @keyframes cursor-float-4 {
          0% { transform: translate(50vw, 18vh); }
          30% { transform: translate(60vw, 30vh); }
          60% { transform: translate(48vw, 38vh); }
          90% { transform: translate(56vw, 22vh); }
          100% { transform: translate(50vw, 18vh); }
        }
        .animate-cursor-float-1 { animation: cursor-float-1 15s ease-in-out infinite; }
        .animate-cursor-float-2 { animation: cursor-float-2 18s ease-in-out infinite; }
        .animate-cursor-float-3 { animation: cursor-float-3 20s ease-in-out infinite; }
        .animate-cursor-float-4 { animation: cursor-float-4 22s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default LandingHero;
