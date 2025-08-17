import React from 'react';
import { motion } from 'framer-motion';

export interface FigmaIconAnimationProps {
  className?: string;
  strokeWidth?: number;
  size?: number;
  animationDuration?: number;
  variant?: 'sequential' | 'bounce' | 'rotate' | 'pulse' | 'spiral';
  fit?: boolean; // when true, svg fills parent container
}

export const FigmaIconAnimation: React.FC<FigmaIconAnimationProps> = ({
  className = '',
  strokeWidth = 2,
  size = 200,
  animationDuration = 3,
  variant = 'sequential',
  fit = true,
}) => {
  const svgWidth: number | string = fit ? '100%' : size;
  const svgHeight: number | string = fit ? '100%' : size;

  const getVariants = (delay: number) => {
    switch (variant) {
      case 'sequential':
        return {
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              delay,
              pathLength: {
                duration: animationDuration * 0.6,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
              },
              opacity: { duration: 0.2, delay }
            }
          }
        };
      case 'bounce':
        return {
          hidden: { pathLength: 0, scale: 0, rotate: -180 },
          visible: {
            pathLength: 1,
            scale: 1,
            rotate: 0,
            transition: {
              delay,
              pathLength: {
                duration: animationDuration * 0.5,
                ease: 'easeOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
              },
              scale: {
                duration: animationDuration * 0.8,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              },
              rotate: {
                duration: animationDuration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              }
            }
          }
        };
      case 'rotate':
        return {
          hidden: { pathLength: 0, rotate: -360, scale: 0.5 },
          visible: {
            pathLength: 1,
            rotate: 0,
            scale: 1,
            transition: {
              delay,
              pathLength: {
                duration: animationDuration * 0.6,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
              },
              rotate: {
                duration: animationDuration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              },
              scale: {
                duration: animationDuration * 0.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              }
            }
          }
        };
      case 'pulse':
        return {
          hidden: { pathLength: 0, scale: 0.3, opacity: 0 },
          visible: {
            pathLength: 1,
            scale: [0.3, 1.2, 1],
            opacity: 1,
            transition: {
              delay,
              pathLength: {
                duration: animationDuration * 0.6,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
              },
              scale: {
                duration: animationDuration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
                times: [0, 0.6, 1],
              },
              opacity: { duration: 0.3, delay }
            }
          }
        };
      case 'spiral':
        return {
          hidden: { pathLength: 0, rotate: 720, scale: 0, x: 50, y: 50 },
          visible: {
            pathLength: 1,
            rotate: 0,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
              delay,
              pathLength: {
                duration: animationDuration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
              },
              rotate: {
                duration: animationDuration * 1.2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              },
              scale: {
                duration: animationDuration * 0.8,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              },
              x: {
                duration: animationDuration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              },
              y: {
                duration: animationDuration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: animationDuration * 0.2,
                delay,
              }
            }
          }
        };
      default:
        return {
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 }
        };
    }
  };

  const delays = [0, 0.2, 0.4, 0.6, 0.8];

  return (
    <div className={`${fit ? 'w-full h-full' : ''} flex items-center justify-center ${className}`}>
      <motion.svg
        width={svgWidth}
        height={svgHeight}
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
      >
        <defs>
          <linearGradient id={`figmaGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7262" />
            <stop offset="25%" stopColor="#9747FF" />
            <stop offset="50%" stopColor="#1ABCFE" />
            <stop offset="75%" stopColor="#0ACF83" />
            <stop offset="100%" stopColor="#F24E1E" />
          </linearGradient>
        </defs>

        {/* Top diamond */}
        <motion.path
          d="M100 20 L130 50 L100 80 L70 50 Z"
          stroke={`url(#figmaGradient-${variant})`}
          strokeWidth={strokeWidth * 0.5}
          fill="none"
          variants={getVariants(delays[0])}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left diamond */}
        <motion.path
          d="M50 70 L80 100 L50 130 L20 100 Z"
          stroke={`url(#figmaGradient-${variant})`}
          strokeWidth={strokeWidth * 0.5}
          fill="none"
          variants={getVariants(delays[1])}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center diamond */}
        <motion.path
          d="M100 70 L130 100 L100 130 L70 100 Z"
          stroke={`url(#figmaGradient-${variant})`}
          strokeWidth={strokeWidth * 0.5}
          fill="none"
          variants={getVariants(delays[2])}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right diamond */}
        <motion.path
          d="M150 70 L180 100 L150 130 L120 100 Z"
          stroke={`url(#figmaGradient-${variant})`}
          strokeWidth={strokeWidth * 0.5}
          fill="none"
          variants={getVariants(delays[3])}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom diamond */}
        <motion.path
          d="M100 120 L130 150 L100 180 L70 150 Z"
          stroke={`url(#figmaGradient-${variant})`}
          strokeWidth={strokeWidth * 0.5}
          fill="none"
          variants={getVariants(delays[4])}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
};



