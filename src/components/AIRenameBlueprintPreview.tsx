import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type FeatureBlueprintTheme = 'blue' | 'emerald' | 'purple' | 'amber' | 'ink';

export interface FeatureBlueprintField {
  label: string;
  value: string;
  accent?: boolean;
}

export interface FeatureBlueprintToggle {
  label: string;
  active: boolean;
}

export interface FeatureBlueprintConfig {
  title: string;
  fields: FeatureBlueprintField[];
  toggles?: FeatureBlueprintToggle[];
  footer?: string;
  theme?: FeatureBlueprintTheme;
}

const THEME_MAP: Record<FeatureBlueprintTheme, { glow: string; stroke: string; particle: string }> = {
  blue: {
    glow: 'rgba(56,189,248,0.32)',
    stroke: 'rgba(96,165,250,0.55)',
    particle: 'rgba(125,211,252,0.6)',
  },
  emerald: {
    glow: 'rgba(16,185,129,0.32)',
    stroke: 'rgba(52,211,153,0.55)',
    particle: 'rgba(110,231,183,0.6)',
  },
  purple: {
    glow: 'rgba(168,85,247,0.32)',
    stroke: 'rgba(192,132,252,0.55)',
    particle: 'rgba(236,180,252,0.6)',
  },
  amber: {
    glow: 'rgba(245,158,11,0.28)',
    stroke: 'rgba(251,191,36,0.55)',
    particle: 'rgba(253,230,138,0.6)',
  },
  ink: {
    glow: 'rgba(15,23,42,0.28)',
    stroke: 'rgba(51,65,85,0.55)',
    particle: 'rgba(30,41,59,0.6)',
  },
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface BlueprintPreviewProps {
  config: FeatureBlueprintConfig;
  className?: string;
}

const AIRenameBlueprintPreview: React.FC<BlueprintPreviewProps> = ({ config, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const palette = THEME_MAP[config.theme ?? 'blue'];
  const fieldCount = config.fields?.length ?? 0;
  const orbitCount = Math.max(fieldCount + 2, 4);
  const particleCount = Math.max((config.toggles?.length ?? 2) + 2, 4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
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

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full max-w-[26rem] aspect-[4/3] transition-all duration-700 ease-out',
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        className
      )}
    >
      <span
        className="pointer-events-none absolute -left-20 top-[-40%] h-64 w-64 rounded-full blur-[120px] opacity-70"
        style={{ background: palette.glow }}
      />
      <span
        className="pointer-events-none absolute -right-16 bottom-[-55%] h-72 w-72 rounded-full blur-[140px] opacity-60"
        style={{ background: palette.glow }}
      />

      <div className="relative h-full w-full">
        {Array.from({ length: orbitCount }).map((_, index) => {
          const ratio = (index + 1) / orbitCount;
          const size = 120 + ratio * 160;
          return (
            <span
              key={`orbit-${index}`}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                marginLeft: `-${size / 2}px`,
                marginTop: `-${size / 2}px`,
                border: `1px solid ${palette.stroke}`,
                opacity: isActive ? 0.2 + ratio * 0.35 : 0,
                transform: isActive ? 'scale(1)' : 'scale(0.8)',
                transition: `opacity 0.6s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms`,
              }}
            />
          );
        })}

        {(config.fields ?? []).map((field, index) => {
          const angle = (index / Math.max(fieldCount, 1)) * Math.PI * 2;
          const radius = 90;
          const x = 50 + Math.cos(angle) * 36;
          const y = 50 + Math.sin(angle) * 32;
          const rotation = (angle * 180) / Math.PI;
          return (
            <span
              key={`field-${field.label}-${index}`}
              className="absolute h-[3px] rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${36 + index * 12}px`,
                background: palette.stroke,
                opacity: isActive ? 0.65 : 0,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                transition: `opacity 0.6s ease ${index * 90}ms`
              }}
            />
          );
        })}

        {(config.toggles ?? []).map((toggle, index) => {
          const angle = (index / Math.max(particleCount, 1)) * Math.PI * 2;
          const distance = 48 + index * 6;
          const x = 50 + Math.cos(angle) * distance;
          const y = 50 + Math.sin(angle) * distance;
          return (
            <span
              key={`toggle-${toggle.label}-${index}`}
              className="absolute h-5 w-5 rounded-full blur"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                background: palette.particle,
                opacity: isActive ? 0.6 : 0,
                transform: 'translate(-50%, -50%)',
                transition: `opacity 0.6s ease ${200 + index * 110}ms`
              }}
            />
          );
        })}

        <div
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[14px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: isActive ? '0 20px 40px rgba(15,23,42,0.35)' : 'none',
            transition: 'box-shadow 0.6s ease'
          }}
        />
      </div>
    </div>
  );
};

export default AIRenameBlueprintPreview;
