import React, { useMemo } from "react";

import { usePublishedContent } from "@/hooks/usePublishedContent";
import { resolveLucideIcon } from "@/lib/iconUtils";
import { getImageDimensions } from "@/lib/imageDimensions";
import { LANDING_FEATURES_ID } from "@/config/sectionAnchors";

type FeatureLike = {
  icon?: string;
  title?: string;
  description?: string;
  idea?: string;
  badge?: string;
  category?: string;
  badgeColor?: string;
  badges?: Array<{ label: string; color?: string; type?: string }>;
  topItems?: string[];
  showBadge?: boolean;
  tagline?: string;
  media?: {
    src?: string;
    alt?: string;
  };
};

const renderBadges = (feature: FeatureLike) => {
  if (feature.badges && feature.badges.length > 0) {
    return feature.badges.slice(0, 2).map((badge, index) => (
      <span
        key={`${feature.title}-badge-${index}`}
        className="badge badge-primary"
      >
        {badge.label}
      </span>
    ));
  }

  if (feature.showBadge && feature.badge) {
    return (
      <span className="badge badge-primary">
        {feature.badge}
      </span>
    );
  }

  return null;
};

const Features: React.FC = () => {
  const { content } = usePublishedContent();

  const featuresSection =
    content.features && !Array.isArray(content.features)
      ? content.features
      : content.featuresSection || {};

  const featuresList: FeatureLike[] = useMemo(() => {
    if (Array.isArray(content.features)) {
      return content.features;
    }
    if (Array.isArray(content.features?.items)) {
      return content.features.items;
    }
    return [];
  }, [content.features]);

  if (content?.settings?.visibility?.features === false) {
    return null;
  }

  const shouldHideFeature = (feature: FeatureLike): boolean => {
    const title = (feature?.title || '').trim().toLowerCase();
    return title.startsWith('bibliokit blocks');
  };

  const filteredFeatures = featuresList.filter(
    (feature) => Boolean(feature?.title) && !shouldHideFeature(feature)
  );

  const getCategoryPill = (feature: FeatureLike) => {
    const key = (feature?.category || feature?.badge || '').trim().toLowerCase();
    if (!key) return null;

    if (key.startsWith('launch')) {
      return {
        label: 'Launched',
        classes: 'border-emerald-200/80 bg-emerald-50/80 text-emerald-700',
        dot: 'bg-emerald-500',
      };
    }
    if (key.startsWith('coming')) {
      return {
        label: 'Coming Soon',
        classes: 'border-amber-200/80 bg-amber-50/80 text-amber-800',
        dot: 'bg-amber-500',
      };
    }
    if (key.startsWith('beta')) {
      return {
        label: 'Beta',
        classes: 'border-indigo-200/80 bg-indigo-50/80 text-indigo-700',
        dot: 'bg-indigo-500',
      };
    }
    return null;
  };

  if (
    filteredFeatures.length === 0 &&
    !(featuresSection?.title || featuresSection?.description)
  ) {
    return null;
  }

  const getFeatureHeading = (title?: string, description?: string) => {
    const rawTitle = (title || '').trim();
    if (rawTitle) {
      const parenIndex = rawTitle.indexOf('(');
      if (parenIndex > 0) {
        return rawTitle.slice(0, parenIndex).trim();
      }
      const dashToken = ' - ';
      if (rawTitle.includes(dashToken)) {
        const split = rawTitle.split(dashToken).slice(1).join(dashToken).trim();
        return split || rawTitle;
      }
      return rawTitle;
    }
    return (description || '').trim();
  };

  return (
    <section
      id={LANDING_FEATURES_ID}
      className="landing-features-section relative overflow-hidden section-background-blend-top bg-gradient-to-b from-white via-slate-50 to-slate-100/40 py-20 sm:py-24"
    >
      <div
        className="absolute inset-x-0 top-[-40%] h-[520px] bg-gradient-to-b from-[#6580E1]/35 via-white/10 to-transparent blur-3xl"
        aria-hidden
      />
      <div className="landing-features-content section-content relative z-10">
        <div className="landing-features-intro max-w-3xl">
          {featuresSection?.title ? (
            <h2 className="landing-features-heading section-title">{featuresSection.title}</h2>
          ) : (
            <h2 className="landing-features-heading section-title">Features</h2>
          )}
          {featuresSection?.description && (
            <p className="landing-features-description section-description">{featuresSection.description}</p>
          )}
        </div>

        <div className="landing-features-grid mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredFeatures.map((feature, index) => {
            const FeatureIcon = resolveLucideIcon(feature.icon);
            const headingText = getFeatureHeading(feature.title, feature.description);
            const descriptionText = (feature.description || '').trim();
            const mediaDimensions = feature.media?.src ? getImageDimensions(feature.media.src) : null;

            return (
              <article
                key={`${feature.title}-${index}`}
                className="landing-features-card flex h-full flex-col rounded-3xl border border-slate-200/60 bg-white/10 p-6 shadow-lg shadow-[rgba(101,128,225,0.15)] backdrop-blur-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="landing-features-icon flex h-12 w-12 items-center justify-center rounded-xl bg-[#6580E1]/12 text-[#6580E1]">
                      <FeatureIcon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                  </div>
            <div className="landing-features-badges flex gap-2 text-xs">{renderBadges(feature)}</div>
          </div>

                {(() => {
                  const category = getCategoryPill(feature);
                  if (!category) return null;
                  return (
                    <div className="mb-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-tight ${category.classes}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${category.dot}`} />
                        {category.label}
                      </span>
                    </div>
                  );
                })()}

                <h3 className="landing-features-card-title text-xl font-semibold text-title-darkest">{headingText}</h3>
                {feature.tagline && (
                  <p className="mt-1 text-sm font-medium text-muted-foreground/90">{feature.tagline}</p>
                )}
                {descriptionText && (
                  <p className="landing-features-card-description mt-3 text-sm text-muted-foreground">{descriptionText}</p>
                )}

                {feature.media?.src && (
                  <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm">
                    <img
                      src={feature.media.src}
                      alt={feature.media.alt || `${feature.title} preview`}
                      className="w-full rounded-xl border border-slate-100 object-cover"
                      width={mediaDimensions?.width}
                      height={mediaDimensions?.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {Array.isArray(feature.topItems) && feature.topItems.length > 0 && (
                  <ul className="landing-features-card-list mt-5 space-y-2 text-sm text-muted-foreground/90">
                    {feature.topItems.slice(0, 4).map((item, itemIndex) => (
                      <li key={`${feature.title}-item-${itemIndex}`} className="flex items-start gap-2">
                        <span className="mt-[6px] inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6580E1]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
