import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ShieldCheck, Zap, Sparkles, Layers, FileCheck, Paintbrush } from 'lucide-react';
import { Icon } from '@iconify/react';

import ContentChunk from './ContentChunk';
import ExpertQuote from './ExpertQuote';
import FAQSchema from './FAQSchema';
import { cn } from '@/lib/utils';
import { debugService } from '@/lib/debugService';
import { SECTION_TITLE_CLASS, SECTION_DESCRIPTION_CLASS } from './productContentSectionConstants';
import { LANDING_FEATURES_ID } from '@/config/sectionAnchors';
import {
  createFeatureAnchorId,
  createSectionClassBuilder,
  gridClassForColumns,
  mediaDiagnosticsEnabled,
  productSectionsDebugEnabled,
  sanitizeColumns
} from './productContentSectionHelpers';
import ProductFeaturesSection from './ProductFeaturesSection';

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
    waitlist?: boolean;
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
  const sectionsDebug = productSectionsDebugEnabled();
  const landingGutterClass = 'section-content';
  const standardContainerClass = 'mx-auto w-full max-w-6xl px-6 md:px-10';
  const buildSectionClass = createSectionClassBuilder(
    compactLayout,
    landingGutterClass,
    standardContainerClass
  );
  const buildContainerClass = buildSectionClass;

  useEffect(() => {
    if (!sectionsDebug || typeof document === 'undefined') return;

    const marqueeContainer = document.querySelector<HTMLElement>('.landing-logo-marquee');
    if (!marqueeContainer) return;

    const marqueeTrack = document.querySelector<HTMLElement>('.landing-logo-marquee-track');
    const marqueeItems = Array.from(
      document.querySelectorAll<HTMLElement>('.landing-logo-marquee-item')
    );

    if (!marqueeTrack || marqueeItems.length === 0) {
      debugService.debug('landing-logo-marquee:missing', {
        hasTrack: Boolean(marqueeTrack),
        itemCount: marqueeItems.length
      });
      return;
    }

    const containerRect = marqueeContainer?.getBoundingClientRect();
    const trackRect = marqueeTrack.getBoundingClientRect();
    const metrics = marqueeItems.map((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const svg = item.querySelector('svg');
      const svgRect = svg?.getBoundingClientRect();
      return {
        index,
        width: itemRect.width,
        height: itemRect.height,
        svgWidth: svgRect?.width ?? null,
        svgHeight: svgRect?.height ?? null
      };
    });

    const widths = metrics.map((m) => m.svgWidth ?? m.width);
    const heights = metrics.map((m) => m.svgHeight ?? m.height);

    debugService.debug('landing-logo-marquee:metrics', {
      container: containerRect
        ? { width: containerRect.width, height: containerRect.height }
        : null,
      track: { width: trackRect.width, height: trackRect.height },
      itemCount: marqueeItems.length,
      minWidth: Math.min(...widths),
      maxWidth: Math.max(...widths),
      minHeight: Math.min(...heights),
      maxHeight: Math.max(...heights),
      zeroSizeCount: metrics.filter((m) => (m.svgWidth ?? m.width) === 0 || (m.svgHeight ?? m.height) === 0).length
    });
  }, [sectionsDebug]);

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

  const renderFeaturesTitleLine = (line: string, _keyPrefix: string) => {
    return line;
  };

  const hasDetails = Boolean(details && details.length > 0);
  const shouldAlternateFeatures = true;

  const featuresTitle = sectionOverrides?.featuresTitle
    || product?.sections?.features?.title
    || 'Trusted by designers\nshipping real products in Figma.';
  const featuresDescription = sectionOverrides?.featuresDescription
    || product?.sections?.features?.description;

  const useCasesTitle = sectionOverrides?.useCasesTitle
    || product?.sections?.useCases?.title
    || 'Use Cases';
  const useCasesDescription = sectionOverrides?.useCasesDescription
    || product?.sections?.useCases?.description
    || 'Perfect for product teams seeking data-driven design system optimization and ROI measurement';

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

  const landingShowcaseLayout = Boolean(enableFeaturesNav && compactLayout);
  const hideFeatureIllustrations = false; // keep product feature sections paired with visuals and placeholders

  const faqProductName = (product as any)?.title || (product as any)?.name;

  // Animated stats counter
  const STATS_DATA = [
    { icon: Layers, label: 'Layers renamed', target: 100, suffix: 'k+' },
    { icon: FileCheck, label: 'Files audited', target: 50, suffix: 'k+' },
    { icon: Paintbrush, label: 'Prototypes cleaned', target: 25, suffix: 'k+' },
  ];

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>(STATS_DATA.map(() => 0));

  const animateCounters = useCallback(() => {
    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(STATS_DATA.map((stat) => Math.round(stat.target * easeOut)));

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues(STATS_DATA.map((stat) => stat.target));
      }
    }, stepDuration);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsVisible) {
            setStatsVisible(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible, animateCounters]);

  const renderFeaturesSection = () => {
    if (!hasDetails || product?.visibility?.features === false) {
      return null;
    }

    const introContent = (
      <div className="relative mx-auto text-center text-white isolate flex flex-col items-center justify-center" style={{ width: '85vw', maxWidth: '1400px' }}>
        <div
          className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-px -translate-y-1/2 bg-white/70 opacity-80"
          aria-hidden="true"
        />
        <div className="relative z-20 py-8 px-8 w-full text-center">
          {/* Trust badges - above title */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-white/55 mb-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-white/40" />
              Data stays in Figma
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-white/40" />
              Results in seconds
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-white/40" />
              No signup required
            </span>
          </div>

          {/* Section Title */}
          <h2 className={cn(SECTION_TITLE_CLASS, 'font-display text-center text-white drop-shadow-[0_20px_60px_rgba(4,0,12,0.6)] mb-10')}>
            {featuresTitle.split('\n').map((line, i, arr) => (
              <span key={i}>
                {renderFeaturesTitleLine(line, `features-title-${i}`)}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>

          {/* Animated Stats Bar */}
          <div
            ref={statsRef}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            {STATS_DATA.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] border border-white/15">
                    <StatIcon className="h-4 w-4 text-[#F772B6]" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold text-white tabular-nums leading-tight">
                      {animatedValues[index]}{stat.suffix}
                    </div>
                    <div className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    return (
        <ProductFeaturesSection
          details={details}
          productTitle={(product as any)?.title}
          primaryButton={(product as any)?.primaryButton}
          landingShowcaseLayout={landingShowcaseLayout}
          shouldAlternateFeatures={shouldAlternateFeatures}
          hideFeatureIllustrations={hideFeatureIllustrations}
          featuresTitle={featuresTitle}
          logoMarquee={null}
          introContent={introContent}
          enableFeaturesNav={Boolean(enableFeaturesNav)}
          compactLayout={compactLayout}
          sectionId={landingShowcaseLayout ? LANDING_FEATURES_ID : undefined}
          key="features"
        />
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
                <div className={cn(gridClassForColumns(useCasesColumns), 'max-w-4xl mx-auto')}>
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
                <div className={cn(gridClassForColumns(testimonialsColumns), 'max-w-5xl mx-auto')}>
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
