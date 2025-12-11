import React, { useEffect } from 'react';

import ContentChunk from './ContentChunk';
import ExpertQuote from './ExpertQuote';
import FAQSchema from './FAQSchema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { debugService } from '@/lib/debugService';
import { SECTION_TITLE_CLASS, SECTION_DESCRIPTION_CLASS } from './productContentSectionConstants';
import { HERO_PRIMARY_BUTTON_CLASS } from './heroConstants';
import { computeFeatureLayout } from './productContentSectionLayout';
import FeatureComparisonPreview, { FeatureComparisonExample } from './AIRenameVariantsFeaturePreview';
import AIRenameBlueprintPreview, { FeatureBlueprintConfig } from './AIRenameBlueprintPreview';
import AIRenameProgressPreview, { FeatureProgressConfig } from './AIRenameProgressPreview';
import AIRenameBatchVisual from './AIRenameBatchVisual';
import UXBiblioAbstractVisual from './UXBiblioAbstractVisual';

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
  mediaExamples?: FeatureComparisonExample[];
  mediaBlueprint?: FeatureBlueprintConfig;
  mediaProgress?: FeatureProgressConfig;
  pill?: FeaturePill | null;
};
type ProductSpec = { icon: string; name: string; value: string };

type ProductLike = {
  llm?: {
    expertQuote?: {
      quote?: string;
      expertName?: string;
      expertTitle?: string;
      institution?: string;
    };
  };
  details?: ProductDetail[];
  benefits?: string[];
  specifications?: ProductSpec[];
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
    company?: string;
    avatarUrl?: string;
  }>;
  visibility?: { 
    expertQuote?: boolean;
    features?: boolean;
    benefits?: boolean;
    specifications?: boolean;
    faqs?: boolean;
    testimonials?: boolean;
  };
  sections?: {
    features?: { title?: string; description?: string; columns?: number };
    useCases?: { title?: string; description?: string; columns?: number };
    specifications?: { title?: string; description?: string; columns?: number };
    testimonials?: { title?: string; description?: string; columns?: number };
  };
};

interface ProductContentSectionsProps {
  product: ProductLike;
  faqs: Array<{ question: string; answer: string }>;
  detailsOverride?: ProductDetail[];
  benefitsOverride?: string[];
  sectionOverrides?: {
    featuresTitle?: string;
    featuresDescription?: string;
    useCasesTitle?: string;
    useCasesDescription?: string;
    specsTitle?: string;
    specsDescription?: string;
    testimonialsTitle?: string;
    testimonialsDescription?: string;
  };
  compactLayout?: boolean;
  enableFeaturesNav?: boolean;
}

const parseFeatureTitle = (rawTitle?: string | null) => {
  const base = (rawTitle || '').trim();
  const match = base.match(/^(.*)\(([^)]+)\)\s*$/);
  if (match) {
    return {
      headline: match[1].trim(),
      productName: match[2].trim(),
    };
  }
  return { headline: base, productName: undefined };
};

