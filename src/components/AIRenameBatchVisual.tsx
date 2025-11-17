import React, { useEffect, useMemo, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface BatchCard {
  angle: number;
  distance: number;
  delay: number;
  rotation: number;
  scale?: number;
  accent?: boolean;
}

const ORBIT_RADII = [120, 186, 244];

const CARDS: BatchCard[] = [
  { angle: -80, distance: 124, delay: 0, rotation: -6, scale: 1.08, accent: true },
  { angle: 40, distance: 164, delay: 160, rotation: 4, scale: 1 },
  { angle: 200, distance: 148, delay: 320, rotation: -4, scale: 0.96 },
];

const createInitialOffsets = () =>
  CARDS.map(() => ({
    x: (Math.random() - 0.5) * 130,
    y: (Math.random() - 0.5) * 130,
    r: (Math.random() - 0.5) * 20,
  }));

const palette = {
  glowPrimary: 'rgba(56,189,248,0.26)',
  glowSecondary: 'rgba(14,116,144,0.22)',
  orbitStroke: 'rgba(125,211,252,0.35)',
  connector: 'rgba(148,163,184,0.45)',
  cardBorder: 'rgba(148,197,253,0.28)',
  cardSurface: 'linear-gradient(135deg, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.62) 100%)',
  cardAccent: 'linear-gradient(135deg, rgba(59,130,246,0.35) 0%, rgba(56,189,248,0.12) 100%)',
};

const AIRenameBatchVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [offsets] = useState(() => createInitialOffsets());
  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    const el = containerRef.current;

    if (!el || reduceMotion) {
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
  }, [reduceMotion]);

  const cardTransforms = useMemo(
    () =>
      CARDS.map((card, index) => {
        const radians = (card.angle * Math.PI) / 180;
        const x = Math.cos(radians) * card.distance;
        const y = Math.sin(radians) * card.distance;
        const transformActive = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${card.rotation}deg) scale(${card.scale ?? 1})`;
        const idle = offsets[index];
        const transformIdle = `translate(-50%, -50%) translate(${idle.x}px, ${idle.y}px) rotate(${idle.r}deg) scale(0.82)`;
        return { transformActive, transformIdle };
      }),
    [offsets]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[26rem] aspect-[4/3] transition-all duration-700 ease-out ${
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <span
        className="pointer-events-none absolute -left-16 top-[-26%] h-64 w-64 rounded-full blur-[120px]"
        style={{ background: palette.glowPrimary }}
      />
      <span
        className="pointer-events-none absolute -right-12 bottom-[-42%] h-72 w-72 rounded-full blur-[140px]"
        style={{ background: palette.glowSecondary }}
      />

      <div className="relative h-full w-full">
        {ORBIT_RADII.map((radius, index) => {
          const size = radius;
          return (
            <span
              key={`orbit-${radius}`}
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-solid"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                marginLeft: `-${size / 2}px`,
                marginTop: `-${size / 2}px`,
                borderColor: palette.orbitStroke,
                opacity: isActive ? 0.24 + index * 0.12 : 0,
                transform: isActive ? 'scale(1)' : 'scale(0.9)',
                transition: `opacity 0.6s ease ${index * 110}ms, transform 0.6s ease ${index * 110}ms`,
              }}
            />
          );
        })}

        {CARDS.map((card, index) => (
          <span
            key={`connector-${index}`}
            className="pointer-events-none absolute left-1/2 top-1/2 origin-left rounded-full"
            style={{
              width: `${card.distance}px`,
              height: '2px',
              background: palette.connector,
              opacity: isActive ? 0.42 : 0,
              transform: isActive
                ? `translateY(-50%) rotate(${card.angle}deg) scaleX(1)`
                : `translateY(-50%) rotate(${card.angle}deg) scaleX(0.6)`,
              transition: `opacity 0.6s ease ${220 + index * 70}ms, transform 0.6s ease ${220 + index * 70}ms`,
            }}
          />
        ))}

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 rounded-2xl border border-white/10"
          style={{
            transform: 'translate(-50%, -50%) rotate(45deg)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 100%)',
            boxShadow: isActive ? '0 24px 46px rgba(15,23,42,0.42)' : 'none',
            transition: 'box-shadow 0.6s ease',
          }}
        >
          <div className="absolute inset-[18%] rounded-xl border border-white/20 bg-slate-950/60 backdrop-blur-sm" />
        </div>

        {CARDS.map((card, index) => {
          const { transformActive, transformIdle } = cardTransforms[index];
          return (
            <div
              key={`card-${index}`}
              className="absolute left-1/2 top-1/2 flex flex-col gap-2 rounded-3xl border bg-slate-900/60 px-4 py-4 backdrop-blur-md"
              style={{
                width: card.accent ? '126px' : '112px',
                borderColor: palette.cardBorder,
                background: card.accent ? palette.cardAccent : palette.cardSurface,
                boxShadow: isActive
                  ? '0 20px 38px rgba(56,189,248,0.32)'
                  : '0 16px 28px rgba(15,23,42,0.35)',
                transform: reduceMotion || isActive ? transformActive : transformIdle,
                transition: reduceMotion
                  ? undefined
                  : `transform 0.85s cubic-bezier(0.22,1,0.28,1) ${card.delay}ms, box-shadow 0.6s ease ${card.delay}ms`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="h-[6px] flex-1 rounded-full bg-white/70" />
                <span className="h-[8px] w-[18px] rounded-full bg-cyan-200/65" />
              </div>
              <span className="h-[4px] w-[72px] rounded-full bg-white/35" />
              <span className="h-[4px] w-[48px] rounded-full bg-white/20" />
              <div className="flex gap-1 pt-1">
                <span className="h-[6px] w-[12px] rounded-full bg-cyan-200/60" />
                <span className="h-[6px] w-[12px] rounded-full bg-white/28" />
                <span className="h-[6px] w-[12px] rounded-full bg-white/18" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRenameBatchVisual;
