import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debugService } from '@/lib/debugService';

interface ListItem {
  id: number;
  title: string;
  subtitle: string;
}

/**
 * UXBiblioScrollSection
 *
 * Full-width, scroll-animated section that pins content and highlights
 * one of three rows based on scroll progress. Designed to appear above
 * the features section on the UXBiblio page. Respects prefers-reduced-motion.
 */
export const UXBiblioScrollSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const items: ListItem[] = useMemo(
    () => [
      {
        id: 1,
        title: 'Automated Insights Generation',
        subtitle: 'AI-driven insights surfaced in real time',
      },
      {
        id: 2,
        title: 'Real-Time Data Access',
        subtitle: 'Instant access for immediate decisions',
      },
      {
        id: 3,
        title: 'Centralized Governance Controls',
        subtitle: 'Unified interface for data privacy',
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) return; // No scroll-driven animation

    let rafId = 0;

    const onFrame = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      // Total scrollable distance while the sticky child is pinned
      const totalScrollable = Math.max(rect.height - viewportHeight, 1);
      // Amount scrolled inside the section (0..totalScrollable)
      const scrolledInside = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = scrolledInside / totalScrollable; // 0..1

      // Map progress to active item index
      const segment = 1 / items.length;
      const index = Math.min(items.length - 1, Math.floor(progress / segment + 0.0001));
      setActiveIndex(index);

      rafId = window.requestAnimationFrame(onFrame);
    };

    rafId = window.requestAnimationFrame(onFrame);

    const onResize = () => {
      // Trigger recalculation
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(onFrame);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });

    debugService.info('UXBiblioScrollSection mounted', { items: items.length });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [items.length, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="UXBiblio scroll showcase"
      className="w-full bg-white mt-[72px]"
    >
      {/* Inline stage, height fits content */}
      <div className="flex items-center justify-center">
        <div className="w-11/12 sm:w-5/6 md:w-[70%] mx-auto">
          <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(24,24,27,0.08)]">
            <div className="p-6 sm:p-8">
              <div role="list" aria-label="Key features" className="space-y-3 sm:space-y-4">
                {items.map((item, index) => {
                  const isActive = prefersReducedMotion ? index === 0 : index === activeIndex;
                  return (
                    <div
                      key={item.id}
                      role="listitem"
                      className={[
                        'group flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/90 px-4 py-3 sm:px-5 sm:py-4 backdrop-blur',
                        'transition-all duration-500',
                        isActive
                          ? 'ring-2 ring-rose-400/60 shadow-xl scale-[1.03] opacity-100'
                          : 'shadow-sm opacity-80'
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 ring-1 ring-rose-100">
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
                            <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h4.086c.464 0 .908.185 1.236.514l1.171 1.172c.328.328.772.514 1.236.514H19.25A1.75 1.75 0 0 1 21 9.95v6.3A2.75 2.75 0 0 1 18.25 19H5.75A2.75 2.75 0 0 1 3 16.25V6.75Z" />
                          </svg>
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm sm:text-base font-medium leading-tight">{item.title}</span>
                          <span className="text-xs text-zinc-500">{item.subtitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="relative inline-flex h-7 w-7 items-center justify-center text-[13px] font-semibold text-rose-500">
                          <span className="absolute inset-0 rounded-full bg-rose-50" />
                          <span className="relative">{index}</span>
                        </span>
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-amber-400 fill-amber-400">
                          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UXBiblioScrollSection;


