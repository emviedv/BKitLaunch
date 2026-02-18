/**
 * Programmatic SEO Content
 *
 * This file contains data for programmatically generated pages that target
 * search patterns at scale. Each page type follows a template structure
 * that can be populated with data to create unique, valuable content.
 */

// =============================================================================
// Type Definitions
// =============================================================================

export type PluginSlug =
  | 'rename-variants'
  | 'componentqa'
  | 'biblioclean'
  | 'statebuilder'
  | 'fixtable'
  | 'organizefile'
  | 'scaleresizer';

export type UseCaseStep = {
  title: string;
  description: string;
  tip?: string;
};

export type UseCasePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  plugin: PluginSlug;
  pluginName: string;
  pluginUrl: string;
  communityUrl: string;
  problem: string;
  problemDetails: string[];
  solution: string;
  steps: UseCaseStep[];
  benefits: string[];
  beforeAfter?: {
    before: string;
    after: string;
    beforeLabel?: string;
    afterLabel?: string;
  };
  faqs: { question: string; answer: string }[];
  relatedUseCases: string[];
  keywords: string[];
};

export type ComparisonPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  verdict: string;
  verdictWinner: 'a' | 'b' | 'depends';
  optionA: {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    bestFor: string;
  };
  optionB: {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    bestFor: string;
  };
  featureTable: { feature: string; optionA: string; optionB: string }[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
};

