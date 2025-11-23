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

const ProductContentSections: React.FC<ProductContentSectionsProps> = ({
  product,
  faqs,
  detailsOverride,
  benefitsOverride,
  sectionOverrides,
  compactLayout = false,
  enableFeaturesNav = false
}) => {
  const buildContainerClass = (...extra: Array<string | false | undefined>) =>
    cn(
      compactLayout ? 'mx-auto w-11/12 sm:w-5/6 md:w-[70%] px-6 md:px-10' : 'container mx-auto',
      ...extra
    );
  const buildSectionContentClass = (...extra: Array<string | false | undefined>) =>
    cn(
      compactLayout ? 'mx-auto w-11/12 sm:w-5/6 md:w-[70%] px-6 md:px-10' : 'section-content',
      ...extra
    );
  const normalizeHref = (href?: string) => {
    if (!href) return undefined;
    return href.startsWith('#') ? `/${href}` : href;
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
    const isShowcase = variant === 'showcase';
    const fallbackWrapperClass = cn(
      'relative flex items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-br from-[#221036]/80 via-[#0c0418]/90 to-[#05000e]/95',
      isShowcase ? 'w-full min-h-[280px] rounded-[28px]' : 'h-32 w-32'
    );

    const fallbackInnerOneClass = cn(
      'absolute rounded-2xl bg-white/10 shadow-[0_20px_60px_rgba(6,0,18,0.35)] backdrop-blur',
      isShowcase ? 'inset-[6%]' : 'inset-[18%]'
    );
    const fallbackInnerTwoClass = cn(
      'absolute rounded-2xl border border-white/25',
      isShowcase ? 'inset-[10%]' : 'inset-[10%]'
    );

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
            'relative overflow-hidden rounded-3xl border border-white/15 bg-black/40',
            isShowcase ? 'w-full min-h-[280px]' : 'h-32 w-32'
          );
          const videoLabel =
            detail.mediaAlt ||
            detail.title ||
            `${product?.title || 'Product'} preview`;
          return (
            <div className={videoWrapperClass}>
              <video
                className="h-full w-full object-cover"
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
      default:
        break;
    }

    return (
      <div className={fallbackWrapperClass}>
        <span className={fallbackInnerOneClass} />
        <span className={fallbackInnerTwoClass} />
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
  const hideFeatureIllustrations = !compactLayout;

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
              {featureNavItems.length > 0 && (
                <div className="order-1 lg:order-none lg:absolute lg:-left-[196px] lg:top-0 lg:w-[220px] lg:pr-6">
                  <FeatureNavList />
                </div>
              )}
              <div
                className={cn(
                  'space-y-14',
                  featureNavItems.length > 0 ? 'order-2 lg:order-none' : undefined
                )}
              >
                {detailEntries.map(({ detail, anchorId }, index) => {
                  const rawItems = Array.isArray(detail.items) ? detail.items : [];
                  const promotedFirstItem = !detail.description && rawItems.length > 0;
                  const descriptionText = detail.description ?? (promotedFirstItem ? rawItems[0] : undefined);
                  const highlightItems = promotedFirstItem ? rawItems.slice(1) : rawItems;
                  const buttonLabel = (() => {
                    const name = detail.title?.trim() || product?.title?.trim() || 'Product';
                    return `Try ${name} For Free`;
                  })();
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
                      'grid gap-10 lg:gap-[64px] lg:items-center',
                      isReversed
                        ? 'lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
                          : 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'
                      )}>
                        <div className={cn('space-y-6', isReversed ? 'lg:order-2' : 'lg:order-1')}>
                          <div className="space-y-4">
                            <h3 className="text-3xl font-semibold text-white leading-tight">
                              {detail.title}
                            </h3>
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
                          <div className="relative rounded-[36px] py-4 sm:py-6">
                            <div className="rounded-[26px] py-4 sm:py-6">
                              {renderDetailMedia(detail, 'showcase')}
                            </div>
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
        className="relative overflow-hidden section-background-blend-top bg-gradient-to-b from-white via-slate-50 to-slate-100/40 py-20 sm:py-24"
        key="features-default"
      >
        <div className={buildSectionContentClass()}>
          {introContent}

          <div className="mt-12 flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
            {featureNavItems.length > 0 && (
              <aside className="lg:col-span-2">
                <FeatureNavList />
              </aside>
            )}

            <div className={cn('flex flex-col gap-[50px]', featureNavItems.length > 0 ? 'lg:col-span-10' : 'lg:col-span-12')}>
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
                const buttonLabel = (() => {
                  const name = detail.title?.trim() || product?.title?.trim() || 'Product';
                  return `Try ${name} For Free`;
                })();
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

                return (
                  <article
                    id={anchorId}
                    key={anchorId}
                    className={cn(
                      'relative rounded-4xl scroll-mt-32',
                      hideFeatureIllustrations ? 'bg-transparent' : 'lg:grid lg:grid-cols-10 lg:grid-flow-dense lg:gap-8'
                    )}
                  >
                    <div className={cn(...layout.text)}>
                      <div className="space-y-4">
                        <h3 className="text-2xl lg:text-3xl font-semibold text-foreground leading-snug">
                          {detail.title}
                        </h3>
                        {descriptionText && (
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {descriptionText}
                          </p>
                        )}
                            {Array.isArray(bulletItems) && bulletItems.length > 0 && (
                              <ul className="mt-2 space-y-2 text-base text-white/70 flex flex-col items-start text-left pb-3">
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
                        {hasCustomMedia ? renderDetailMedia(detail) : (
                          <div className="w-full flex items-center justify-center">
                            {renderDetailMedia(detail)}
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
                <FAQSchema faqs={faqs} />
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
