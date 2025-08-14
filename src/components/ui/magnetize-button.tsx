"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface MagnetizeButtonProps extends ButtonProps {
  particleCount?: number;
  attractRadius?: number;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

function MagnetizeButton({
  className,
  particleCount = 12,
  attractRadius = 50,
  children,
  href,
  target,
  rel,
  ...props
}: MagnetizeButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesControl = useAnimation();

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true);
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    });
  }, [particlesControl]);

  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false);
    await particlesControl.start((i) => ({
      x: particles[i].x,
      y: particles[i].y,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }));
  }, [particlesControl, particles]);

  const isLink = typeof href === "string" && href.length > 0;

  if (isLink) {
    return (
      <Button
        asChild
        className={cn("relative touch-none transition-all duration-300", className)}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        {...props}
      >
        <a href={href} target={target} rel={rel}>
          {particles.map((_, index) => (
            <motion.div
              key={index}
              custom={index}
              initial={{ x: particles[index].x, y: particles[index].y }}
              animate={particlesControl}
              className={cn(
                "absolute w-1.5 h-1.5 rounded-full",
                "bg-violet-400 dark:bg-violet-300",
                "transition-opacity duration-300",
                isAttracting ? "opacity-100" : "opacity-40"
              )}
            />
          ))}
          <span className="relative w-full flex items-center justify-center gap-2">
            <Star
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                isAttracting && "scale-110"
              )}
            />
            {children}
          </span>
        </a>
      </Button>
    );
  }

  return (
    <Button
      className={cn("relative touch-none transition-all duration-300", className)}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {particles.map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={{ x: particles[index].x, y: particles[index].y }}
          animate={particlesControl}
          className={cn(
            "absolute w-1.5 h-1.5 rounded-full",
            "bg-violet-400 dark:bg-violet-300",
            "transition-opacity duration-300",
            isAttracting ? "opacity-100" : "opacity-40"
          )}
        />
      ))}
      <span className="relative w-full flex items-center justify-center gap-2">
        <Star
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            isAttracting && "scale-110"
          )}
        />
        {children}
      </span>
    </Button>
  );
}

export { MagnetizeButton };