export type PersonaPage = {
  slug: string;
  persona: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroText: string;
  painPoints: { title: string; description: string }[];
  recommendedPlugins: {
    slug: PluginSlug;
    name: string;
    reason: string;
    url: string;
  }[];
  workflow: { step: number; action: string; plugin?: string }[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
};

export type GlossaryPage = {
  slug: string;
  term: string;
  definition: string;
  metaTitle: string;
  metaDescription: string;
  context: string;
  examples?: string[];
  relatedTerms: string[];
  pluginCta?: {
    plugin: PluginSlug;
    pluginName: string;
    text: string;
    url: string;
  };
  keywords: string[];
};

// =============================================================================
// Plugin Reference Data
// =============================================================================

export const PLUGIN_DATA: Record<PluginSlug, {
  name: string;
  pageUrl: string;
  communityUrl: string;
  tagline: string;
}> = {
  'rename-variants': {
    name: 'RenameVariantsAI',
    pageUrl: '/figma-component-variant-renamer',
    communityUrl: 'https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted',
    tagline: 'AI-powered batch renaming for Figma layers and variants'
  },
  'componentqa': {
    name: 'ComponentQA',
    pageUrl: '/figma-design-system-audit-plugin',
    communityUrl: 'https://www.figma.com/community/plugin/1564328602359376130/componentqa-find-detached-instances-design-system-check',
    tagline: 'Automated design system audits and detached instance detection'
  },
  'biblioclean': {
    name: 'BiblioClean',
    pageUrl: '/figma-plugin-remove-prototype-links',
    communityUrl: 'https://www.figma.com/community/plugin/1573014835821113198/biblioclean-remove-prototype-links-blue-lines',
    tagline: 'Safely remove prototype links and blue lines from Figma files'
  },
  'statebuilder': {
    name: 'StateBuilder',
    pageUrl: '/figma-component-states',
    communityUrl: 'https://www.figma.com/community/plugin/1576299538313439140/bibliostates-component-state-generator-specs',
    tagline: 'Auto-generate component states and documentation specs'
  },
  'fixtable': {
    name: 'FixTable',
    pageUrl: '/figma-table-builder',
    communityUrl: 'https://www.figma.com/community/plugin/1580378065847525472/bibliotable-auto-layout-table-fixer-data-aligner',
    tagline: 'Fix auto-layout tables with one click'
  },
  'organizefile': {
    name: 'OrganizeFile',
    pageUrl: '/figma-organize-design-files-plugin',
    communityUrl: 'https://www.figma.com/community/plugin/1590764972487321562/organizefile-figma-organize-design-file-plugin-setup',
    tagline: 'One-click project scaffolding for Figma files'
  },
  'scaleresizer': {
    name: 'ScaleResizer',
    pageUrl: '/figma-marketing-resizer-plugin',
    communityUrl: 'https://www.figma.com/community/plugin/scaleresizer',
    tagline: 'AI-powered marketing frame resizer'
  }
};

// =============================================================================
// Use Case Pages Data
// =============================================================================

export const USE_CASE_PAGES: UseCasePage[] = [
  // -----------------------------------------------------------------------------
  // RenameVariantsAI Use Cases
  // -----------------------------------------------------------------------------
  {
    slug: 'batch-rename-figma-layers',
    title: 'How to Batch Rename Figma Layers',
    metaTitle: 'Batch Rename Figma Layers in Seconds | RenameVariantsAI',
    metaDescription: 'Learn how to batch rename hundreds of Figma layers instantly with AI. Stop renaming manually and standardize your component naming in one click.',
    plugin: 'rename-variants',
    pluginName: 'RenameVariantsAI',
    pluginUrl: '/figma-component-variant-renamer',
    communityUrl: PLUGIN_DATA['rename-variants'].communityUrl,
    problem: 'Renaming Figma layers one by one wastes hours every week',
    problemDetails: [
      'You inherit a file with layers named "Frame 422", "Rectangle 17", and "Group copy copy"',
      'Manual renaming is tedious and error-prone',
      'Inconsistent naming breaks developer handoff and design system governance',
      'Find-and-replace only works for exact matches, not semantic patterns'
    ],
    solution: 'RenameVariantsAI uses context-aware AI to batch rename hundreds of layers in seconds. It reads component structure, variant properties, and token patterns to generate consistent, semantic names automatically.',
    steps: [
      {
        title: 'Select your layers or components',
        description: 'Select the layers, frames, or component sets you want to rename. You can select individual items or entire pages.',
        tip: 'Use Cmd/Ctrl+A to select all layers on a page for bulk renaming.'
      },
      {
        title: 'Run RenameVariantsAI',
        description: 'Open the plugin from Plugins > RenameVariantsAI. The AI analyzes your selection and suggests semantic names based on hierarchy, properties, and content.',
        tip: 'The plugin respects your existing naming conventions and extends them consistently.'
      },
      {
        title: 'Review and apply',
        description: 'Preview the suggested names in the before/after view. Adjust any names manually if needed, then click Apply to rename all layers instantly.',
        tip: 'Use Cmd/Ctrl+Z to undo if you need to revert any changes.'
      }
    ],
    benefits: [
      'Rename 100+ layers in under 10 seconds',
      'AI understands component context and variant properties',
      'Maintains consistency with your existing naming patterns',
      'Non-destructive with full undo support',
      'Works with nested components and auto-layout frames'
    ],
    beforeAfter: {
      before: 'Frame 422, Rectangle 17, Group copy, Button_FINAL_v2',
      after: 'Hero/Container, Hero/Background, Hero/CTA-Group, Button/Primary/Default',
      beforeLabel: 'Messy layer names',
      afterLabel: 'Clean, semantic names'
    },
    faqs: [
      {
        question: 'How many layers can I rename at once?',
        answer: 'RenameVariantsAI can process hundreds of layers in a single batch. We have tested it with files containing 1,000+ layers without performance issues.'
      },
      {
        question: 'Will this break my component instances?',
        answer: 'No. RenameVariantsAI only changes layer names, not component structure. All instances, overrides, and links remain intact.'
      },
      {
        question: 'Can I customize the naming convention?',
        answer: 'Yes. You can set custom rules for prefixes, casing (camelCase, PascalCase, kebab-case), and separators to match your design system standards.'
      },
      {
        question: 'Does it work with variants and component properties?',
        answer: 'Absolutely. The AI reads variant properties and generates names that reflect state (Hover, Disabled), size (Small, Large), and other properties.'
      }
    ],
    relatedUseCases: [
      'standardize-variant-names',
      'rename-layers-before-handoff',
      'enforce-naming-conventions'
    ],
    keywords: [
      'batch rename figma layers',
      'figma layer renaming',
      'bulk rename figma',
      'rename multiple layers figma',
      'figma naming convention',
      'figma layer organization'
    ]
  },

  // -----------------------------------------------------------------------------
  // ComponentQA Use Cases
  // -----------------------------------------------------------------------------
  {
    slug: 'find-detached-instances-figma',
    title: 'How to Find Detached Instances in Figma',
    metaTitle: 'Find Detached Instances in Figma Instantly | ComponentQA',
    metaDescription: 'Quickly locate every detached component instance in your Figma file. Audit your design system health and fix broken components before handoff.',
    plugin: 'componentqa',
    pluginName: 'ComponentQA',
    pluginUrl: '/figma-design-system-audit-plugin',
    communityUrl: PLUGIN_DATA['componentqa'].communityUrl,
    problem: 'Detached instances break your design system and create inconsistency',
    problemDetails: [
      'Designers detach instances to make quick edits, then forget about them',
      'Detached components do not update when the main component changes',
      'Manual auditing is impossible in large files with thousands of instances',
      'Broken components ship to production, creating tech debt'
    ],
    solution: 'ComponentQA scans your entire Figma file and identifies every detached instance in seconds. Get a clear report showing exactly where detached components are located so you can fix them or convert them back to instances.',
    steps: [
      {
        title: 'Open ComponentQA',
        description: 'Launch the plugin from Plugins > ComponentQA. Choose your audit scope: current selection, current page, or entire file.',
        tip: 'For large files, start with a single page to see results faster.'
      },
      {
        title: 'Run the audit',
        description: 'Click "Run Audit" and ComponentQA scans for detached instances, dirty overrides, missing tokens, and other issues. Results appear in a categorized list.',
        tip: 'The audit typically completes in under 30 seconds, even for files with 100+ pages.'
      },
      {
        title: 'Review and fix',
        description: 'Click any issue to navigate directly to the problem layer. Decide whether to reconnect the instance, update the main component, or intentionally keep it detached.',
        tip: 'Use the "Select All" feature to select all detached instances at once for bulk operations.'
      }
    ],
    benefits: [
      'Find every detached instance in seconds, not hours',
      'Navigate directly to problem layers with one click',
      'Audit entire files or specific pages',
      'Track design system health over time',
      'Export audit reports for stakeholders'
    ],
    faqs: [
      {
        question: 'What counts as a detached instance?',
        answer: 'A detached instance is a component that was disconnected from its main component using "Detach Instance." It no longer receives updates when the main component changes.'
      },
      {
        question: 'Can ComponentQA fix detached instances automatically?',
        answer: 'ComponentQA locates and highlights detached instances so you can make informed decisions. Automatic fixes would risk overwriting intentional customizations, so we leave the final action to you.'
      },
      {
        question: 'How is this different from Figma native search?',
        answer: 'Figma native search cannot filter by "detached status." ComponentQA specifically identifies instances that were detached from their main components and provides context about why they might have been detached.'
      },
      {
        question: 'Does it work with external libraries?',
        answer: 'Yes. ComponentQA can detect instances from external libraries that have been detached, even if you do not have edit access to the original library.'
      }
    ],
    relatedUseCases: [
      'audit-design-system-figma',
      'validate-design-tokens',
      'qa-before-handoff'
    ],
    keywords: [
      'find detached instances figma',
      'figma detached component',
      'design system audit figma',
      'figma component health',
      'detached instance finder',
      'figma QA tool'
    ]
  },

  // -----------------------------------------------------------------------------
  // BiblioClean Use Cases
  // -----------------------------------------------------------------------------
  {
    slug: 'remove-prototype-links-figma',
    title: 'How to Remove Prototype Links in Figma',
    metaTitle: 'Remove Prototype Links in Figma Safely | BiblioClean',
    metaDescription: 'Quickly remove all prototype links and blue lines from your Figma file without breaking components. Clean up before handoff in one click.',
    plugin: 'biblioclean',
    pluginName: 'BiblioClean',
    pluginUrl: '/figma-plugin-remove-prototype-links',
    communityUrl: PLUGIN_DATA['biblioclean'].communityUrl,
    problem: 'Prototype links create visual clutter and confuse developers',
    problemDetails: [
      'Blue prototype lines make files look messy and unprofessional',
      'Old prototype flows point to deleted or outdated frames',
      'Developers waste time following incorrect interaction paths',
      'Manually removing links one by one takes forever in large files'
    ],
    solution: 'BiblioClean removes all prototype links from your selection or entire page in one click. It safely handles components, warns you before touching shared library assets, and provides a full history log for undo.',
    steps: [
      {
        title: 'Select your scope',
        description: 'Choose what to clean: your current selection, the entire page, or specific frames. BiblioClean works with any selection size.',
        tip: 'Start with a single page if you want to review the results before cleaning the whole file.'
      },
      {
        title: 'Run BiblioClean',
        description: 'Open the plugin and click "Clean Links." BiblioClean scans for prototype connections, external URLs, and hotspot interactions.',
        tip: 'Enable "Show Warnings" to get alerts before removing links from main components.'
      },
      {
        title: 'Review the cleanup report',
        description: 'BiblioClean shows exactly how many links were removed and from which frames. Use the history log to undo any changes if needed.',
        tip: 'The plugin tracks time saved so you can see how much manual work you avoided.'
      }
    ],
    benefits: [
      'Remove hundreds of prototype links in seconds',
      'Safety warnings protect main components and libraries',
      'Full history log with one-click undo',
      'Clean files improve handoff clarity',
      'Works with nested frames and auto-layout'
    ],
    faqs: [
      {
        question: 'Will this remove links from my main components?',
        answer: 'BiblioClean warns you before removing links from main components or shared library assets. You can choose to skip these or proceed with full awareness.'
      },
      {
        question: 'Can I undo the cleanup?',
        answer: 'Yes. BiblioClean works with Figma native undo (Cmd/Ctrl+Z). We also keep a history log so you can see exactly what was removed.'
      },
      {
        question: 'Does it remove scroll interactions too?',
        answer: 'BiblioClean focuses on navigation links (the blue lines). Scroll behaviors and other interactions can be preserved or removed based on your settings.'
      },
      {
        question: 'What about links to external URLs?',
        answer: 'Yes, BiblioClean can remove external URL links attached to frames. This is useful for cleaning up old marketing links or placeholder URLs.'
      }
    ],
    relatedUseCases: [
      'clean-figma-file-handoff',
      'prepare-file-for-developers',
      'remove-blue-lines-figma'
    ],
    keywords: [
      'remove prototype links figma',
      'figma blue lines remove',
      'clean figma prototype',
      'delete all interactions figma',
      'figma prototype cleanup',
      'remove figma connections'
    ]
  },

  // -----------------------------------------------------------------------------
  // FixTable Use Cases
  // -----------------------------------------------------------------------------
  {
    slug: 'fix-figma-table-alignment',
    title: 'How to Fix Table Alignment in Figma',
    metaTitle: 'Fix Figma Table Alignment in One Click | FixTable',
    metaDescription: 'Instantly fix misaligned columns, uneven row heights, and sub-pixel bugs in Figma tables. Normalize auto-layout tables without manual resizing.',
    plugin: 'fixtable',
    pluginName: 'FixTable',
    pluginUrl: '/figma-table-builder',
    communityUrl: PLUGIN_DATA['fixtable'].communityUrl,
    problem: 'Figma tables break when content changes or data varies',
    problemDetails: [
      'Column widths become uneven when cell content changes',
      'Sub-pixel positioning creates 1px misalignment bugs',
      'Auto-layout tables do not maintain consistent column widths',
      'Manually fixing 50+ row tables takes hours'
    ],
    solution: 'FixTable analyzes your auto-layout table structure and normalizes column widths, row heights, and alignment in one click. It detects the widest cell in each column and applies consistent sizing across all rows.',
    steps: [
      {
        title: 'Select your table',
        description: 'Select the auto-layout frame containing your table. FixTable works with standard row/column structures built with auto-layout.',
        tip: 'FixTable detects table structure automatically based on nesting patterns.'
      },
      {
        title: 'Run FixTable',
        description: 'Open the plugin and click "Fix Table." FixTable scans the table structure, identifies column boundaries, and calculates optimal widths.',
        tip: 'Use "Preview" mode to see changes before applying them.'
      },
      {
        title: 'Apply fixes',
        description: 'Review the proposed fixes and click Apply. FixTable normalizes widths, fixes sub-pixel bugs, and optionally adds zebra striping.',
        tip: 'Enable "Zebra Striping" to add alternating row colors for better readability.'
      }
    ],
    benefits: [
      'Fix entire tables in one click',
      'Automatic sub-pixel bug detection and repair',
      'Works with complex nested auto-layout structures',
      'Optional zebra striping for readability',
      'Non-destructive with full undo support'
    ],
    beforeAfter: {
      before: 'Columns: 120px, 87px, 142px, 95px (misaligned)',
      after: 'Columns: 142px, 142px, 142px, 142px (normalized)',
      beforeLabel: 'Uneven columns',
      afterLabel: 'Perfectly aligned'
    },
    faqs: [
      {
        question: 'What table structures does FixTable support?',
        answer: 'FixTable works with auto-layout tables where rows are horizontal frames and columns are defined by cell positions. It supports headers, body rows, and footer rows.'
      },
      {
        question: 'Will this break my responsive table behavior?',
        answer: 'FixTable applies fixed widths to normalize alignment. If you need fill-container behavior for the wrapper, it preserves that while fixing internal column widths.'
      },
      {
        question: 'Can I customize the zebra stripe colors?',
        answer: 'Yes. You can select custom fill colors for alternating rows to match your design system tokens.'
      },
      {
        question: 'How does it detect table structure?',
        answer: 'FixTable analyzes auto-layout direction and nesting to identify rows, columns, and cells. It works best with conventional table structures using horizontal rows.'
      }
    ],
    relatedUseCases: [
      'normalize-figma-columns',
      'add-zebra-striping-figma',
      'fix-subpixel-bugs-figma'
    ],
    keywords: [
      'fix figma table',
      'figma table alignment',
      'normalize figma columns',
      'figma auto-layout table',
      'fix table widths figma',
      'figma table plugin'
    ]
  },

  // -----------------------------------------------------------------------------
  // ComponentQA - Design System Audit
  // -----------------------------------------------------------------------------
  {
    slug: 'audit-design-system-figma',
    title: 'How to Audit Your Design System in Figma',
    metaTitle: 'Audit Your Figma Design System Automatically | ComponentQA',
    metaDescription: 'Run automated design system audits in Figma. Find token drift, detached instances, dirty overrides, and governance issues in minutes.',
    plugin: 'componentqa',
    pluginName: 'ComponentQA',
    pluginUrl: '/figma-design-system-audit-plugin',
    communityUrl: PLUGIN_DATA['componentqa'].communityUrl,
    problem: 'Design system drift happens silently and compounds over time',
    problemDetails: [
      'Teams create one-off styles instead of using tokens',
      'Component overrides accumulate without review',
      'No visibility into which files follow design system rules',
      'Manual audits are too slow to run regularly'
    ],
    solution: 'ComponentQA runs comprehensive design system audits in seconds. It checks for token usage, component health, override patterns, and accessibility issues across your entire file or selected pages.',
    steps: [
      {
        title: 'Configure audit rules',
        description: 'Set which checks to run: detached instances, token validation, color drift, spacing issues, and accessibility warnings.',
        tip: 'Start with the default ruleset and customize based on your design system requirements.'
      },
      {
        title: 'Run the audit',
        description: 'Select your scope (page or file) and click "Run Audit." ComponentQA analyzes every layer against your rules and generates a categorized report.',
        tip: 'Schedule weekly audits by saving your configuration for quick re-runs.'
      },
      {
        title: 'Triage and fix issues',
        description: 'Review issues by severity. Click any issue to navigate directly to the problem layer. Mark issues as "Ignored" if they are intentional deviations.',
        tip: 'Export the audit report to share with your team or include in design reviews.'
      }
    ],
    benefits: [
      'Audit entire files in under 60 seconds',
      'Customizable rules for your design system',
      'Severity levels help prioritize fixes',
      'Track improvement over time',
      'Exportable reports for stakeholders'
    ],
    faqs: [
      {
        question: 'What does ComponentQA check for?',
        answer: 'ComponentQA audits detached instances, dirty overrides, non-token colors, spacing violations, deprecated components, accessibility contrast, and more. You can enable or disable individual checks.'
      },
      {
        question: 'Can I audit multiple files at once?',
        answer: 'Currently, ComponentQA audits one file at a time. For multi-file audits, you can run the plugin in each file and compare reports.'
      },
      {
        question: 'How do I define my design system rules?',
        answer: 'ComponentQA reads your published styles and variables as the source of truth. Any deviation from these tokens is flagged as potential drift.'
      },
      {
        question: 'Can I ignore intentional deviations?',
        answer: 'Yes. You can mark specific issues as "Ignored" so they do not appear in future audits. This is useful for approved exceptions.'
      }
    ],
    relatedUseCases: [
      'find-detached-instances-figma',
      'validate-design-tokens',
      'qa-before-handoff'
    ],
    keywords: [
      'design system audit figma',
      'figma governance tool',
      'design token validation',
      'component health check',
      'design system drift',
      'figma QA automation'
    ]
  }
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Find a use case page by slug
 */
export const findUseCaseBySlug = (slug: string): UseCasePage | undefined => {
  return USE_CASE_PAGES.find(page => page.slug === slug);
};

/**
 * Get all use cases for a specific plugin
 */
export const getUseCasesForPlugin = (plugin: PluginSlug): UseCasePage[] => {
  return USE_CASE_PAGES.filter(page => page.plugin === plugin);
};

/**
 * Get related use case pages
 */
export const getRelatedUseCases = (currentSlug: string): UseCasePage[] => {
  const current = findUseCaseBySlug(currentSlug);
  if (!current) return [];

  return current.relatedUseCases
    .map(slug => findUseCaseBySlug(slug))
    .filter((page): page is UseCasePage => page !== undefined);
};

/**
 * Get all use case slugs for sitemap generation
 */
export const getAllUseCaseSlugs = (): string[] => {
  return USE_CASE_PAGES.map(page => page.slug);
};

// =============================================================================
// Comparison Pages Data (Phase 2 - Placeholder)
// =============================================================================

export const COMPARISON_PAGES: ComparisonPage[] = [];

// =============================================================================
// Persona Pages Data (Phase 3 - Placeholder)
// =============================================================================

export const PERSONA_PAGES: PersonaPage[] = [];

// =============================================================================
// Glossary Pages Data (Phase 4 - Placeholder)
// =============================================================================

export const GLOSSARY_PAGES: GlossaryPage[] = [];
