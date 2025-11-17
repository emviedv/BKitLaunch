import React, { useEffect, useRef, useState } from 'react';

type UXBiblioVariant =
  | 'uxbiblio-organize'
  | 'uxbiblio-capture'
  | 'uxbiblio-insights'
  | 'uxbiblio-collections'
  | 'uxbiblio-pin'
  | 'uxbiblio-reuse';

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const ensureKeyframesInjected = () => {
  if (typeof document === 'undefined') {
    return;
  }
  const token = '__uxbiblioAbstractKeyframesV2__';
  if ((window as any)[token]) {
    return;
  }

  const style = document.createElement('style');
  style.setAttribute('data-uxbiblio-abstract-visuals', 'true');
  style.innerHTML = `
    @keyframes uxbOrganizeOrbitA {
      0% { transform: translate(-76px, -62px) rotate(-18deg) scale(0.82); opacity: 0; }
      12% { opacity: 0.45; }
      48% { transform: translate(-10px, -18px) rotate(-4deg) scale(1); opacity: 0.95; }
      70% { opacity: 0.7; }
      100% { transform: translate(-76px, -62px) rotate(-18deg) scale(0.82); opacity: 0; }
    }
    @keyframes uxbOrganizeOrbitB {
      0% { transform: translate(78px, -32px) rotate(12deg) scale(0.78); opacity: 0; }
      18% { opacity: 0.4; }
      50% { transform: translate(6px, -8px) rotate(2deg) scale(1); opacity: 0.9; }
      78% { opacity: 0.65; }
      100% { transform: translate(78px, -32px) rotate(12deg) scale(0.78); opacity: 0; }
    }
    @keyframes uxbOrganizeOrbitC {
      0% { transform: translate(-24px, 74px) rotate(-6deg) scale(0.8); opacity: 0; }
      10% { opacity: 0.35; }
      52% { transform: translate(-4px, 20px) rotate(0deg) scale(1); opacity: 0.88; }
      82% { opacity: 0.5; }
      100% { transform: translate(-24px, 74px) rotate(-6deg) scale(0.8); opacity: 0; }
    }
    @keyframes uxbCaptureSweep {
      0% { transform: translateY(-72px); opacity: 0; }
      15% { opacity: 0.75; }
      50% { transform: translateY(72px); opacity: 0.4; }
      85% { opacity: 0; }
      100% { transform: translateY(-72px); opacity: 0; }
    }
    @keyframes uxbCaptureExposure {
      0% { transform: translateX(-36px); opacity: 0; }
      20% { opacity: 0.6; }
      70% { transform: translateX(36px); opacity: 0.2; }
      100% { transform: translateX(-36px); opacity: 0; }
    }
    @keyframes uxbInsightSweep {
      0% { transform: rotate(0deg); opacity: 0; }
      15% { opacity: 0.35; }
      50% { transform: rotate(180deg); opacity: 0.7; }
      85% { opacity: 0.15; }
      100% { transform: rotate(360deg); opacity: 0; }
    }
    @keyframes uxbInsightDrop {
      0% { transform: translateY(-48px); opacity: 0; }
      25% { opacity: 0.65; }
      70% { transform: translateY(48px); opacity: 0.25; }
      100% { transform: translateY(54px); opacity: 0; }
    }
    @keyframes uxbCollectionsPulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      45% { transform: scale(1.08); opacity: 0.55; }
      70% { transform: scale(0.95); opacity: 0.68; }
    }
    @keyframes uxbCollectionsFloat {
      0%, 100% { transform: translateY(0); opacity: 0.55; }
      50% { transform: translateY(-12px); opacity: 0.4; }
    }
    @keyframes uxbPinGlow {
      0%, 100% { transform: scale(1); opacity: 0.72; }
      45% { transform: scale(1.12); opacity: 0.45; }
      70% { transform: scale(0.9); opacity: 0.6; }
    }
    @keyframes uxbPinSlide {
      0% { transform: translateY(-26px); opacity: 0; }
      25% { opacity: 0.75; }
      70% { transform: translateY(14px); opacity: 0.4; }
      100% { transform: translateY(26px); opacity: 0; }
    }
    @keyframes uxbReuseShift {
      0% { transform: translate(0, 0); opacity: 0.85; }
      50% { transform: translate(38px, -18px); opacity: 0.4; }
      100% { transform: translate(0, 0); opacity: 0.85; }
    }
    @keyframes uxbReuseGlow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 0.25; }
    }
  `;
  document.head.appendChild(style);
  (window as any)[token] = true;
};

