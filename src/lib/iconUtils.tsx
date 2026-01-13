import { Icon } from '@iconify/react';
import React, { forwardRef } from 'react';

// Map legacy token names to Solar Iconify strings
const iconMap: Record<string, string> = {
  // Defaults
  sparkles: 'solar:stars-minimalistic-linear',
  sparkle: 'solar:stars-minimalistic-linear',
  default: 'solar:stars-minimalistic-linear',

  // Security
  lock: 'solar:lock-password-linear',
  secure: 'solar:lock-password-linear',
  security: 'solar:lock-password-linear',
  "🔒": 'solar:lock-password-linear',
  shield: 'solar:shield-check-linear',

  // Actions
  zap: 'solar:bolt-linear',
  bolt: 'solar:bolt-linear',
  lightning: 'solar:bolt-linear',
  "⚡": 'solar:bolt-linear',
  download: 'solar:download-minimalistic-linear',
  refresh: 'solar:refresh-circle-linear',
  undo: 'solar:undo-left-round-linear',
  revert: 'solar:undo-left-round-linear',
  "↩️": 'solar:undo-left-round-linear',
  check: 'solar:check-circle-linear',
  success: 'solar:check-circle-linear',
  done: 'solar:check-circle-linear',
  "✅": 'solar:check-circle-linear',
  arrowRight: 'solar:arrow-right-linear',
  mousePointer: 'solar:cursor-linear',

  // Time
  clock: 'solar:clock-circle-linear',
  time: 'solar:clock-circle-linear',
  timer: 'solar:clock-circle-linear',
  "⏱️": 'solar:clock-circle-linear',
  "⏰": 'solar:clock-circle-linear',

  // Users
  users: 'solar:users-group-rounded-linear',
  team: 'solar:users-group-rounded-linear',
  people: 'solar:users-group-rounded-linear',
  "👥": 'solar:users-group-rounded-linear',

  // Tech
  laptop: 'solar:laptop-minimalistic-linear',
  developer: 'solar:laptop-minimalistic-linear',
  dev: 'solar:laptop-minimalistic-linear',
  "💻": 'solar:laptop-minimalistic-linear',
  
  // Rating
  star: 'solar:star-linear',
  premium: 'solar:star-linear',
  favorite: 'solar:star-linear',
  "⭐": 'solar:star-linear',

  // Tags
  tag: 'solar:tag-linear',
  label: 'solar:tag-linear',
  "🏷️": 'solar:tag-linear',

  // Search
  search: 'solar:magnifer-linear',
  discover: 'solar:magnifer-linear',
  audit: 'solar:magnifer-linear',
  "🔍": 'solar:magnifer-linear',
  "🔎": 'solar:magnifer-linear',

  // Data
  analytics: 'solar:chart-linear',
  chart: 'solar:chart-linear',
  metrics: 'solar:chart-linear',
  "📊": 'solar:chart-linear',

  // Commerce
  cart: 'solar:cart-large-minimalistic-linear',
  shopping: 'solar:cart-large-minimalistic-linear',
  commerce: 'solar:cart-large-minimalistic-linear',
  "🛒": 'solar:cart-large-minimalistic-linear',

  // AI
  brain: 'solar:brain-linear',
  ai: 'solar:brain-linear',
  intelligence: 'solar:brain-linear',
  "🧠": 'solar:brain-linear',

  // Navigation
  globe: 'solar:globe-linear',
  global: 'solar:globe-linear',
  world: 'solar:globe-linear',
  "🌐": 'solar:globe-linear',
  compass: 'solar:compass-linear',
  navigator: 'solar:compass-linear',
  direction: 'solar:compass-linear',
  "🧭": 'solar:compass-linear',
  link: 'solar:link-minimalistic-linear',
  link2: 'solar:link-minimalistic-linear',
  unlink: 'solar:link-minimalistic-linear',
  "🔗": 'solar:link-minimalistic-linear',

  // Files
  folder: 'solar:folder-linear',
  organize: 'solar:folder-linear',
  "🗂️": 'solar:folder-linear',
};

const normalizeToken = (token: string) =>
  token
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

