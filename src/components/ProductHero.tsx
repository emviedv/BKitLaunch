import React, { ReactNode, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Confetti, type ConfettiRef } from '@/components/ui/confetti';
import { debugService } from '@/lib/debugService';
import { resolveLucideIcon } from '@/lib/iconUtils';
import {
  HERO_DESCRIPTION_CLASS,
  HERO_TITLE_CLASS,
  HERO_PRIMARY_BUTTON_CLASS,
  HERO_HEADLINE_GRADIENT_CLASS,
  buildHeroHeadlineSegments,
  splitHeroHeadline,
  type HeroHeadlineSegment,
} from './heroConstants';
import { logHeroHeadlineSplit } from './heroInstrumentation';
import LandingHero from './LandingHero';
import { cn } from '@/lib/utils';
import { LANDING_FEATURES_ID } from '@/config/sectionAnchors';

interface ProductInfo {
  emoji?: string;
  icon?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButton?: string;
  primaryButtonLink?: string;
  primaryButtonIcon?: string;
  secondaryButton?: string;
  secondaryButtonLink?: string;
  badgeLabel?: string;
  gradientColors?: string[];
  callouts?: RawCallout[];
  benefits?: string[];
  heroImage?: string;
  heroImageAlt?: string;
}

type ProductHeroProps = {
  product: ProductInfo;
  compact?: boolean;
  headlineColorOverride?: string;
  mediaWrapperClassName?: string;
  withBottomPadding?: boolean;
  containerPaddingOverride?: string;
  mediaContent?: ReactNode;
};

type RawCallout =
  | string
  | {
      icon?: string;
      label?: string;
      title?: string;
      description?: string;
    };

type NormalizedCallout = {
  label: string;
  icon?: string;
};

const DEFAULT_CALLOUTS: NormalizedCallout[] = [
  { label: 'Automated workflows your team trusts', icon: 'sparkles' },
  { label: 'Insight-rich analytics dashboards', icon: 'analytics' },
  { label: 'Collaboration designed for scale', icon: 'users' },
  { label: 'Enterprise-grade security baked in', icon: 'lock' },
];

const ProductHeroIllustration: React.FC = () => (
  <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-[40px] border border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-[0_24px_60px_rgba(28,48,69,0.08)] product-hero__illustration">
    <div className="absolute inset-6 rounded-[30px] border border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="absolute left-8 top-8 h-24 w-20 rounded-3xl border border-primary/20 bg-primary/10" />
      <div className="absolute right-10 top-14 h-16 w-16 rounded-full border border-sky-200 bg-sky-100/80" />
      <div className="absolute left-12 bottom-16 h-16 w-28 rounded-[28px] border border-emerald-200/70 bg-emerald-100/70" />
      <div className="absolute inset-x-10 bottom-10 flex items-center justify-between rounded-full border border-slate-200/70 bg-white/80 px-6 py-3 text-sm font-medium text-slate-600">
        <span>FPO Illustration</span>
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
      </div>
    </div>
    <div className="absolute -left-8 bottom-12 h-24 w-24 rounded-full border border-purple-200/70 bg-purple-100/60" />
    <div className="absolute right-6 top-1/2 h-20 w-20 -translate-y-1/2 rotate-12 rounded-[28px] border border-rose-200/60 bg-rose-100/60" />
  </div>
);

