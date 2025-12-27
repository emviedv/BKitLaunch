import React, { useMemo } from 'react';

import { usePublishedContent } from '@/hooks/usePublishedContent';
import ProductFeaturesSection from './ProductFeaturesSection';
import { SECTION_DESCRIPTION_CLASS, SECTION_TITLE_CLASS } from './productContentSectionConstants';

type FeaturePill = {
  label: string;
  classes: string;
  dotClass: string;
};

type FeatureLike = {
  title?: string;
  description?: string;
  idea?: string;
  topItems?: string[];
  buttonText?: string;
  buttonLink?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  badge?: string;
  badgeColor?: string;
  category?: string;
  badges?: Array<{ label?: string; color?: string; type?: string }>;
  media?: {
    src?: string;
    alt?: string;
  };
};

type ProductFeatureDetail = {
  title: string;
  description?: string;
  items?: string[];
  buttonText?: string;
  buttonLink?: string;
  mediaComponent?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  pill?: FeaturePill | null;
  mediaLoading?: 'lazy' | 'eager';
};

const sanitizeCopy = (value?: string): string | undefined => {
  if (!value) return value;
  return value.replace(/\s*\u2014\s*/g, ', ').replace(/\s+/g, ' ').trim();
};

const sanitizeItems = (items?: string[]): string[] | undefined => {
  if (!Array.isArray(items)) return undefined;
  const sanitized = items
    .map((item) => sanitizeCopy(item))
    .filter(Boolean) as string[];
  return sanitized.length > 0 ? sanitized : undefined;
};

const shouldHideFeature = (item: FeatureLike): boolean => {
  const title = (item.title || item.idea || '').trim().toLowerCase();
  return title.startsWith('bibliokit blocks');
};

const resolveFeaturePill = (feature: FeatureLike): FeaturePill | null => {
  const rawLabel = (feature.category || feature.badge || feature.badges?.[0]?.label || '').trim();
  if (!rawLabel) return null;

  const normalized = rawLabel.toLowerCase();
  if (normalized.startsWith('launch')) {
    return {
      label: 'Launched',
      classes: 'bg-emerald-500/15 border-emerald-300/60 text-white shadow-[0_12px_40px_rgba(16,185,129,0.15)]',
      dotClass: 'bg-emerald-300',
    };
  }
  if (normalized.startsWith('coming')) {
    return {
      label: 'Coming Soon',
      classes: 'bg-amber-400/15 border-amber-200/60 text-white shadow-[0_12px_40px_rgba(251,191,36,0.18)]',
      dotClass: 'bg-amber-200',
    };
  }
  if (normalized.startsWith('beta')) {
    return {
      label: 'Beta',
      classes: 'bg-indigo-500/15 border-indigo-300/60 text-white shadow-[0_12px_40px_rgba(99,102,241,0.16)]',
      dotClass: 'bg-indigo-200',
    };
  }

  return {
    label: rawLabel,
    classes: 'bg-white/10 border-white/25 text-white/90',
    dotClass: 'bg-white/80',
  };
};

const buildFeatureDetails = (rawFeatures: FeatureLike[]): ProductFeatureDetail[] => {
  return rawFeatures
    .map((item) => {
      const title = sanitizeCopy(item.title || item.idea);
      if (!title) return null;
      if (shouldHideFeature(item)) return null;

      const rawButtonText = item.buttonText ?? item.buttonLabel;
      const rawButtonLink = item.buttonLink ?? item.buttonUrl;
      const buttonText = typeof rawButtonText === 'string' ? sanitizeCopy(rawButtonText) : '';
      const buttonLink = typeof rawButtonLink === 'string' ? rawButtonLink.trim() : '';
      const mediaSrc = typeof item.media?.src === 'string' ? item.media.src.trim() : '';
      const mediaAlt = typeof item.media?.alt === 'string' ? sanitizeCopy(item.media.alt) : undefined;
      const pill = resolveFeaturePill(item);

      const detail: ProductFeatureDetail = {
        title,
        description: sanitizeCopy(item.description || item.idea),
        items: sanitizeItems(item.topItems),
        buttonText: buttonText || undefined,
        buttonLink: buttonLink || undefined,
        pill,
      };

      if (mediaSrc) {
        Object.assign(detail, {
          mediaComponent: 'image',
          mediaUrl: mediaSrc,
          mediaAlt: mediaAlt || `${title} preview`,
        });
      }

      return detail;
    })
    .filter(Boolean) as ProductFeatureDetail[];
};

const ProductsPage: React.FC = () => {
  const { content } = usePublishedContent();

  const rawFeatures: FeatureLike[] = useMemo(() => {
    const features = content?.features;
    if (Array.isArray(features)) {
      return features;
    }
    if (features && Array.isArray((features as any)?.items)) {
      return (features as any).items;
    }
    return [];
  }, [content?.features]);

  const featureDetails = useMemo(() => buildFeatureDetails(rawFeatures), [rawFeatures]);

  const prioritizedDetails = useMemo(
    () =>
      featureDetails.map((detail, index) => {
        if (index !== 0 || !detail.mediaUrl) return detail;
        return { ...detail, mediaLoading: 'eager' };
      }),
    [featureDetails]
  );

  const renderSectionIntro = () => (
    <div className="products-page-intro mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-center text-white">
      <h1 className={`${SECTION_TITLE_CLASS} products-page-title text-white`}>
        All BiblioKit products
      </h1>
      <p className={`${SECTION_DESCRIPTION_CLASS} products-page-description text-white/70`}>
        Pick the plugin that cuts the manual grind out of your Figma file. We've built this suite
        for designers, developers, and marketers fighting messy workflows, tangled systems, and
        handoff confusion so teams stay aligned from wireframes to polished products.
      </p>
    </div>
  );

  return (
    <div className="products-page bg-[#0b0c0f] text-white">
      <ProductFeaturesSection
        details={prioritizedDetails}
        productTitle="BiblioKit"
        primaryButton={undefined}
        landingShowcaseLayout
        shouldAlternateFeatures={false}
        hideFeatureIllustrations={false}
        featuresTitle="All products"
        logoMarquee={null}
        introContent={renderSectionIntro()}
        enableFeaturesNav={false}
        compactLayout={false}
        sectionId="products-page-list"
      />
    </div>
  );
};

export default ProductsPage;
