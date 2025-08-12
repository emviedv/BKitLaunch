import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';

const Hero = () => {
  const { content } = usePublishedContent();
  const { hero } = content;
  
  // Return null if hero section is set to hidden
  if (content.settings?.visibility?.hero === false) {
    return null;
  }

  return (
    <section className="section-hero py-24 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">{hero.title}</span>
            <br />
            <span className="text-gray-700">{hero.subtitle}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {hero.primaryButtonLink ? (
              <a 
                href={hero.primaryButtonLink} 
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
            )}
            {hero.secondaryButtonLink ? (
              <a 
                href={hero.secondaryButtonLink} 
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
            )}
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute -z-10 top-10 left-10 w-24 h-24 bg-pink-300/30 rounded-full blur-2xl"></div>
      <div className="absolute -z-10 bottom-10 right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl"></div>
    </section>
  );
};

export default Hero; 