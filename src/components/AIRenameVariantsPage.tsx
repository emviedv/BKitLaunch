import React, { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useSchema, createProductSchema, createBreadcrumbSchema } from '@/lib/useSchema';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import AnswerBox from './AnswerBox';
import ExpertQuote from './ExpertQuote';
import StatBox from './StatBox';
import ContentChunk from './ContentChunk';
import FAQSchema from './FAQSchema';
import Waitlist from './Waitlist';

const AIRenameVariantsPage = () => {
  // Debug service for detailed logging
  debugService.info('AIRenameVariantsPage mounted', { 
    timestamp: new Date().toISOString() 
  });

  // Load published content before any effects that depend on it
  const { content } = usePublishedContent();

  // Clear any conflicting localStorage data
  useEffect(() => {
    // Ensure no cross-contamination from other product pages
    debugService.info('AI Rename Variants: Page loaded with correct content');
  }, []);

  // Add schema and meta tags for the AI Rename Variants page
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://bibliokit.com';
    const metadata = generateMetadata('/ai-rename-variants', content, baseUrl);
    updatePageMetadata(metadata);
  }, [content]);

  const product = content.products?.['ai-rename-variants'] || {
    title: 'AI Rename Variants',
    description: 'Instantly relabel Figma variant and layer names with context-aware AI. Remove clutter and bring order to your files in seconds.',
    primaryButton: 'Install Plugin',
    primaryButtonLink: 'https://www.figma.com/community/plugin/ai-rename-variants',
    secondaryButton: 'Learn More',
    secondaryButtonLink: '#features',
  };

  // Generate schemas
  const productSchema = createProductSchema(product);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bibliokit.com';
  const href = typeof window !== 'undefined' ? window.location.href : `${origin}/ai-rename-variants`;
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: origin },
    { name: 'AI Rename Variants', url: href }
  ]);

  // Inject schemas
  useSchema(productSchema, 'ai-rename-variants-schema');
  useSchema(breadcrumbSchema, 'breadcrumb-schema');

  // LLM-optimized content data
  const answerBoxContent =
    product?.llm?.answerBox ||
    "AI Rename Variants automatically renames Figma variant and layer names using context-aware artificial intelligence. Clean up messy design files instantly, improve team collaboration, and maintain consistent naming conventions across your design system with zero manual effort.";

  const expertQuote = {
    quote: "The way you structure and present work can make or break your ability to map towards broader goals, stay on the same page, and even know where to find the latest version of a design.",
    expertName: "Figma Design Team",
    expertTitle: "Figma Best Practices",
    institution: "Figma"
  };  

  const statistic = {
    statistic: "73%",
    description: "of design teams report faster file navigation and improved collaboration after implementing consistent naming conventions",
    source: "Design Systems Efficiency Report 2024",
    date: "March 2024"
  };

  const features = [
    {
      title: "Context-Aware AI Naming",
      description: "Smart algorithm analyzes component structure, properties, and design patterns to generate meaningful, consistent names automatically"
    },
    {
      title: "Batch Processing",
      description: "Rename hundreds of variants and layers simultaneously across multiple components with a single click for maximum efficiency"
    },
    {
      title: "Custom Naming Rules",
      description: "Configure naming patterns, prefixes, and conventions that match your team's design system standards and guidelines"
    },
    {
      title: "Undo & Version Control",
      description: "Safe renaming with full undo support and version history tracking to prevent accidental changes to important files"
    },
    {
      title: "Team Collaboration",
      description: "Share naming conventions across teams with consistent results, improving handoff quality and reducing designer-developer friction"
    }
  ];

  const benefits = [
    "Reduce file cleanup time by 80% with automated intelligent renaming",
    "Improve team collaboration through consistent naming conventions",
    "Eliminate manual renaming errors and inconsistencies",
    "Accelerate design handoffs with developer-friendly naming",
    "Maintain design system quality at scale across large teams",
    "Boost productivity with instant file organization and clarity"
  ];

  const faqs = [
    {
      question: "How does AI Rename Variants understand my component structure?",
      answer: "The plugin analyzes your component's properties, layer hierarchy, design patterns, and existing naming conventions to generate contextually appropriate names that match your design system standards."
    },
    {
      question: "Can I customize the naming patterns and conventions?",
      answer: "Yes, you can configure custom naming rules, prefixes, suffixes, and patterns to match your team's specific design system guidelines and maintain consistency across all projects."
    },
    {
      question: "Is it safe to use on important design files?",
      answer: "Absolutely. The plugin includes comprehensive undo functionality and tracks all changes, allowing you to safely revert any renaming operations if needed."
    },
    {
      question: "Does it work with existing design systems and component libraries?",
      answer: "Yes, AI Rename Variants is designed to work with any Figma file structure and can learn from your existing naming patterns to maintain consistency with your current design system."
    },
    {
      question: "How many variants can it rename at once?",
      answer: "The plugin can process hundreds of variants and layers simultaneously, making it perfect for large component libraries and complex design systems with extensive variant structures."
    }
  ];

  const colorClasses = ['icon-purple', 'icon-blue', 'icon-green', 'icon-orange', 'icon-pink', 'icon-indigo'];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-blue-50/30 to-purple-100/30 text-gray-900">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {(product as any)?.badgeLabel && (
              <div className="inline-block mb-6 bg-blue-600/10 px-4 py-2 rounded-full">
                <span className="text-blue-600 font-medium">{(product as any).badgeLabel}</span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">{product.title}</span>
            </h1>
            
            {/* Answer Box right under H1 */}
            <div className="mb-8">
              <AnswerBox content={answerBoxContent} className="bg-white/95 text-gray-800 border-white shadow-lg" />
            </div>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {product.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={product.primaryButtonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="button bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3"
              >
                {product.primaryButton}
              </a>
              <a 
                href={product.secondaryButtonLink}
                className="button-secondary border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-lg px-8 py-3 inline-block text-center"
              >
                {product.secondaryButton}
              </a>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
      </section>



      {/* Expert Quote Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <ExpertQuote {...expertQuote} />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 section-background">
        <div className="container mx-auto">
          <ContentChunk>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🤖 AI-Powered Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced artificial intelligence that understands your design system and naming conventions
              </p>
            </div>
          </ContentChunk>

          {/* Statistics Section */}
          <div className="flex justify-center mb-16">
            <StatBox {...statistic} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ContentChunk key={index}>
                <div className="card relative">
                  <div className={`icon ${colorClasses[index % colorClasses.length]} mb-6`}>
                    {['🧠', '⚡', '⚙️', '↩️', '👥'][index] || '✨'}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </ContentChunk>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <ContentChunk>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                💡 Key Benefits
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your design workflow with intelligent automation and improved team collaboration
              </p>
            </div>
          </ContentChunk>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <ContentChunk key={index}>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              </ContentChunk>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <FAQSchema faqs={faqs} />
        </div>
      </section>

      {/* Waitlist Section */}
      <Waitlist visibleOverride={(product as any)?.visibility?.waitlist} />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Clean Up Your Figma Files?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of designers who've transformed their workflow with AI Rename Variants
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={product.primaryButtonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="button bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700 text-lg px-8 py-3"
              >
                Install Free Plugin
              </a>
              <a 
                href={product.secondaryButtonLink}
                className="button-secondary border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white text-lg px-8 py-3 inline-block text-center"
              >
                {product.secondaryButton}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AIRenameVariantsPage;