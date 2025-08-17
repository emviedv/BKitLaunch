import React from 'react';
import { motion } from 'framer-motion';

export interface ShootingStarsBackgroundProps {
  className?: string;
  density?: number; // number of stars
  speedMs?: number; // average time for a star to travel top -> bottom
}

interface StarConfig {
  id: string;
  leftPercent: number;
  delayMs: number;
  durationMs: number;
  sizePx: number;
  xDriftPx: number;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export const ShootingStarsBackground: React.FC<ShootingStarsBackgroundProps> = ({
  className,
  density = 18,
  speedMs = 6000,
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
      return {
        id: `star-${i}`,
        leftPercent,
        delayMs,
        durationMs,
        sizePx,
        xDriftPx,
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
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className || ''}`}
      style={{ opacity: isReducedMotion ? 0.5 : undefined }}
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
          <div className="relative flex flex-col items-center">
            {/* tail */}
            <div className="w-px h-12 md:h-16 lg:h-20 bg-gradient-to-b from-white/90 via-white/30 to-transparent blur-[0.5px]" />
            {/* core */}
            <div
              className="rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
              style={{ width: star.sizePx, height: star.sizePx }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShootingStarsBackground;


