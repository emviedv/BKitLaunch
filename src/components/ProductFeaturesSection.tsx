import React from 'react';

import ContentChunk from './ContentChunk';
import { resolveLucideIcon, ArrowRight } from '@/lib/iconUtils';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from './heroConstants';
import { SECTION_TITLE_CLASS } from './productContentSectionConstants';
import { computeFeatureLayout } from './productContentSectionLayout';
import { cn } from '@/lib/utils';
import { debugService } from '@/lib/debugService';
import ProductFeatureMedia from './ProductFeatureMedia';
import {
  createFeatureAnchorId,
  gridClassForCount,
  normalizeHref,
  parseFeatureTitle,
  productSectionsDebugEnabled,
} from './productContentSectionHelpers';

type FeaturePill = {
  label: string;
  classes: string;
  dotClass: string;
};

type ProductDetail = {
  title: string;
  description?: string;
  items?: string[];
  buttonText?: string;
  buttonLink?: string;
  mediaComponent?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  mediaLoading?: 'lazy' | 'eager';
  mediaExamples?: any[];
  mediaBlueprint?: any;
  mediaProgress?: any;
  pill?: FeaturePill | null;
  icon?: string;
  statValue?: string;
  statLabel?: string;
};

type FeatureNavItem = { title: string; anchorId: string };

type Props = {
  details: ProductDetail[] | undefined;
  productTitle?: string;
  primaryButton?: string;
  landingShowcaseLayout: boolean;
  shouldAlternateFeatures: boolean;
  hideFeatureIllustrations: boolean;
  featuresTitle: string;
  logoMarquee: React.ReactNode;
  introContent: React.ReactNode;
  enableFeaturesNav: boolean;
  compactLayout: boolean;
  sectionId?: string;
};

