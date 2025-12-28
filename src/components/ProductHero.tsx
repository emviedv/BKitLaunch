import React, { useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Confetti, type ConfettiRef } from '@/components/ui/confetti';
import { debugService } from '@/lib/debugService';
import { resolveLucideIcon, ArrowRight } from '@/lib/iconUtils';
import {
  HERO_TITLE_CLASS,
  HERO_PRIMARY_BUTTON_CLASS,
  HERO_HEADLINE_GRADIENT_CLASS,
  buildHeroHeadlineSegments,
  type HeroHeadlineSegment,
} from './heroConstants';
import LandingHero from './LandingHero';
import { cn } from '@/lib/utils';
import { LANDING_FEATURES_ID } from '@/config/sectionAnchors';
import FluidBackground from './FluidBackground';

interface ProductInfo {
  emoji?: string;
  icon?: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroHighlight?: HeroHighlight;
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
  lastUpdated?: string;
}

type ProductHeroProps = {
  product: ProductInfo;
  compact?: boolean;
  headlineColorOverride?: string;
  withBottomPadding?: boolean;
  containerPaddingOverride?: string;
  headingId?: string;
  as?: 'section' | 'header';
};

type RawCallout =
  | string
  | {
      icon?: string;
      label?: string;
      title?: string;
      description?: string;
      href?: string;
    };

type NormalizedCallout = {
  label: string;
  icon?: string;
  href?: string;
};

type HeroHighlight = {
  label: string;
  icon?: string;
  className?: string;
};

