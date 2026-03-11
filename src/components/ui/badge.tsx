import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Consolidated Badge component for BiblioKit.
 *
 * Uses a composable API with semantic naming:
 * - intent: What the badge communicates (success, warning, info, accent, muted)
 * - size: Scale of the badge (xs, sm, md, lg)
 * - shape: Visual form (pill, circle, rounded)
 * - context: Background it sits on (light, dark)
 *
 * Examples:
 * - <Badge intent="success" context="light">Launched</Badge>
 * - <Badge intent="accent" shape="circle" size="lg">1</Badge>
 * - <Badge intent="warning" context="dark">Coming Soon</Badge>
 */
const badgeVariants = cva(
  // Base styles - apply to ALL badges
  "inline-flex items-center gap-1.5 font-medium transition-colors border",
  {
    variants: {
      intent: {
        default: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
        accent: "",
        muted: "",
      },
      size: {
        xs: "px-2 py-0.5 text-[10px]",
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
      },
      shape: {
        pill: "rounded-full",
        circle: "rounded-full aspect-square justify-center p-0",
        rounded: "rounded-md",
      },
      context: {
        light: "",
        dark: "",
      },
    },
    compoundVariants: [
      // ─────────────────────────────────────────────────────────────
      // DEFAULT (neutral gray)
      // ─────────────────────────────────────────────────────────────
      { intent: "default", context: "light", className: "bg-slate-100 text-slate-700 border-slate-200" },
      { intent: "default", context: "dark", className: "bg-slate-500/15 text-slate-300 border-slate-500/30" },

      // ─────────────────────────────────────────────────────────────
      // SUCCESS (green - launched, completed, active)
      // ─────────────────────────────────────────────────────────────
      { intent: "success", context: "light", className: "bg-emerald-50/80 text-emerald-700 border-emerald-200/80" },
      { intent: "success", context: "dark", className: "bg-emerald-500/12 text-white border-emerald-400/35 backdrop-blur-sm" },

      // ─────────────────────────────────────────────────────────────
      // WARNING (amber - coming soon, beta, pending)
      // ─────────────────────────────────────────────────────────────
      { intent: "warning", context: "light", className: "bg-amber-50/80 text-amber-800 border-amber-200/80" },
      { intent: "warning", context: "dark", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },

      // ─────────────────────────────────────────────────────────────
      // DANGER (red - problems, errors, alerts)
      // ─────────────────────────────────────────────────────────────
      { intent: "danger", context: "light", className: "bg-red-50/80 text-red-700 border-red-200/80" },
      { intent: "danger", context: "dark", className: "bg-red-500/10 text-red-400 border-red-500/20" },

      // ─────────────────────────────────────────────────────────────
      // INFO (indigo/blue - beta, informational)
      // ─────────────────────────────────────────────────────────────
      { intent: "info", context: "light", className: "bg-indigo-50/80 text-indigo-700 border-indigo-200/80" },
      { intent: "info", context: "dark", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },

      // ─────────────────────────────────────────────────────────────
      // ACCENT (green - branded, primary action, highlight)
      // ─────────────────────────────────────────────────────────────
      { intent: "accent", context: "light", className: "bg-emerald-50/80 text-emerald-700 border-emerald-200/80" },
      { intent: "accent", context: "dark", className: "bg-emerald-500/12 text-white border-emerald-400/35 backdrop-blur-sm" },

      // ─────────────────────────────────────────────────────────────
      // MUTED (subtle, de-emphasized)
      // ─────────────────────────────────────────────────────────────
      { intent: "muted", context: "light", className: "bg-slate-50 text-slate-500 border-slate-200" },
      { intent: "muted", context: "dark", className: "bg-white/5 text-white/80 border-white/15" },

      // ─────────────────────────────────────────────────────────────
      // CIRCLE SIZE OVERRIDES (square aspect ratio needs different padding)
      // ─────────────────────────────────────────────────────────────
      { shape: "circle", size: "xs", className: "w-5 h-5 text-[10px]" },
      { shape: "circle", size: "sm", className: "w-6 h-6 text-xs" },
      { shape: "circle", size: "md", className: "w-8 h-8 text-sm" },
      { shape: "circle", size: "lg", className: "w-10 h-10 text-sm" },
    ],
    defaultVariants: {
      intent: "default",
      size: "md",
      shape: "pill",
      context: "light",
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY VARIANT MAPPING (for backward compatibility during migration)
// ─────────────────────────────────────────────────────────────────────────────
const LEGACY_VARIANT_MAP: Record<string, { intent: VariantProps<typeof badgeVariants>['intent']; context: VariantProps<typeof badgeVariants>['context'] }> = {
  'glass': { intent: 'success', context: 'dark' },
  'neon': { intent: 'success', context: 'dark' },
  'accent': { intent: 'success', context: 'dark' },
  'launched': { intent: 'success', context: 'light' },
  'coming-soon': { intent: 'warning', context: 'light' },
  'beta': { intent: 'info', context: 'light' },
  'problem': { intent: 'danger', context: 'dark' },
  'solution': { intent: 'success', context: 'dark' },
  'info': { intent: 'muted', context: 'dark' },
};

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  /**
   * @deprecated Use `intent` and `context` instead.
   * Legacy variant for backward compatibility.
   */
  variant?: keyof typeof LEGACY_VARIANT_MAP;
  /** Optional icon to display on the left side */
  icon?: React.ReactNode;
  /** Optional href to render as a link */
  href?: string;
  /** Link target (only applies when href is set) */
  target?: string;
  /** Link rel (only applies when href is set) */
  rel?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      intent: intentProp,
      size,
      shape,
      context: contextProp,
      variant, // legacy prop
      icon,
      href,
      target,
      rel,
      children,
      ...props
    },
    ref
  ) => {
    // Resolve legacy variant to new props (if legacy variant provided and new props not set)
    let intent = intentProp;
    let context = contextProp;

    if (variant && LEGACY_VARIANT_MAP[variant]) {
      const mapped = LEGACY_VARIANT_MAP[variant];
      if (!intentProp) intent = mapped.intent;
      if (!contextProp) context = mapped.context;
    }

    const content = (
      <>
        {icon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </>
    );

    // Render as link if href is provided
    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn(badgeVariants({ intent, size, shape, context, className }))}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ intent, size, shape, context, className }))}
        {...props}
      >
        {content}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