const useIsActive = (
  ref: React.RefObject<HTMLDivElement>,
  reduceMotion: boolean
): boolean => {
  const [active, setActive] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setActive(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }
        setActive(entry.isIntersecting);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, reduceMotion]);

  return active;
};

interface AbstractProps {
  isActive: boolean;
  reduceMotion: boolean;
}

const renderOrganize = ({ isActive, reduceMotion }: AbstractProps) => {
  const animate = isActive && !reduceMotion;

  const clusterBase: React.CSSProperties = {
    position: 'absolute',
    width: '138px',
    height: '92px',
    borderRadius: '28px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.07)',
    boxShadow: '0 24px 40px rgba(15,23,42,0.3)',
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="relative h-[220px] w-[220px] rounded-[32px] border border-white/12 bg-white/5 backdrop-blur-xl"
        aria-hidden
      >
        <span
          className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-dashed border-white/14"
          style={{
            opacity: isActive ? 0.5 : 0.2,
            transition: 'opacity 0.6s ease',
          }}
        />

        <span
          style={{
            ...clusterBase,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'linear-gradient(135deg, rgba(14,165,233,0.35) 0%, rgba(56,189,248,0.15) 100%)',
            borderColor: 'rgba(56,189,248,0.45)',
          }}
        />

        <span
          style={{
            ...clusterBase,
            left: '50%',
            top: '50%',
            opacity: animate ? undefined : 0.6,
            animation: animate
              ? 'uxbOrganizeOrbitA 7.8s cubic-bezier(0.45, 0, 0.2, 1) infinite'
              : undefined,
          }}
        />
        <span
          style={{
            ...clusterBase,
            left: '50%',
            top: '50%',
            opacity: animate ? undefined : 0.55,
            animation: animate
              ? 'uxbOrganizeOrbitB 7.8s cubic-bezier(0.45, 0, 0.2, 1) infinite 160ms'
              : undefined,
            borderColor: 'rgba(34,197,94,0.35)',
            background:
              'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(255,255,255,0.06) 100%)',
          }}
        />
        <span
          style={{
            ...clusterBase,
            left: '50%',
            top: '50%',
            opacity: animate ? undefined : 0.5,
            animation: animate
              ? 'uxbOrganizeOrbitC 7.8s cubic-bezier(0.45, 0, 0.2, 1) infinite 320ms'
              : undefined,
            borderColor: 'rgba(250,204,21,0.28)',
            background:
              'linear-gradient(135deg, rgba(250,204,21,0.18) 0%, rgba(255,255,255,0.05) 100%)',
          }}
        />
      </div>
    </div>
  );
};

