import type { BorderSwatchProps, SwatchProps, TextSwatchProps } from "../swatches";

export type GradientPreset = {
  id: string;
  description: string;
  className: string;
};

export const brandSwatches: SwatchProps[] = [
  { name: "brand-500", className: "bg-[#6580E1]", hex: "#6580E1" },
  { name: "blue-500", className: "bg-blue-500", hex: "#3b82f6" },
  { name: "green-500", className: "bg-green-500", hex: "#22c55e" },
  { name: "brand-50", className: "bg-[#6580E1]/10", hex: "#e7ebfb" },
  { name: "blue-50", className: "bg-blue-50", hex: "#eff6ff" },
  { name: "green-50", className: "bg-green-50", hex: "#f0fdf4" },
] as const;

export const primarySwatches: SwatchProps[] = [
  { name: "primary", className: "bg-[#6580E1]", hex: "#6580E1" },
  { name: "primary-foreground", className: "bg-[#6580E1]", textClass: "text-white", hex: "#ffffff" },
  { name: "ring", className: "bg-[#7C92EA]", hex: "#7C92EA" },
] as const;

export const accentSwatches: SwatchProps[] = [
  { name: "accent", className: "bg-blue-500", hex: "#3b82f6" },
  { name: "accent-foreground", className: "bg-blue-500", textClass: "text-white", hex: "#eff6ff" },
] as const;

export const successSwatches: SwatchProps[] = [
  { name: "success", className: "bg-green-500", hex: "#22c55e" },
  { name: "success soft", className: "bg-green-100", hex: "#dcfce7" },
] as const;

export const neutralSwatches: SwatchProps[] = [
  { name: "gray-50", className: "bg-gray-50", hex: "#f9fafb" },
  { name: "gray-100", className: "bg-muted", hex: "#f3f4f6" },
  { name: "gray-200", className: "bg-muted", hex: "#e5e7eb" },
  { name: "gray-300", className: "bg-gray-300", hex: "#d1d5db" },
  { name: "gray-400", className: "bg-gray-400", hex: "#9ca3af" },
  { name: "gray-500", className: "bg-gray-500", textClass: "text-white", hex: "#6b7280" },
  { name: "gray-600", className: "bg-gray-600", textClass: "text-white", hex: "#4b5563" },
  { name: "gray-700", className: "bg-gray-700", textClass: "text-white", hex: "#374151" },
  { name: "gray-800", className: "bg-gray-800", textClass: "text-white", hex: "#1f2937" },
  { name: "gray-900", className: "bg-gray-900", textClass: "text-white", hex: "#111827" },
] as const;

export const surfaceSwatches: SwatchProps[] = [
  { name: "background", className: "bg-background" },
  { name: "card", className: "bg-card" },
  { name: "muted", className: "bg-muted" },
] as const;

export const surfaceBorderSwatches: BorderSwatchProps[] = [
  { name: "border", borderClass: "border-border" },
] as const;

export const surfaceTextSwatches: TextSwatchProps[] = [
  { name: "foreground", textClass: "text-foreground" },
  { name: "muted-foreground", textClass: "text-muted-foreground" },
] as const;

export const gradientPresets: GradientPreset[] = [
  {
    id: "gradient-rosewater-soft-radial",
    className: "gradient-rosewater-soft-radial",
    description: "rose/pink/violet soft with radial accents",
  },
  {
    id: "gradient-aurora-soft-radial",
    className: "gradient-aurora-soft-radial",
    description: "green/cyan/violet aurora-inspired soft blend",
  },
  {
    id: "gradient-meadow-soft-radial",
    className: "gradient-meadow-soft-radial",
    description: "lime/green/mint meadow soft blend",
  },
  {
    id: "gradient-moonlight-soft-radial",
    className: "gradient-moonlight-soft-radial",
    description: "slate/indigo/violet moonlight soft blend",
  },
  {
    id: "gradient-cream-soft-radial",
    className: "gradient-cream-soft-radial",
    description: "warm cream soft blend (FBF9F4)",
  },
] as const;
