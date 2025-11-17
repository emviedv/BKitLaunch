import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type ComparisonTone = 'positive' | 'negative';

export interface FeatureComparisonExample {
  label: string;
  title: string;
  tone?: ComparisonTone;
}

interface FeatureComparisonPreviewProps {
  examples: FeatureComparisonExample[];
  className?: string;
}

const toneStyles: Record<ComparisonTone, { gradient: string; glow: string; accent: string }> = {
  negative: {
    gradient: 'linear-gradient(135deg, rgba(244,114,182,0.42) 0%, rgba(248,113,113,0.28) 100%)',
    glow: 'rgba(248,113,113,0.35)',
    accent: 'rgba(252,165,165,0.45)',
  },
  positive: {
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.45) 0%, rgba(59,130,246,0.25) 100%)',
    glow: 'rgba(45,212,191,0.35)',
    accent: 'rgba(134,239,172,0.5)',
  },
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FeatureComparisonPreview: React.FC<FeatureComparisonPreviewProps> = ({ examples, className }) => {
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
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layers = (examples ?? []).slice(0, 2);
  if (layers.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn('relative flex w-full max-w-[30rem] flex-col items-center gap-12', className)}>
      <div className="relative h-44 w-full">
        {layers.map((example, index) => {
          const alignLeft = index === 0;
          const tone = toneStyles[(example.tone as ComparisonTone) ?? (alignLeft ? 'negative' : 'positive')];
          const delay = index * 140;
          const alignment: CSSProperties = alignLeft ? { left: 0 } : { right: 0 };
          const activeTransform = `${alignLeft ? 'translate(-6%, -50%) rotate(-7deg)' : 'translate(6%, -50%) rotate(6deg)'} scale(1)`;
          const idleTransform = `${alignLeft ? 'translate(-16%, -50%) rotate(-14deg)' : 'translate(16%, -50%) rotate(12deg)'} scale(0.78)`;

          return (
            <div
              key={`${example.label}-${index}`}
              className="absolute h-32 w-[52%] min-w-[12rem]"
              style={{
                ...alignment,
                top: '50%',
                transform: isActive ? activeTransform : idleTransform,
                opacity: isActive ? 1 : 0,
                transition: `transform 0.7s cubic-bezier(0.19,1,0.22,1) ${delay}ms, opacity 0.6s ease ${delay}ms`,
              }}
            >
              <div className="absolute inset-0 rounded-[26px]" style={{ background: tone.gradient }} />
              <div className="pointer-events-none absolute inset-0 blur-3xl" style={{ background: tone.glow, opacity: 0.55 }} />
              <div className="absolute inset-[8%] rounded-[20px] bg-white/6 backdrop-blur-[30px]" />

              {Array.from({ length: 4 }).map((_, stripeIndex) => (
                <span
                  key={stripeIndex}
                  className="absolute left-[14%] h-[3px] rounded-full bg-white/40"
                  style={{
                    top: `${34 + stripeIndex * 13}%`,
                    width: `${46 + stripeIndex * 14}%`,
                    transform: `rotate(${alignLeft ? -8 + stripeIndex * 2 : 7 - stripeIndex * 2}deg)`
                  }}
                />
              ))}

              <span
                className="absolute right-[20%] top-[36%] h-12 w-12 rounded-full blur-3xl"
                style={{ background: tone.accent, opacity: 0.55 }}
              />
              <span className="absolute left-[10%] bottom-[18%] h-3 w-24 rounded-full bg-white/28" />
              <span className="absolute right-[24%] top-[22%] h-[3px] w-20 rounded-full bg-white/22" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureComparisonPreview;