const renderCapture = ({ isActive, reduceMotion }: AbstractProps) => {
  const animate = isActive && !reduceMotion;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="relative h-[210px] w-[210px] rounded-[28px] border border-white/12 bg-slate-950/50 backdrop-blur-xl"
        aria-hidden
      >
        <span
          className="absolute inset-[18px] rounded-[22px] border border-white/10"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(14,165,233,0.38)',
          }}
        />
        <span
          className="absolute inset-x-[32px] top-[46px] h-[86px] rounded-[18px]"
          style={{
            border: '1px solid rgba(14,165,233,0.42)',
            background:
              'linear-gradient(135deg, rgba(14,165,233,0.24) 0%, rgba(14,165,233,0.08) 100%)',
          }}
        />
        <span
          className="absolute inset-x-[44px] top-[52px] h-[74px] rounded-[16px] bg-white/6"
        />
        <span
          className="absolute left-[46px] top-[32px] h-2 w-[54px] rounded-full bg-white/20"
        />
        <span
          className="absolute left-[46px] bottom-[34px] h-2 w-[66px] rounded-full bg-white/14"
        />
        <span
          className="absolute right-[38px] top-[34px] h-3 w-3 rounded-full"
          style={{
            background: 'rgba(14,165,233,0.85)',
            boxShadow: animate ? '0 0 12px rgba(56,189,248,0.55)' : 'none',
            transition: 'box-shadow 0.6s ease',
          }}
        />
        <span
          className="absolute inset-x-[60px] top-[58px] h-[58px] rounded-[14px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.05) 100%)',
            animation: animate ? 'uxbCaptureSweep 6.6s ease-in-out infinite' : undefined,
          }}
        />
        {[-1, 1].map((direction) => (
          <span
            key={direction}
            className="absolute left-[34px] top-1/2 h-[64px] w-[46px] rounded-[14px] border border-white/10 bg-white/4"
            style={{
              transform: `translate(${direction * 64}px, -50%) rotate(${direction * 4}deg)`,
              animation: animate
                ? `uxbCaptureExposure 7.2s ease-in-out infinite ${direction === -1 ? '120ms' : '420ms'}`
                : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const renderInsights = ({ isActive, reduceMotion }: AbstractProps) => {
  const animate = isActive && !reduceMotion;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-[220px] w-[220px]" aria-hidden>
        <span
          className="absolute left-1/2 top-1/2 h-[176px] w-[176px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12"
          style={{
            opacity: isActive ? 0.45 : 0.2,
            transition: 'opacity 0.6s ease',
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            border: '1px solid rgba(249,115,22,0.45)',
            animation: animate ? 'uxbInsightSweep 8.8s linear infinite' : undefined,
          }}
        />
        {[ -60, 0, 60 ].map((offset, index) => (
          <span
            key={offset}
            className="absolute left-1/2 top-[32px] flex h-[144px] translate-x-[-50%] flex-col justify-between"
            style={{
              transform: `translate(calc(-50% + ${offset}px), 0)`,
            }}
          >
            {[0, 1, 2].map((drop) => (
              <span
                key={drop}
                className="relative h-[34px] w-[12px] rounded-full border border-white/14"
                style={{
                  background: index === 1 ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.08)',
                  animation: animate
                    ? `uxbInsightDrop ${5.4 + index * 0.4}s ease-in-out infinite ${drop * 180}ms`
                    : undefined,
                  opacity: isActive ? 0.75 : 0.3,
                }}
              >
                <span
                  className="absolute left-1/2 top-[6px] h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.4)' }}
                />
                <span
                  className="absolute left-1/2 bottom-[6px] h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{
                    background: index === 1 ? 'rgba(251,191,36,0.4)' : 'rgba(148,163,184,0.24)',
                  }}
                />
              </span>
            ))}
          </span>
        ))}
        <span
          className="absolute left-1/2 top-1/2 h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(249,115,22,0.12) 60%, rgba(15,23,42,0.6) 100%)',
            boxShadow: animate ? '0 24px 46px rgba(249,115,22,0.32)' : 'none',
            transition: 'box-shadow 0.6s ease',
          }}
        />
      </div>
    </div>
  );
};

const renderCollections = ({ isActive, reduceMotion }: AbstractProps) => {
  const animate = isActive && !reduceMotion;
  const tileSize = 52;

  const tiles = [
    { row: 0, col: 0, highlight: true },
    { row: 0, col: 1, highlight: false },
    { row: 0, col: 2, highlight: false },
    { row: 1, col: 0, highlight: false },
    { row: 1, col: 1, highlight: true },
    { row: 1, col: 2, highlight: false },
    { row: 2, col: 0, highlight: false },
    { row: 2, col: 1, highlight: false },
    { row: 2, col: 2, highlight: true },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-[220px] w-[220px]" aria-hidden>
        <span
          className="absolute left-1/2 top-1/2 h-[196px] w-[196px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/12"
          style={{
            opacity: isActive ? 0.5 : 0.2,
            transition: 'opacity 0.6s ease',
          }}
        />
        {tiles.map((tile, index) => {
          const translate = `translate(${tile.col * (tileSize + 12) - 92}px, ${
            tile.row * (tileSize + 12) - 92
          }px)`;
          return (
            <span
              key={`${tile.row}-${tile.col}`}
              className="absolute rounded-[16px] border backdrop-blur-sm"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                transform: translate,
                borderColor: tile.highlight
                  ? 'rgba(34,197,94,0.45)'
                  : 'rgba(255,255,255,0.12)',
                background: tile.highlight
                  ? 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.12) 100%)'
                  : 'rgba(255,255,255,0.05)',
                boxShadow: tile.highlight
                  ? '0 18px 36px rgba(34,197,94,0.25)'
                  : '0 12px 22px rgba(15,23,42,0.28)',
                animation: animate
                  ? tile.highlight
                    ? `uxbCollectionsPulse 5.6s ease-in-out infinite ${index * 140}ms`
                    : `uxbCollectionsFloat 7.2s ease-in-out infinite ${index * 160}ms`
                  : undefined,
                opacity: isActive ? 0.85 : 0.4,
              }}
            >
              <span className="absolute left-[10px] top-[12px] h-2 w-[30px] rounded-full bg-white/18" />
              <span className="absolute left-[10px] top-[26px] flex gap-1">
                <span
                  className="block h-2 w-2 rounded-full"
                  style={{
                    background: tile.highlight ? 'rgba(34,197,94,0.6)' : 'rgba(148,163,184,0.26)',
                  }}
                />
                <span className="block h-2 w-2 rounded-full bg-white/20" />
              </span>
            </span>
          );
        })}
        <span
          className="absolute left-1/2 top-1/2 h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/14"
          style={{
            background: 'rgba(15,23,42,0.55)',
          }}
        >
          <span
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'rgba(34,197,94,0.6)' }}
          />
        </span>
      </div>
    </div>
  );
};

