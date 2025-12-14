import { cn } from '@/lib/utils';

export const parseFeatureTitle = (rawTitle?: string | null) => {
  const base = (rawTitle || '').trim();
  const match = base.match(/^(.*)\(([^)]+)\)\s*$/);
  if (match) {
    return {
      headline: match[1].trim(),
      productName: match[2].trim(),
    };
  }
  return { headline: base, productName: undefined };
};

export const normalizeHref = (href?: string) => {
  if (!href) return undefined;
  return href.startsWith('#') ? `/${href}` : href;
};

export const createFeatureAnchorId = (title: string | undefined, index: number) => {
  const slug = (title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const base = slug || `feature-${index + 1}`;
  return `feature-card-${base}-${index}`;
};

export const gridClassForColumns = (cols: number): string => {
  switch (cols) {
    case 1:
      return 'grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8';
    case 2:
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8';
    case 3:
      return 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8';
    case 4:
    default:
      return 'grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8';
  }
};

export const gridClassForCount = (count: number): string => {
  const cols = Math.max(1, Math.min(count, 4));
  return gridClassForColumns(cols);
};

export const sanitizeColumns = (value: any, fallback: number): number => {
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(4, Math.max(1, parsed));
};

export const createSectionClassBuilder = (
  compactLayout: boolean,
  landingGutterClass: string,
  standardContainerClass: string
) => (...extra: Array<string | false | undefined>) =>
  cn(
    compactLayout ? landingGutterClass : standardContainerClass,
    ...extra
  );

export const mediaDiagnosticsEnabled = () => {
  if (typeof process !== 'undefined' && typeof process.env?.DEBUG_FIX !== 'undefined') {
    return process.env.DEBUG_FIX !== '0';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
    return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
  }
  return false;
};

export const productSectionsDebugEnabled = () => {
  if (typeof process !== 'undefined') {
    const envValue = process.env?.DEBUG_PRODUCT_SECTIONS ?? process.env?.DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  if (typeof import.meta !== 'undefined') {
    const envValue = (import.meta as any)?.env?.VITE_DEBUG_PRODUCT_SECTIONS ?? (import.meta as any)?.env?.VITE_DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  return false;
};
