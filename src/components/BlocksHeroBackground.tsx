import React from 'react';
import { motion } from 'framer-motion';
import { Search, User, Settings, Bell, Mail, Calendar, FileText, Image, Video, Music } from '@/lib/iconUtils';

// Background animation for BiblioKit Blocks hero
// Adapted from the provided LoadingScreenAnimation:
// - Removed scanning line effect
// - Removed central loading text
// - Slowed overall animation timings for a calmer hero background

type UIComponentType = 'button' | 'card' | 'input' | 'avatar' | 'icon' | 'form' | 'table';

interface UIComponentOutline {
  id: string;
  type: UIComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
}

type IconComponent = React.ComponentType<{ size?: number | string; className?: string }>;

interface FloatingIconDef {
  Icon: IconComponent;
  x: number;
  y: number;
}

const components: UIComponentOutline[] = [
  { id: 'search', type: 'input', x: 50, y: 100, width: 300, height: 40, delay: 0 },
  { id: 'profile', type: 'avatar', x: 400, y: 80, width: 60, height: 60, delay: 0.3 },
  { id: 'nav-card', type: 'card', x: 50, y: 200, width: 200, height: 120, delay: 0.6 },
  { id: 'main-card', type: 'card', x: 300, y: 180, width: 350, height: 200, delay: 0.9 },
  { id: 'sidebar', type: 'card', x: 700, y: 100, width: 180, height: 300, delay: 1.2 },
  { id: 'button-1', type: 'button', x: 50, y: 350, width: 100, height: 35, delay: 1.5 },
  { id: 'button-2', type: 'button', x: 170, y: 350, width: 100, height: 35, delay: 1.8 },
  { id: 'form', type: 'form', x: 300, y: 420, width: 250, height: 150, delay: 2.1 },
  { id: 'table', type: 'table', x: 50, y: 450, width: 200, height: 100, delay: 2.4 },
  { id: 'icon-1', type: 'icon', x: 600, y: 450, width: 30, height: 30, delay: 2.7 },
  { id: 'icon-2', type: 'icon', x: 650, y: 450, width: 30, height: 30, delay: 3.0 },
  { id: 'icon-3', type: 'icon', x: 700, y: 450, width: 30, height: 30, delay: 3.3 }
];

const floatingIcons: FloatingIconDef[] = [
  { Icon: Search, x: 100, y: 50 },
  { Icon: User, x: 800, y: 150 },
  { Icon: Settings, x: 150, y: 600 },
  { Icon: Bell, x: 750, y: 500 },
  { Icon: Mail, x: 900, y: 300 },
  { Icon: Calendar, x: 50, y: 550 },
  { Icon: FileText, x: 850, y: 80 },
  { Icon: Image, x: 200, y: 400 },
  { Icon: Video, x: 600, y: 200 },
  { Icon: Music, x: 500, y: 550 }
];

// Use the same color family as the primary Hero animation
const heroPalette: string[] = ['#98fb98', '#1f2937', '#87ceeb']; // soft green, charcoal, blue
const cycleFrom = (start: number): string[] => [
  heroPalette[start % heroPalette.length],
  heroPalette[(start + 1) % heroPalette.length],
  heroPalette[(start + 2) % heroPalette.length],
];
const translucent = (hex: string | undefined, alphaHex: string = '66') => {
  if (!hex) return `#ffffff${alphaHex}`;
  return hex.length === 7 ? `${hex}${alphaHex}` : hex;
};