export const ProductHero: React.FC<ProductHeroProps> = ({
  product,
  compact = false,
  headlineColorOverride,
  mediaWrapperClassName,
  withBottomPadding = true,
  containerPaddingOverride,
  mediaContent,
}) => {
  const confettiRef = useRef<ConfettiRef>(null);

  try {
    debugService.info('ProductHero render', {
      title: product?.title
    });
  } catch {}

  if (!product || !product.title) {
    return null;
  }

  if (compact) {
    return <LandingHero hero={product} />;
  }

  const productIconToken = product?.emoji || product?.icon;
  const ProductGlyph = productIconToken ? resolveLucideIcon(productIconToken) : null;
  const PrimaryButtonIcon = product.primaryButtonIcon ? resolveLucideIcon(product.primaryButtonIcon) : null;
  const calloutItems = useMemo(() => {
    const normalizedCallouts: NormalizedCallout[] = [];

    if (Array.isArray(product.callouts)) {
      for (const callout of product.callouts) {
        if (typeof callout === 'string') {
          const label = callout.trim();
          if (label) {
            normalizedCallouts.push({ label });
          }
          continue;
        }

        const label = callout?.label || callout?.title || callout?.description;
        if (label && label.trim()) {
          normalizedCallouts.push({
            label: label.trim(),
            icon: callout.icon,
          });
        }
      }
    }

    if (
      normalizedCallouts.length === 0 &&
      Array.isArray(product.benefits) &&
      product.benefits.length > 0
    ) {
      normalizedCallouts.push(
        ...product.benefits.slice(0, 4).map((benefit) => ({
          label: benefit.trim(),
        }))
      );
    }

    const source =
      normalizedCallouts.length > 0
        ? normalizedCallouts.slice(0, 4)
        : DEFAULT_CALLOUTS;

    return source.map((callout, index) => {
      const fallback = DEFAULT_CALLOUTS[index % DEFAULT_CALLOUTS.length];
      const Icon = resolveLucideIcon(callout.icon || fallback.icon);

      return {
        label: callout.label,
        Icon,
      };
    });
  }, [product.callouts, product.benefits]);

  const rawBadgeLabel = product.badgeLabel ?? '';
  const badgeLabel = useMemo(
    () => rawBadgeLabel.replace(/^[\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}\s]+/gu, '').trim(),
    [rawBadgeLabel]
  );

  const headlineSegments: HeroHeadlineSegment[] = useMemo(
    () =>
      buildHeroHeadlineSegments({
        subtitle: product.subtitle,
        title: product.title,
      }),
    [product.subtitle, product.title]
  );

  const sectionClassName = cn(
    'landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center',
    !withBottomPadding && 'pb-0'
  );
  const layoutClassName = 'mx-auto grid w-full max-w-6xl items-center gap-8 pb-12 pt-0 lg:grid-cols-12';
  const contentColumnClassName = 'flex flex-col gap-2 text-center lg:col-span-5 lg:text-left product-hero__content';
  const titleWrapperClassName = 'space-y-2';
  const descriptionClassName = `${HERO_DESCRIPTION_CLASS} mx-auto mt-3 mb-6 text-center lg:mx-0 lg:text-left`;
  const calloutContainerClassName = 'flex flex-col items-stretch gap-3 product-hero__callouts';
  const calloutRowClassName = 'flex items-start gap-2 text-left';
  const calloutIconWrapperClassName = 'mt-[2px] flex-shrink-0 text-primary';
  const calloutTextClassName = 'text-[20px] leading-7 font-medium text-[#1C3045]/90';
  const ctaWrapperClassName = 'relative z-10 mt-2 flex justify-center sm:justify-start';
  const primaryButtonClassName = HERO_PRIMARY_BUTTON_CLASS;
  const glyphWrapperClassName = 'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:mx-0';
  const containerClassName = cn(
    'container mx-auto relative z-10 px-6 md:px-10',
    containerPaddingOverride
  );
  const heroImageSrc = product.heroImage;
  const heroImageAlt = product.heroImageAlt || `${product.title} preview`;
  const heroMediaElement = mediaContent ?? (
    heroImageSrc ? (
      <img
        src={heroImageSrc}
        alt={heroImageAlt}
        className="h-auto w-full max-w-2xl rounded-[32px] border border-slate-200/70 bg-white object-cover shadow-[0_24px_60px_rgba(28,48,69,0.12)]"
        loading="lazy"
      />
    ) : (
      <ProductHeroIllustration />
    )
  );

  return (
    <section className={sectionClassName}>
      <div className="landing-hero-gradient__layer" aria-hidden="true" />
      <div className="landing-hero-column-lines" aria-hidden="true" />
      <div className="landing-hero-noise" aria-hidden="true" />
      <div className="landing-hero-contrast" aria-hidden="true" />
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-[1] h-full w-full pointer-events-none"
        manualstart
      />
      <div className={containerClassName}>
        <div className={layoutClassName}>
          <div className={contentColumnClassName}>
            {ProductGlyph && (
              <div className={glyphWrapperClassName}>
                <ProductGlyph
                  className="h-8 w-8"
                  strokeWidth={1.75}
                />
              </div>
            )}

            <div className={titleWrapperClassName}>
              {badgeLabel && (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-sm font-medium text-[#1C3045] supports-[backdrop-filter]:bg-white/50">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                  <span>{badgeLabel}</span>
                </span>
              )}
              {headlineSegments.length > 0 ? (
                <h1 className={cn(HERO_TITLE_CLASS, 'pb-3')}>
                  {headlineSegments.map((segment) => {
                    const isSubtitle = segment.key === 'subtitle';
                    const segmentClass = (() => {
                      if (headlineColorOverride) {
                        return `${headlineColorOverride} block`;
                      }
                      if (segment.gradient && !isSubtitle) {
                        return `${HERO_HEADLINE_GRADIENT_CLASS} block pb-3`;
                      }
                      if (isSubtitle) {
                        return 'text-[#1B1622] block';
                      }
                      return 'text-foreground block';
                    })();

                    return (
                      <span
                        key={segment.key}
                        className={segmentClass}
                      >
                        {segment.text}
                      </span>
                    );
                  })}
                </h1>
              ) : (
                <h1 className={cn(HERO_TITLE_CLASS, headlineColorOverride, 'pb-3')}>{product.title}</h1>
              )}
            </div>

            {calloutItems.length > 0 && (
              <div className={calloutContainerClassName}>
                {calloutItems.map(({ label, Icon }, index) => (
                  <div
                    key={`${label}-${index}`}
                    className={calloutRowClassName}
                  >
                    <span className={calloutIconWrapperClassName}>
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                    <p className={calloutTextClassName}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {product.description && (
              <p className={descriptionClassName}>
                {product.description}
              </p>
            )}

            {product.primaryButton && (
              <div className={ctaWrapperClassName}>
                {product.primaryButtonLink ? (
                  <Button
                    asChild
                    size="lg"
                    className={primaryButtonClassName}
                    onMouseEnter={() => {
                      confettiRef.current?.fire({});
                    }}
                    aria-label={`${product.primaryButton} - Primary action`}
                  >
                    <a
                      href={(product.primaryButtonLink.startsWith('#') ? `/${product.primaryButtonLink}` : product.primaryButtonLink)}
                      target={product.primaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                      rel={product.primaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2"
                    >
                      <span>{product.primaryButton}</span>
                      {PrimaryButtonIcon && (
                        <PrimaryButtonIcon
                          className="h-4 w-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className={primaryButtonClassName}
                    onClick={() => {
                      const featuresSection = document.getElementById(LANDING_FEATURES_ID);
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        (e.currentTarget as HTMLButtonElement).click();
                      }
                    }}
                    onMouseEnter={() => {
                      confettiRef.current?.fire({});
                    }}
                    aria-label={`${product.primaryButton} - Primary action`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{product.primaryButton}</span>
                      {PrimaryButtonIcon && (
                        <PrimaryButtonIcon
                          className="h-4 w-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div
            className={cn(
              'relative mx-auto flex w-full max-w-2xl justify-center lg:justify-end lg:col-span-7',
              mediaWrapperClassName ?? 'lg:max-w-none'
            )}
          >
            {heroMediaElement}
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-48 bg-gradient-to-b from-transparent via-background/80 to-background md:h-64"
        aria-hidden="true"
      />
    </section>
  );
};

export default ProductHero;
