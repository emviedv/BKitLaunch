import React, { useCallback, useEffect, useMemo } from 'react';

import LandingHero from './LandingHero';
import ProductContentSections from './ProductContentSections';
import Waitlist from './Waitlist';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { debugService } from '@/lib/debugService';
import { Button } from '@/components/ui/button';

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
  icon?: string;
  statValue?: string;
  statLabel?: string;
};

type ProductVisibility = {
  faqs?: boolean;
  waitlist?: boolean;
  [key: string]: boolean | undefined;
};

const heroDiagnosticsEnabled = () => {
  if (typeof process !== 'undefined') {
    const envValue = process.env?.DEBUG_LANDING_HERO ?? process.env?.DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  if (typeof import.meta !== 'undefined') {
    const envValue = (import.meta as any)?.env?.VITE_DEBUG_LANDING_HERO ?? (import.meta as any)?.env?.VITE_DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  return false;
};

const BiblioKitLanding: React.FC = () => {
  const { content } = usePublishedContent();

  const hero = content?.hero ?? {};
  const heroVisible = content?.settings?.visibility?.hero !== false;
  const productVisible = content?.settings?.visibility?.product !== false;

  const baseProduct = (productVisible && content?.product) ? content.product : {};

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

  const shouldHideFeature = (item: FeatureLike): boolean => {
    const title = (item.title || item.idea || '').trim().toLowerCase();
    return title.startsWith('bibliokit blocks');
  };

  const resolveFeaturePill = useCallback((feature: FeatureLike): FeaturePill | null => {
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
  }, []);

  type LandingFeatureDetail = {
    title: string;
    description?: string;
    items?: string[];
    buttonText?: string;
    buttonLink?: string;
    mediaComponent?: string;
    mediaUrl?: string;
    mediaAlt?: string;
    pill?: FeaturePill | null;
    icon?: string;
    statValue?: string;
    statLabel?: string;
  };

  const featureDetails = useMemo<LandingFeatureDetail[]>(() => {
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

        const detail = {
          title,
          description: item.description || item.idea,
          items: Array.isArray(item.topItems) && item.topItems.length > 0
            ? item.topItems.slice(0, 3)
            : undefined,
          buttonText: buttonText || undefined,
          buttonLink: buttonLink || undefined,
          pill,
          icon: item.icon,
          statValue: item.statValue,
          statLabel: item.statLabel,
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
      .filter(Boolean) as LandingFeatureDetail[];
  }, [rawFeatures, shouldHideFeature, resolveFeaturePill]);

  const faqs = useMemo(() => {
    if (Array.isArray((baseProduct as any)?.faqs)) {
      return (baseProduct as any).faqs;
    }
    if (Array.isArray((content as any)?.faqs)) {
      return (content as any).faqs;
    }
    return [];
  }, [baseProduct, content]);

  const mergedProduct = useMemo(() => {
    const visibility: ProductVisibility = {
      ...(baseProduct?.visibility ?? {}),
      faqs: faqs.length > 0 ? baseProduct?.visibility?.faqs !== false : false,
      benefits: false,
      waitlist: false,
    };

    const merged = {
      ...baseProduct,
      title: heroVisible ? (hero.title ?? baseProduct?.title ?? 'BiblioKit') : (baseProduct?.title ?? 'BiblioKit'),
      subtitle: heroVisible ? (hero.subtitle ?? baseProduct?.subtitle) : baseProduct?.subtitle,
      badgeLabel: heroVisible ? (hero.badgeLabel ?? baseProduct?.badgeLabel) : baseProduct?.badgeLabel,
      description: heroVisible ? (hero.description ?? baseProduct?.description) : baseProduct?.description,
      primaryButton: heroVisible ? (hero.primaryButton ?? baseProduct?.primaryButton) : baseProduct?.primaryButton,
      primaryButtonLink: heroVisible ? (hero.primaryButtonLink ?? baseProduct?.primaryButtonLink) : baseProduct?.primaryButtonLink,
      secondaryButton: heroVisible ? (hero.secondaryButton ?? baseProduct?.secondaryButton) : baseProduct?.secondaryButton,
      secondaryButtonLink: heroVisible ? (hero.secondaryButtonLink ?? baseProduct?.secondaryButtonLink) : baseProduct?.secondaryButtonLink,
      visibility,
    };

    if (heroDiagnosticsEnabled()) {
      debugService.debug('hero:bibliokit-merged-product', {
        timestamp: new Date().toISOString(),
        heroVisible,
        baseProductTitle: (baseProduct as any)?.title,
        mergedTitle: merged.title,
        mergedSubtitle: merged.subtitle,
        mergedBadge: merged.badgeLabel,
        mergedDescriptionLength: merged.description?.length ?? 0,
        heroButtons: {
          primary: merged.primaryButton,
          primaryLink: merged.primaryButtonLink,
          secondary: merged.secondaryButton,
          secondaryLink: merged.secondaryButtonLink,
        },
        clearedCallouts: heroVisible,
        heroKeys: Object.keys(hero ?? {}),
        baseProductKeys: Object.keys(baseProduct ?? {}),
      });
    }

    if (heroVisible) {
      return {
        ...merged,
        callouts: [],
        benefits: [],
        emoji: undefined,
        icon: undefined,
      };
    }

    return merged;
  }, [baseProduct, hero, heroVisible, faqs.length]);

  const shouldRenderHero = Boolean(mergedProduct?.title);
  const shouldRenderSections =
    Boolean(featureDetails.length) ||
    Boolean(Array.isArray((mergedProduct as any)?.details) && (mergedProduct as any).details.length) ||
    Boolean(Array.isArray((mergedProduct as any)?.benefits) && (mergedProduct as any).benefits.length) ||
    Boolean(Array.isArray((mergedProduct as any)?.specifications) && (mergedProduct as any).specifications.length);

  useEffect(() => {
    if (!heroDiagnosticsEnabled()) {
      return;
    }

    debugService.debug('hero:bibliokit-render-snapshot', {
      timestamp: new Date().toISOString(),
      heroTitle: hero?.title,
      heroSubtitle: hero?.subtitle,
      heroDescriptionLength: hero?.description?.length ?? 0,
      heroVisibleSetting: heroVisible,
      productVisibleSetting: productVisible,
      hasBaseProduct: Boolean(baseProduct && Object.keys(baseProduct).length > 0),
      mergedTitle: mergedProduct?.title,
      shouldRenderHero,
      shouldRenderSections,
      featureCount: featureDetails.length,
    });
  }, [baseProduct, featureDetails, hero, heroVisible, mergedProduct, productVisible, shouldRenderHero, shouldRenderSections]);

  if (!shouldRenderHero && !shouldRenderSections) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Content is missing</h1>
        <p className="text-muted-foreground">The content for this page is not available. Please check the configuration.</p>
      </div>
    );
  }

  return (
    <>
      {shouldRenderHero && (
        <LandingHero hero={mergedProduct as any} descriptionMaxWidthClassName="max-w-[90%]" disableCursorEffects />
      )}
      {shouldRenderSections && (
        <div className="relative isolate overflow-hidden">
          <div className="landing-hero-gradient__layer" aria-hidden="true" />
          <div className="landing-hero-column-lines" aria-hidden="true" />
          <div className="landing-hero-noise" aria-hidden="true" />
          <div className="landing-hero-contrast" aria-hidden="true" />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" aria-hidden="true" />

          <div className="relative z-10">
            <ProductContentSections
              product={mergedProduct as any}
              faqs={faqs}
              detailsOverride={featureDetails.length > 0 ? featureDetails : undefined}
              sectionOverrides={{
                featuresTitle: content?.featuresSection?.title,
                featuresDescription: content?.featuresSection?.description,
              }}
              compactLayout
              enableFeaturesNav
            />
          </div>
        </div>
      )}
      <Waitlist />
    </>
  );
};

export default BiblioKitLanding;
