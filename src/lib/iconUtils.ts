import {
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Compass,
  Folder,
  Globe2,
  Laptop,
  Link2,
  Lock,
  LucideIcon,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Undo2,
  Users,
  Zap,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  sparkle: Sparkles,
  default: Sparkles,

  lock: Lock,
  secure: Lock,
  security: Lock,
  "🔒": Lock,

  zap: Zap,
  bolt: Zap,
  lightning: Zap,
  "⚡": Zap,

  clock: Clock3,
  time: Clock3,
  timer: Clock3,
  "⏱️": Clock3,
  "⏰": Clock3,

  users: Users,
  team: Users,
  people: Users,
  "👥": Users,

  laptop: Laptop,
  developer: Laptop,
  dev: Laptop,
  "💻": Laptop,

  star: Star,
  premium: Star,
  favorite: Star,
  "⭐": Star,

  check: CheckCircle2,
  success: CheckCircle2,
  done: CheckCircle2,
  "✅": CheckCircle2,

  tag: Tag,
  label: Tag,
  "🏷️": Tag,

  search: Search,
  discover: Search,
  audit: Search,
  "🔍": Search,
  "🔎": Search,

  analytics: BarChart3,
  chart: BarChart3,
  metrics: BarChart3,
  "📊": BarChart3,

  cart: ShoppingCart,
  shopping: ShoppingCart,
  commerce: ShoppingCart,
  "🛒": ShoppingCart,

  brain: Brain,
  ai: Brain,
  intelligence: Brain,
  "🧠": Brain,

  undo: Undo2,
  revert: Undo2,
  "↩️": Undo2,

  globe: Globe2,
  global: Globe2,
  world: Globe2,
  "🌐": Globe2,

  folder: Folder,
  organize: Folder,
  "🗂️": Folder,

  compass: Compass,
  navigator: Compass,
  direction: Compass,
  "🧭": Compass,

  link: Link2,
  link2: Link2,
  unlink: Link2,
  "🔗": Link2,
};

const normalizeToken = (token: string) =>
  token
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

export const resolveLucideIcon = (token?: string): LucideIcon => {
  if (!token) {
    return Sparkles;
  }

  if (iconMap[token]) {
    return iconMap[token];
  }

  const normalized = token.toLowerCase().trim();
  if (iconMap[normalized]) {
    return iconMap[normalized];
  }

  const slug = normalizeToken(token);
  if (iconMap[slug]) {
    return iconMap[slug];
  }

  return Sparkles;
};
