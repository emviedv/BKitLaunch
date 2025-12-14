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
    || 'Trusted by designers\nshipping real products in Figma.';
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

  // Re-init Unicorn Studio when component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      if ((window as any).UnicornStudio?.init) {
        (window as any).UnicornStudio.init();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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

    // Logo data for scrolling marquee (increased by 20%: h-7 -> h-8, h-6 -> h-7)
    const logoItems = [
      { name: 'Spotify', svg: <svg className="h-8 w-auto" viewBox="0 0 167 50" fill="currentColor"><path d="M83.996 0C37.747 0 0 11.193 0 25.002c0 13.806 37.747 25 83.996 25 46.251 0 83.004-11.194 83.004-25C167 11.193 129.247 0 83.996 0zM29.5 36.5h-6v-23h6v23zm35.5 0h-6V19.896l-8 16.604h-4l-8-16.604V36.5h-6v-23h8l8 14.604 8-14.604h8v23zm25-17.5h-10v4h9v5h-9v3.5h10v5h-16v-23h16v5.5zm17 17.5h-6v-23h6v23zm22 0h-6V19.896l-8 16.604h-4l-8-16.604V36.5h-6v-23h8l8 14.604 8-14.604h8v23z"/></svg> },
      { name: 'Figma', svg: <svg className="h-8 w-auto" viewBox="0 0 38 57" fill="currentColor"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/></svg> },
      { name: 'Slack', svg: <svg className="h-8 w-auto" viewBox="0 0 54 54" fill="currentColor"><path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386"/><path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387"/><path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386"/><path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.25m14.336-.001v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387"/></svg> },
      { name: 'Notion', svg: <svg className="h-8 w-auto" viewBox="0 0 100 100" fill="currentColor"><path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z"/><path fill="#fff" d="M61.35 1.476l-55.333 4.087C1.553 6.2 0 9.116 0 12.613v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.437-.387 6.99-2.917 6.99-7.193V19.64c0-2.33-.97-2.913-3.883-5.053L74.167 2.143c-4.274-3.107-6.02-3.5-12.817-2.917zM25.92 19.523c-5.247.353-6.437.433-9.417-1.99L8.927 11.507c-.77-.78-.383-1.753 1.557-1.947l53.193-3.887c4.467-.39 6.793 1.167 8.54 2.527l9.123 6.61c.39.197 1.36 1.36.193 1.36l-54.933 3.307-.68.047zM19.803 88.3V30.367c0-2.53.777-3.697 3.103-3.893L86 22.78c2.14-.193 3.107 1.167 3.107 3.693v57.547c0 2.53-.39 4.67-3.883 4.863l-60.377 3.5c-3.493.193-5.043-.97-5.043-4.083zm59.6-54.827c.387 1.75 0 3.5-1.75 3.7l-2.91.577v42.773c-2.527 1.36-4.853 2.137-6.797 2.137-3.107 0-3.883-.973-6.21-3.887l-19.03-29.94v28.967l6.02 1.363s0 3.5-4.857 3.5l-13.39.777c-.39-.78 0-2.723 1.357-3.11l3.497-.97v-38.3L30.48 40.667c-.39-1.75.58-4.277 3.3-4.473l14.357-.967l19.8 30.327v-26.83l-5.047-.58c-.39-2.143 1.163-3.7 3.103-3.89l13.41-.78z"/></svg> },
      { name: 'Linear', svg: <svg className="h-8 w-auto" viewBox="0 0 100 100" fill="currentColor"><path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5765C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957055.7606L52.3503 99.7085c.2007.2007.4773.3072.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5765-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7946 3.5171-1.6976 5.1855-2.7039.5765-.3474.6455-1.151.1572-1.6393L9.21103 25.0197c-.48825-.4883-1.29192-.4193-1.63932.1573-1.00636 1.6683-1.90936 3.3994-2.70393 5.1854ZM12.6587 18.074c-.3088-.3474-.3307-.8645-.0536-1.2349 4.5019-6.02016 10.3914-10.98368 17.2351-14.403443.5462-.2728 1.2011-.102521 1.5583.377743L99.5765 80.991c.4803.4803.6506 1.1351.3778 1.5583-3.4198 6.8437-8.3833 12.7332-14.4035 17.2351-.3704.2771-.8875.2552-1.2349-.0536L12.6587 18.074ZM41.9291 3.00034C41.0805 2.40167 39.8681 2.89235 39.6282 3.90746c-1.2831 5.43057-1.9505 11.07746-1.9505 16.87434 0 15.2495 4.7164 29.3924 12.7729 41.0379.3898.5644 1.1564.6482 1.6557.1489L99.0854 14.9894c.4994-.4993.4156-1.266-.1489-1.6557C87.2905 5.27717 73.1475.56084 57.898.56084c-5.7969 0-11.4438.66739-16.8744 1.95053-.0786.02-.1576.04165-.2355.06448-.1313.03847-.2619.08255-.3913.1312-.0443.01669-.0883.03383-.132.0514-.1234.04957-.2464.10275-.3675.16065l-.0443.02135c-.116.05559-.2313.1145-.3449.17733l-.024.01328c-.1049.05787-.209.1187-.3115.18253l-.033.02061c-.0992.0624-.1973.12721-.2942.19481l-.02.01376c-.0835.05862-.1662.11888-.2479.18107Z"/></svg> },
      { name: 'Vercel', svg: <svg className="h-7 w-auto" viewBox="0 0 116 100" fill="currentColor"><path d="M57.5 0L115 100H0L57.5 0z"/></svg> },
      { name: 'GitHub', svg: <svg className="h-8 w-auto" viewBox="0 0 98 96" fill="currentColor"><path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg> },
      { name: 'Stripe', svg: <svg className="h-8 w-auto" viewBox="0 0 60 25" fill="currentColor"><path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.9 10.9 0 0 1-4.56 1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.04-.06 1.58zm-6.2-5.8c-1.04 0-2.24.68-2.24 2.8h4.38c0-2.14-.93-2.8-2.14-2.8zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.1 1.03a4.19 4.19 0 0 1 3.18-1.4c2.82 0 5.37 2.48 5.37 7.25 0 5.06-2.66 7.85-5.37 7.85zm-.35-11.12c-1.02 0-1.77.53-2.13 1.13l.04 5.73c.35.54 1.1 1.1 2.1 1.1 1.58 0 2.68-1.76 2.68-3.97 0-2.27-1.06-3.99-2.7-3.99zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-5.35L32.37 0v3.91h-4.13V.22zm-4.44 9.22l-3.31.7v-3.7h3.31v-2.2c0-3.24 1.76-5.03 5.1-5.03.92 0 1.7.12 2.1.27v3.34a8.78 8.78 0 0 0-1.47-.14c-1.12 0-1.6.5-1.6 1.65v2.1h3.31v3.71h-3.31v10.73h-4.13V9.44zM8.54 19.82a7.87 7.87 0 0 1-3.36-.74V15.1c1.04.6 2.42 1.1 3.9 1.1 1.22 0 1.88-.37 1.88-.94 0-1.68-6.17-.96-6.17-5.82 0-2.93 2.33-4.77 5.8-4.77 1.04 0 2.56.18 3.52.5v3.94c-.98-.54-2.33-.9-3.52-.9-1.18 0-1.76.38-1.76.9 0 1.48 6.13.72 6.13 5.63 0 3.19-2.58 5.08-6.42 5.08z"/></svg> },
    ];

    // Scrolling Logo Marquee component (rendered outside the title box)
    const logoMarquee = (
      <div className="w-full flex flex-col items-center justify-center gap-4" style={{ height: '220px' }}>
        <p className="text-center text-white/60 text-sm font-medium tracking-wide uppercase">
          Trusted by 500+ teams who value user experience
        </p>
        <div className="w-full overflow-hidden py-8">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...logoItems, ...logoItems, ...logoItems, ...logoItems].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="mx-8 flex items-center text-white/40 hover:text-white/60 transition-colors flex-shrink-0"
                title={logo.name}
              >
                {logo.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const introContent = (
      <div className="relative mx-auto text-center text-white isolate flex flex-col items-center justify-center border border-white" style={{ width: '85vw', maxWidth: '1400px' }}>
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        >
          <div
            data-us-project="clh5ttrCGWQmiptJb8bS"
            className="[&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:object-cover"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="relative z-10 py-16 px-12 w-full">
          <h2 className={cn(SECTION_TITLE_CLASS, 'font-display text-center text-white drop-shadow-[0_20px_60px_rgba(4,0,12,0.6)]')}>
            {featuresTitle.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>
      </div>
    );

    if (landingShowcaseLayout) {
      return (
        <section
          className="relative overflow-hidden landing-sections-gradient py-24 sm:py-28"
          key="features-landing"
        >
          <div className="relative w-full flex flex-col items-center">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-b border-white z-0" />
            <div className="relative z-10">
              {introContent}
            </div>
            {logoMarquee}
          </div>
          <div className={buildSectionContentClass('relative overflow-visible')}>
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
