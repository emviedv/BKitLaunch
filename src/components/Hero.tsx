import React from 'react';
import { motion } from 'framer-motion';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { HeroBackground } from './HeroBackground';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          {hero.emoji && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span role="img" aria-label="hero emoji" className="text-5xl md:text-6xl">
                {hero.emoji}
              </span>
            </motion.div>
          )}

          {(hero.title || hero.subtitle) && (
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold tracking-tight"
              >
                {hero.title && (
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-green-500"
                  >
                    {hero.title}
                  </motion.span>
                )}
                {hero.subtitle && (
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="block text-gray-700"
                  >
                    {hero.subtitle}
                  </motion.span>
                )}
              </motion.h1>
            </div>
          )}

          {hero.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              {hero.description}
            </motion.p>
          )}

          {(hero.primaryButton || hero.secondaryButton) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {hero.primaryButton && (hero.primaryButtonLink ? (
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                  aria-label={`${hero.primaryButton} - Primary action`}
                >
                  <a
                    href={(hero.primaryButtonLink.startsWith('#') ? `/${hero.primaryButtonLink}` : hero.primaryButtonLink)}
                    target={hero.primaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                    rel={hero.primaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <Zap className="w-4 h-4" />
                    {hero.primaryButton}
                  </a>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      (e.currentTarget as HTMLButtonElement).click();
                    }
                  }}
                  aria-label={`${hero.primaryButton} - Primary action`}
                >
                  <Zap className="w-4 h-4" />
                  {hero.primaryButton}
                </Button>
              ))}

              {hero.secondaryButton && (hero.secondaryButtonLink ? (
                <Button asChild size="lg" variant="outline" className="gap-2" aria-label={`${hero.secondaryButton} - Secondary action`}>
                  <a
                    href={(hero.secondaryButtonLink.startsWith('#') ? `/${hero.secondaryButtonLink}` : hero.secondaryButtonLink)}
                    target={hero.secondaryButtonLink.startsWith('http') ? '_blank' : '_self'}
                    rel={hero.secondaryButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {hero.secondaryButton}
                  </a>
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const pricingSection = document.getElementById('pricing');
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      (e.currentTarget as HTMLButtonElement).click();
                    }
                  }}
                  aria-label={`${hero.secondaryButton} - Secondary action`}
                >
                  {hero.secondaryButton}
                </Button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      {/* Animated background is handled by HeroBackground */}
    </section>
  );
};

export default Hero; 