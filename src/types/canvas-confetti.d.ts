declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    x?: number;
    y?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    shapes?: string[];
    colors?: string[];
    origin?: {
      x?: number;
      y?: number;
    };
    scalar?: number;
  }

  export interface GlobalOptions {
    resize?: boolean;
    useWorker?: boolean;
  }

  export interface CreateTypes {
    (options?: Options): void;
    reset: () => void;
  }

  export interface CanvasConfetti {
    (options?: Options): void;
    reset: () => void;
    create: (canvas: HTMLCanvasElement, options?: GlobalOptions) => CreateTypes;
  }

  const confetti: CanvasConfetti;
  export default confetti;
}