export const ProductHero: React.FC<ProductHeroProps> = ({
  product,
  compact = false,
  headlineColorOverride,
  withBottomPadding = true,
  containerPaddingOverride,
  headingId,
  as = 'section',
}) => {
  const confettiRef = useRef<ConfettiRef>(null);

  try {
    debugService.info('ProductHero render', {
      title: product?.title
    });
  } catch { /* empty */ }

  const resolvedHeadingId = typeof headingId === 'string' && headingId.trim().length > 0
    ? headingId.trim()
    : undefined;

  const productIconToken = product?.emoji || product?.icon;
  const ProductGlyph = productIconToken ? resolveLucideIcon(productIconToken) : null;
  const PrimaryButtonIcon = product?.primaryButtonIcon ? resolveLucideIcon(product.primaryButtonIcon) : ArrowRight;
  // Product hero callouts are intentionally hidden on product pages.
  const calloutItems: NormalizedCallout[] = [];

  const rawBadgeLabel = product?.badgeLabel ?? '';
  const badgeLabel = useMemo(
    () => rawBadgeLabel.replace(/^[\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}\s]+/gu, '').trim(),
    [rawBadgeLabel]
  );

  const headlineSegments: HeroHeadlineSegment[] = useMemo(
    () =>
      buildHeroHeadlineSegments({
        subtitle: product?.subtitle,
        title: product?.title || '',
      }),
    [product?.subtitle, product?.title]
  );

  if (!product || !product.title) {
    return null;
  }

  if (compact) {
    return <LandingHero hero={product} />;
  }

  const sectionClassName = cn(
    'landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center',
    !withBottomPadding && 'pb-0'
  );
  const layoutClassName = 'mx-auto grid w-full max-w-5xl grid-cols-1 gap-y-10 pb-16 pt-0 text-center justify-items-center lg:grid-cols-12 lg:gap-x-6 lg:justify-items-start lg:text-left';
  const contentColumnClassName = 'flex flex-col items-center gap-6 text-center lg:col-span-4 lg:items-start lg:text-left product-hero__content';
  const titleWrapperClassName = 'space-y-10 w-full';
  const descriptionClassName = 'mx-auto mt-[-14px] mb-6 max-w-[60%] text-xl leading-relaxed text-white/80 whitespace-pre-line lg:mx-0';
  const calloutContainerClassName = 'flex flex-col items-stretch gap-3 w-full text-white/80 product-hero__callouts';
  const calloutRowClassName = 'flex items-start gap-3 text-left';
  const calloutIconWrapperClassName = 'mt-[2px] flex-shrink-0 text-white';
  const calloutTextClassName = 'text-lg leading-7 font-semibold text-white';
  const calloutLinkClassName = `${calloutTextClassName} product-hero__callout-link text-[#F1A0FF] hover:text-white transition-colors`;
  const highlightBaseClassName = 'product-hero__highlight inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base font-semibold text-white/90 shadow-sm';
  const highlightIconWrapperClassName = 'product-hero__highlight-icon flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white';
  const highlightTextClassName = 'product-hero__highlight-text text-left';
  const highlight = product.heroHighlight;
  const HighlightIcon = highlight?.icon ? resolveLucideIcon(highlight.icon) : null;
  const highlightClassName = cn(highlightBaseClassName, highlight?.className);
  const ctaWrapperClassName = 'relative z-10 mt-0 flex justify-center lg:justify-start';
  const primaryButtonClassName = HERO_PRIMARY_BUTTON_CLASS;
  const glyphWrapperClassName = 'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white lg:mx-0';
  const containerClassName = cn(
    'container mx-auto relative z-10 px-6 md:px-10',
    containerPaddingOverride
  );

  const RootTag = as;

  return (
    <RootTag className={sectionClassName} aria-labelledby={resolvedHeadingId}>
      <div className="landing-hero-gradient__layer" aria-hidden="true" />
      <div className="landing-hero-noise" aria-hidden="true" />
      <div className="landing-hero-contrast" aria-hidden="true" />
      <FluidBackground />
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
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 supports-[backdrop-filter]:bg-white/10">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#F1A0FF]" />
                  <span>{badgeLabel}</span>
                </span>
              )}
              {product.lastUpdated && (
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  Updated {product.lastUpdated}
                </span>
              )}
              {headlineSegments.length > 0 ? (
                <h1 className={cn(HERO_TITLE_CLASS, 'pb-3')} id={resolvedHeadingId}>
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
                        return 'text-white/75 block';
                      }
                      return 'text-white block';
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
                <h1 className={cn(HERO_TITLE_CLASS, headlineColorOverride, 'pb-3')} id={resolvedHeadingId}>
                  {product.title}
                </h1>
              )}
            </div>

            {calloutItems.length > 0 && (
              <div className={calloutContainerClassName}>
                {calloutItems.map(({ label, icon, href }, index) => {
                  const Icon = icon ? resolveLucideIcon(icon) : ArrowRight;
                  const resolvedHref = href?.startsWith('#') ? `/${href}` : href;
                  const isExternalCalloutLink = Boolean(resolvedHref && resolvedHref.startsWith('http'));
                  const calloutContent = resolvedHref ? (
                    <a
                      href={resolvedHref}
                      target={isExternalCalloutLink ? '_blank' : '_self'}
                      rel={isExternalCalloutLink ? 'noopener noreferrer' : undefined}
                      className={calloutLinkClassName}
                    >
                      {label}
                    </a>
                  ) : (
                    <p className={calloutTextClassName}>
                      {label}
                    </p>
                  );

                  return (
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
                      {calloutContent}
                    </div>
                  );
                })}
              </div>
            )}

            {highlight?.label && (
              <div className={highlightClassName}>
                {HighlightIcon && (
                  <span className={highlightIconWrapperClassName}>
                    <HighlightIcon
                      className="h-5 w-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                )}
                <span className={highlightTextClassName}>{highlight.label}</span>
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
                      {PrimaryButtonIcon && (
                        <PrimaryButtonIcon
                          className="h-4 w-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                      <span>{product.primaryButton}</span>
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
                      {PrimaryButtonIcon && (
                        <PrimaryButtonIcon
                          className="h-4 w-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                      <span>{product.primaryButton}</span>
                    </span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </RootTag>
  );
};

export default ProductHero;
