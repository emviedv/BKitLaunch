import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Features = () => {
  const { content } = usePublishedContent();
  const { features } = content;
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
          border: '1px solid'
        };
      }
    }
    return {};
  };
  
  // Return null if features section is set to hidden
  if (content.settings?.visibility?.features === false) {
    return null;
  }

  return (
    <section id="features" className="py-20 px-4 section-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to build and scale
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From secure API management to comprehensive support systems, 
            we provide all the tools you need for professional SaaS development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => (
            <div key={index} className={`card ${feature.isFeatured ? 'card-featured' : ''} ${feature.isFeatured ? 'flex flex-col max-w-4xl mx-auto' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`icon ${colorClasses[index % colorClasses.length]}`}>
                  {feature.icon}
                </div>
                {feature.badge && (content.settings?.labels?.featuresBadges ?? true) && (feature as any).showBadge !== false && (
                  <span 
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColorClasses(feature.badgeColor || 'primary')}`}
                    style={getBadgeStyle(feature.badgeColor || '')}
                  >
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className={`text-muted-foreground ${feature.isFeatured ? 'flex-grow' : ''}`}>
                {feature.description}
              </p>
              
              {/* Featured card button */}
              {(() => {
                const label: string | undefined =
                  feature.buttonPreset === 'beta' ? 'Sign Up for Beta' : feature.buttonText;
                const computedLink: string | undefined =
                  feature.productSlug ? `/${feature.productSlug}` : feature.buttonLink;

                if (!feature.isFeatured || !label) return null;

                const external = Boolean(computedLink && isExternalLink(computedLink));

                return (
                  <a
                    href={computedLink || '#'}
                    className="card-button"
                    onClick={(e) => handleButtonClick(e, computedLink)}
                    target={external ? '_blank' : '_self'}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={`${label} - ${feature.title}`}
                  >
                    {label}
                  </a>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 