// Wrapper to make Iconify behave like a Lucide component (accepts Lucide props)
const createIconWrapper = (iconName: string) => {
  return forwardRef<any, any>((props, ref) => {
    // Lucide props: size, strokeWidth, absoluteStrokeWidth, color, etc.
    // Iconify props: icon, width, height, color, etc.
    const { size, strokeWidth, className, ...rest } = props;
    
    // Solar icons are usually 24px grid. 
    // We map 'size' to width/height.
    // 'strokeWidth' is ignored for Solar as they are pre-styled, 
    // but we can pass it to style if it's an SVG that supports it.
    // For now, we just pass other props.
    
    return (
      <Icon
        ref={ref}
        icon={iconName}
        width={size ?? 24}
        height={size ?? 24}
        className={className}
        {...rest}
      />
    );
  });
};

export const resolveLucideIcon = (token?: string): React.ComponentType<any> => {
  if (!token) {
    return createIconWrapper(iconMap['sparkles']);
  }

  // Check direct map
  if (iconMap[token]) {
    return createIconWrapper(iconMap[token]);
  }

  // Check normalized
  const normalized = token.toLowerCase().trim();
  if (iconMap[normalized]) {
    return createIconWrapper(iconMap[normalized]);
  }

  // Check slug
  const slug = normalizeToken(token);
  if (iconMap[slug]) {
    return createIconWrapper(iconMap[slug]);
  }

  // Fallback
  return createIconWrapper(iconMap['sparkles']);
};

// Export specific icons for manual usage if needed, maintaining "Lucide-like" export shape
export const ArrowRight = createIconWrapper('solar:arrow-right-linear');
export const Check = createIconWrapper('solar:check-circle-linear');
export const RefreshCw = createIconWrapper('solar:refresh-circle-linear');
export const Shield = createIconWrapper('solar:shield-check-linear');
export const Lock = createIconWrapper('solar:lock-password-linear');
export const Download = createIconWrapper('solar:download-minimalistic-linear');
export const Zap = createIconWrapper('solar:bolt-linear');
export const MousePointer2 = createIconWrapper('solar:cursor-linear');
export const Search = createIconWrapper('solar:magnifer-linear');
export const User = createIconWrapper('solar:user-linear');
export const Settings = createIconWrapper('solar:settings-linear');
export const Bell = createIconWrapper('solar:bell-linear');
export const Mail = createIconWrapper('solar:letter-linear');
export const Calendar = createIconWrapper('solar:calendar-linear');
export const FileText = createIconWrapper('solar:file-text-linear');
export const Image = createIconWrapper('solar:gallery-linear');
export const Video = createIconWrapper('solar:videocamera-record-linear');
export const Music = createIconWrapper('solar:music-note-linear');
export const Layout = createIconWrapper('solar:layers-minimalistic-linear');
export const Columns = createIconWrapper('solar:list-linear');
export const Table = createIconWrapper('solar:clipboard-list-linear');
export const FolderTree = createIconWrapper('solar:folder-linear');

// Additional icons for ScaleResizer page
export const Scaling = createIconWrapper('solar:scaling-linear');
export const Grid2X2 = createIconWrapper('solar:widget-4-linear');
export const Monitor = createIconWrapper('solar:monitor-linear');
export const Square = createIconWrapper('solar:gallery-minimalistic-linear');
export const Youtube = createIconWrapper('solar:play-circle-linear');
export const Smartphone = createIconWrapper('solar:smartphone-linear');
export const ShoppingCart = createIconWrapper('solar:cart-large-minimalistic-linear');
export const Package = createIconWrapper('solar:box-linear');
export const Brain = createIconWrapper('solar:brain-linear');
export const AlertTriangle = createIconWrapper('solar:danger-triangle-linear');
export const Tags = createIconWrapper('solar:tag-linear');
export const Crosshair = createIconWrapper('solar:target-linear');
export const Layers = createIconWrapper('solar:layers-linear');
export const Clock = createIconWrapper('solar:clock-circle-linear');
export const SplitSquareHorizontal = createIconWrapper('solar:slider-horizontal-linear');
export const AlignCenter = createIconWrapper('solar:align-horizontal-center-linear');
export const AlignVerticalJustifyStart = createIconWrapper('solar:align-vertical-spacing-linear');
export const AlignHorizontalJustifyStart = createIconWrapper('solar:align-horizontal-spacing-linear');