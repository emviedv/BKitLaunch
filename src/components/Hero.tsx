import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { HeroBackground } from './HeroBackground';

const Hero = () => {
  const { content } = usePublishedContent();
  const { hero } = content;
  
  // Return null if hero section is set to hidden
  if (content.settings?.visibility?.hero === false) {
    return null;
  }

  // Hide hero if there is no meaningful content to show
  const hasAnyHeroContent = Boolean(
    (hero && (
      hero.title ||
      hero.subtitle ||
      hero.description ||
      hero.primaryButton ||
      hero.secondaryButton ||
      hero.emoji
    ))
  );
  if (!hasAnyHeroContent) {
    return null;
  }

  return (
    <section className="section-hero relative overflow-hidden py-24 px-4 min-h-[calc(100vh-60px)] flex items-center">
      <HeroBackground />
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {hero.emoji && (
            <div className="mb-4">
              <span role="img" aria-label="hero emoji" className="text-5xl md:text-6xl">
                {hero.emoji}
              </span>
            </div>
          )}
          {(hero.title || hero.subtitle) && (
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {hero.title && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">{hero.title}</span>
              )}
              {hero.title && hero.subtitle && <br />}
              {hero.subtitle && (
                <span className="text-gray-700">{hero.subtitle}</span>
              )}
            </h1>
          )}
          {hero.description && (
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {hero.description}
            </p>
          )}
          {(hero.primaryButton || hero.secondaryButton) && (
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {hero.primaryButton && (hero.primaryButtonLink ? (
              <a 
                href={(hero.primaryButtonLink.startsWith('#') ? `/${hero.primaryButtonLink}` : hero.primaryButtonLink)} 
                className="button"
                target={hero.primaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                rel={hero.primaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={`${hero.primaryButton} - Primary action`}
              >
                {hero.primaryButton}
              </a>
            ) : (
              <button 
                className="button"
                onClick={() => {
                  // Default action - could scroll to features or open waitlist
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
                aria-label={`${hero.primaryButton} - Primary action`}
                tabIndex={0}
              >
                {hero.primaryButton}
              </button>
            ))}
            {hero.secondaryButton && (hero.secondaryButtonLink ? (
              <a 
                href={(hero.secondaryButtonLink.startsWith('#') ? `/${hero.secondaryButtonLink}` : hero.secondaryButtonLink)} 
                className="button-secondary"
                target={hero.secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                rel={hero.secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={`${hero.secondaryButton} - Secondary action`}
              >
                {hero.secondaryButton}
              </a>
            ) : (
              <button 
                className="button-secondary"
                onClick={() => {
                  // Default action - scroll to pricing section
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
                aria-label={`${hero.secondaryButton} - Secondary action`}
                tabIndex={0}
              >
                {hero.secondaryButton}
              </button>
            ))}
          </div>
          )}
        </div>
      </div>
      {/* Animated background is handled by HeroBackground */}
    </section>
  );
};

export default Hero; 