const ProductContentSections: React.FC<ProductContentSectionsProps> = ({
  product,
  faqs,
  detailsOverride,
  benefitsOverride,
  sectionOverrides,
  compactLayout = false,
  enableFeaturesNav = false
}) => {
  const landingGutterClass = 'section-content';
  const standardContainerClass = 'mx-auto w-full max-w-6xl px-6 md:px-10';
  const buildContainerClass = (...extra: Array<string | false | undefined>) =>
    cn(
      compactLayout
        ? landingGutterClass
        : standardContainerClass,
      ...extra
    );
  const buildSectionContentClass = (...extra: Array<string | false | undefined>) =>
    cn(
      compactLayout
        ? landingGutterClass
        : standardContainerClass,
      ...extra
    );
  const normalizeHref = (href?: string) => {
    if (!href) return undefined;
    return href.startsWith('#') ? `/${href}` : href;
  };

  const mediaDiagnosticsEnabled = () => {
    if (typeof process !== 'undefined' && typeof process.env?.DEBUG_FIX !== 'undefined') {
      return process.env.DEBUG_FIX !== '0';
    }
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
      return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
    }
    return false;
  };

  const logFeatureMedia = (detail: ProductDetail, variant: 'default' | 'showcase') => {
    if (!mediaDiagnosticsEnabled() || !detail.mediaUrl) {
      return;
    }
    debugService.debug('landing:feature-media', {
      title: detail.title,
      mediaUrl: detail.mediaUrl,
      mediaAlt: detail.mediaAlt,
      variant,
      isLocal: detail.mediaUrl.startsWith('/'),
    });
  };

  const createFeatureAnchorId = (title: string | undefined, index: number) => {
    const slug = (title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const base = slug || `feature-${index + 1}`;
    return `feature-card-${base}-${index}`;
  };

  const getGridClassesForCount = (count: number): string => {
    const cols = Math.max(1, Math.min(count, 4));
    switch (cols) {
      case 1:
        return 'grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8';
      case 4:
      default:
        return 'grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8';
    }
  };

  const expertQuote = {
    quote: product?.llm?.expertQuote?.quote || '',
    expertName: product?.llm?.expertQuote?.expertName || '—',
    expertTitle: product?.llm?.expertQuote?.expertTitle || '',
    institution: product?.llm?.expertQuote?.institution || '',
  };

  const hasExpertQuote = Boolean(expertQuote.quote);

  const details: ProductDetail[] | undefined = (detailsOverride && detailsOverride.length > 0)
    ? detailsOverride
    : product.details;

  const benefits: string[] | undefined = (benefitsOverride && benefitsOverride.length > 0)
    ? benefitsOverride
    : product.benefits;

  const hasDetails = Boolean(details && details.length > 0);
  const detailEntries = hasDetails
    ? details!.map((detail, index) => ({
        detail,
        anchorId: createFeatureAnchorId(detail.title, index),
      }))
    : [];
  const shouldAlternateFeatures = true;
  const featureNavItems = enableFeaturesNav
    ? detailEntries
        .map(({ detail, anchorId }) =>
          detail.title ? { title: detail.title, anchorId } : null
        )
        .filter(Boolean) as Array<{ title: string; anchorId: string }>
    : [];

  const renderDetailMedia = (
    detail: ProductDetail,
    variant: 'default' | 'showcase' = 'default'
  ) => {
    logFeatureMedia(detail, variant);

    const isShowcase = variant === 'showcase';
    const placeholderStroke = 'rgba(148,163,184,0.52)'; // slate-400, ~4 shades lighter than the slate-900 base
    const placeholderSecondaryStroke = 'rgba(148,163,184,0.28)';
    const fallbackWrapperClass = cn(
      'relative flex items-center justify-center overflow-hidden border bg-gradient-to-br from-[#0c1024] via-[#0a081a] to-[#070512] shadow-[0_32px_90px_rgba(7,0,18,0.35)] rounded-[12px]',
      isShowcase ? 'w-full max-w-[640px] min-h-[280px] px-6 py-6' : 'w-full max-w-[520px] min-h-[220px] px-5 py-5'
    );
    const imageWrapperClass = cn(
      'relative inline-flex overflow-hidden border bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/0 rounded-[12px]',
      isShowcase ? 'w-full max-w-[640px]' : 'w-full max-w-[520px]'
    );
    const mediaFrameStyle = { borderColor: placeholderStroke };

    switch (detail.mediaComponent) {
      case 'feature-comparison':
        if (Array.isArray(detail.mediaExamples) && detail.mediaExamples.length > 0) {
          return <FeatureComparisonPreview examples={detail.mediaExamples} />;
        }
        break;
      case 'feature-blueprint':
        if (detail.mediaBlueprint) {
          return <AIRenameBlueprintPreview config={detail.mediaBlueprint} />;
        }
        break;
      case 'feature-progress':
        if (detail.mediaProgress) {
          return <AIRenameProgressPreview config={detail.mediaProgress} />;
        }
        break;
      case 'video':
        if (detail.mediaUrl) {
          const videoWrapperClass = cn(
            'relative inline-flex overflow-hidden border bg-black/40 rounded-[12px]',
            isShowcase ? 'w-full max-w-[640px]' : 'w-full max-w-[520px]'
          );
          const videoLabel =
            detail.mediaAlt ||
            detail.title ||
            `${product?.title || 'Product'} preview`;
          return (
            <div className={videoWrapperClass} style={mediaFrameStyle}>
              <video
                className="w-full h-auto object-cover"
                src={detail.mediaUrl}
                loop
                autoPlay
                muted
                playsInline
                aria-label={videoLabel}
              />
            </div>
          );
        }
        break;
      case 'feature-batch':
        return <AIRenameBatchVisual />;
      case 'uxbiblio-organize':
      case 'uxbiblio-capture':
      case 'uxbiblio-insights':
      case 'uxbiblio-collections':
      case 'uxbiblio-pin':
      case 'uxbiblio-reuse':
        return <UXBiblioAbstractVisual variant={detail.mediaComponent} />;
      case 'image':
        if (detail.mediaUrl) {
          const imageLabel =
            detail.mediaAlt ||
            detail.title ||
            `${product?.title || 'Product'} preview`;
          return (
            <div className={imageWrapperClass} style={mediaFrameStyle}>
              <img
                src={detail.mediaUrl}
                alt={imageLabel}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          );
        }
        break;
      default:
        break;
    }

    if (detail.mediaUrl) {
      const imageLabel =
        detail.mediaAlt ||
        detail.title ||
        `${product?.title || 'Product'} preview`;
      return (
        <div className={imageWrapperClass} style={mediaFrameStyle}>
          <img
            src={detail.mediaUrl}
            alt={imageLabel}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className={fallbackWrapperClass} aria-hidden="true" style={{ borderColor: placeholderStroke }}>
        <div
          className="absolute inset-[10%] rounded-[12px] border backdrop-blur-sm"
          style={{ borderColor: placeholderStroke }}
        />
        <div
          className="absolute inset-[16%] rounded-[10px] border border-dashed"
          style={{ borderColor: placeholderSecondaryStroke }}
        />
        <div
          className="absolute left-[18%] top-[22%] h-3 w-24 rounded-full bg-white/[0.12]"
          style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.14)' }}
        />
        <div
          className="absolute right-[18%] bottom-[18%] h-20 w-28 rounded-[10px] border bg-white/[0.08] backdrop-blur"
          style={{ borderColor: placeholderStroke }}
        />
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -left-12 top-6 h-24 w-24 rounded-full bg-[#a855f7]/18 blur-3xl" />
          <div className="absolute right-4 bottom-4 h-24 w-32 rounded-full bg-[#22d3ee]/14 blur-3xl" />
        </div>
      </div>
    );
  };

  const featuresTitle = sectionOverrides?.featuresTitle
    || product?.sections?.features?.title
    || 'Design smarter. Ship cleaner.';
  const featuresDescription = sectionOverrides?.featuresDescription
    || product?.sections?.features?.description
    || 'Comprehensive design system analytics platform with automated Figma integration and ROI tracking';

  const useCasesTitle = sectionOverrides?.useCasesTitle
    || product?.sections?.useCases?.title
    || 'Use Cases';
  const useCasesDescription = sectionOverrides?.useCasesDescription
    || product?.sections?.useCases?.description
    || 'Perfect for product teams seeking data-driven design system optimization and ROI measurement';

  const sanitizeColumns = (value: any, fallback: number): number => {
    const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
    if (Number.isNaN(parsed)) return fallback;
    return Math.min(4, Math.max(1, parsed));
  };
  const useCasesColumns = sanitizeColumns(product?.sections?.useCases?.columns, 2);
  const testimonialsColumns = sanitizeColumns(product?.sections?.testimonials?.columns, 2);

  // Debug: report computed columns and item counts
  useEffect(() => {
    try {
      debugService.info('ProductContentSections: computed grid settings', {
        detailsCount: details?.length || 0,
        useCasesColumns,
        benefitsCount: benefits?.length || 0,
        testimonialsColumns,
        testimonialsCount: Array.isArray(product?.testimonials) ? product.testimonials.length : 0,
      });
    } catch {}
  }, [details, useCasesColumns, benefits, testimonialsColumns, product?.testimonials]);

  const getGridClassesForColumns = (cols: number): string => {
    switch (cols) {
      case 1:
        return 'grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8';
      case 4:
      default:
        return 'grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8';
    }
  };

  const landingShowcaseLayout = Boolean(enableFeaturesNav && compactLayout);
  const hideFeatureIllustrations = false; // keep product feature sections paired with visuals and placeholders

  const faqProductName = (product as any)?.title || (product as any)?.name;

  const productSectionsDebugEnabled = () => {
    if (typeof process !== 'undefined') {
      const envValue = process.env?.DEBUG_PRODUCT_SECTIONS ?? process.env?.DEBUG_FIX;
      if (typeof envValue !== 'undefined') {
        return envValue !== '0';
      }
    }

    if (typeof import.meta !== 'undefined') {
      const envValue = (import.meta as any)?.env?.VITE_DEBUG_PRODUCT_SECTIONS ?? (import.meta as any)?.env?.VITE_DEBUG_FIX;
      if (typeof envValue !== 'undefined') {
        return envValue !== '0';
      }
    }

    return false;
  };

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

  const renderFeaturesSection = () => {
    if (!hasDetails || product?.visibility?.features === false) {
      return null;
    }

    const introContent = (
      <div className="max-w-3xl md:max-w-4xl mx-auto text-center py-[18px] text-white">
        <h2 className={cn(SECTION_TITLE_CLASS, 'text-center text-white drop-shadow-[0_20px_60px_rgba(4,0,12,0.6)]')}>
          {featuresTitle}
        </h2>
        <p className={cn(SECTION_DESCRIPTION_CLASS, 'mt-4 text-center max-w-3xl mx-auto text-white/70')}>
          {featuresDescription}
        </p>
      </div>
    );

    if (landingShowcaseLayout) {
      return (
        <section
          className="relative overflow-hidden landing-sections-gradient py-24 sm:py-28"
          key="features-landing"
        >
          <div className={buildSectionContentClass('relative overflow-visible')}>
            {introContent}
            <div className="mt-12 relative flex flex-col gap-10 lg:gap-12">
              <div className="space-y-[96px]">
                {detailEntries.map(({ detail, anchorId }, index) => {
                const rawItems = Array.isArray(detail.items) ? detail.items : [];
                const promotedFirstItem = !detail.description && rawItems.length > 0;
                const descriptionText = detail.description ?? (promotedFirstItem ? rawItems[0] : undefined);
                const highlightItems = promotedFirstItem ? rawItems.slice(1) : rawItems;
                const featurePill = detail.pill;
                const { headline, productName } = parseFeatureTitle(detail.title);
                const buttonLabel =
                  detail.buttonText ||
                  product?.primaryButton ||
                  detail.title ||
                  product?.title ||
                    'View Product';
                const buttonHrefRaw = detail.buttonLink?.trim();
                const buttonHref = normalizeHref(buttonHrefRaw);
                const isExternalButton = Boolean(buttonHrefRaw && buttonHrefRaw.startsWith('http'));

                if (productSectionsDebugEnabled()) {
                  try {
                    debugService.debug('product-sections:landing-feature-layout', {
                      index,
                      anchorId,
                      highlightCount: highlightItems.length,
                      hasButton: Boolean(buttonLabel),
                    });
                  } catch {}
                }
                  const isReversed = index % 2 === 1;

                return (
                  <article
                    id={anchorId}
                    key={anchorId}
                    className="relative rounded-[40px] px-8 sm:px-12"
                  >
                    <div className={cn(
                      'grid gap-[64px] lg:gap-[88px] lg:items-center',
                      isReversed
                        ? 'lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
                          : 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'
                  )}>
                        <div className={cn('space-y-6', isReversed ? 'lg:order-2' : 'lg:order-1')}>
                          <div className="space-y-4">
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
                                  <p className="text-xl font-semibold text-white/75 leading-relaxed">
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
                              <p className="text-lg text-white/75 leading-relaxed">
                                {descriptionText}
                              </p>
                            )}
                          </div>
                          {buttonLabel && (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                        <div className={cn('w-full', isReversed ? 'lg:order-1' : 'lg:order-2')}>
                          <div className="relative py-4 sm:py-6">
                            {renderDetailMedia(detail, 'showcase')}
                          </div>
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
    }

    return (
      <section
        className="relative overflow-hidden landing-sections-gradient py-20 sm:py-24"
        key="features-default"
      >
        <div className={buildSectionContentClass('relative z-10')}>
          {introContent}

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
                const rawItems = Array.isArray(detail.items) ? detail.items : [];
                const promotedFirstItem = !detail.description && rawItems.length > 0;
                const descriptionText = detail.description ?? (promotedFirstItem ? rawItems[0] : undefined);
                const bulletItems = promotedFirstItem ? rawItems.slice(1) : rawItems;
                const { headline, productName } = parseFeatureTitle(detail.title);
                const buttonLabel =
                  detail.buttonText ||
                  product?.primaryButton ||
                  detail.title ||
                  product?.title ||
                  'View Product';
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
                const mediaElement = renderDetailMedia(detail, 'showcase');

                    return (
                      <article
                        id={anchorId}
                        key={anchorId}
                        className={cn(
                          'relative rounded-4xl scroll-mt-32 text-white',
                          hideFeatureIllustrations ? 'bg-transparent' : 'lg:grid lg:grid-cols-10 lg:grid-flow-dense lg:gap-8'
                        )}
                      >
                        <div className={cn(...layout.text)}>
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
  };

  return (
    <>
      {(() => {
        const defaultOrder = ['expertQuote','features','benefits','testimonials','faqs'];
        const rawOrder = Array.isArray((product as any)?.sectionsOrder) ? (product as any).sectionsOrder : [];
        const valid = defaultOrder.filter((k) => rawOrder.includes(k));
        const renderOrder = valid.concat(defaultOrder.filter((k) => !valid.includes(k)));

        const blocks: Record<string, JSX.Element | null> = {
          expertQuote: (hasExpertQuote && product?.visibility?.expertQuote !== false) ? (
            <section className="py-16 landing-sections-gradient" key="expert">
              <div className={buildContainerClass('max-w-4xl')}>
                <ExpertQuote {...expertQuote} />
              </div>
            </section>
          ) : null,
          features: renderFeaturesSection(),
          benefits: (benefits && benefits.length > 0 && product?.visibility?.benefits !== false) ? (
            <section className="py-20 landing-sections-gradient" key="benefits">
              <div className={buildContainerClass()}>
                <ContentChunk>
                  <div className="text-center mb-16">
                    <h2 className={cn(SECTION_TITLE_CLASS, 'text-center mb-6 text-white')}>{useCasesTitle}</h2>
                    <p className={cn(SECTION_DESCRIPTION_CLASS, 'text-center max-w-2xl mx-auto text-white/70')}>
                      {useCasesDescription}
                    </p>
                  </div>
                </ContentChunk>
                <div className={cn(getGridClassesForColumns(useCasesColumns), 'max-w-4xl mx-auto')}>
                  {benefits.map((benefit: string, index: number) => (
                    <ContentChunk key={index}>
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f871a0]/30 via-[#b970ff]/30 to-[#5bceff]/30 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 text-white">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-lg text-white">{benefit}</span>
                      </div>
                    </ContentChunk>
                  ))}
                </div>
              </div>
            </section>
          ) : null,
          testimonials: (Array.isArray(product.testimonials) && product.testimonials.length > 0 && product?.visibility?.testimonials !== false) ? (
            <section className="py-20 landing-sections-gradient" key="testimonials">
              <div className={buildContainerClass()}>
                <ContentChunk>
                  <div className="text-center mb-16">
                    <h2 className={cn(SECTION_TITLE_CLASS, 'text-center mb-6 text-white')}>
                      {sectionOverrides?.testimonialsTitle || product?.sections?.testimonials?.title || 'What customers say'}
                    </h2>
                    {(sectionOverrides?.testimonialsDescription || product?.sections?.testimonials?.description) && (
                      <p className={cn(SECTION_DESCRIPTION_CLASS, 'text-center max-w-2xl mx-auto text-white/70')}>
                        {sectionOverrides?.testimonialsDescription || product?.sections?.testimonials?.description}
                      </p>
                    )}
                  </div>
                </ContentChunk>
                <div className={cn(getGridClassesForColumns(testimonialsColumns), 'max-w-5xl mx-auto')}>
                  {product.testimonials.map((t, index) => (
                    <ContentChunk key={index}>
                      <div className="relative h-full rounded-3xl border border-white/10 bg-[#080213]/75 p-6 shadow-[0_30px_80px_rgba(3,0,12,0.6)]">
                        <div className="text-left">
                          <p className="italic text-white mb-4">“{t.quote}”</p>
                          <div className="space-y-1">
                            <div className="font-semibold text-white">{t.author}</div>
                            <div className="text-sm text-white/60">{[t.role, t.company].filter(Boolean).join(' • ')}</div>
                          </div>
                        </div>
                      </div>
                    </ContentChunk>
                  ))}
                </div>
              </div>
            </section>
          ) : null,
          faqs: (product?.visibility?.faqs !== false) ? (
            <section className="py-20 landing-sections-gradient" key="faqs">
              <div className={buildContainerClass()}>
                <FAQSchema faqs={faqs} productName={faqProductName} />
              </div>
            </section>
          ) : null,
        };

        return <>{renderOrder.map((k) => blocks[k])}</>;
      })()}
    </>
  );
};

export default ProductContentSections;
