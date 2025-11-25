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
import { debugService } from '@/lib/debugService';
import {
  LANDING_FEATURES_ID,
  LANDING_PRICING_ID,
  LANDING_WAITLIST_ID,
} from '@/config/sectionAnchors';
import { cn } from '@/lib/utils';
import { FileText, Share2, Zap, MousePointer2, ThumbsUp, MessageSquare, Move } from 'lucide-react';

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
  const isoContainerRef = useRef<HTMLDivElement>(null);
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

  // Calculate connector points for SVG lines
  const getCenter = (xPercent: number, yPercent: number, widthPx: number, heightPx: number) => {
    const containerSize = 700;
    return {
      x: (xPercent / 100) * containerSize + widthPx / 2,
      y: (yPercent / 100) * containerSize + heightPx / 2
    };
  };

  // Create curved lines between elements
  const createCurve = (start: {x:number, y:number}, end: {x:number, y:number}) => {
    const distX = Math.abs(end.x - start.x);
    const distY = Math.abs(end.y - start.y);

    const curvature = Math.max(distX * 0.5, 100);

    const cp1 = { x: start.x + curvature, y: start.y };
    const cp2 = { x: end.x - curvature, y: end.y };

    if (distX < 50) {
      cp1.x = start.x + 100;
      cp2.x = end.x - 100;
    }

    return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
  };

  // Calculate element centers for connecting lines
  const pos = ORIGAMI_LAYOUT;
  const b1 = getCenter(pos.blob1.x, pos.blob1.y, 160, 160); // w-40 (160px)
  const b2 = getCenter(pos.blob2.x, pos.blob2.y, 160, 160); // w-40 (160px)
  const b3 = getCenter(pos.blob3.x, pos.blob3.y, 192, 128); // w-48 (192px), h-32 (128px)
  const b4 = getCenter(pos.blob4.x, pos.blob4.y, 160, 160);

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
      <div className="landing-hero-column-lines" aria-hidden="true" />
      <div className="landing-hero-noise" aria-hidden="true" />
      <div className="landing-hero-contrast" aria-hidden="true" />

      {/* Subtle overlay to tone down the gradient for visibility of origami elements */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" aria-hidden="true" />

      {/* Cursor Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {/* User Cursor (You) */}
        <div
          className={`absolute top-0 left-0 transition-opacity duration-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
        >
          <MousePointer2 className="w-5 h-5 text-blue-600 fill-blue-600 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            You
          </div>
        </div>

        {/* Bot 1: Gabrielle */}
        <div className="absolute top-0 left-0 animate-cursor-float-1">
          <MousePointer2 className="w-5 h-5 text-orange-500 fill-orange-500 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            Gabrielle
          </div>
        </div>

        {/* Bot 2: Kristine */}
        <div className="absolute top-0 left-0 animate-cursor-float-2">
          <MousePointer2 className="w-5 h-5 text-emerald-500 fill-emerald-500 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            Kristine
          </div>
        </div>

        {/* Bot 3: Paul */}
        <div className="absolute top-0 left-0 animate-cursor-float-3">
          <MousePointer2 className="w-5 h-5 text-purple-600 fill-purple-600 stroke-white stroke-[2px]" />
          <div className="ml-3 mt-1 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full shadow-sm inline-block">
            Paul
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
              <p className="text-xl text-white/75 max-w-lg leading-relaxed mb-8 pointer-events-none select-none">
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
                  className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-xl hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-2"
                  onClick={secondaryButtonLink ? (event) => handleAnchorNavigation(event, secondaryButtonLink) : () => scrollToSection(LANDING_PRICING_ID)}
                >
                  <Zap className="w-4 h-4 text-purple-500" />
                  {secondaryButton}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Right Side: Isometric Illustration Container */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-end pr-0 lg:pr-10 xl:pr-16">

        {/* The Isometric Plane Container */}
        <div
          ref={isoContainerRef}
          className="relative z-40 w-[700px] h-[700px] transform-style-3d rotate-isometric animate-hover-gentle"
        >

          {/* Dynamic Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible opacity-70 pointer-events-none" style={{ transform: 'translateZ(-10px)' }}>
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Line from Note (Blob1) to Logic (Blob2) */}
            <path
              d={createCurve(b1, b2)}
              stroke="url(#flow-gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="12 8"
              strokeLinecap="round"
              className="animate-dash-flow"
            />
            {/* Line from Logic (Blob2) to Media (Blob3) */}
            <path
              d={createCurve(b2, b3)}
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Line from Sticky (Blob4) to Logic (Blob2) */}
            <path
              d={createCurve(b4, b2)}
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </svg>

          {/* Element 1: Note Card */}
          <div
            className="absolute w-40 h-40 bg-[#FEF3C7] rounded-3xl shadow-xl border-4 border-white transform transition-transform hover:translate-z-10 flex flex-col p-6 items-center justify-center text-center gap-3 duration-300 ease-out"
            style={{
              left: `${pos.blob1.x}%`,
              top: `${pos.blob1.y}%`,
            }}
          >
            <div className="w-12 h-12 bg-orange-400/20 rounded-full flex items-center justify-center text-orange-600 pointer-events-none">
              <FileText className="w-6 h-6" />
            </div>
            <div className="h-2 w-20 bg-orange-900/10 rounded-full pointer-events-none"></div>
            <div className="h-2 w-12 bg-orange-900/10 rounded-full pointer-events-none"></div>
          </div>

          {/* Element 2: Diamond Shape */}
          <div
            className="absolute w-40 h-40 bg-[#E0E7FF] rounded-[2rem] shadow-xl border-4 border-white transform rotate-45 flex items-center justify-center z-10 transition-transform duration-300 ease-out"
            style={{
              left: `${pos.blob2.x}%`,
              top: `${pos.blob2.y}%`,
            }}
          >
            <div className="transform -rotate-45 text-center pointer-events-none">
              <div className="font-bold text-indigo-900/50 text-sm uppercase tracking-wider">Logic</div>
            </div>
          </div>

          {/* Element 3: Media Card */}
          <div
            className="absolute w-48 h-32 bg-[#D1FAE5] rounded-2xl shadow-xl border-4 border-white transform translate-z-5 flex items-center justify-center group transition-transform duration-300 ease-out"
            style={{
              left: `${pos.blob3.x}%`,
              top: `${pos.blob3.y}%`,
            }}
          >
            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center pointer-events-none">
              <Share2 className="w-8 h-8 text-emerald-500" />
            </div>
            {/* Floating Reaction */}
            <div className="absolute -top-8 -right-4 bg-white p-2 rounded-full shadow-lg transform rotate-12 scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none">
              <ThumbsUp className="w-5 h-5 text-emerald-600 fill-emerald-100" />
            </div>
          </div>

          {/* Element 4: Sticky Note */}
          <div
            className="absolute w-40 h-40 bg-[#F3E8FF] rounded-none shadow-lg transform -rotate-3 border-t-[12px] border-purple-300/50 p-4 transition-transform duration-300 ease-out"
            style={{
              left: `${pos.blob4.x}%`,
              top: `${pos.blob4.y}%`,
            }}
          >
            <p className="font-handwriting text-purple-800 text-lg leading-tight pointer-events-none select-none">Don't forget to sync the assets!</p>

            <div className="absolute -bottom-8 -right-8 bg-white px-3 py-1.5 rounded-tl-xl rounded-br-xl rounded-bl-sm shadow-lg border border-slate-100 flex items-center gap-2 pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">P</div>
              <span className="text-xs font-medium text-slate-600">Paul</span>
            </div>
          </div>

        </div>
      </div>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-[1] h-full w-full pointer-events-none"
        manualstart
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 md:h-64 z-0 bg-gradient-to-b from-transparent via-[#0C041C]/80 to-[#04000A]"
        aria-hidden="true"
      />

      <style jsx>{`
        .perspective-loose {
          perspective: 1200px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        /* Isometric Rotation: Rotate X for tilt, Rotate Z for angle */
        .rotate-isometric {
          transform: rotateX(55deg) rotateZ(-45deg);
        }
        .translate-z-10 {
          transform: translateZ(20px);
        }
        .translate-z-5 {
          transform: translateZ(10px);
        }
        .font-handwriting {
          font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
        }
        @keyframes hover-gentle {
          0%, 100% { transform: rotateX(55deg) rotateZ(-45deg) translateY(0px); }
          50% { transform: rotateX(55deg) rotateZ(-45deg) translateY(-20px); }
        }
        .animate-hover-gentle {
          animation: hover-gentle 6s ease-in-out infinite;
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -40; }
        }
        .animate-dash-flow {
          animation: dash-flow 2s linear infinite;
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
        .animate-cursor-float-1 { animation: cursor-float-1 15s ease-in-out infinite; }
        .animate-cursor-float-2 { animation: cursor-float-2 18s ease-in-out infinite; }
        .animate-cursor-float-3 { animation: cursor-float-3 20s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default LandingHero;