const renderPin = ({ isActive, reduceMotion }: AbstractProps) => {
  const animate = isActive && !reduceMotion;

  const boardTransformActive = 'translate(0, 0) rotate(-4deg)';
  const boardTransformIdle = 'translate(0, 22px) rotate(-10deg)';

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="relative h-[220px] w-[220px] rounded-[28px] border border-white/10 bg-white/6 backdrop-blur-lg"
        style={{
          transform: reduceMotion || isActive ? boardTransformActive : boardTransformIdle,
          transition: reduceMotion
            ? 'opacity 0.5s ease'
            : 'transform 0.85s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s ease',
          boxShadow: isActive
            ? '0 26px 48px rgba(236,72,153,0.35)'
            : '0 16px 28px rgba(15,23,42,0.32)',
          opacity: isActive ? 1 : 0,
        }}
        aria-hidden
      >
        <span className="absolute inset-[18px] rounded-[22px] border border-white/12 bg-slate-950/45" />
        <div className="absolute inset-[32px] flex flex-col gap-4">
          {[0, 1, 2].map((cardIndex) => {
            const highlight = cardIndex === 0;
            const slideAnimation = animate
              ? `uxbPinSlide ${5.5 + cardIndex * 0.4}s ease-in-out ${cardIndex * 260}ms infinite`
              : undefined;
            return (
              <span
                key={cardIndex}
                className="relative block h-[66px] rounded-2xl border"
                style={{
                  borderColor: highlight ? 'rgba(236,72,153,0.6)' : 'rgba(255,255,255,0.1)',
                  background: highlight
                    ? 'linear-gradient(135deg, rgba(244,114,182,0.32) 0%, rgba(244,114,182,0.12) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: highlight
                    ? '0 18px 36px rgba(236,72,153,0.32)'
                    : '0 12px 22px rgba(15,23,42,0.28)',
                  animation: slideAnimation,
                }}
              >
                <span className="absolute left-[16px] top-[18px] h-2 w-[56px] rounded-full bg-white/20" />
                <span
                  className="absolute left-[16px] top-[34px] h-2 w-[40px] rounded-full"
                  style={{ background: highlight ? 'rgba(236,72,153,0.7)' : 'rgba(148,163,184,0.3)' }}
                />
                <span className="absolute right-[16px] bottom-[18px] flex gap-2">
                  <span className="block h-2 w-2 rounded-full bg-white/26" />
                  <span className="block h-2 w-2 rounded-full bg-white/18" />
                </span>
                {highlight && (
                  <span
                    className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full"
                    style={{
                      background: 'rgba(236,72,153,0.9)',
                      boxShadow: animate ? '0 0 16px rgba(236,72,153,0.55)' : 'none',
                      animation: animate ? 'uxbPinGlow 6.5s ease-in-out infinite' : undefined,
                    }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                )}
              </span>
            );
          })}
        </div>

        <span className="absolute left-[32px] top-[26px] h-3 w-[52px] rounded-full bg-white/12" />
        <span className="absolute right-[34px] top-[26px] flex gap-2">
          <span className="h-2 w-2 rounded-full bg-white/22" />
          <span className="h-2 w-2 rounded-full bg-white/18" />
          <span className="h-2 w-2 rounded-full bg-white/14" />
        </span>
        <span className="absolute left-[32px] bottom-[26px] flex gap-2">
          <span className="block h-2 w-2 rounded-full bg-white/20" />
          <span className="block h-2 w-2 rounded-full bg-white/16" />
          <span className="block h-2 w-2 rounded-full bg-white/10" />
        </span>
      </div>
    </div>
  );
};

