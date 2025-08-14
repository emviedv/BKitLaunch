import React from 'react';
import { motion } from 'framer-motion';
import { Search, User, Settings, Bell, Mail, Calendar, FileText, Image, Video, Music } from 'lucide-react';

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

type IconComponent = React.ComponentType<{ size?: number; className?: string }>; 

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

const renderComponent = (component: UIComponentOutline) => {
  const baseClasses = 'absolute border-2 border-gray-300/70 bg-transparent';

  const slowTransition = {
    delay: component.delay,
    duration: 6,
    repeat: Infinity as const,
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
            borderColor: ['#cbd5e1', '#94a3b8', '#cbd5e1']
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-gray-400/70 rounded-full" />
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 w-20 h-2 bg-gray-300/70 rounded" />
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
            borderColor: ['#cbd5e1', '#94a3b8', '#cbd5e1']
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="absolute inset-2 border border-gray-400/70 rounded-full" />
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
            borderColor: ['#cbd5e1', '#94a3b8', '#cbd5e1']
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="p-4 space-y-2">
            <div className="w-3/4 h-3 bg-gray-300/70 rounded" />
            <div className="w-1/2 h-2 bg-gray-300/70 rounded" />
            <div className="w-full h-2 bg-gray-300/70 rounded" />
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
            borderColor: ['#cbd5e1', '#94a3b8', '#cbd5e1']
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-2 bg-gray-300/70 rounded" />
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
            borderColor: ['#cbd5e1', '#94a3b8', '#cbd5e1']
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="p-4 space-y-3">
            <div className="w-full h-6 border border-gray-300/70 rounded" />
            <div className="w-full h-6 border border-gray-300/70 rounded" />
            <div className="w-20 h-6 border border-gray-300/70 rounded" />
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
            borderColor: ['#cbd5e1', '#94a3b8', '#cbd5e1']
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="p-2 space-y-2">
            <div className="flex space-x-2">
              <div className="w-1/3 h-2 bg-gray-300/70 rounded" />
              <div className="w-1/3 h-2 bg-gray-300/70 rounded" />
              <div className="w-1/3 h-2 bg-gray-300/70 rounded" />
            </div>
            <div className="flex space-x-2">
              <div className="w-1/3 h-2 bg-gray-300/70 rounded" />
              <div className="w-1/3 h-2 bg-gray-300/70 rounded" />
              <div className="w-1/3 h-2 bg-gray-300/70 rounded" />
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
            borderColor: ['#cbd5e1', '#94a3b8', '#cbd5e1'],
            rotate: [0, 120, 240, 360]
          }}
          transition={slowTransition}
          aria-hidden="true"
        >
          <div className="w-full h-full border border-gray-300/70 rounded" />
        </motion.div>
      );

    default:
      return null;
  }
};

export interface BlocksHeroBackgroundProps {
  className?: string;
}

export const BlocksHeroBackground: React.FC<BlocksHeroBackgroundProps> = ({ className }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className || ''}`} aria-hidden="true">
      <div className="absolute inset-0">
        {components.map(renderComponent)}
      </div>

      <div className="absolute inset-0">
        {floatingIcons.map(({ Icon, x, y }, index) => (
          <motion.div
            key={`floating-${index}`}
            className="absolute text-gray-400/70"
            style={{ left: x, top: y }}
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
  );
};

export default BlocksHeroBackground;


