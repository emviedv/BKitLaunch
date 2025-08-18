import React from 'react';
import { motion } from 'framer-motion';

export interface ShootingStarsBackgroundProps {
  className?: string;
  density?: number; // number of stars
  speedMs?: number; // average time for a star to travel top -> bottom
  debug?: boolean; // shows a tinted overlay and outline to confirm visibility
}

interface StarConfig {
  id: string;
  leftPercent: number;
  delayMs: number;
  durationMs: number;
  sizePx: number;
  xDriftPx: number;
  twinkleDelayMs: number;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export const ShootingStarsBackground: React.FC<ShootingStarsBackgroundProps> = ({
  className,
  density = 18,
  speedMs = 6000,
  debug = false,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [stars, setStars] = React.useState<StarConfig[]>([]);
  const [isReducedMotion, setIsReducedMotion] = React.useState(false);
  const [viewportWidth, setViewportWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Observe reduced motion and viewport
  React.useEffect(() => {
    if (!mounted) return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleRm = () => setIsReducedMotion(rm.matches);
    handleRm();
    rm.addEventListener?.('change', handleRm);

    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      rm.removeEventListener?.('change', handleRm);
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;

    // Responsive, reduced-motion-aware density and speed
    let numStars = clamp(Math.round(density), 4, 36);
    if (viewportWidth !== null) {
      if (viewportWidth < 640) {
        numStars = Math.max(4, Math.round(numStars * 0.5));
      } else if (viewportWidth < 1024) {
        numStars = Math.max(6, Math.round(numStars * 0.8));
      }
    }
    if (isReducedMotion) {
      numStars = Math.min(numStars, 8);
    }

    let speedTarget = speedMs;
    if (viewportWidth !== null && viewportWidth < 640) {
      speedTarget = Math.round(speedTarget * 1.1);
    }
    if (isReducedMotion) {
      speedTarget = Math.round(speedTarget * 1.3);
    }

    const configs: StarConfig[] = Array.from({ length: numStars }).map((_, i) => {
      const leftPercent = Math.random() * 100; // 0..100
      const delayMs = Math.random() * 4000; // random stagger
      const durationJitter = 0.6 + Math.random() * 0.8; // 0.6x..1.4x
      const durationMs = clamp(speedTarget * durationJitter, 2800, 14000);
      const sizePx = 2 + Math.floor(Math.random() * 2); // 2..3 px core for visibility
      const xDriftPx = (Math.random() * 60 - 30) * (Math.random() > 0.5 ? 1 : 0.6); // gentle horizontal drift
      const twinkleDelayMs = Math.random() * 800;
      return {
        id: `star-${i}`,
        leftPercent,
        delayMs,
        durationMs,
        sizePx,
        xDriftPx,
        twinkleDelayMs,
      };
    });
    setStars(configs);
  }, [mounted, density, speedMs, viewportWidth, isReducedMotion]);

  // Avoid hydration issues from random positions on server
  if (!mounted) {
    return <div className={`absolute inset-0 pointer-events-none ${className || ''}`} aria-hidden="true" />;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${debug ? 'z-40' : 'z-20'} ${debug ? 'bg-emerald-300/15' : ''} ${className || ''}`}
      style={{
        opacity: isReducedMotion ? 0.5 : undefined,
        outline: debug ? '1px dashed rgba(16,185,129,0.6)' : undefined,
      }}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{ left: `${star.leftPercent}%`, top: -16 }}
          initial={{ y: -64, x: 0, opacity: 0 }}
          animate={{ y: '120%', x: star.xDriftPx, opacity: [0, 1, 0.0] }}
          transition={{
            delay: star.delayMs / 1000,
            duration: star.durationMs / 1000,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          <div className="relative flex flex-col items-center mix-blend-screen">
            {/* tail (brighter golden with glow) */}
            <div className="relative">
              <div className="w-[2px] h-16 md:h-24 lg:h-32 bg-gradient-to-b from-yellow-200 via-yellow-200 to-transparent" />
              <div className="absolute inset-0 blur-[2px] bg-gradient-to-b from-yellow-300/70 via-yellow-200/50 to-transparent" />
            </div>
            {/* core (stronger glow) */}
            <div
              className="relative rounded-full bg-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.95),0_0_30px_rgba(253,224,71,0.7)]"
              style={{ width: star.sizePx + 1, height: star.sizePx + 1 }}
            />
            {/* sparkle pulse with randomized phase */}
            <motion.div
              className="absolute rounded-full bg-yellow-200"
              style={{ width: star.sizePx + 3, height: star.sizePx + 3 }}
              initial={{ opacity: 0.75, scale: 0.9 }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.25, 0.95] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: star.twinkleDelayMs / 1000 }}
            />
            {/* animated glint cross */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ rotate: 0, opacity: 0.9 }}
              animate={{ rotate: [0, 20, -10, 0], opacity: [0.8, 1, 0.85, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: star.twinkleDelayMs / 1200 }}
            >
              <div className="absolute w-4 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />
              <div className="absolute h-4 w-px bg-gradient-to-b from-transparent via-yellow-300 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShootingStarsBackground;


