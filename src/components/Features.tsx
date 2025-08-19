import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { BentoGrid } from '@/components/ui/bento-grid';
import { ShootingStarsBackground } from '@/components/ui/shooting-stars';

const Features = () => {
  const { content } = usePublishedContent();
  
  // Support both legacy array shape and DB object shape with { title, description, items }
  const featuresSection = content.features && !Array.isArray(content.features) ? content.features : null;
  const featuresList = Array.isArray(content.features)
    ? content.features
    : (content.features?.items || []);
  const sectionTitleRaw = featuresSection?.title || content.featuresSection?.title || '';
  const sectionDescription = featuresSection?.description || content.featuresSection?.description || '';
  // Section-level CTA not used; every card has its own link
  const colorClasses = ['icon-purple', 'icon-blue', 'icon-green', 'icon-orange', 'icon-pink', 'icon-indigo'];

  // Helper function to determine if a link is external
  const isExternalLink = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Handle button click for featured cards
  const handleButtonClick = (e: React.MouseEvent, buttonLink?: string) => {
    if (!buttonLink) {
      e.preventDefault();
      return;
    }
    
    if (isExternalLink(buttonLink)) {
      // External links are handled by the anchor tag naturally
      return;
    }
    
    // For internal links, you could add navigation logic here if needed
    // For now, we'll let the anchor tag handle it
  };
  
  // Badge color mapping - supports both predefined colors and hex values
  const getBadgeColorClasses = (color: string) => {
    // Check if it's a hex color (starts with #)
    if (color && color.startsWith('#')) {
      return '';
    }
    
    const badgeColors = {
      green: 'bg-green-100 text-green-800 border border-green-200',
      blue: 'bg-blue-100 text-blue-800 border border-blue-200',
      orange: 'bg-orange-100 text-orange-800 border border-orange-200',
      purple: 'bg-purple-100 text-purple-800 border border-purple-200',
      red: 'bg-red-100 text-red-800 border border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      indigo: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      pink: 'bg-pink-100 text-pink-800 border border-pink-200',
      gray: 'bg-gray-100 text-gray-800 border border-gray-200',
      primary: 'bg-primary text-primary-foreground'
    };
    return badgeColors[color as keyof typeof badgeColors] || badgeColors.primary;
  };

  const FigmaIcon = () => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 384" className="w-3.5 h-3.5 mr-1">
      <path fill="#0ACF83" d="M128 192a64 64 0 1 1 64 64h-64v-64Z"/>
      <path fill="#A259FF" d="M64 128a64 64 0 1 1 64 64H64v-64Z"/>
      <path fill="#F24E1E" d="M128 64a64 64 0 1 1 64-64H128v64Z"/>
      <path fill="#FF7262" d="M64 64a64 64 0 1 1 64-64H64v64Z"/>
      <path fill="#1ABCFE" d="M64 256a64 64 0 1 0 64-64H64v64Z"/>
    </svg>
  );

  const SaaSIcon = () => (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 mr-1">
      <path fill="currentColor" d="M6 14a4 4 0 0 1 3.874-3.997A5.5 5.5 0 0 1 19.5 9a4.5 4.5 0 0 1 .5 8.973V18H7a4 4 0 0 1-1-7.874V10A4 4 0 0 1 6 14Z"/>
    </svg>
  );

  const renderBadgeIcon = (type?: string) => {
    if (type === 'figma') return <FigmaIcon />;
    if (type === 'saas') return <SaaSIcon />;
    return null;
  };

  // Generate inline styles for hex colors
  const getBadgeStyle = (color: string) => {
    if (color && color.startsWith('#')) {
      // Calculate lighter background and darker text based on hex color
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };
      
      const rgb = hexToRgb(color);
      if (rgb) {
        // Create a lighter background (add 80 to each RGB component, cap at 255)
        const lightBg = `rgba(${Math.min(rgb.r + 80, 255)}, ${Math.min(rgb.g + 80, 255)}, ${Math.min(rgb.b + 80, 255)}, 0.15)`;
        // Use the original color for text
        const textColor = color;
        // Create a border color (add 40 to each RGB component)
        const borderColor = `rgba(${Math.min(rgb.r + 40, 255)}, ${Math.min(rgb.g + 40, 255)}, ${Math.min(rgb.b + 40, 255)}, 0.3)`;
        
        return {
          backgroundColor: lightBg,
          color: textColor,
          borderColor: borderColor,
          borderWidth: '1px',
          borderStyle: 'solid'
        };
      }
    }
    return {};
  };
  
  // Return null if features section is set to hidden
  if (content.settings?.visibility?.features === false) {
    return null;
  }

  // Hide entire section when there are no items and no heading content
  const hasItems = Array.isArray(featuresList) && featuresList.length > 0;
  const effectiveSectionTitle = sectionTitleRaw || (hasItems ? 'Features' : '');
  const hasHeading = Boolean(effectiveSectionTitle || sectionDescription);
  if (!hasHeading && !hasItems) {
    return null;
  }

  // Determine featured vs non-featured items
  const featuredIndex = featuresList.findIndex((f: any) => f.isFeatured || f.is_featured);
  const featuredItem = featuredIndex >= 0 ? featuresList[featuredIndex] : null;
  const otherItems = featuredIndex >= 0
    ? featuresList.filter((_: any, i: number) => i !== featuredIndex)
    : featuresList;

  // Traditional card grid layout; responsive columns and auto row height

  // Background images removed per request, retaining clean card styling
  
  // No top-level CTA or list

  return (
    <section id="features" className="relative z-10 -mt-8 pt-[148px] pb-20 px-4 section-background-blend-top scroll-mt-28">
      {/* Subtle shooting stars background */}
      <ShootingStarsBackground density={24} speedMs={9000} />
      <div className="container mx-auto relative z-30">
        <div className="text-center mb-16 pb-16">
          {effectiveSectionTitle && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {effectiveSectionTitle}
            </h2>
          )}
          {sectionDescription && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Featured card on its own centered row */}
        {featuredItem && (() => {
          const feature = featuredItem;
          const isFeatured = true;
          const badgeColor = feature.badgeColor || feature.badge_color;
          const buttonText = feature.buttonText || feature.button_text;
          const buttonLink = feature.buttonLink || feature.button_link;
          const productSlug = feature.productSlug || feature.product_slug;
          const showBadge = (feature as any).showBadge !== false;
          const ideaText: string | undefined = (feature as any).idea || (feature as any).ideaText || (feature as any).tagline;
          const topItems: string[] = Array.isArray((feature as any).topItems)
            ? (feature as any).topItems
            : Array.isArray((feature as any).top_items)
              ? (feature as any).top_items
              : Array.isArray((feature as any).top3)
                ? (feature as any).top3
                : [];

          const computedLink: string | undefined = productSlug
            ? `/${productSlug}`
            : buttonLink;
          const external = Boolean(computedLink && isExternalLink(computedLink));
          const normalizedHref = computedLink && computedLink.startsWith('#')
            ? `/${computedLink}`
            : computedLink;

          return (
            <div className="mb-8">
              <div className="max-w-3xl mx-auto">
                <div className={`group relative overflow-hidden h-full card ${isFeatured ? 'card-featured' : ''}`}>
                  <div className="relative z-10 flex h-full flex-col justify-start">
                    <div className="min-h-56 md:min-h-60 lg:min-h-64">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`icon ${colorClasses[0]}`}>
                          {feature.icon}
                        </div>
                        {(Array.isArray((feature as any).badges) && (feature as any).badges.length > 0 && (content.settings?.labels?.featuresBadges ?? true) && showBadge) ? (
                          <div className="flex flex-wrap gap-1">
                            {(feature as any).badges.map((b: any, bi: number) => (
                              <span key={bi}
                                className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${getBadgeColorClasses(b.color || 'primary')}`}
                                style={getBadgeStyle(b.color || '')}
                                aria-label={`${b.type || 'badge'}: ${b.label}`}
                              >
                                {renderBadgeIcon(b.type)}
                                {b.label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          feature.badge && (content.settings?.labels?.featuresBadges ?? true) && showBadge && (() => {
                            const label = String(feature.badge);
                            const lower = label.toLowerCase();
                            const icon = lower.includes('figma') ? <FigmaIcon /> : lower.includes('saas') ? <SaaSIcon /> : null;
                            return (
                              <span 
                                className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${getBadgeColorClasses(badgeColor || 'primary')}`}
                                style={getBadgeStyle(badgeColor || '')}
                              >
                                {icon}
                                {label}
                              </span>
                            );
                          })()
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-6">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      {ideaText && (
                        <p className="mt-2 text-sm italic text-muted-foreground/80">
                          {ideaText}
                        </p>
                      )}
                    </div>
                    <div className="mt-7 min-h-32">
                      {topItems.length > 0 && (
                        <>
                          <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                          <ul className="grid grid-cols-1 gap-2">
                            {topItems.slice(0, 3).map((t: string, ti: number) => (
                              <li key={ti} className="flex items-start gap-2">
                                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                                <span className="text-sm text-muted-foreground">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    {(() => {
                      const label: string | undefined =
                        feature.buttonPreset === 'beta' ? 'Sign Up for Beta' : (buttonText || 'Visit product page');
                      if (label && normalizedHref) {
                        return (
                          <a
                            href={normalizedHref || '#'}
                            className="card-button mt-auto self-start"
                            onClick={(e) => handleButtonClick(e, computedLink)}
                            target={external ? '_blank' : '_self'}
                            rel={external ? 'noopener noreferrer' : undefined}
                            aria-label={`${label} - ${feature.title}`}
                          >
                            {label}
                          </a>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Grid with remaining cards should be full width within content area */}
        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-6">
          {otherItems.map((feature: any, index: number) => {
            const isFeatured = false;
            const badgeColor = feature.badgeColor || feature.badge_color;
            const buttonText = feature.buttonText || feature.button_text;
            const buttonLink = feature.buttonLink || feature.button_link;
            const productSlug = feature.productSlug || feature.product_slug;
            const showBadge = (feature as any).showBadge !== false;
            const ideaText: string | undefined = (feature as any).idea || (feature as any).ideaText || (feature as any).tagline;
            const topItems: string[] = Array.isArray((feature as any).topItems)
              ? (feature as any).topItems
              : Array.isArray((feature as any).top_items)
                ? (feature as any).top_items
                : Array.isArray((feature as any).top3)
                  ? (feature as any).top3
                  : [];

            const computedLink: string | undefined = productSlug
              ? `/${productSlug}`
              : buttonLink;
            const external = Boolean(computedLink && isExternalLink(computedLink));
            const normalizedHref = computedLink && computedLink.startsWith('#')
              ? `/${computedLink}`
              : computedLink;

            return (
              <div
                key={index}
                className="col-span-1"
              >
                <div className={`group relative overflow-hidden h-full card ${isFeatured ? 'card-featured' : ''}`}>
                  <div className="relative z-10 flex h-full flex-col justify-start">
                    <div className="min-h-56 md:min-h-60 lg:min-h-64">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`icon ${colorClasses[index % colorClasses.length]}`}>
                          {feature.icon}
                        </div>
                        {(Array.isArray((feature as any).badges) && (feature as any).badges.length > 0 && (content.settings?.labels?.featuresBadges ?? true) && showBadge) ? (
                          <div className="flex flex-wrap gap-1">
                            {(feature as any).badges.map((b: any, bi: number) => (
                              <span key={bi}
                                className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${getBadgeColorClasses(b.color || 'primary')}`}
                                style={getBadgeStyle(b.color || '')}
                                aria-label={`${b.type || 'badge'}: ${b.label}`}
                              >
                                {renderBadgeIcon(b.type)}
                                {b.label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          feature.badge && (content.settings?.labels?.featuresBadges ?? true) && showBadge && (() => {
                            const label = String(feature.badge);
                            const lower = label.toLowerCase();
                            const icon = lower.includes('figma') ? <FigmaIcon /> : lower.includes('saas') ? <SaaSIcon /> : null;
                            return (
                              <span 
                                className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${getBadgeColorClasses(badgeColor || 'primary')}`}
                                style={getBadgeStyle(badgeColor || '')}
                              >
                                {icon}
                                {label}
                              </span>
                            );
                          })()
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-6">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                      {ideaText && (
                        <p className="mt-2 text-sm italic text-muted-foreground/80">
                          {ideaText}
                        </p>
                      )}
                    </div>
                    {/* Key features for this card */}
                    <div className="mt-7 min-h-32">
                      {topItems.length > 0 && (
                        <>
                          <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                          <ul className="grid grid-cols-1 gap-2">
                            {topItems.slice(0, 3).map((t: string, ti: number) => (
                              <li key={ti} className="flex items-start gap-2">
                                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                                <span className="text-sm text-muted-foreground">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    {/* Button area aligned to bottom */}
                    {(() => {
                      const label: string | undefined =
                        feature.buttonPreset === 'beta' ? 'Sign Up for Beta' : (buttonText || 'Visit product page');

                      if (label && normalizedHref) {
                        return (
                          <a
                            href={normalizedHref || '#'}
                            className="card-button mt-auto self-start"
                            onClick={(e) => handleButtonClick(e, computedLink)}
                            target={external ? '_blank' : '_self'}
                            rel={external ? 'noopener noreferrer' : undefined}
                            aria-label={`${label} - ${feature.title}`}
                          >
                            {label}
                          </a>
                        );
                      }

                      return null;
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Features; 