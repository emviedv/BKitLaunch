import React, { useEffect } from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';
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

  const FEATURES_TITLE_ACCENT_REGEX = /(\breal\s+products\b)/i;

  const renderFeaturesTitleLine = (line: string, keyPrefix: string) => {
    if (!FEATURES_TITLE_ACCENT_REGEX.test(line)) {
      return line;
    }

    return line.split(FEATURES_TITLE_ACCENT_REGEX).map((part, index) => {
      if (!FEATURES_TITLE_ACCENT_REGEX.test(part)) {
        return (
          <React.Fragment key={`${keyPrefix}-text-${index}`}>
            {part}
          </React.Fragment>
        );
      }

      return (
        <span key={`${keyPrefix}-accent-${index}`} className="product-features-title-accent">
          {part}
        </span>
      );
    });
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

  // Initialize Unicorn Studio after component mounts (once only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as any;
    if (win.__US_INITIALIZED__) return;

    const initUS = () => {
      const US = win.UnicornStudio;
      if (US?.init && !win.__US_INITIALIZED__) {
        win.__US_INITIALIZED__ = true;
        US.init();
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initUS, 100);
    return () => clearTimeout(timer);
  }, []);
  const landingShowcaseLayout = Boolean(enableFeaturesNav && compactLayout);
  const hideFeatureIllustrations = false; // keep product feature sections paired with visuals and placeholders

  const faqProductName = (product as any)?.title || (product as any)?.name;

  const renderFeaturesSection = () => {
    if (!hasDetails || product?.visibility?.features === false) {
      return null;
    }

    // Logo data for scrolling marquee - using official wordmark SVG paths
    const logoItems = [
      { name: 'Spotify', svg: <svg className="h-10 w-auto" viewBox="0 0 512 160" fill="currentColor"><path d="M79.655 0C35.664 0 0 35.663 0 79.654c0 43.993 35.664 79.307 79.655 79.307 43.996 0 79.656-35.314 79.656-79.307C159.311 35.666 123.651.004 79.654.004L79.655 0zm36.53 114.884c-1.427 2.34-4.49 3.082-6.83 1.645-18.702-11.424-42.246-14.011-69.973-7.676-2.672.609-5.336-1.064-5.944-3.737-.609-2.673 1.057-5.337 3.73-5.946 30.343-6.933 56.37-3.948 77.367 8.884 2.34 1.436 3.082 4.56 1.645 6.83h.005zm9.75-21.689c-1.799 2.922-5.622 3.862-8.539 2.064-21.41-13.166-54.049-16.972-79.374-9.284-3.284.997-6.756-1.155-7.047-4.57-.29-3.414 1.707-5.807 4.991-6.804 28.906-8.79 64.839-4.535 89.487 10.596 2.921 1.798 3.862 5.622 2.064 8.538l.418-.54zm.836-22.585C101.1 55.362 58.742 53.96 34.231 61.4c-3.936 1.194-8.098-1.028-9.291-4.964-1.194-3.936 1.028-8.098 4.964-9.291 28.138-8.528 74.876-6.875 104.432 9.656 3.54 2.099 4.703 6.676 2.604 10.216-2.099 3.54-6.676 4.703-10.215 2.604l-.004-.011zm100.53 12.437c-14.134-3.37-16.645-5.733-16.645-10.69 0-4.69 4.42-7.846 10.991-7.846 6.376 0 12.704 2.402 19.353 7.345.193.145.44.203.679.165.247-.036.456-.168.599-.37l7.028-9.87c.276-.39.2-.927-.171-1.225-7.676-5.946-16.315-8.839-26.417-8.839-14.848 0-25.225 8.912-25.225 21.663 0 14.362 9.263 19.203 25.048 22.94 13.374 3.036 15.6 5.59 15.6 10.133 0 5.17-4.63 8.385-12.084 8.385-8.273 0-15.029-2.79-22.556-9.31-.18-.162-.427-.229-.654-.22-.247.019-.466.131-.618.312l-7.82 9.492c-.316.38-.278.932.084 1.255 8.74 7.768 19.512 11.874 31.117 11.874 16.232 0 26.684-8.76 26.684-22.352 0-12.037-7.187-18.313-24.993-22.842zm56.086-12.95c-6.934 0-12.627 2.732-17.326 8.33v-6.3c0-.497-.4-.902-.894-.902h-12.318c-.497 0-.894.405-.894.902v70.008c0 .497.397.909.894.909h12.318c.494 0 .894-.412.894-.909v-22.096c4.699 5.26 10.392 7.838 17.326 7.838 12.889 0 25.939-9.92 25.939-28.886 0-18.969-13.069-28.893-25.939-28.893zm11.225 28.886c0 9.653-5.943 16.397-14.466 16.397-8.418 0-14.772-7.053-14.772-16.397 0-9.347 6.354-16.396 14.772-16.396 8.38 0 14.466 6.893 14.466 16.396zm57.826-28.886c-16.598 0-29.601 12.78-29.601 29.099 0 16.143 12.918 28.784 29.401 28.784 16.655 0 29.696-12.736 29.696-28.991 0-16.2-12.946-28.891-29.496-28.891zm0 45.385c-8.827 0-15.485-7.096-15.485-16.498 0-9.444 6.43-16.298 15.285-16.298 8.884 0 15.58 7.093 15.58 16.505 0 9.442-6.468 16.29-15.38 16.29zm64.937-44.26h-13.555V47.24c0-.497-.4-.898-.894-.898h-12.318c-.494 0-.894.401-.894.898v13.855h-6.016c-.494 0-.894.404-.894.897v10.584c0 .497.4.902.894.902h6.016v27.39c0 11.062 5.507 16.674 16.379 16.674 4.414 0 8.076-.912 11.529-2.873.283-.157.454-.46.454-.783v-10.082c0-.307-.163-.604-.429-.766-.266-.171-.597-.181-.872-.038-2.368 1.189-4.66 1.74-7.228 1.74-3.947 0-5.717-1.798-5.717-5.812V73.478h13.554c.494 0 .895-.405.895-.902v-10.59c.019-.493-.382-.897-.904-.897zm47.217.107v-1.702c0-4.985 1.921-7.238 6.22-7.238 2.568 0 4.633.51 6.944 1.269.285.089.58.044.808-.114.238-.17.371-.443.371-.737v-10.38c0-.396-.247-.755-.637-.874-2.435-.728-5.556-1.455-10.235-1.455-11.367 0-17.388 6.405-17.388 18.517v2.605h-6.017c-.494 0-.902.406-.902.899v10.64c0 .496.408.901.902.901h6.017v42.277c0 .496.4.904.894.904h12.309c.504 0 .904-.408.904-.904V73.478h11.502l17.616 42.252c-2 4.434-3.969 5.318-6.652 5.318-2.168 0-4.461-.647-6.79-1.93-.211-.116-.476-.154-.713-.095-.247.086-.447.26-.551.489l-4.177 9.092c-.2.438-.028 1.135.409 1.36 4.357 2.374 8.284 3.38 13.145 3.38 9.093 0 14.125-4.241 18.548-15.637l21.363-55.2c.114-.277.076-.599-.104-.837-.162-.256-.437-.461-.731-.461H484.2c-.39 0-.745.264-.848.646L470.057 99.27l-13.296-37.529c-.114-.371-.459-.647-.854-.647h-20.031v-.005zm-29.891.006h-12.318c-.494 0-.894.404-.894.897v53.724c0 .496.4.904.894.904h12.318c.504 0 .894-.408.894-.904V62.0c0-.493-.39-.897-.894-.897zm-6.088-24.463c-4.88 0-8.837 3.949-8.837 8.828 0 4.88 3.957 8.835 8.837 8.835 4.88 0 8.827-3.955 8.827-8.835 0-4.879-3.947-8.828-8.827-8.828z"/></svg> },
      { name: 'Figma', svg: <svg className="h-8 w-auto" viewBox="0 0 256 384" fill="currentColor"><path d="M64 384c35.328 0 64-28.672 64-64v-64H64c-35.328 0-64 28.672-64 64s28.672 64 64 64z"/><path d="M0 192c0-35.328 28.672-64 64-64h64v128H64c-35.328 0-64-28.672-64-64z"/><path d="M0 64C0 28.672 28.672 0 64 0h64v128H64C28.672 128 0 99.328 0 64z"/><path d="M128 0h64c35.328 0 64 28.672 64 64s-28.672 64-64 64h-64V0z"/><path d="M256 192c0 35.328-28.672 64-64 64s-64-28.672-64-64 28.672-64 64-64 64 28.672 64 64z"/></svg> },
      { name: 'Slack', svg: <svg className="h-9 w-auto" viewBox="0 0 512 130" fill="currentColor"><path d="M163.593 101.885L169.98 87.05c6.902 5.151 16.07 7.83 25.137 7.83 6.696 0 10.92-2.576 10.92-6.49-.103-10.92-40.075-2.372-40.384-29.775-.103-13.907 12.26-24.621 29.773-24.621 10.405 0 20.81 2.575 28.227 8.448l-6.013 15.144c-6.799-4.34-15.25-7.327-23.286-7.327-5.46 0-9.166 2.575-9.166 5.872.103 10.714 40.384 4.842 40.694 30.29 0 14.114-11.96 24.311-29.473 24.311-12.671 0-23.938-2.987-32.798-9.374l-.003-.003-.608.527zm245.08-20.192l17.593 9.787c-6.593 11.847-18.578 19.78-33.104 19.78-21.325 0-38.632-17.307-38.632-38.632s17.307-38.632 38.632-38.632c14.422 0 27.063 7.932 33.693 19.675l-17.593 9.787c-3.194-5.563-9.169-9.375-16.071-9.375-10.199 0-18.44 8.241-18.44 18.44 0 10.199 8.241 18.44 18.44 18.44 6.902 0 12.877-3.708 16.071-9.375l-.589.105zM234.984 1.957h22.046v107.86h-22.046V1.957zm200.958 0h22.046v63.356l24.93-29.772h27.07L479.984 71.39l32.034 38.426h-27.984l-26.046-32.348v32.348h-22.046V1.957zm-113.393 79.942V63.665c-3.193-5.357-9.786-9.478-17.204-9.478-10.199 0-18.44 8.241-18.44 18.44 0 10.199 8.241 18.44 18.44 18.44 7.418 0 14.011-4.225 17.204-9.168zm0-46.358h22.046v74.176h-22.046v-8.757c-3.606 6.078-12.569 10.302-21.943 10.302-19.367 0-34.614-17.307-34.614-38.735 0-21.428 15.247-38.632 34.614-38.632 9.374 0 18.337 4.224 21.943 10.302v-8.656z"/></svg> },
      { name: 'Notion', svg: <svg className="h-9 w-auto" viewBox="0 0 512 178" fill="currentColor"><path d="M10.691 7.666l98.321-7.263c12.077-1.036 15.181-.467 22.774 5.053l30.609 21.547c5.177 3.803 6.9 4.839 6.9 8.98v121.261c0 7.599-2.76 12.124-12.403 12.81l-113.256 6.914c-7.25.343-10.704-.693-14.54-5.416L7.188 147.147c-4.149-5.417-5.866-9.747-5.866-14.514V16.85c0-6.244 2.76-11.161 9.369-11.684v2.5zm95.262 9.166c-9.12.614-11.19.753-16.34-3.462l-16.073-12.36c-1.337-1.357-.67-3.047 2.697-3.385l92.321-6.755c7.76-.678 11.803 2.03 14.86 4.393l15.848 11.483c.678.343 2.359 2.364.335 2.364l-95.42 5.746-1.182.082 2.954-2.106zM45.112 153.405V52.984c0-4.4 1.35-6.43 5.389-6.77l104.29-6.357c3.72-.336 5.402 2.03 5.402 6.423v99.907c0 4.4-.678 8.117-6.744 8.453l-104.896 6.082c-6.07.336-8.764-1.688-8.764-7.317h.323zm103.61-95.248c.672 3.041 0 6.082-3.04 6.43l-5.054 1.002v74.27c-4.393 2.367-8.435 3.712-11.805 3.712-5.394 0-6.744-1.69-10.787-6.754l-33.048-51.98v50.29l10.453 2.367s0 6.082-8.435 6.082L63.74 145c-.678-1.354 0-4.73 2.358-5.398l6.075-1.685V73.155l-9.03-1.827c-.678-3.04 1.01-7.423 5.735-7.765l24.947-1.68L128.22 114.16V67.378l-8.77-1.007c-.678-3.952 2.02-6.424 5.39-6.752l23.302-1.355-.42-.108zM245.413 125.87V79.02h.811l33.784 46.851h10.646V57.022h-11.869v46.803h-.812l-33.783-46.803h-10.67v68.848h11.893zm78.663 1.054c15.607 0 25.101-10.24 25.101-27.18 0-16.986-9.543-27.178-25.1-27.178-15.607 0-25.1 10.192-25.1 27.179 0 16.939 9.444 27.179 25.1 27.179zm0-10.07c-8.282 0-12.755-6.344-12.755-17.11 0-10.766 4.424-17.155 12.756-17.155 8.283 0 12.756 6.343 12.756 17.156 0 10.812-4.522 17.109-12.756 17.109zm31.614-55.76v12.914h-8.235v9.51h8.235v38.446c0 11.013 4.774 15.07 16.75 15.07 2.286 0 4.573-.238 6.67-.599v-9.752c-1.377.143-2.28.238-3.946.238-4.956 0-7.003-2.238-7.003-7.292V83.518h11.19v-9.51h-11.19V61.094h-12.471zm45.018 64.776V73.67h-11.786v52.199h11.786zm-5.909-59.397c3.91 0 7.102-3.157 7.102-7.052 0-3.91-3.193-7.067-7.102-7.067-3.862 0-7.055 3.157-7.055 7.067 0 3.895 3.193 7.052 7.055 7.052zm33.795 60.452c15.608 0 25.101-10.241 25.101-27.18 0-16.986-9.542-27.178-25.1-27.178-15.608 0-25.101 10.192-25.101 27.179 0 16.939 9.445 27.179 25.1 27.179zm0-10.07c-8.283 0-12.756-6.344-12.756-17.11 0-10.766 4.424-17.155 12.756-17.155 8.283 0 12.756 6.343 12.756 17.156 0 10.812-4.522 17.109-12.756 17.109zm35.985-42.185h11.834v5.679c3.48-4.102 8.979-6.829 15.507-6.829 12.363 0 19.177 8.11 19.177 20.641v31.91H499.31v-30.285c0-8.152-3.766-12.397-11.164-12.397-7.054 0-11.957 5.044-11.957 12.921v29.761h-11.786V74.67h.107z"/></svg> },
      { name: 'Linear', svg: <svg className="h-8 w-auto" viewBox="0 0 256 256" fill="currentColor"><path d="M8.174 102.613L153.387 247.826c2.12 2.12.098 5.72-2.849 6.27-4.914.918-9.926 1.556-15.02 1.896-1.088.072-2.15-.338-2.921-1.109L1.117 122.403c-.771-.771-1.18-1.833-1.109-2.921.34-5.094.978-10.106 1.896-15.02.55-2.946 4.15-3.969 6.27-1.849zM4.082 161.41c-.969-3.614 3.3-5.894 5.946-3.249l87.811 87.811c2.646 2.646.366 6.915-3.248 5.946C50.56 240.113 15.887 205.44 4.082 161.41zM16.809 64.164c1.233-2.136 4.147-2.463 5.89-.72l169.855 169.856c1.744 1.744 1.416 4.658-.72 5.891a127.62 127.62 0 0 1-11.09 6.295c-1.432.65-3.11.322-4.221-.789L11.893 79.485c-1.11-1.111-1.438-2.789-.789-4.221a127.85 127.85 0 0 1 5.705-11.1zM127.86 0c70.77 0 128.14 57.37 128.14 128.14 0 37.57-16.168 71.363-41.93 94.801-1.486 1.353-3.768 1.263-5.19-.158L33.217 47.116c-1.42-1.421-1.512-3.703-.158-5.19C56.497 16.168 90.29 0 127.86 0z"/></svg> },
      { name: 'Vercel', svg: <svg className="h-8 w-auto" viewBox="0 0 512 116" fill="currentColor"><path d="M255.42 28.976c-19.993 0-34.408 13.039-34.408 32.597 0 19.558 16.226 32.597 36.22 32.597 12.079 0 22.728-4.78 29.32-12.84l-13.854-8.004c-3.658 4.002-9.218 6.339-15.466 6.339-8.674 0-16.045-4.528-18.78-11.771h50.744c.398-2.128.634-4.23.634-6.439 0-19.558-14.416-32.479-34.41-32.479zm-17.132 26.259c2.264-7.226 8.458-11.772 17.114-11.772 8.675 0 14.868 4.546 17.114 11.772h-34.228zm195.014 0c2.264-7.226 8.457-11.772 17.113-11.772 8.675 0 14.868 4.546 17.115 11.772h-34.228zm17.132-26.259c-19.993 0-34.408 13.039-34.408 32.597 0 19.558 16.226 32.597 36.219 32.597 12.079 0 22.728-4.78 29.32-12.84l-13.853-8.004c-3.658 4.002-9.219 6.339-15.466 6.339-8.675 0-16.045-4.528-18.78-11.771h50.743c.399-2.128.635-4.23.635-6.439 0-19.558-14.417-32.479-34.41-32.479zm-88.303 32.597c0 10.866 7.099 18.11 18.11 18.11 7.46 0 13.056-3.382 16.067-8.8l13.908 8.023c-5.759 9.598-16.552 15.375-29.845 15.375-20.011 0-34.538-17.307-34.538-38.632 0-21.428 14.421-38.632 34.408-38.632 13.293 0 24.086 5.777 29.845 15.375l-13.908 8.023c-3.011-5.418-8.607-8.8-16.067-8.8-11.011 0-17.98 8.241-17.98 18.11v5.848zm-57.137-13.614c-7.418 0-14.01 4.12-17.204 9.477v18.234c3.193 4.943 9.786 9.168 17.204 9.168 10.199 0 18.44-8.241 18.44-18.44s-8.241-18.44-18.44-18.44zm0-14.188c13.293 0 25.085 8.977 25.94 28.893 0 18.966-13.051 28.887-25.94 28.887-9.374 0-18.337-4.224-21.943-10.302v8.757h-22.046V1.957h22.046v32.348c3.606-6.078 12.569-10.302 21.943-10.302v3.962zm-130.003-3.85l18.053 46.851h.192L211.29 30.12h20.012l-28.053 62.046c-5.777 12.746-14.225 24.328-29.845 24.328-4.861 0-8.788-1.006-13.145-3.38-.437-.225-.609-.922-.41-1.36l4.178-9.092c.104-.229.304-.403.55-.489.238-.059.503-.02.714.095 2.33 1.283 4.622 1.93 6.79 1.93 2.683 0 4.652-.884 6.652-5.318l-21.363-55.169c-.113-.276-.075-.598.104-.836.163-.256.438-.461.732-.461H189.41c.395 0 .74.276.855.647l13.295 37.529 13.296-37.529c.103-.382.458-.647.848-.647h12.366c.294 0 .57.205.731.46.18.239.218.56.104.838l-21.363 55.2c-4.423 11.396-9.455 15.637-18.548 15.637-4.86 0-8.788-1.006-13.145-3.38-.437-.225-.609-.922-.41-1.36l4.178-9.092c.104-.229.304-.403.551-.489.237-.059.502-.02.713.095 2.33 1.283 4.622 1.93 6.79 1.93 2.684 0 4.653-.884 6.653-5.318l-21.364-55.169c-.114-.276-.076-.598.104-.836.162-.256.437-.461.731-.461h12.085c.395 0 .74.276.854.647l13.296 37.529 13.295-37.529c.104-.382.459-.647.849-.647h6.859V1.957H434.942v64.4l24.93-29.772h27.071l-30.004 35.849 32.034 38.426h-27.984l-26.046-32.348v32.348h-22.046V1.957h22.046v63.356l24.93-29.772h27.07l-30.003 35.849L512 109.816h-27.984l-26.047-32.348v32.348h-22.046V1.957h22.046v63.356l24.93-29.772h27.071l-30.004 35.849L512 109.816h-27.984zM66.916 0L133.83 115.903H0L66.916 0z"/></svg> },
      { name: 'GitHub', svg: <svg className="h-9 w-auto" viewBox="0 0 512 139" fill="currentColor"><path d="M98.696 59.312H55.635c-1.11 0-2.012.902-2.012 2.013v21.054c0 1.111.901 2.014 2.012 2.014h16.798v26.156s-3.772 1.286-14.2 1.286c-12.302 0-29.49-4.495-29.49-42.292 0-37.805 17.866-42.773 34.667-42.773 14.544 0 20.81 2.56 24.806 3.794 1.253.388 2.41-.862 2.41-1.974l4.754-20.342c0-.476-.158-.98-.706-1.37-1.618-1.153-11.502-6.602-36.52-6.602C27.22 0 0 12.23 0 71.023c0 58.795 31.495 67.556 58.052 67.556 21.995 0 35.328-9.397 35.328-9.397.546-.306.607-.861.607-1.145V61.326c0-1.11-.907-2.014-2.011-2.014h-7.28zm221.799-52.046c0-1.12-.91-2.024-2.016-2.024h-23.745c-1.104 0-2.013.903-2.013 2.024.001.006.025 46.257.025 46.257h-38.362V7.267c0-1.12-.905-2.024-2.016-2.024h-23.757c-1.111 0-2.01.903-2.01 2.024v126.779c0 1.119.899 2.03 2.01 2.03h23.757c1.11 0 2.016-.911 2.016-2.03V79.87h38.362s-.066 54.17-.066 54.176c0 1.119.904 2.03 2.013 2.03H318.468c1.11 0 2.016-.911 2.027-2.03V7.267zm-176.07 16.965c0-9.072-7.3-16.42-16.305-16.42-9 0-16.305 7.348-16.305 16.42 0 9.068 7.305 16.442 16.305 16.442 9.006 0 16.305-7.374 16.305-16.442zm-1.923 83.302V46.876c0-.498-.4-.91-.894-.91h-23.541c-1.104 0-2.097 1.157-2.097 2.27v82.08c0 2.46 1.532 3.193 3.52 3.193h21.77c2.387 0 3.242-1.163 3.242-3.237V107.534zM413.162 46.95h-23.575c-1.106 0-2.013.904-2.013 2.02v64.19s-6.112 4.472-14.787 4.472c-8.675 0-10.977-3.936-10.977-12.431V48.97c0-1.116-.903-2.02-2.013-2.02h-23.958c-1.103 0-2.013.904-2.013 2.02v58.364c0 16.863 9.401 20.987 22.335 20.987 10.61 0 19.165-5.858 19.165-5.858s.406 3.087.595 3.454c.19.366.626.735 1.134.735l14.6-.055c1.103 0 2.013-.904 2.013-2.011l-.514-77.635c0-1.116-.895-2.02-2.007-2.02l.015-.011zm54.17 68.756c-8.348-.253-13.98-4.041-13.98-4.041V71.488c0 0 5.585-3.423 12.437-4.036 8.664-.773 17.012 1.844 17.012 22.514 0 21.794-3.771 26.088-15.469 25.74zm9.49-71.524c-13.682 0-22.993 6.097-22.993 6.097V7.36c0-1.12-.9-2.024-2.013-2.024h-23.97c-1.104 0-2.007.903-2.007 2.024v126.768c0 1.12.903 2.03 2.015 2.03l16.533-.015c.759 0 1.17-.388 1.362-.945.187-.542.543-4.644.543-4.644s9.943 7.56 28.764 7.56c22.093 0 34.773-11.207 34.773-50.316 0-39.116-19.728-45.617-32.998-45.617h-.01zM212.23 46.731h-18.212s-.02-22.047-.02-22.756c0-.826-.428-1.239-1.38-1.239h-24.416c-.854 0-1.322.368-1.322 1.229v24.086s-12.393 2.99-13.232 3.233c-.833.24-1.446 1.008-1.446 1.91v13.673c0 1.12.905 2.027 2.013 2.027h12.666v34.373c0 25.544 17.931 28.048 30.026 28.048 5.528 0 12.146-1.775 13.236-2.179.656-.247.98-.866.98-1.56l.017-15.067c0-1.12-.957-2.027-2.012-2.027-.923 0-3.289.376-5.726.376-7.793 0-10.431-3.625-10.431-8.316V69.16h18.26c1.112 0 2.014-.908 2.014-2.028V48.76c0-1.119-.902-2.029-2.013-2.029h-.002z"/></svg> },
      { name: 'Stripe', svg: <svg className="h-9 w-auto" viewBox="0 0 512 214" fill="currentColor"><path d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138-33.85 0-54.33 28.73-54.33 64.854 0 42.808 24.179 64.426 58.88 64.426 16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823-13.796 0-26.027-4.836-27.592-21.618h69.504c0-1.85.285-9.244.285-12.658h.043zm-70.258-13.511c0-16.082 9.814-22.773 18.773-22.773 8.676 0 17.92 6.69 17.92 22.773h-36.693zM351.43 44.942c-13.937 0-22.897 6.547-27.876 11.112l-1.849-8.837h-29.737v168.091l33.757-7.158.142-40.78c5.12 3.696 12.667 8.979 25.18 8.979 25.458 0 48.643-20.48 48.643-65.61-.142-41.283-23.612-65.797-48.26-65.797zm-8.485 101.167c-8.391 0-13.369-2.987-16.787-6.69l-.143-52.81c3.702-4.126 8.822-6.972 16.93-6.972 12.942 0 21.902 14.534 21.902 33.094 0 19.058-8.818 33.378-21.902 33.378zM241.494 36.551l33.898-7.252V0l-33.898 7.538v29.013zm0 10.809h33.898v124.444h-33.898V47.36zm-36.238 10.524l-2.133-10.524h-29.292v124.444h33.756V88.466c7.964-10.382 21.456-8.533 25.644-6.97V47.36c-4.33-1.635-20.196-4.622-27.975 10.524zm-67.994-31.39l-32.976 7.015-.142 113.93c0 21.05 15.786 36.584 36.835 36.584 11.648 0 20.196-2.133 24.892-4.693V152.3c-4.55 1.848-27.023 8.39-27.023-12.658V77.653h27.023V47.36h-27.023l-1.586-20.866zM35.982 83.484c0-5.973 4.92-8.248 13.084-8.248 11.695 0 26.464 3.555 38.16 9.893V52.293c-12.8-5.074-25.457-7.065-38.16-7.065C19.2 45.228 0 60.303 0 85.191c0 38.54 53.044 32.38 53.044 48.996 0 7.065-6.147 9.34-14.738 9.34-12.751 0-29.11-5.217-42.003-12.282v33.094c14.311 6.162 28.764 8.818 42.003 8.818 30.375 0 51.271-15.02 51.271-40.406-.142-41.568-53.329-34.219-53.329-49.851l-.266.584z"/></svg> },
    ];

    const marqueeItems = [...logoItems, ...logoItems];

    const introContent = (
      <div className="relative mx-auto text-center text-white isolate flex flex-col items-center justify-center" style={{ width: '85vw', maxWidth: '1400px' }}>
        <div
          className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-px -translate-y-1/2 bg-white/70 opacity-80"
          aria-hidden="true"
        />
        <div className="relative z-20 py-11 px-12 w-full text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Icon key={i} icon="solar:star-linear" className="w-6 h-6 text-yellow-400" />
            ))}
          </div>
          <h2 className={cn(SECTION_TITLE_CLASS, 'font-display text-center text-white drop-shadow-[0_20px_60px_rgba(4,0,12,0.6)]')}>
            {featuresTitle.split('\n').map((line, i, arr) => (
              <span key={i}>
                {renderFeaturesTitleLine(line, `features-title-${i}`)}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          {featuresDescription && (
            <p className={cn(SECTION_DESCRIPTION_CLASS, 'mt-4 max-w-3xl text-white/70 mx-auto')}>
              {featuresDescription}
            </p>
          )}
          {featuresDescription && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-base font-medium text-white/60">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#6580E1]" />
                Data stays in Figma
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#6580E1]" />
                Results in seconds
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#6580E1]" />
                No signup required
              </span>
            </div>
          )}
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
