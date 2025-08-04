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
    <section className="relative py-24 px-4 lemon-gradient text-white">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">{hero.title}</span>
            <br />
            <span className="text-white/90">{hero.subtitle}</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary bg-white text-purple-600 hover:bg-white/90 hover:text-purple-700">
              {hero.primaryButton}
            </button>
            <button className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              {hero.secondaryButton}
            </button>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default Hero; 