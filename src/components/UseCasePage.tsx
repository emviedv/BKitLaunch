import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS, HERO_SECONDARY_BUTTON_CLASS } from '@/components/heroConstants';
import { Check, ArrowRight, Download, ChevronRight, HelpCircle } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import FluidBackground from './FluidBackground';
import {
  findUseCaseBySlug,
  getRelatedUseCases,
  PLUGIN_DATA,
  type UseCasePage as UseCasePageType
} from '@/data/programmaticContent';

interface UseCasePageProps {
  slug?: string;
}

/**
 * UseCasePage - Programmatic SEO template for use case pages
 *
 * This component renders use case pages from programmatic content data.
 * Each page targets a specific search pattern like "how to [action] in Figma"
 */
const UseCasePage: React.FC<UseCasePageProps> = ({ slug: propSlug }) => {
  const [location] = useLocation();
  const { content } = usePublishedContent();

  // Extract slug from URL if not provided as prop
  const slug = propSlug || location.replace('/use-cases/', '').replace(/\/$/, '');
  const pageData = findUseCaseBySlug(slug);
  const relatedUseCases = pageData ? getRelatedUseCases(slug) : [];

  debugService.info('UseCasePage mounted', {
    slug,
    found: !!pageData,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (!pageData) return;

    // Generate SEO metadata for this use case page
    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://www.bibliokit.com';

    const metadata = generateMetadata(`/use-cases/${slug}`, {
      ...content,
      // Override with use case specific metadata
      title: pageData.metaTitle,
      description: pageData.metaDescription,
      keywords: pageData.keywords.join(', ')
    }, baseUrl);

    updatePageMetadata(metadata);

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug, pageData, content]);

  // 404 state
  if (!pageData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Use Case Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The use case you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <a href="/use-cases">Browse All Use Cases</a>
          </Button>
        </div>
      </div>
    );
  }

  const pluginData = PLUGIN_DATA[pageData.plugin];

  // --- Reusable Section Components ---
  const Section = ({
    children,
    className = '',
    dark = true
  }: {
    children: React.ReactNode;
    className?: string;
    dark?: boolean
  }) => (
    <section className={`py-16 md:py-24 px-6 md:px-10 ${dark ? 'landing-sections-gradient text-white' : 'bg-white text-slate-900'} ${className} relative overflow-hidden`}>
      <div className="mx-auto max-w-5xl relative z-10">
        {children}
      </div>
    </section>
  );

  const SectionTitle = ({
    children,
    className = ''
  }: {
    children: React.ReactNode;
    className?: string
  }) => (
    <h2 className={`text-3xl md:text-4xl font-semibold mb-6 ${className}`}>{children}</h2>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumb */}
      <nav className="landing-hero-gradient pt-20 pb-0 px-6 md:px-10 text-white" aria-label="Breadcrumb">
        <div className="mx-auto max-w-5xl">
          <ol className="flex items-center gap-2 text-sm text-slate-400">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <ChevronRight className="w-4 h-4" />
            <li><a href="/use-cases" className="hover:text-white transition-colors">Use Cases</a></li>
            <ChevronRight className="w-4 h-4" />
            <li className="text-white">{pageData.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero-gradient section-hero relative overflow-hidden flex items-center pt-8 pb-20 px-6 md:px-10 text-white">
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="landing-hero-contrast" aria-hidden="true" />
        <FluidBackground />

        <div className="mx-auto max-w-5xl relative z-10">
          {/* Plugin Badge */}
          <div className="mb-6">
            <a
              href={pageData.pluginUrl}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <span>🔌</span>
              <span>Powered by {pageData.pluginName}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {pageData.title}
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl">
            {pageData.solution}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={pageData.communityUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Try {pageData.pluginName} — Free</span>
              </a>
            </Button>
            <Button asChild className={HERO_SECONDARY_BUTTON_CLASS} size="lg">
              <a href={pageData.pluginUrl} className="inline-flex items-center gap-2">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <Section dark className="border-y border-slate-800/50">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-block bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-red-500/20">
              The Problem
            </div>
            <SectionTitle>{pageData.problem}</SectionTitle>
            <ul className="space-y-4">
              {pageData.problemDetails.map((detail, index) => (
                <li key={index} className="flex items-start gap-3 text-lg text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {pageData.beforeAfter && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  {pageData.beforeAfter.beforeLabel || 'Before'}
                </div>
                <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-4">
                  <code className="text-red-300 text-sm break-all">
                    {pageData.beforeAfter.before}
                  </code>
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-green-400 rotate-90" />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  {pageData.beforeAfter.afterLabel || 'After'}
                </div>
                <div className="bg-green-900/20 border border-green-900/40 rounded-lg p-4">
                  <code className="text-green-300 text-sm break-all">
                    {pageData.beforeAfter.after}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Step-by-Step Solution */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-500/20">
            Step-by-Step Solution
          </div>
          <SectionTitle>How to {pageData.title.replace('How to ', '')}</SectionTitle>
        </div>

        <div className="space-y-8">
          {pageData.steps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-lg mb-4">
                    {step.description}
                  </p>
                  {step.tip && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                      <span className="text-blue-400 text-lg">💡</span>
                      <p className="text-blue-200 text-sm">
                        <strong>Pro tip:</strong> {step.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA after steps */}
        <div className="mt-12 text-center">
          <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
            <a href={pageData.communityUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <Download className="w-5 h-5" />
              <span>Try {pageData.pluginName} — Free</span>
            </a>
          </Button>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section dark className="border-y border-slate-800/50">
        <div className="text-center mb-12">
          <SectionTitle>Why Use {pageData.pluginName}?</SectionTitle>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pageData.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-slate-800/30 border border-slate-700/50 rounded-lg p-5"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-slate-200">{benefit}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ Section */}
      <Section dark>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-slate-700">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <SectionTitle>Common Questions About {pageData.title.replace('How to ', '')}</SectionTitle>
        </div>

        <div className="max-w-3xl mx-auto">
          <FAQList faqs={pageData.faqs} variant="dark" />
        </div>
      </Section>

      {/* Related Use Cases */}
      {relatedUseCases.length > 0 && (
        <Section dark className="border-t border-slate-800/50">
          <div className="text-center mb-12">
            <SectionTitle>Related Use Cases</SectionTitle>
            <p className="text-slate-400">Explore more ways to use {pageData.pluginName}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedUseCases.map((relatedCase) => (
              <a
                key={relatedCase.slug}
                href={`/use-cases/${relatedCase.slug}`}
                className="group bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all hover:bg-slate-800/70"
              >
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  {relatedCase.pluginName}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  {relatedCase.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2">
                  {relatedCase.problem}
                </p>
                <div className="mt-4 flex items-center gap-2 text-pink-400 text-sm font-medium">
                  <span>Read guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Final CTA */}
      <Section dark className="border-t border-slate-800/50">
        <div className="text-center">
          <SectionTitle>Ready to {pageData.title.replace('How to ', '')}?</SectionTitle>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {pluginData.tagline}. Install {pageData.pluginName} for free and start in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href={pageData.communityUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Install {pageData.pluginName} — Free</span>
              </a>
            </Button>
            <Button asChild className={HERO_SECONDARY_BUTTON_CLASS} size="lg">
              <a href={pageData.pluginUrl} className="inline-flex items-center gap-2">
                <span>View Full Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default UseCasePage;
