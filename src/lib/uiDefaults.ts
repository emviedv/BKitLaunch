// UI defaults for headings and icon fallbacks used across product pages

export const SPEC_ICON_FALLBACKS: readonly string[] = [
  '📊', // analytics / data
  '🔗', // integration / linking
  '📈', // growth / metrics
  '👥', // team / collaboration
  '📋', // export / reports
  '🛡️', // security / reliability
  '⚙️', // settings / configuration
  '🧩', // modularity / components
  '🔧', // tools
  '🚀'  // performance / launch
] as const;

export const getSpecIconFallback = (index: number): string => {
  const safeIndex = Number.isFinite(index) ? Math.abs(index) : 0;
  return SPEC_ICON_FALLBACKS[safeIndex % SPEC_ICON_FALLBACKS.length];
};

export const DEFAULT_SPECIFICATIONS_TITLE = '🛠️ Technical Capabilities';


