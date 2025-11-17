import React, { useEffect, useMemo, useRef, useState } from 'react';

export type ListAnimationPosition = 'left' | 'right' | 'center';
export type ListAnimationSize = 'sm' | 'md' | 'lg';

interface ListItem {
  title: string;
  subtitle: string;
}

interface ListAnimationPreviewProps {
  position?: ListAnimationPosition;
  size?: ListAnimationSize;
  items?: ListItem[];
  autoplayMs?: number;
  className?: string;
}

/**
 * ListAnimationPreview
 *
 * Compact version of the UX list animation for embedding into feature cards.
 * Supports left/right alignment via container utilities and size presets.
 */
export const ListAnimationPreview: React.FC<ListAnimationPreviewProps> = ({
  position = 'left',
  size = 'md',
  items: itemsProp,
  autoplayMs = 2000,
  className,
}) => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items: ListItem[] = useMemo(
    () =>
      itemsProp || [
        { title: 'Automated Insights Generation', subtitle: 'AI-driven insights surfaced in real time' },
        { title: 'Real-Time Data Access', subtitle: 'Instant access for immediate decisions' },
        { title: 'Centralized Governance Controls', subtitle: 'Unified interface for data privacy' },
      ],
    [itemsProp]
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const start = () => {
      stop();
      timerRef.current = window.setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, Math.max(900, autoplayMs));
    };
    const stop = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    start();
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
  }, [items.length, autoplayMs, prefersReducedMotion]);

  const sizeClasses = size === 'sm'
    ? 'w-[260px] h-[180px]'
    : size === 'lg'
      ? 'w-[420px] h-[300px]'
      : 'w-[340px] h-[240px]';

  const alignClass = position === 'right' ? 'md:ml-auto' : position === 'center' ? 'mx-auto' : 'md:mr-auto';

  return (
    <div className={[sizeClasses, 'rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(24,24,27,0.08)]', 'p-4 sm:p-5', 'select-none', alignClass, className || ''].join(' ')} aria-hidden>
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const isActive = prefersReducedMotion ? index === 0 : index === activeIndex;
          return (
            <div
              key={index}
              className={[
                'flex items-center justify-between rounded-lg border border-zinc-200/70 bg-white/90 px-3 py-2',
                'transition-all duration-500',
                isActive ? 'ring-1 ring-rose-400/60 shadow-md scale-[1.02] opacity-100' : 'shadow-sm opacity-85'
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-500 ring-1 ring-rose-100">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                    <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h4.086c.464 0 .908.185 1.236.514l1.171 1.172c.328.328.772.514 1.236.514H19.25A1.75 1.75 0 0 1 21 9.95v6.3A2.75 2.75 0 0 1 18.25 19H5.75A2.75 2.75 0 0 1 3 16.25V6.75Z" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium leading-tight">{item.title}</span>
                  <span className="text-[11px] text-zinc-500">{item.subtitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-6 w-6 items-center justify-center text-[11px] font-semibold text-rose-500">
                  <span className="absolute inset-0 rounded-full bg-rose-50" />
                  <span className="relative">{index}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListAnimationPreview;

