import React, { useEffect, useMemo } from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';
import { debugService } from '@/lib/debugService';
import ProductContentSections from './ProductContentSections';
import ProductHero from './ProductHero';
import ExpertQuote from './ExpertQuote';
import { AI_RENAME_FEATURES_DESCRIPTION } from './aiRenameVariantsCopy';
import { LANDING_FEATURES_ANCHOR } from '@/config/sectionAnchors';
import { ROUTE_PATHS } from '@/config/routes';

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
    debugService.info('BiblioRename: Page loaded with correct content');
  }, []);

  // Add schema and meta tags for the BiblioRename page
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://www.bibliokit.com';
    const metadata = generateMetadata(ROUTE_PATHS.BIBLIO_RENAME, content, baseUrl);
    updatePageMetadata(metadata);
  }, [content]);

  const canonicalSlug = 'biblio-rename';
  const legacySlug = 'ai-rename-variants';
  const publishedProduct = content.products?.[canonicalSlug] || content.products?.[legacySlug];

  const pluginInstallUrl =
    'https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted';

  const product = publishedProduct || {
    title: 'BiblioRename',
    description:
      'Reads your visual hierarchy to apply consistent names.\nFrame 422 → Primary_Button with no manual rules.',
    lastUpdated: '2025-12-11',
    heroHighlight: {
      label: 'For senior designers and DesignOps: reclaim up to 12 hours/week.',
      icon: 'clock',
      className: 'biblio-rename-hero-highlight'
    },
    primaryButton: 'Get 5 Free Credits',
    primaryButtonLink: pluginInstallUrl,
    primaryButtonIcon: 'arrow-right',
    secondaryButton: 'Learn More',
    secondaryButtonLink: LANDING_FEATURES_ANCHOR,
    callouts: [
      {
        label: 'Install BiblioRename on Figma to auto-rename variants instantly.',
        icon: 'link',
        href: pluginInstallUrl
      }
    ],
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
        description: 'Reads component structure and properties to generate consistent names automatically.',
        buttonText: 'Try Plugin For Free',
        buttonLink: pluginInstallUrl,
        mediaComponent: 'feature-blueprint',
        items: [
          'Map Frame 422 → Primary_Button using component hierarchy signals.',
          'Normalize tokens and states so variant sets ship with consistent names.',
          'Flag duplicates and legacy tags before publishing to the library.',
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
        description: 'Select multiple components once and update every variant and layer reliably.',
        buttonText: 'Try Plugin For Free',
        buttonLink: pluginInstallUrl,
        items: [
          'Batch rename 186 variants in one run while keeping overrides intact.',
          'Keep multi-state component sets aligned after bulk updates.',
          'Apply property and casing rules in the same pass to stay consistent.',
        ],
        mediaComponent: 'feature-blueprint',
        mediaBlueprint: {
          title: 'Batch Rename Run (FPO)',
          fields: [
            { label: 'Scope', value: '24 components · 186 variants', accent: true },
            { label: 'Mode', value: 'Smart rename + token align' },
            { label: 'Status', value: 'In progress' }
          ],
          toggles: [
            { label: 'Preserve overrides', active: true },
            { label: 'Normalize casing', active: true },
            { label: 'Flag legacy tags', active: true }
          ],
          footer: 'Preview · FPO illustration',
          theme: 'ink',
        },
      },
      {
        title: 'Make naming match your system',
        description: 'Define patterns, prefixes, and conventions that match your design standards.',
        buttonText: 'Try Plugin For Free',
        buttonLink: pluginInstallUrl,
        items: [
          'Set naming rules once; auto-apply to new variants without manual edits.',
          'Map outputs to existing tokens for Dev Mode and handoff.',
          'Enforce casing and prefixes so component names stay consistent.',
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

  // No AnswerBox; keep Expert Quote and Statistic through llm fields

  const resolvedDetails = useMemo(() => {
    if (Array.isArray((product as any)?.details)) {
      return (product as any).details;
    }
    return [];
  }, [product]);

  if (aiRenamePageDebugEnabled()) {
    try {
      debugService.debug('biblio-rename:details-source', {
        hasPublishedProduct: Boolean(publishedProduct),
        detailsCount: resolvedDetails.length,
        detailTitles: resolvedDetails.map((detail: any) => detail?.title),
      });
    } catch {}
  }

  const faqs = [
    {
      question: "Is BiblioRename secure for design files?",
      answer: "Yes. Rename logic runs inside Figma; we don't export files or store customer data, and team permissions stay enforced."
    },
    {
      question: "Can we undo a rename run?",
      answer: "Yes. Every pass uses native Figma undo/redo and a run log so you can roll back instantly."
    },
    {
      question: "What happens to our files when we rename?",
      answer: "Only layer and variant names change in place; components, overrides, and instances stay intact with no asset copies."
    }
  ];

  return (
    <>
      <ProductHero
        product={product as any}
        headlineColorOverride="text-white"
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