const renderReuse = ({ isActive, reduceMotion }: AbstractProps) => {
  const animate = isActive && !reduceMotion;

  const sourceTransformActive = 'translate(-72px, -18px) rotate(-6deg)';
  const sourceTransformIdle = 'translate(-72px, 18px) rotate(-10deg)';

  const targetTransformActive = 'translate(32px, 24px) rotate(4deg)';
  const targetTransformIdle = 'translate(40px, 54px) rotate(10deg)';

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-[220px] w-[220px]" aria-hidden>
        <span
          className="absolute left-1/2 top-1/2 h-[196px] w-[196px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/12"
          style={{
            opacity: isActive ? 0.45 : 0.18,
            transition: 'opacity 0.6s ease',
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 block h-[132px] w-[108px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border bg-white/8 backdrop-blur-md"
          style={{
            borderColor: 'rgba(129,140,248,0.48)',
            transform: reduceMotion || isActive ? sourceTransformActive : sourceTransformIdle,
            transition: reduceMotion
              ? 'opacity 0.5s ease'
              : 'transform 0.85s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s ease',
            boxShadow: '0 22px 42px rgba(99,102,241,0.32)',
          }}
        >
          <span className="absolute left-[18px] top-[18px] h-2 w-[52px] rounded-full bg-white/22" />
          <span className="absolute left-[18px] top-[32px] h-2 w-[64px] rounded-full bg-white/18" />
          <span className="absolute left-[18px] top-[46px] h-2 w-[44px] rounded-full bg-white/14" />
          <span
            className="absolute left-[18px] bottom-[26px] h-2 w-[50px] rounded-full"
            style={{ background: 'rgba(129,140,248,0.55)' }}
          />
          <span className="absolute right-[18px] bottom-[22px] flex gap-2">
            <span className="block h-2 w-2 rounded-full bg-white/26" />
            <span className="block h-2 w-2 rounded-full bg-white/18" />
            <span className="block h-2 w-2 rounded-full bg-white/14" />
          </span>
        </span>

        <span
          className="absolute left-1/2 top-1/2 block h-[134px] w-[108px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border border-dashed"
          style={{
            borderColor: 'rgba(129,140,248,0.5)',
            transform: reduceMotion || isActive ? targetTransformActive : targetTransformIdle,
            transition: reduceMotion
              ? 'opacity 0.5s ease'
              : 'transform 0.85s cubic-bezier(0.23, 1, 0.32, 1) 140ms, opacity 0.6s ease 80ms',
            opacity: isActive ? 0.6 : 0.1,
            background: 'rgba(129,140,248,0.12)',
            animation: animate ? 'uxbReuseGlow 5.4s ease-in-out infinite' : undefined,
          }}
        />

        <span
          className="absolute left-1/2 top-1/2 block h-[134px] w-[108px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border border-white/12 bg-white/10 backdrop-blur-md"
          style={{
            transform: reduceMotion || isActive ? targetTransformActive : targetTransformIdle,
            animation: animate ? 'uxbReuseShift 5.4s ease-in-out infinite' : undefined,
            opacity: isActive ? 0.25 : 0,
          }}
        />

        <span className="absolute left-[46px] top-[32px] h-3 w-[58px] rounded-full bg-white/12" />
        <span className="absolute right-[48px] top-[32px] h-3 w-[46px] rounded-full bg-white/10" />
        <span className="absolute right-[52px] bottom-[32px] h-3 w-[36px] rounded-full bg-white/12" />
      </div>
    </div>
  );
};

const variantRenderers: Record<
  UXBiblioVariant,
  (props: AbstractProps) => JSX.Element
> = {
  'uxbiblio-organize': renderOrganize,
  'uxbiblio-capture': renderCapture,
  'uxbiblio-insights': renderInsights,
  'uxbiblio-collections': renderCollections,
  'uxbiblio-pin': renderPin,
  'uxbiblio-reuse': renderReuse,
};

interface UXBiblioAbstractVisualProps {
  variant: UXBiblioVariant;
}

const UXBiblioAbstractVisual: React.FC<UXBiblioAbstractVisualProps> = ({ variant }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = prefersReducedMotion();
  const isActive = useIsActive(containerRef, reduceMotion);

  useEffect(() => {
    ensureKeyframesInjected();
  }, []);

  const render = variantRenderers[variant] ?? renderOrganize;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[26rem] aspect-[4/3] transition-all duration-700 ease-out"
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'none' : 'translateY(14px)',
      }}
    >
      <span
        className="pointer-events-none absolute -left-14 -top-16 h-64 w-64 rounded-full blur-[140px]"
        style={{ background: 'rgba(59,130,246,0.28)' }}
      />
      <span
        className="pointer-events-none absolute -right-16 bottom-[-38%] h-72 w-72 rounded-full blur-[150px]"
        style={{ background: 'rgba(236,72,153,0.22)' }}
      />
      {render({ isActive, reduceMotion })}
    </div>
  );
};

export default UXBiblioAbstractVisual;
