import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS, HERO_SECONDARY_BUTTON_CLASS } from '@/components/heroConstants';
import { ArrowRight, Download } from '@/lib/iconUtils';
import FluidBackground from './FluidBackground';
import {
  GLOSSARY_PAGES,
  PLUGIN_DATA,
  findGlossaryBySlug,
  type GlossaryPage as GlossaryPageType
} from '@/data/programmaticContent';

interface GlossaryPageProps {
  slug: string;
}

/**
 * GlossaryPage - Template for /glossary/:slug definition pages
 *
 * These pages target definition searches like:
 * - "what is a detached instance in figma"
 * - "what is design ops"
 */
const GlossaryPage: React.FC<GlossaryPageProps> = ({ slug }) => {
  const { content } = usePublishedContent();
  const glossary = findGlossaryBySlug(slug);

  debugService.info('GlossaryPage mounted', {
    slug,
    found: !!glossary,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (!glossary) return;

    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://www.bibliokit.com';

    const metadata = generateMetadata(`/glossary/${slug}`, content, baseUrl, {
      title: glossary.metaTitle,
      description: glossary.metaDescription,
      keywords: glossary.keywords.join(', ')
    });
    updatePageMetadata(metadata);

    window.scrollTo(0, 0);
  }, [slug, glossary, content]);

  if (!glossary) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Term Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We could not find a definition for this term.
        </p>
        <Button asChild size="lg">
          <a href="/glossary">Browse All Terms</a>
        </Button>
      </div>
    );
  }

  // Find related terms data
  const relatedGlossaryItems = glossary.relatedTerms
    .map(termSlug => GLOSSARY_PAGES.find(g => g.slug === termSlug))
    .filter(Boolean) as GlossaryPageType[];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-32 pb-20 px-6 md:px-10 text-white">
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="landing-hero-contrast" aria-hidden="true" />
        <FluidBackground />

        <div className="mx-auto max-w-4xl relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/glossary" className="hover:text-white transition-colors">Glossary</a>
            <span>/</span>
            <span className="text-white">{glossary.term}</span>
          </nav>

          <p className="text-pink-400 font-semibold uppercase tracking-wider text-sm mb-4">
            Definition
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
            What is {glossary.term}?
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">
            {glossary.definition}
          </p>
        </div>
      </section>

      {/* Context Section */}
      <section className="landing-sections-gradient py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold mb-6">
            Why It Matters
          </h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-slate-300 text-lg leading-relaxed">
              {glossary.context}
            </p>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      {glossary.examples && glossary.examples.length > 0 && (
        <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-semibold mb-8">
              Examples
            </h2>
            <div className="space-y-4">
              {glossary.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-slate-300">{example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plugin CTA Section */}
      {glossary.pluginCta && (
        <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
          <div className="mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                How BiblioKit Helps
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                {glossary.pluginCta.text}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
                  <a href={glossary.pluginCta.url} className="inline-flex items-center gap-2">
                    <span>Learn About {glossary.pluginCta.pluginName}</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
                {PLUGIN_DATA[glossary.pluginCta.plugin]?.communityUrl && (
                  <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500">
                    <a href={PLUGIN_DATA[glossary.pluginCta.plugin].communityUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Install Free
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Terms Section */}
      {relatedGlossaryItems.length > 0 && (
        <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-semibold mb-8">
              Related Terms
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedGlossaryItems.map((term) => (
                <a
                  key={term.slug}
                  href={`/glossary/${term.slug}`}
                  className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                    {term.term}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {term.definition}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Explore More Design Terms
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Browse our complete glossary of Figma and design systems terminology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="/glossary" className="inline-flex items-center gap-2">
                <span>View All Terms</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button asChild className={HERO_SECONDARY_BUTTON_CLASS} size="lg">
              <a href="/products">
                <span>Explore Plugins</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlossaryPage;
