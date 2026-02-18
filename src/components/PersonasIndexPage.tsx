import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { ArrowRight, Users } from '@/lib/iconUtils';
import FluidBackground from './FluidBackground';
import { PERSONA_PAGES } from '@/data/programmaticContent';

/**
 * PersonasIndexPage - Hub page listing all persona pages
 *
 * This page serves as the hub in a hub-and-spoke internal linking model.
 * It lists all persona pages for easy discovery.
 */
const PersonasIndexPage: React.FC = () => {
  const { content } = usePublishedContent();

  debugService.info('PersonasIndexPage mounted', {
    personaCount: PERSONA_PAGES.length,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://www.bibliokit.com';

    const metadata = generateMetadata('/for', content, baseUrl);
    updatePageMetadata(metadata);

    window.scrollTo(0, 0);
  }, [content]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-32 pb-20 px-6 md:px-10 text-white">
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="landing-hero-contrast" aria-hidden="true" />
        <FluidBackground />

        <div className="mx-auto max-w-5xl relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            BiblioKit for Your Role
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Discover which BiblioKit plugins are best suited for your specific role and workflow.
            We have tailored recommendations for every type of design professional.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-slate-800/60 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-300">
              <span className="font-semibold text-white">{PERSONA_PAGES.length}</span> role guides
            </div>
          </div>
        </div>
      </section>

      {/* Persona Cards */}
      <section className="landing-sections-gradient py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PERSONA_PAGES.map((persona) => (
              <a
                key={persona.slug}
                href={`/for/${persona.slug}`}
                className="group bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl p-8 transition-all hover:bg-slate-800/70"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  {persona.persona}
                </h2>
                <p className="text-slate-400 mb-6 line-clamp-3">
                  {persona.heroText}
                </p>
                <div className="flex items-center gap-2 text-pink-400 font-medium">
                  <span>View recommendations</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Not Sure Where to Start?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Browse our complete product lineup to find the perfect tools for your workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="/products" className="inline-flex items-center gap-2">
                <span>Browse All Products</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500" size="lg">
              <a href="/use-cases">
                View Use Cases
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonasIndexPage;
