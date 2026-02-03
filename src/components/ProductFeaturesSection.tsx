import React from 'react';

import ContentChunk from './ContentChunk';
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
            {detailEntries.map(({ detail, anchorId }) => {
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
                  className="relative h-full rounded-[4px] border border-slate-200 px-4 py-6 sm:px-6 sm:py-8 text-white shadow-md"
                >
                  <div className="flex h-full flex-col">
                    <div className="space-y-4 text-white">
                      {featurePill && (
                        <div className="landing-feature-pill-wrapper">
                          <span
                            className={cn(
                              'landing-feature-pill inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-tight text-white/90',
                              featurePill.classes
                            )}
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full', featurePill.dotClass || 'bg-white/80')} />
                            {featurePill.label}
                          </span>
                        </div>
                      )}
                      {productName ? (
                        <>
                          <h2 className="text-3xl font-semibold text-white leading-tight">
                            {productName}
                          </h2>
                          {(headline || detail.title) && (
                            <p className="text-xl font-semibold text-white/85 leading-relaxed">
                              {headline || detail.title}
                            </p>
                          )}
                        </>
                      ) : (
                        <h2 className="text-3xl font-semibold text-white leading-tight">
                          {headline || detail.title}
                        </h2>
                      )}
                      {descriptionText && (
                        <p className="text-lg text-white/75 leading-relaxed line-clamp-2">
                          {descriptionText}
                        </p>
                      )}
                    </div>
                    {buttonLabel && (
                      <div className="mt-auto pt-6">
                        <Button
                          asChild={Boolean(buttonHref)}
                          size="lg"
                          className={cn(
                            HERO_PRIMARY_BUTTON_CLASS
                          )}
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
