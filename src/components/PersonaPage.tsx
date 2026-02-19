import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS, HERO_SECONDARY_BUTTON_CLASS } from '@/components/heroConstants';
import { Check, ArrowRight, Download } from '@/lib/iconUtils';
import FAQList from '@/components/FAQList';
import FluidBackground from './FluidBackground';
import {
  PERSONA_PAGES,
  PLUGIN_DATA,
  findPersonaBySlug,
  type PersonaPage as PersonaPageType
} from '@/data/programmaticContent';

interface PersonaPageProps {
  slug: string;
}

/**
 * PersonaPage - Template for /for/:slug persona pages
 *
 * These pages target persona-based searches like:
 * - "figma plugins for design system managers"
 * - "figma tools for freelance designers"
 */
const PersonaPage: React.FC<PersonaPageProps> = ({ slug }) => {
  const { content } = usePublishedContent();
  const persona = findPersonaBySlug(slug);

  debugService.info('PersonaPage mounted', {
    slug,
    found: !!persona,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (!persona) return;

    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://www.bibliokit.com';

    const metadata = generateMetadata(`/for/${slug}`, content, baseUrl, {
      title: persona.metaTitle,
      description: persona.metaDescription,
      keywords: persona.keywords.join(', ')
    });
    updatePageMetadata(metadata);

    window.scrollTo(0, 0);
  }, [slug, persona, content]);

  if (!persona) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Persona Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We could not find a page for this audience type.
        </p>
        <Button asChild size="lg">
          <a href="/for">Browse All Personas</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="landing-hero-gradient landing-hero-expanded section-hero relative -mt-16 overflow-hidden flex items-center pt-32 pb-20 px-6 md:px-10 text-white">
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="landing-hero-contrast" aria-hidden="true" />
        <FluidBackground />

        <div className="mx-auto max-w-5xl relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/for" className="hover:text-white transition-colors">For</a>
            <span>/</span>
            <span className="text-white">{persona.persona}</span>
          </nav>

          {/* Role Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-pink-400 font-semibold">{persona.recommendedPlugins.length}</span>
            <span className="text-sm text-slate-300">recommended plugins</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {persona.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl">
            {persona.heroText}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="#recommended-plugins" className="inline-flex items-center gap-2">
                <span>See Recommended Plugins</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button asChild className={HERO_SECONDARY_BUTTON_CLASS} size="lg">
              <a href="/products">
                <span>Browse All Products</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="landing-sections-gradient py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
            Challenges You Face
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            We understand the specific pain points that {persona.persona.toLowerCase()} deal with every day.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {persona.painPoints.map((painPoint, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {painPoint.title}
                </h3>
                <p className="text-slate-400">
                  {painPoint.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Plugins Section */}
      <section id="recommended-plugins" className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
            Recommended Plugins for {persona.persona}
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            These BiblioKit plugins are specifically designed to solve your workflow challenges.
          </p>

          <div className="grid gap-8">
            {persona.recommendedPlugins.map((plugin, index) => {
              const pluginInfo = PLUGIN_DATA[plugin.slug];
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 flex flex-col md:flex-row gap-6"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {plugin.name}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      {pluginInfo?.tagline}
                    </p>
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 mb-4">
                      <p className="text-pink-300 font-medium">Why you need it:</p>
                      <p className="text-slate-300 mt-1">{plugin.reason}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild className={HERO_PRIMARY_BUTTON_CLASS}>
                        <a href={plugin.url}>
                          Learn More
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500">
                        <a href={pluginInfo?.communityUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Install Free
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      {persona.workflow.length > 0 && (
        <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
              Your Optimized Workflow
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Here is how BiblioKit plugins fit into your daily design workflow.
            </p>

            <div className="space-y-6">
              {persona.workflow.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 font-semibold">{step.step}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{step.action}</p>
                    {step.plugin && (
                      <p className="text-pink-400 text-sm mt-1">
                        Using: {step.plugin}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {persona.faqs.length > 0 && (
        <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <FAQList faqs={persona.faqs} />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="landing-sections-gradient border-t border-slate-800/50 py-16 md:py-24 px-6 md:px-10 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of {persona.persona.toLowerCase()} who save hours every week with BiblioKit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className={HERO_PRIMARY_BUTTON_CLASS} size="lg">
              <a href="/products" className="inline-flex items-center gap-2">
                <span>Explore All Products</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonaPage;
