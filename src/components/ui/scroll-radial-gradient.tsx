import React, { useEffect, useMemo, useState } from 'react';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

type SectionGradientConfig = {
  id: string;
  gradientColors: string[];
  gradientStops: number[];
  startingGap?: number;
  topOffset?: number;
};

/**
 * ScrollRadialGradient
 *
 * Viewport-fixed, decorative radial gradient that adapts while scrolling
 * through key sections to mirror the design system's soft radial style.
 *
 * - Uses IntersectionObserver to detect the active section
 * - Updates AnimatedGradientBackground colors to match the section
 * - Respects prefers-reduced-motion (disables breathing)
 * - Pointer-events disabled and aria-hidden to avoid interaction/AT noise
 */
export const ScrollRadialGradient: React.FC = () => {
  const isBrowser = typeof window !== 'undefined';

  const prefersReducedMotion = isBrowser
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Palette approximations inspired by the design system soft radial sets
  const sectionConfigs: SectionGradientConfig[] = useMemo(
    () => [
      {
        id: 'hero',
        gradientColors: ['#ffffff00', '#ffffff00'],
        gradientStops: [0, 100],
        startingGap: 120,
        topOffset: -20,
      },
      {
        id: 'features',
        gradientColors: ['#ecfeff00', '#ecfeff10', '#c7d2fe40', '#a7f3d040', '#a5b4fc50', '#93c5fd40', '#ffffff00'],
        gradientStops: [20, 44, 58, 70, 82, 90, 100],
        startingGap: 118,
        topOffset: -10,
      },
      {
        id: 'pricing',
        gradientColors: ['#fff1f200', '#fdf2f820', '#fee2e240', '#e9d5ff40', '#dbeafe40', '#dcfce740', '#ffffff00'],
        gradientStops: [20, 44, 60, 72, 84, 92, 100],
        startingGap: 118,
        topOffset: -10,
      },
      {
        id: 'waitlist',
        gradientColors: ['#f0f9ff00', '#ecfeff20', '#eef2ff35', '#f0fdfa35', '#a5b4fc30', '#93c5fd30', '#ffffff00'],
        gradientStops: [18, 42, 58, 70, 82, 90, 100],
        startingGap: 118,
        topOffset: -10,
      },
    ],
    []
  );

  const defaultConfig = sectionConfigs[1]; // fallback to features palette

  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isBrowser || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observedIds = sectionConfigs.map((s) => s.id);
    const elements = observedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the section with highest intersection ratio in view
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (inView.length > 0) {
          const topEntry = inView[0];
          const id = topEntry.target.id;
          setActiveSectionId(id);
          setVisible(id !== 'hero');
        } else {
          // If nothing is intersecting, keep previous but ensure visible during scroll past hero
          setVisible(true);
        }
      },
      { threshold: [0.1, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isBrowser, sectionConfigs]);

  const activeConfig = sectionConfigs.find((s) => s.id === activeSectionId) || defaultConfig;

  // Render a fixed, viewport-covering decorative layer
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'} -z-10`}
    >
      <AnimatedGradientBackground
        Breathing={!prefersReducedMotion}
        startingGap={activeConfig.startingGap}
        topOffset={activeConfig.topOffset}
        gradientColors={activeConfig.gradientColors}
        gradientStops={activeConfig.gradientStops}
        containerClassName="pointer-events-none"
      />
    </div>
  );
};

export default ScrollRadialGradient;