const ProductFeaturesSection: React.FC<Props> = ({
  details,
  productTitle,
  primaryButton,
  landingShowcaseLayout,
  shouldAlternateFeatures,
  hideFeatureIllustrations,
  featuresTitle,
  logoMarquee,
  introContent,
  enableFeaturesNav,
  compactLayout,
  sectionId,
}) => {
  const detailEntries = Array.isArray(details)
    ? details.map((detail, index) => ({
        detail,
        anchorId: createFeatureAnchorId(detail.title, index),
      }))
    : [];

  const featureNavItems = enableFeaturesNav
    ? detailEntries
        .map(({ detail, anchorId }) =>
          detail.title ? { title: detail.title, anchorId } : null
        )
        .filter(Boolean) as FeatureNavItem[]
    : [];

  if (!detailEntries.length) return null;

  const FeatureNavList = () => (
    <nav
      aria-label={`${featuresTitle || 'Features'} quick links`}
      className="lg:sticky lg:top-32"
    >
      <ul className="flex flex-col gap-3">
        {featureNavItems.map(({ title, anchorId }) => (
          <li key={anchorId}>
            <a
              href={`#${anchorId}`}
              className="block text-sm font-semibold text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4AEFF]"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  const renderLandingCard = () => (
    <section
      id={sectionId}
      className="relative overflow-hidden landing-sections-gradient py-24 sm:py-28"
      key="features-landing"
    >
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="relative z-10">
          {introContent}
        </div>
        {logoMarquee}
      </div>
      <div className="section-content relative overflow-visible z-10 pt-16">
        <div className="mt-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {detailEntries.map(({ detail, anchorId }, index) => {
              // Color themes for each card (bg, icon color, border)
              const colorThemes = [
                { bg: 'rgba(59, 130, 246, 0.08)', icon: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },   // Blue
                { bg: 'rgba(168, 85, 247, 0.08)', icon: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },   // Purple
                { bg: 'rgba(20, 184, 166, 0.08)', icon: '#14b8a6', border: 'rgba(20, 184, 166, 0.2)' },   // Teal
                { bg: 'rgba(34, 197, 94, 0.08)', icon: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },     // Green
                { bg: 'rgba(249, 115, 22, 0.08)', icon: '#f97316', border: 'rgba(249, 115, 22, 0.2)' },   // Orange
                { bg: 'rgba(99, 102, 241, 0.08)', icon: '#6366f1', border: 'rgba(99, 102, 241, 0.2)' },   // Indigo
                { bg: 'rgba(236, 72, 153, 0.08)', icon: '#ec4899', border: 'rgba(236, 72, 153, 0.2)' },   // Pink
              ];
              const theme = colorThemes[index % colorThemes.length];
              const rawItems = Array.isArray(detail.items) ? detail.items : [];
              const promotedFirstItem = !detail.description && rawItems.length > 0;
              const descriptionText = detail.description ?? (promotedFirstItem ? rawItems[0] : undefined);
              const highlightItems = promotedFirstItem ? rawItems.slice(1) : rawItems;
              const featurePill = detail.pill;
              const { headline, productName } = parseFeatureTitle(detail.title);
              const buttonLabel =
                detail.buttonText ||
                primaryButton ||
                detail.title ||
                productTitle ||
                'See how it works';
              const buttonHrefRaw = detail.buttonLink?.trim();
              const buttonHref = normalizeHref(buttonHrefRaw);
              const isExternalButton = Boolean(buttonHrefRaw && buttonHrefRaw.startsWith('http'));

              if (productSectionsDebugEnabled()) {
                try {
                  debugService.debug('product-sections:landing-feature-layout', {
                    anchorId,
                    highlightCount: highlightItems.length,
                    hasButton: Boolean(buttonLabel),
                  });
                } catch {}
              }

              return (
                <article
                  id={anchorId}
                  key={anchorId}
                  className="relative h-full rounded-[20px] px-6 py-7"
                  style={{ backgroundColor: theme.bg, borderWidth: 1, borderStyle: 'solid', borderColor: theme.border }}
                >
                  <div className="flex h-full flex-col">
                    {/* Top row: Icon + Category badge */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Icon square */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ backgroundColor: theme.bg, color: theme.icon, border: `1px solid ${theme.icon}` }}>
                        {(() => {
                          const IconComponent = resolveLucideIcon(detail.icon);
                          return <IconComponent size={28} />;
                        })()}
                      </div>
                      {/* Category badge */}
                      {featurePill && (
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase"
                          style={{ backgroundColor: theme.bg, color: theme.icon, border: `1px solid ${theme.icon}` }}
                        >
                          {featurePill.label}
                        </span>
                      )}
                    </div>

                    {/* Title and description */}
                    <div className="flex-1 space-y-2">
                      <h2 className="text-xl font-semibold text-white">
                        {productName || headline || detail.title}
                      </h2>
                      {descriptionText && (
                        <p className="text-base text-slate-400 leading-relaxed">
                          {descriptionText}
                        </p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="my-6 border-t" style={{ borderColor: theme.border }} />

                    {/* Bottom row: Stat + Arrow button */}
                    <div className="flex items-end justify-between">
                      {/* Stat */}
                      {detail.statValue && (
                        <div>
                          <div className="text-4xl font-bold text-[#ff2f87] leading-none">
                            {detail.statValue}
                          </div>
                          {detail.statLabel && (
                            <div className="mt-1 text-xs font-medium tracking-wider text-slate-400 uppercase">
                              {detail.statLabel}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Arrow button */}
                      {buttonHref && (
                        <a
                          href={buttonHref}
                          target={isExternalButton ? '_blank' : '_self'}
                          rel={isExternalButton ? 'noopener noreferrer' : undefined}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff2f87] text-white transition-colors hover:brightness-110"
                          aria-label={`Go to ${productName || detail.title}`}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  const renderDefaultGrid = () => (
    <section
      id={sectionId}
      className="relative overflow-hidden landing-sections-gradient py-20 sm:py-24"
      key="features-default"
    >
      <div className="section-content relative z-10">
        <div className="flex flex-col items-center">
          {introContent}
          {logoMarquee}
        </div>

        <div className="mt-12 flex flex-col gap-12">
          <div className="flex flex-col gap-[74px]">
            {detailEntries.map(({ detail, anchorId }, index) => {
              const layout = hideFeatureIllustrations
                ? {
                    isEven: index % 2 === 0,
                    text: [
                      'flex flex-col gap-6 px-8 py-12 lg:px-12',
                      'rounded-[28px]',
                      'bg-white',
                      'shadow-[0_18px_50px_rgba(15,23,42,0.08)]',
                      'border border-slate-200/70',
                    ],
                    media: [],
                  }
                : computeFeatureLayout({ index, alternate: shouldAlternateFeatures });
              const useFeatureDescription = landingShowcaseLayout;
              const rawItems = Array.isArray(detail.items) ? detail.items : [];
              const promotedFirstItem = useFeatureDescription && !detail.description && rawItems.length > 0;
              const descriptionText = useFeatureDescription
                ? detail.description ?? (promotedFirstItem ? rawItems[0] : undefined)
                : undefined;
              const bulletItems = promotedFirstItem ? rawItems.slice(1) : rawItems;
              const { headline, productName } = parseFeatureTitle(detail.title);
              const buttonLabel =
                detail.buttonText ||
                primaryButton ||
                detail.title ||
                productTitle ||
                'See how it works';
              const buttonHrefRaw = detail.buttonLink?.trim();
              const buttonHref = normalizeHref(buttonHrefRaw);
              const isExternalButton = Boolean(buttonHrefRaw && buttonHrefRaw.startsWith('http'));

              if (productSectionsDebugEnabled()) {
                try {
                  debugService.debug('product-sections:feature-card-layout', {
                    index,
                    anchorId,
                    isEven: layout.isEven,
                    navColumnPresent: featureNavItems.length > 0,
                    textColumns: layout.text,
                    mediaColumns: layout.media,
                  });
                } catch {}
              }

              const hasCustomMedia = (() => {
                switch (detail.mediaComponent) {
                  case 'feature-comparison':
                    return Array.isArray(detail.mediaExamples) && detail.mediaExamples.length > 0;
                  case 'feature-blueprint':
                    return Boolean(detail.mediaBlueprint);
                  case 'feature-progress':
                    return Boolean(detail.mediaProgress);
                  default:
                    return false;
                }
              })();
              const mediaElement = <ProductFeatureMedia detail={detail} productTitle={productTitle} variant="showcase" />;

              return (
                <article
                  id={anchorId}
                  key={anchorId}
                  className={cn(
                    'relative scroll-mt-32 rounded-[4px] border border-slate-200 p-4 lg:p-6 text-white shadow-md',
                    hideFeatureIllustrations ? '' : 'lg:grid lg:grid-cols-10 lg:grid-flow-dense lg:gap-8'
                  )}
                >
                  <div className={cn('space-y-6', ...layout.text)}>
                    <div className="space-y-4">
                      <h2 className="text-2xl lg:text-3xl font-semibold text-white leading-snug">
                        {headline || detail.title}
                      </h2>
                      {productName && (
                        <div className="text-[32px] font-semibold text-white leading-tight">
                          {productName}
                        </div>
                      )}
                      {descriptionText && (
                        <p className="text-base text-white/75 leading-relaxed">
                          {descriptionText}
                        </p>
                      )}
                      {Array.isArray(bulletItems) && bulletItems.length > 0 && (
                        <ul className="mt-2 space-y-2 text-base text-white/75 flex flex-col items-start text-left pb-3 leading-relaxed">
                          {bulletItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <span className="mt-[6px] inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F772B6]" />
                              <span className="text-left">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {buttonLabel && (
                        <div className="mt-6 flex justify-start">
                          <Button
                            asChild={Boolean(buttonHref)}
                            size="lg"
                            className={HERO_PRIMARY_BUTTON_CLASS}
                          >
                            {buttonHref ? (
                              <a
                                href={buttonHref}
                                target={isExternalButton ? '_blank' : '_self'}
                                rel={isExternalButton ? 'noopener noreferrer' : undefined}
                              >
                                {buttonLabel}
                              </a>
                            ) : (
                              <span>{buttonLabel}</span>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {!hideFeatureIllustrations && (
                    <div className={cn(...layout.media, 'flex items-center justify-center')}>
                      {hasCustomMedia ? mediaElement : (
                        <div className="w-full flex items-center justify-center">
                          {mediaElement}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  return landingShowcaseLayout ? renderLandingCard() : renderDefaultGrid();
};

export default ProductFeaturesSection;
