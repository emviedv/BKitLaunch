import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from '@/components/heroConstants';
import { ArrowRight, Layers } from '@/lib/iconUtils';
import FluidBackground from './FluidBackground';
import {
  USE_CASE_PAGES,
  PLUGIN_DATA,
  type PluginSlug
} from '@/data/programmaticContent';

/**
 * UseCasesIndexPage - Hub page listing all use cases
 *
 * This page serves as the hub in a hub-and-spoke internal linking model.
 * It lists all use case pages grouped by plugin for easy discovery.
 */
const UseCasesIndexPage: React.FC = () => {
  const { content } = usePublishedContent();

  debugService.info('UseCasesIndexPage mounted', {
    useCaseCount: USE_CASE_PAGES.length,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://www.bibliokit.com';

    const metadata = generateMetadata('/use-cases', content, baseUrl);
    updatePageMetadata(metadata);

    window.scrollTo(0, 0);
  }, [content]);

  // Group use cases by plugin
  const useCasesByPlugin = USE_CASE_PAGES.reduce((acc, useCase) => {
    if (!acc[useCase.plugin]) {
      acc[useCase.plugin] = [];
    }
    acc[useCase.plugin].push(useCase);
    return acc;
  }, {} as Record<PluginSlug, typeof USE_CASE_PAGES>);

  // Order plugins by number of use cases (most first)
  const sortedPlugins = Object.entries(useCasesByPlugin)
    .sort(([, a], [, b]) => b.length - a.length)
    .map(([plugin]) => plugin as PluginSlug);

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
            Figma Use Cases &amp; Tutorials
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Step-by-step guides for common Figma tasks. Learn how to batch rename layers,
            find detached instances, remove prototype links, and more.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <Layers className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-slate-300"><span className="font-semibold text-white">{USE_CASE_PAGES.length}</span> use case guides</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <span className="text-sm text-slate-300"><span className="font-semibold text-white">{Object.keys(useCasesByPlugin).length}</span> plugins covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases by Plugin */}
      <section className="landing-sections-gradient py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-6xl">
          {sortedPlugins.map((pluginSlug) => {
            const plugin = PLUGIN_DATA[pluginSlug];
            const useCases = useCasesByPlugin[pluginSlug];

            return (
              <div key={pluginSlug} className="mb-16 last:mb-0">
                {/* Plugin Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <a
                      href={plugin.pageUrl}
                      className="group inline-flex items-center gap-2 text-2xl md:text-3xl font-semibold hover:text-pink-400 transition-colors"
                    >
                      {plugin.name}
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                    <p className="text-slate-400 mt-1">{plugin.tagline}</p>
                  </div>
                  <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500">
                    <a href={plugin.communityUrl} target="_blank" rel="noopener noreferrer">
                      Install {plugin.name}
                    </a>
                  </Button>
                </div>

                {/* Use Case Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {useCases.map((useCase) => (
                    <a
                      key={useCase.slug}
                      href={`/use-cases/${useCase.slug}`}
                      className="group bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all hover:bg-slate-800/70"
                    >
                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors">
                        {useCase.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {useCase.problem}
                      </p>
                      <div className="flex items-center gap-2 text-pink-400 text-sm font-medium">
                        <span>Read guide</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Don&apos;t See Your Use Case?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            We&apos;re always adding new guides. Browse our blog for more tutorials
            or reach out if you have a specific workflow question.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="/blog" className="inline-flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span>Browse All Tutorials</span>
              </a>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500" size="lg">
              <a href="mailto:hello@bibliokit.com">
                Request a Guide
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UseCasesIndexPage;
