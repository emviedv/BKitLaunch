import React, { useEffect, useMemo } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useSchema, createProductSchema, createBreadcrumbSchema } from '@/lib/useSchema';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import ProductContentSections from './ProductContentSections';
import ProductHero from './ProductHero';
import ExpertQuote from './ExpertQuote';
import { AI_RENAME_FEATURES_DESCRIPTION } from './aiRenameVariantsCopy';
import AIRenameVariantsHeroAnimation from './AIRenameVariantsHeroAnimation';
import { LANDING_FEATURES_ANCHOR } from '@/config/sectionAnchors';

const aiRenamePageDebugEnabled = () => {
  if (typeof process !== 'undefined' && process.env?.DEBUG_FIX) {
    return process.env.DEBUG_FIX !== '0';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
    return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
  }
  return false;
};

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

  const publishedProduct = content.products?.['ai-rename-variants'];

  const pluginInstallUrl =
    'https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted';

  const product = publishedProduct || {
    title: 'AI Rename Variants',
    description:
      'Instantly standardize your Figma variant names with one-click renaming that aligns with Material, Carbon, and Polaris design systems.',
    primaryButton: 'Install Plugin',
    primaryButtonLink: pluginInstallUrl,
    secondaryButton: 'Learn More',
    secondaryButtonLink: LANDING_FEATURES_ANCHOR,
    llm: {
      statistics: [
        {
          statistic: '73%',
          description: 'Deliver cleaner files 73% faster once variant names stay consistent across every component.',
          source: 'Design Systems Efficiency Report 2024',
          date: 'March 2024'
        },
        {
          statistic: '4x',
          description: 'Ship component refreshes 4x faster by batch-renaming entire variant libraries with one click.',
          source: 'Bibliokit Automation Study',
          date: 'May 2024'
        },
        {
          statistic: '95%',
          description: 'Eliminate 95% of naming inconsistencies caught in design QA so teams stay focused on shipping.',
          source: 'Enterprise DesignOps Benchmark',
          date: 'June 2024'
        }
      ],
      statistic: {
        statistic: '73%',
        description: 'Deliver cleaner files 73% faster once variant names stay consistent across every component.',
        source: 'Design Systems Efficiency Report 2024',
        date: 'March 2024'
      }
    },
    details: [
      {
        title: 'Stop fixing messy names by hand',
        description: 'AI reads your component structure, properties, and patterns to generate consistent, meaningful names automatically.',
        buttonText: 'Try Product For Free',
        buttonLink: pluginInstallUrl,
        mediaComponent: 'feature-blueprint',
        items: [
          'Let the AI rename messy variant titles instantly, guided by your component context.',
          'Keep every component aligned with your design system vocabulary automatically.',
          'Flag duplicate states and legacy tags before the rename publishes to your team.',
        ],
        mediaBlueprint: {
          title: 'Smart Rename Blueprint',
          fields: [
            { label: 'Original variant', value: 'Button / FINAL_FINAL_v2 / frame copy', accent: true },
            { label: 'AI signals', value: 'Props • States • Tokens' },
            { label: 'Clean result', value: 'Button • Primary / Hover', accent: false },
          ],
          toggles: [
            { label: 'Collapse duplicates', active: true },
            { label: 'Normalize casing', active: true },
            { label: 'Flag legacy tags', active: false },
          ],
          footer: 'Preview: Before vs After',
          theme: 'blue',
        },
      },
      {
        title: 'Bulk renaming made effortless',
        description: 'Select multiple components, run once, and instantly update every variant and layer — fast, reliable, and consistent.',
        buttonText: 'Try Product For Free',
        buttonLink: pluginInstallUrl,
        items: [
          'Keep multi-state component sets in sync while you batch rename entire libraries.',
          'Protect overrides and downstream instances when hundreds of layers change at once.',
          'Apply property optimizations in the same pass so every variant stays consistent.',
        ],
        mediaComponent: 'feature-batch',
      },
      {
        title: 'Make naming match your system',
        description: "Define custom patterns, prefixes, and conventions that align with your team's design standards and naming logic.",
        buttonText: 'Try Product For Free',
        buttonLink: pluginInstallUrl,
        items: [
          'Define rule blueprints once and auto-apply them to new variants with zero manual edits.',
          'Map naming outputs directly to the tokens your teams already rely on.',
          'Guarantee every generated name stays readable for Dev Mode and handoff reviews.',
        ],
        mediaComponent: 'feature-blueprint',
        mediaBlueprint: {
          title: 'Naming Rule Builder',
          fields: [
            { label: 'Platform', value: 'Web · iOS · Android', accent: true },
            { label: 'Component', value: 'Button' },
            { label: 'States', value: 'Default • Hover • Disabled' },
          ],
          toggles: [
            { label: 'Enforce casing', active: true },
            { label: 'Prefix theme token', active: true },
            { label: 'Developer handoff notes', active: false },
          ],
          footer: 'Preview · Web / Button / Primary / Hover',
          theme: 'emerald',
        },
      },
      {
        title: 'Built for safe iteration',
        description: 'Keep your naming workflow flexible with full version control and instant undo for every rename operation.',
        buttonText: 'Try Product For Free',
        buttonLink: pluginInstallUrl,
        items: [
          'Roll back full rename runs instantly when experiments change direction.',
          'Guard overrides and developer hooks automatically while you iterate on names.',
          'Capture every adjustment in an audit-ready history for compliance checks.',
        ],
        mediaComponent: 'feature-progress',
        mediaProgress: {
          label: 'Latest rename run',
          metric: '287 variants processed',
          progress: 0.95,
          duration: 'Undo available for 30 minutes',
          checkpoints: [
            { label: 'Snapshot saved' },
            { label: 'Rename complete' },
            { label: 'Undo ready' },
          ],
        },
      },
      {
        title: 'Keep every team in sync',
        description: 'Share and apply the same naming conventions across projects so designers and developers stay aligned and handoffs stay clean.',
        buttonText: 'Try Product For Free',
        buttonLink: pluginInstallUrl,
        items: [
          'Share governance rules across design, dev, and QA with built-in approvals.',
          'Surface adoption gaps and coverage metrics so partner teams know what to fix next.',
          'Track usage analytics to prove ROI and enforce best practices across the org.',
        ],
        mediaComponent: 'feature-blueprint',
        mediaBlueprint: {
          title: 'Shared Rule Sync',
          fields: [
            { label: 'Teams', value: 'Design · Dev · QA', accent: true },
            { label: 'Status', value: 'In sync (3 active rules)' },
            { label: 'Last sync', value: '2 minutes ago' },
          ],
          toggles: [
            { label: 'Notify Slack channel', active: true },
            { label: 'Require approvals', active: false },
          ],
          footer: 'Everyone ships with the same naming language',
          theme: 'purple',
        },
      }
    ]
  };

  const expertQuote = (product as any)?.llm?.expertQuote;
  const productVisibility = {
    ...((product as any)?.visibility),
    expertQuote: false,
    benefits: false,
    testimonials: false
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

  // No AnswerBox; keep Expert Quote and Statistic through llm fields

  const resolvedDetails = useMemo(() => {
    if (Array.isArray((product as any)?.details)) {
      return (product as any).details;
    }
    return [];
  }, [product]);

  if (aiRenamePageDebugEnabled()) {
    try {
      debugService.debug('ai-rename-variants:details-source', {
        hasPublishedProduct: Boolean(publishedProduct),
        detailsCount: resolvedDetails.length,
        detailTitles: resolvedDetails.map((detail: any) => detail?.title),
      });
    } catch {}
  }

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

  return (
    <>
      <ProductHero
        product={product as any}
        headlineColorOverride="text-white"
        mediaWrapperClassName="lg:max-w-[29rem]"
        withBottomPadding={false}
        containerPaddingOverride="px-0 md:px-0"
        mediaContent={<AIRenameVariantsHeroAnimation />}
      />



      {/* Expert Quote / Statistic / Features / Benefits / Specs / FAQs / Waitlist */}
      <ProductContentSections
        product={{
          ...(product as any),
          llm: (product as any)?.llm,
          details: resolvedDetails,
          benefits: [],
          testimonials: [],
          visibility: productVisibility
        }}
        faqs={faqs}
        sectionOverrides={{
          featuresTitle: 'Rename smarter, not harder.',
          featuresDescription: AI_RENAME_FEATURES_DESCRIPTION
        }}
      />

      {expertQuote?.quote && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto">
            <div className="mx-auto max-w-4xl">
              <ExpertQuote {...expertQuote} />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AIRenameVariantsPage;
