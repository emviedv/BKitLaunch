import React, { useMemo } from "react";

import { usePublishedContent } from "@/hooks/usePublishedContent";
import { resolveLucideIcon } from "@/lib/iconUtils";
import { LANDING_FEATURES_ID } from "@/config/sectionAnchors";

type FeatureLike = {
  icon?: string;
  title?: string;
  description?: string;
  idea?: string;
  badge?: string;
  badgeColor?: string;
  badges?: Array<{ label: string; color?: string; type?: string }>;
  topItems?: string[];
  showBadge?: boolean;
};

const renderBadges = (feature: FeatureLike) => {
  if (feature.badges && feature.badges.length > 0) {
    return feature.badges.slice(0, 2).map((badge, index) => (
      <span
        key={`${feature.title}-badge-${index}`}
        className="inline-flex items-center rounded-full border border-[#6580E1]/50 bg-[#6580E1]/10 px-2.5 py-0.5 text-xs font-medium text-[#6580E1]"
      >
        {badge.label}
      </span>
    ));
  }

  if (feature.showBadge && feature.badge) {
    return (
      <span className="inline-flex items-center rounded-full border border-[#6580E1]/50 bg-[#6580E1]/10 px-2.5 py-0.5 text-xs font-medium text-[#6580E1]">
        {feature.badge}
      </span>
    );
  }

  return null;
};

const Features: React.FC = () => {
  const { content } = usePublishedContent();

  if (content?.settings?.visibility?.features === false) {
    return null;
  }

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

  const shouldHideFeature = (feature: FeatureLike): boolean => {
    const title = (feature?.title || '').trim().toLowerCase();
    return title.startsWith('bibliokit blocks');
  };

  const filteredFeatures = featuresList.filter(
    (feature) => Boolean(feature?.title) && !shouldHideFeature(feature)
  );

  if (
    filteredFeatures.length === 0 &&
    !(featuresSection?.title || featuresSection?.description)
  ) {
    return null;
  }

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

                <h3 className="landing-features-card-title text-xl font-semibold text-title-darkest">{feature.title}</h3>
                {feature.description && (
                  <p className="landing-features-card-description mt-3 text-sm text-muted-foreground">{feature.description}</p>
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
