export type ConfettiBoundingBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ConfettiViewport = {
  width: number;
  height: number;
};

export type ConfettiOrigin = {
  x: number;
  y: number;
};

const DEFAULT_ORIGIN: ConfettiOrigin = { x: 0.5, y: 0.5 };

const clampNormalized = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0.5;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
};

/**
 * Converts the CTA bounding box + viewport dimensions into the normalized origin
 * coordinates canvas-confetti expects.
 */
export const calculateConfettiOrigin = (
  box?: ConfettiBoundingBox | null,
  viewport?: ConfettiViewport | null
): ConfettiOrigin => {
  if (!box || !viewport || viewport.width <= 0 || viewport.height <= 0) {
    return DEFAULT_ORIGIN;
  }

  const centerX = box.left + box.width / 2;
  const centerY = box.top + box.height / 2;

  return {
    x: clampNormalized(centerX / viewport.width),
    y: clampNormalized(centerY / viewport.height),
  };
};
