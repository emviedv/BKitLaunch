import React from 'react';
import { motion } from 'framer-motion';

// Utility function for className concatenation
const cn = (...classes: Array<string | undefined | null | false>): string => {
  return classes.filter(Boolean).join(' ');
};

interface KitPieceProps {
  delay: number;
  x: string;
  y: string;
  width: number;
  height: number;
  rotation: number;
  color: string;
}

const KitPiece: React.FC<KitPieceProps> = ({ delay, x, y, width, height, rotation, color }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        rotate: Math.random() * 360,
      }}
      animate={{
        opacity: 0.6,
        scale: 1,
        x: 0,
        y: 0,
        rotate: rotation,
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: 'easeOut',
        repeat: Infinity,
        repeatType: 'reverse',
      }}
      className="absolute"
      style={{
        left: x,
        top: y,
        width: `${width}px`,
        height: `${height}px`,
      }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full border-2 rounded-lg backdrop-blur-sm"
        style={{
          borderColor: color,
          background: `linear-gradient(135deg, ${color}20, transparent)`,
          boxShadow: `0 0 20px ${color}40`,
        }}
      />
    </motion.div>
  );
};

interface FloatingElementProps {
  delay: number;
  x: string;
  y: string;
  size: number;
  color: string;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ delay, x, y, size, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0.4],
        scale: [0, 1, 0.8],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color}60, transparent)`,
        border: `1px solid ${color}80`,
      }}
      aria-hidden="true"
    />
  );
};

export interface HeroBackgroundProps {
  className?: string;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ className }) => {
  // Avoid SSR hydration mismatches from random initial values
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const kitPieces: KitPieceProps[] = [
    { delay: 0.5, x: '20%', y: '15%', width: 120, height: 80, rotation: -15, color: '#ff69b4' },
    { delay: 0.8, x: '70%', y: '20%', width: 100, height: 60, rotation: 25, color: '#87ceeb' },
    { delay: 1.1, x: '15%', y: '60%', width: 140, height: 70, rotation: 10, color: '#98fb98' },
    { delay: 1.4, x: '75%', y: '65%', width: 90, height: 90, rotation: -30, color: '#dda0dd' },
    { delay: 1.7, x: '45%', y: '25%', width: 110, height: 50, rotation: 45, color: '#f0e68c' },
    { delay: 2.0, x: '35%', y: '70%', width: 80, height: 100, rotation: -10, color: '#ffa07a' },
  ];

  const floatingElements: FloatingElementProps[] = [
    { delay: 0.3, x: '10%', y: '30%', size: 40, color: '#ff69b4' },
    { delay: 0.6, x: '85%', y: '40%', size: 30, color: '#87ceeb' },
    { delay: 0.9, x: '25%', y: '80%', size: 35, color: '#98fb98' },
    { delay: 1.2, x: '80%', y: '10%', size: 25, color: '#dda0dd' },
    { delay: 1.5, x: '60%', y: '85%', size: 45, color: '#f0e68c' },
  ];

  // Render nothing on server to prevent hydration mismatch for animated random initial states
  if (!isMounted) {
    return <div className={cn('absolute inset-0 pointer-events-none', className)} aria-hidden="true" />;
  }

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)} aria-hidden="true">
      {/* Gradient Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-blue-100/20 to-green-100/30" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/20 via-transparent to-yellow-100/20" />

      {/* Animated Kit Pieces */}
      <div className="absolute inset-0">
        {kitPieces.map((piece, index) => (
          <KitPiece key={`kit-${index}`} {...piece} />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element, index) => (
          <FloatingElement key={`float-${index}`} {...element} />
        ))}
      </div>

      {/* Connecting Lines Animation */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <motion.path
          d="M 200 200 Q 400 300 600 400"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.path
          d="M 800 150 Q 500 250 300 500"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.8, repeat: Infinity, repeatType: 'reverse' }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#87ceeb" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#98fb98" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dda0dd" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};


