import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface LineAssemblyItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
}

export interface LineAssemblyAnimationProps {
  items: LineAssemblyItem[];
  lineColor?: string; // Tailwind class like "stroke-primary/30" or hex like "#94a3b8"
  durationMs?: number;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

const useElementSize = (ref: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const target = ref.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();

    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const ro = new ResizeObserver(() => update());
      ro.observe(element);
      return () => ro.disconnect();
    }

    if (typeof window !== 'undefined') {
      const win: Window & typeof globalThis = window;
      win.addEventListener('resize', update);
      return () => win.removeEventListener('resize', update);
    }
  }, [ref]);

  return size;
};

const polarToCartesian = (center: Point, radius: number, angleRad: number): Point => ({
  x: center.x + radius * Math.cos(angleRad),
  y: center.y + radius * Math.sin(angleRad),
});

const isHexColor = (value?: string) => Boolean(value && (/^#/.test(value) || value.startsWith('rgb') || value.startsWith('hsl')));

export const LineAssemblyAnimation: React.FC<LineAssemblyAnimationProps> = ({
  items,
  lineColor = 'stroke-primary/30',
  durationMs = 1800,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(containerRef);

  const center = useMemo<Point>(() => ({ x: width / 2, y: height / 2 }), [width, height]);

  const ringRadius = useMemo(() => {
    const minDim = Math.min(width, height);
    return Math.max(60, Math.floor(minDim * 0.32));
  }, [width, height]);

  const nodes = useMemo(() => {
    const count = Math.max(0, Math.min(items.length, 12));
    if (count === 0) return [] as Array<{ point: Point; item: LineAssemblyItem; index: number }>;
    const step = (Math.PI * 2) / count;
    const startAngle = -Math.PI / 2; // start at top
    return items.slice(0, count).map((item, i) => {
      const angle = startAngle + i * step;
      return {
        item,
        index: i,
        point: polarToCartesian(center, ringRadius, angle),
      };
    });
  }, [items, center, ringRadius]);

  const svgViewBox = useMemo(() => `0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`, [width, height]);

  const strokeClass = isHexColor(lineColor) ? undefined : lineColor;
  const strokeStyle = isHexColor(lineColor) ? { stroke: lineColor as string } : undefined;

  // Early return if no available space or no nodes
  if (!width || !height || nodes.length === 0) {
    return (
      <div ref={containerRef} className={clsx('pointer-events-none absolute inset-0', className)} aria-hidden="true" />
    );
  }

  return (
    <div ref={containerRef} className={clsx('pointer-events-none absolute inset-0', className)} aria-hidden="true">
      <svg
        role="presentation"
        aria-hidden="true"
        viewBox={svgViewBox}
        className="absolute inset-0 h-full w-full"
      >
        {/* Radial connector lines to center */}
        {nodes.map(({ point }, i) => {
          const d = `M ${point.x} ${point.y} L ${center.x} ${center.y}`;
          return (
            <motion.path
              key={`line-${i}`}
              d={d}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: durationMs / 1000, delay: 0.15 + i * 0.05, ease: 'easeInOut' }}
              className={clsx('fill-none', strokeClass)}
              style={{ ...strokeStyle, strokeWidth: 1.5 }}
              strokeLinecap="round"
            />
          );
        })}

        {/* Outer ring path for a soft circular guide */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={ringRadius}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: durationMs / 1000, ease: 'easeOut' }}
          className={clsx('fill-none opacity-40', strokeClass)}
          style={{ ...strokeStyle, strokeWidth: 1 }}
        />
      </svg>

      {/* Center hub */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
      >
        <div className="pointer-events-auto rounded-xl border border-primary/20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 shadow-sm px-3 py-2 text-xs font-medium text-gray-700 select-none">
          Assembling UI
        </div>
      </motion.div>

      {/* Node cards/icons */}
      {nodes.map(({ point, item, index }) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8, x: point.x, y: point.y }}
          animate={{ opacity: 1, scale: 1, x: point.x, y: point.y }}
          transition={{ delay: 0.1 + index * 0.05, duration: 0.45 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="pointer-events-auto rounded-lg border border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 text-[11px] leading-tight text-gray-700 shadow-sm px-2.5 py-1.5 flex items-center gap-1.5">
            {item.icon && (
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center text-gray-600" aria-hidden="true">{item.icon}</span>
            )}
            {item.label && <span className="whitespace-nowrap">{item.label}</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// no default export per project guidelines (named exports only for components)

