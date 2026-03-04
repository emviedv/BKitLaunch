import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Consolidated Badge component for BiblioKit.
 * Replaces 7+ scattered badge implementations with a single CVA-based component.
 *
 * Variants:
 * - glass: Frosted glass effect for dark hero backgrounds (default)
 * - accent: Pink-tinted for plugin/product badges
 * - launched/coming-soon/beta: Status badges for feature cards (light bg)
 * - problem/solution/info: Section badges for use case pages (dark bg)
 */
const badgeVariants = cva(
  // Base styles - apply to ALL badges
  "inline-flex items-center gap-2 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        // Dark theme badges (hero sections, dark backgrounds)
        glass:
          "bg-[var(--badge-glass-bg)] text-white/90 border border-[var(--badge-glass-border)] backdrop-blur-sm shadow-[0_0_30px_rgba(250,174,255,0.15)]",
        accent:
          "bg-ds-pink-500/15 text-white border border-ds-pink-700/40 hover:bg-ds-pink-500/25 transition-colors",

        // Status badges (light backgrounds - feature cards)
        launched:
          "border-emerald-200/80 bg-emerald-50/80 text-emerald-700",
        "coming-soon":
          "border-amber-200/80 bg-amber-50/80 text-amber-800",
        beta:
          "border-indigo-200/80 bg-indigo-50/80 text-indigo-700",

        // Section badges (dark backgrounds - use case pages)
        problem:
          "bg-red-500/10 text-red-400 border border-red-500/20",
        solution:
          "bg-green-500/10 text-green-400 border border-green-500/20",
        info:
          "bg-slate-500/10 text-slate-400 border border-slate-500/20",
      },
      size: {
        sm: "px-2.5 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-sm",
      },
      withDot: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
      withDot: false,
    },
  }
);

/**
 * Maps badge variants to their dot colors.
 * Uses CSS custom properties for glass/accent, Tailwind colors for status badges.
 */
const getDotColor = (variant: string | null | undefined): string => {
  switch (variant) {
    case "glass":
    case "accent":
      return "bg-[var(--badge-dot)]"; // #F1A0FF from tokens
    case "launched":
      return "bg-emerald-500";
    case "coming-soon":
      return "bg-amber-500";
    case "beta":
      return "bg-indigo-500";
    case "problem":
      return "bg-red-500";
    case "solution":
      return "bg-green-500";
    case "info":
      return "bg-slate-500";
    default:
      return "bg-[var(--badge-dot)]";
  }
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional href to render as a link */
  href?: string;
  /** Link target (only applies when href is set) */
  target?: string;
  /** Link rel (only applies when href is set) */
  rel?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant, size, withDot, href, target, rel, children, ...props },
    ref
  ) => {
    const dotColor = getDotColor(variant);

    const content = (
      <>
        {withDot && (
          <span
            className={cn("inline-flex h-2 w-2 rounded-full", dotColor)}
            aria-hidden="true"
          />
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
          className={cn(badgeVariants({ variant, size, withDot, className }))}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, withDot, className }))}
        {...props}
      >
        {content}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
