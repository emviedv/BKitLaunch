import React, { useEffect, useMemo } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { ArrowRight, Search } from '@/lib/iconUtils';
import FluidBackground from './FluidBackground';
import { GLOSSARY_PAGES } from '@/data/programmaticContent';

/**
 * GlossaryIndexPage - Hub page for /glossary
 *
 * Lists all glossary terms organized alphabetically, serving as
 * the main entry point for the glossary section.
 */
const GlossaryIndexPage: React.FC = () => {
  const { content } = usePublishedContent();

  debugService.info('GlossaryIndexPage mounted', {
    termCount: GLOSSARY_PAGES.length,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://www.bibliokit.com';

    const metadata = generateMetadata('/glossary', content, baseUrl, {
      title: 'Figma & Design Systems Glossary | BiblioKit',
      description: 'Learn key Figma and design systems terms. Clear definitions for detached instances, design tokens, auto-layout, design ops, and more.',
      keywords: 'figma glossary, design systems glossary, figma terms, design terminology, what is detached instance'
    });
    updatePageMetadata(metadata);

    window.scrollTo(0, 0);
  }, [content]);

  // Group terms alphabetically
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof GLOSSARY_PAGES> = {};

    GLOSSARY_PAGES.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });

    // Sort each group alphabetically
    Object.keys(groups).forEach(letter => {
      groups[letter].sort((a, b) => a.term.localeCompare(b.term));
    });

    return groups;
  }, []);

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-32 pb-20 px-6 md:px-10 text-white">
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="landing-hero-contrast" aria-hidden="true" />
        <FluidBackground />

        <div className="mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <Search className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-slate-300">{GLOSSARY_PAGES.length} terms defined</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Figma & Design Systems Glossary
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Clear, practical definitions for the terms you encounter every day in Figma and design systems work.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="#terms" className="inline-flex items-center gap-2">
                <span>Browse Terms</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <section className="landing-sections-gradient py-8 px-6 md:px-10 text-white border-b border-slate-800/50 sticky top-16 z-30 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-2">
            {sortedLetters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-pink-500/20 hover:border-pink-500/50 hover:text-white transition-all font-semibold"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Grid */}
      <section id="terms" className="landing-sections-gradient py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-5xl">
          {sortedLetters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="mb-12 scroll-mt-32">
              <h2 className="text-4xl font-bold text-pink-400 mb-6 pb-3 border-b border-slate-800">
                {letter}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedTerms[letter].map(term => (
                  <a
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-all hover:bg-slate-800/70"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors flex items-center gap-2">
                      {term.term}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {term.definition}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Put These Terms Into Practice
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            BiblioKit plugins help you apply design system best practices in Figma.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="/products" className="inline-flex items-center gap-2">
                <span>Explore Plugins</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlossaryIndexPage;
