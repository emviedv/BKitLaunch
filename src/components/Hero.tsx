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
    <section className="relative py-24 px-4 bg-gradient-to-br from-yellow-50/30 to-orange-100/30 text-gray-900">
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
                className="btn-primary bg-purple-600 text-white hover:bg-purple-700 inline-block text-center w-auto"
                target={hero.primaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                rel={hero.primaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {hero.primaryButton}
              </a>
            ) : (
              <button className="btn-primary bg-purple-600 text-white hover:bg-purple-700 w-auto">
                {hero.primaryButton}
              </button>
            )}
            {hero.secondaryButtonLink ? (
              <a 
                href={hero.secondaryButtonLink} 
                className="btn-secondary border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 inline-block text-center w-auto"
                target={hero.secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                rel={hero.secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {hero.secondaryButton}
              </a>
            ) : (
              <button className="btn-secondary border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-auto">
                {hero.secondaryButton}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"></div>
    </section>
  );
};

export default Hero; 