const renderComponent = (component: UIComponentOutline, colorIndex: number = 0) => {
  const baseClasses = 'absolute border-2 border-white/60 bg-transparent';

  const slowTransition = {
    delay: component.delay,
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  };

  switch (component.type) {
    case 'input':
      return (
        <motion.div
          key={component.id}
          className={`${baseClasses} rounded-md`}
          style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.95, 1.02, 0.95],
            borderColor: cycleFrom(colorIndex)
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border rounded-full" style={{ borderColor: translucent(heroPalette[colorIndex % heroPalette.length]) }} />
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 w-20 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 1) % heroPalette.length]) }} />
        </motion.div>
      );

    case 'avatar':
      return (
        <motion.div
          key={component.id}
          className={`${baseClasses} rounded-full`}
          style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.95, 1.06, 0.95],
            borderColor: cycleFrom(colorIndex)
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="absolute inset-2 border rounded-full" style={{ borderColor: translucent(heroPalette[(colorIndex + 1) % heroPalette.length]) }} />
        </motion.div>
      );

    case 'card':
      return (
        <motion.div
          key={component.id}
          className={`${baseClasses} rounded-lg`}
          style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.96, 1.02, 0.96],
            borderColor: cycleFrom(colorIndex)
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="p-4 space-y-2">
            <div className="w-3/4 h-3 rounded" style={{ backgroundColor: translucent(heroPalette[colorIndex % heroPalette.length]) }} />
            <div className="w-1/2 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 1) % heroPalette.length]) }} />
            <div className="w-full h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 2) % heroPalette.length]) }} />
          </div>
        </motion.div>
      );

    case 'button':
      return (
        <motion.div
          key={component.id}
          className={`${baseClasses} rounded`}
          style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.98, 1.03, 0.98],
            borderColor: cycleFrom(colorIndex)
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 1) % heroPalette.length]) }} />
          </div>
        </motion.div>
      );

    case 'form':
      return (
        <motion.div
          key={component.id}
          className={`${baseClasses} rounded-lg`}
          style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.96, 1.02, 0.96],
            borderColor: cycleFrom(colorIndex)
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="p-4 space-y-3">
            <div className="w-full h-6 border rounded" style={{ borderColor: translucent(heroPalette[colorIndex % heroPalette.length]) }} />
            <div className="w-full h-6 border rounded" style={{ borderColor: translucent(heroPalette[(colorIndex + 1) % heroPalette.length]) }} />
            <div className="w-20 h-6 border rounded" style={{ borderColor: translucent(heroPalette[(colorIndex + 2) % heroPalette.length]) }} />
          </div>
        </motion.div>
      );

    case 'table':
      return (
        <motion.div
          key={component.id}
          className={`${baseClasses} rounded`}
          style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.96, 1.02, 0.96],
            borderColor: cycleFrom(colorIndex)
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="p-2 space-y-2">
            <div className="flex space-x-2">
              <div className="w-1/3 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[colorIndex % heroPalette.length]) }} />
              <div className="w-1/3 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 1) % heroPalette.length]) }} />
              <div className="w-1/3 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 2) % heroPalette.length]) }} />
            </div>
            <div className="flex space-x-2">
              <div className="w-1/3 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 1) % heroPalette.length]) }} />
              <div className="w-1/3 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[(colorIndex + 2) % heroPalette.length]) }} />
              <div className="w-1/3 h-2 rounded" style={{ backgroundColor: translucent(heroPalette[colorIndex % heroPalette.length]) }} />
            </div>
          </div>
        </motion.div>
      );

    case 'icon':
      return (
        <motion.div
          key={component.id}
          className={`${baseClasses} rounded`}
          style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.95, 1.08, 0.95],
            borderColor: cycleFrom(colorIndex),
            rotate: [0, 120, 240, 360]
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="w-full h-full border rounded" style={{ borderColor: translucent(heroPalette[(colorIndex + 2) % heroPalette.length]) }} />
        </motion.div>
      );

    default:
      return null;
  }
};

export interface BlocksHeroBackgroundProps {
  className?: string;
  emoji?: string;
  emojiX?: number;
  emojiY?: number;
  // Ensure the emoji appears at least this many viewport pixels from the top
  minEmojiViewportTop?: number;
}

export const BlocksHeroBackground: React.FC<BlocksHeroBackgroundProps> = ({ className, emoji, emojiX, emojiY, minEmojiViewportTop }) => {
  // Centered, responsive canvas for consistent layout
  const designWidth = 1000;
  const designHeight = 700;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState<number>(1);

  React.useEffect(() => {
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;
      const { clientWidth, clientHeight } = el;
      if (!clientWidth || !clientHeight) return;
      const widthScale = clientWidth / designWidth;
      const heightScale = clientHeight / designHeight;
      setScale(Math.min(widthScale, heightScale));
    };

    updateScale();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateScale);
      if (containerRef.current) ro.observe(containerRef.current);
    } else {
      window.addEventListener('resize', updateScale);
    }
    return () => {
      if (ro && containerRef.current) ro.unobserve(containerRef.current);
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className || ''}`} aria-hidden="true">
      {/* Soft green → charcoal → blue background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-slate-200/35 to-sky-100/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/30 via-slate-100/25 to-sky-50/30" />
      </div>
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center',
          willChange: 'transform',
        }}
      >
        {/* Optional emoji rendered within the scaled canvas to avoid layout shifts */}
        {emoji && (
          <motion.div
            className="absolute select-none"
            style={{
              left: `${typeof emojiX === 'number' ? emojiX : designWidth / 2}px`,
              top: (() => {
                const baseY = (typeof emojiY === 'number' ? emojiY : 110);
                if (typeof minEmojiViewportTop === 'number' && scale > 0) {
                  // Convert desired viewport px offset to canvas space by dividing by scale
                  const minCanvasY = minEmojiViewportTop / scale;
                  return `${Math.max(baseY, minCanvasY)}px`;
                }
                return `${baseY}px`;
              })(),
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <span style={{ fontSize: 56, lineHeight: '56px' }}>{emoji}</span>
          </motion.div>
        )}

        <div className="absolute inset-0">
          {components.map((component, index) => renderComponent(component, index))}
        </div>

        <div className="absolute inset-0">
          {floatingIcons.map(({ Icon, x, y }, index) => (
            <motion.div
              key={`floating-${index}`}
              className="absolute"
              style={{ left: x, top: y, color: translucent(heroPalette[index % heroPalette.length], '99') }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.35, 0.2, 0.35],
                scale: [0, 1.05, 0.9, 1.05],
                rotate: [0, 360],
                x: [0, Math.sin(index) * 14, 0],
                y: [0, Math.cos(index) * 10, 0]
              }}
              transition={{
                delay: index * 0.4,
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Icon size={20} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlocksHeroBackground;
