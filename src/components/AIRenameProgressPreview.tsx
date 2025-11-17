import React, { useEffect, useRef, useState } from 'react';

export interface FeatureProgressCheckpoint {
  label: string;
  time?: string;
}

export interface FeatureProgressConfig {
  label: string;
  metric: string;
  progress: number; // 0 to 1
  duration?: string;
  checkpoints?: FeatureProgressCheckpoint[];
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CIRCUMFERENCE = 2 * Math.PI * 70;

const AIRenameProgressPreview: React.FC<{ config: FeatureProgressConfig; className?: string }> = ({ config, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      },
      { threshold: 0.55 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const clampedProgress = Math.min(Math.max(config.progress ?? 0, 0), 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - clampedProgress);
  const checkpoints = config.checkpoints ?? [];

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[22rem] aspect-square transition-all duration-700 ease-out ${
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className ?? ''}`}
    >
      <span className="pointer-events-none absolute left-[-20%] top-[-25%] h-64 w-64 rounded-full bg-indigo-400/30 blur-[120px]" />
      <span className="pointer-events-none absolute bottom-[-30%] right-[-15%] h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[140px]" />

      <div className="relative h-full w-full flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-[0_18px_40px_rgba(129,140,248,0.45)]">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(129,140,248,0.4)" />
              <stop offset="100%" stopColor="rgba(129,140,248,0)" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="76" fill="url(#orbGlow)" />
          <circle cx="100" cy="100" r="76" stroke="rgba(129,140,248,0.25)" strokeWidth="10" fill="none" />
          <circle
            cx="100"
            cy="100"
            r="76"
            stroke="url(#progressGradient)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isActive ? strokeDashoffset : CIRCUMFERENCE}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.19,1,0.22,1)' }}
          />
        </svg>

        {checkpoints.map((_, index) => {
          const angle = (index / Math.max(checkpoints.length, 1)) * Math.PI * 2 - Math.PI / 2;
          const radius = 96;
          const x = 100 + Math.cos(angle) * radius;
          const y = 100 + Math.sin(angle) * radius;
          return (
            <span
              key={`checkpoint-${index}`}
              className="pointer-events-none absolute h-4 w-4 rounded-full bg-white/70 shadow-[0_0_20px_rgba(129,140,248,0.45)]"
              style={{
                left: `${x / 2}%`,
                top: `${y / 2}%`,
                transform: 'translate(-50%, -50%)',
                opacity: isActive ? 1 : 0,
                transition: `opacity 0.5s ease ${300 + index * 120}ms`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AIRenameProgressPreview;
