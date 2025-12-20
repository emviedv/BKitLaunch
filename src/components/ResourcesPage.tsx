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

type ResourceFeatureDetail = {
  title: string;
  description?: string;
  items?: string[];
  buttonText?: string;
  buttonLink?: string;
  mediaComponent?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  pill?: FeaturePill | null;
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

const buildFeatureDetails = (rawFeatures: FeatureLike[]): ResourceFeatureDetail[] => {
  return rawFeatures
    .map((item) => {
      const title = item.title || item.idea;
      if (!title) return null;
      if (shouldHideFeature(item)) return null;

      const rawButtonText = item.buttonText ?? item.buttonLabel;
      const rawButtonLink = item.buttonLink ?? item.buttonUrl;
      const buttonText = typeof rawButtonText === 'string' ? rawButtonText.trim() : '';
      const buttonLink = typeof rawButtonLink === 'string' ? rawButtonLink.trim() : '';
      const mediaSrc = typeof item.media?.src === 'string' ? item.media.src.trim() : '';
      const mediaAlt = typeof item.media?.alt === 'string' ? item.media.alt : undefined;
      const pill = resolveFeaturePill(item);

      const detail: ResourceFeatureDetail = {
        title,
        description: item.description || item.idea,
        items: Array.isArray(item.topItems) && item.topItems.length > 0
          ? item.topItems.slice(0, 3)
          : undefined,
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
    .filter(Boolean) as ResourceFeatureDetail[];
};

const matchesBiblioClean = (detail: ResourceFeatureDetail): boolean => {
  const titleMatch = detail.title.toLowerCase().includes('biblioclean');
  const linkMatch = (detail.buttonLink || '').toLowerCase().includes('biblio-clean');
  return titleMatch || linkMatch;
};

const ResourcesPage: React.FC = () => {
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

  const freeResourceDetails = useMemo(
    () => featureDetails.filter((detail) => matchesBiblioClean(detail)),
    [featureDetails]
  );

  const renderSectionIntro = (
    HeadingTag: 'h1' | 'h2',
    title: string,
    description: string
  ) => (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-center text-white">
      <HeadingTag className={`${SECTION_TITLE_CLASS} text-white`}>{title}</HeadingTag>
      <p className={`${SECTION_DESCRIPTION_CLASS} text-white/70`}>{description}</p>
    </div>
  );

  return (
    <div className="bg-[#0b0c0f] text-white">
      <ProductFeaturesSection
        details={freeResourceDetails}
        productTitle="BiblioClean"
        primaryButton={undefined}
        landingShowcaseLayout
        shouldAlternateFeatures={false}
        hideFeatureIllustrations={false}
        featuresTitle="Free resources"
        logoMarquee={null}
        introContent={renderSectionIntro(
          'h1',
          'Free resources for prototype cleanup.',
          'Start with BiblioClean to revoke risky prototype links fast so designers, developers, and marketers stay on the right build.'
        )}
        enableFeaturesNav={false}
        compactLayout={false}
      />

      <ProductFeaturesSection
        details={featureDetails}
        productTitle="BiblioKit"
        primaryButton={undefined}
        landingShowcaseLayout
        shouldAlternateFeatures={false}
        hideFeatureIllustrations={false}
        featuresTitle="All plugins"
        logoMarquee={null}
        introContent={renderSectionIntro(
          'h2',
          'All plugins in one place.',
          'Browse every BiblioKit plugin and pick the fastest fix for your file.'
        )}
        enableFeaturesNav={false}
        compactLayout={false}
      />
    </div>
  );
};

export default ResourcesPage;
