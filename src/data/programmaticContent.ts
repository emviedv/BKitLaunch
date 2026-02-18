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
  },

  // -----------------------------------------------------------------------------
  // RenameVariantsAI - Variant Names
  // -----------------------------------------------------------------------------
  {
    slug: 'standardize-figma-variant-names',
    title: 'How to Standardize Variant Names in Figma',
    metaTitle: 'Standardize Figma Variant Names Automatically | RenameVariantsAI',
    metaDescription: 'Automatically standardize variant property names across your Figma components. Convert Size=sm to Size=Small and enforce consistent naming patterns.',
    plugin: 'rename-variants',
    pluginName: 'RenameVariantsAI',
    pluginUrl: '/figma-component-variant-renamer',
    communityUrl: PLUGIN_DATA['rename-variants'].communityUrl,
    problem: 'Inconsistent variant names create confusion and break design tokens',
    problemDetails: [
      'Different designers use different conventions: sm vs Small vs small',
      'Component properties become impossible to map to code tokens',
      'Search and filtering breaks when naming is inconsistent',
      'Manual standardization across hundreds of variants is impractical'
    ],
    solution: 'RenameVariantsAI detects variant property patterns and applies consistent naming rules across your entire component library. It supports predefined conventions or custom rules you define.',
    steps: [
      {
        title: 'Select components with variants',
        description: 'Select one or more component sets containing variants. RenameVariantsAI works with any component that has variant properties.',
        tip: 'Select your entire component library page to standardize everything at once.'
      },
      {
        title: 'Choose naming convention',
        description: 'Select from preset conventions (PascalCase, camelCase, kebab-case) or define custom mappings like sm→Small, md→Medium, lg→Large.',
        tip: 'Import your design token naming rules to ensure perfect alignment with code.'
      },
      {
        title: 'Preview and apply',
        description: 'Review all proposed changes in the preview panel. Each property transformation is shown with before/after values. Click Apply when ready.',
        tip: 'Changes are non-destructive and can be undone with Cmd/Ctrl+Z.'
      }
    ],
    benefits: [
      'Standardize hundreds of variants in seconds',
      'Preset conventions for common patterns',
      'Custom mapping rules for your token system',
      'Preview all changes before applying',
      'Works across multiple component sets'
    ],
    beforeAfter: {
      before: 'Size=sm, Size=med, Size=lg, State=hov',
      after: 'Size=Small, Size=Medium, Size=Large, State=Hover',
      beforeLabel: 'Inconsistent abbreviations',
      afterLabel: 'Standardized names'
    },
    faqs: [
      {
        question: 'Will this break existing instances?',
        answer: 'No. Figma automatically updates all instances when variant names change. Your designs remain intact.'
      },
      {
        question: 'Can I define custom naming rules?',
        answer: 'Yes. You can create custom mappings like "hov→Hover" or "pri→Primary" to match your specific conventions.'
      },
      {
        question: 'Does it work with boolean properties?',
        answer: 'Absolutely. RenameVariantsAI handles boolean, string, and instance-swap properties equally well.'
      }
    ],
    relatedUseCases: [
      'batch-rename-figma-layers',
      'rename-figma-layers-before-handoff'
    ],
    keywords: [
      'standardize variant names figma',
      'figma variant naming convention',
      'rename component properties figma',
      'figma design tokens naming',
      'consistent variant names'
    ]
  },

  // -----------------------------------------------------------------------------
  // RenameVariantsAI - Pre-Handoff
  // -----------------------------------------------------------------------------
  {
    slug: 'rename-figma-layers-before-handoff',
    title: 'How to Rename Figma Layers Before Developer Handoff',
    metaTitle: 'Rename Figma Layers Before Handoff | RenameVariantsAI',
    metaDescription: 'Clean up layer names before developer handoff. Transform Frame 422 and Group copy into semantic names that map to code components.',
    plugin: 'rename-variants',
    pluginName: 'RenameVariantsAI',
    pluginUrl: '/figma-component-variant-renamer',
    communityUrl: PLUGIN_DATA['rename-variants'].communityUrl,
    problem: 'Messy layer names waste developer time and create confusion',
    problemDetails: [
      'Developers see "Frame 422" and have no idea what it represents',
      'Exported assets get names like "Rectangle-17.svg"',
      'CSS class names derived from layer names become meaningless',
      'Questions back to design slow down the entire team'
    ],
    solution: 'RenameVariantsAI generates semantic layer names based on component structure and content. Prepare your file for handoff by renaming everything in one pass.',
    steps: [
      {
        title: 'Select handoff frames',
        description: 'Select the frames or pages that will be handed off to developers. Include all relevant screens and components.',
        tip: 'Use Cmd/Ctrl+A on a page to select all frames at once.'
      },
      {
        title: 'Run AI renaming',
        description: 'RenameVariantsAI analyzes layer hierarchy, content, and component relationships to generate meaningful names.',
        tip: 'Enable "Developer-Friendly Mode" to use hyphenated names that work well as CSS classes.'
      },
      {
        title: 'Export clean assets',
        description: 'With semantic layer names in place, exports produce clean file names like "hero-cta-button.svg" instead of "Group-copy-2.svg".',
        tip: 'Run the plugin immediately before export to catch any last-minute additions.'
      }
    ],
    benefits: [
      'Semantic names that map to code components',
      'Clean asset export file names',
      'Reduced developer questions',
      'Faster handoff reviews',
      'Better design-to-code documentation'
    ],
    faqs: [
      {
        question: 'What naming format works best for developers?',
        answer: 'Most teams prefer kebab-case (hero-section) or camelCase (heroSection) for layer names. RenameVariantsAI supports both conventions.'
      },
      {
        question: 'Does it rename hidden layers?',
        answer: 'Yes, hidden layers are renamed too. This is useful because developers often need to access hidden states in the layer panel.'
      },
      {
        question: 'Can I exclude certain layers?',
        answer: 'Yes. You can lock layers you do not want renamed, and RenameVariantsAI will skip them.'
      }
    ],
    relatedUseCases: [
      'batch-rename-figma-layers',
      'standardize-figma-variant-names'
    ],
    keywords: [
      'rename layers before handoff',
      'figma developer handoff',
      'clean layer names figma',
      'figma export naming',
      'semantic layer names'
    ]
  },

  // -----------------------------------------------------------------------------
  // StateBuilder Use Cases
  // -----------------------------------------------------------------------------
  {
    slug: 'create-button-states-figma',
    title: 'How to Create Button States in Figma',
    metaTitle: 'Create Button States in Figma Automatically | StateBuilder',
    metaDescription: 'Auto-generate Default, Hover, Active, Disabled, and Focus states for your Figma buttons. Build complete interaction specs in one click.',
    plugin: 'statebuilder',
    pluginName: 'StateBuilder',
    pluginUrl: '/figma-component-states',
    communityUrl: PLUGIN_DATA['statebuilder'].communityUrl,
    problem: 'Creating button states manually is tedious and error-prone',
    problemDetails: [
      'Each button variant needs 5-6 states: Default, Hover, Active, Focus, Disabled',
      'Multiply by sizes and styles: Primary, Secondary, Ghost in Small, Medium, Large',
      'Maintaining consistency across 50+ button variants is exhausting',
      'Missing states cause incomplete developer specs'
    ],
    solution: 'StateBuilder generates all interaction states from your base button design. Define state rules once, then apply them to every button variant automatically.',
    steps: [
      {
        title: 'Select your base button',
        description: 'Select the default state of your button component. StateBuilder uses this as the source for generating other states.',
        tip: 'Make sure your base button uses proper auto-layout and design tokens.'
      },
      {
        title: 'Configure state rules',
        description: 'Define how each state differs from default: Hover lightens fill 10%, Active darkens 5%, Disabled reduces opacity to 50%.',
        tip: 'Save state rules as presets to apply the same logic to future components.'
      },
      {
        title: 'Generate states',
        description: 'Click Generate to create all configured states as new variants. StateBuilder adds them to your component set with proper naming.',
        tip: 'Review generated states and tweak if needed - StateBuilder gets you 90% there.'
      }
    ],
    benefits: [
      'Generate 5+ button states in seconds',
      'Consistent state rules across all buttons',
      'Proper variant structure for prototyping',
      'Complete specs for developers',
      'Reusable state presets'
    ],
    beforeAfter: {
      before: '1 button variant (Default only)',
      after: '6 button variants (Default, Hover, Active, Focus, Disabled, Loading)',
      beforeLabel: 'Single state',
      afterLabel: 'Complete state set'
    },
    faqs: [
      {
        question: 'What states does StateBuilder generate?',
        answer: 'Default, Hover, Active/Pressed, Focus, Disabled, and optionally Loading. You can customize which states to include.'
      },
      {
        question: 'Does it work with existing button components?',
        answer: 'Yes. Select your existing button component and StateBuilder adds new states as additional variants.'
      },
      {
        question: 'Can I customize the state transformations?',
        answer: 'Absolutely. Define custom rules like "Hover: fill lightness +10%" or "Disabled: opacity 40%".'
      }
    ],
    relatedUseCases: [
      'generate-hover-states-figma',
      'build-component-variants-figma'
    ],
    keywords: [
      'button states figma',
      'figma hover state',
      'create disabled state figma',
      'figma component states',
      'button variants figma'
    ]
  },

  {
    slug: 'generate-hover-states-figma',
    title: 'How to Generate Hover States in Figma',
    metaTitle: 'Generate Hover States in Figma Automatically | StateBuilder',
    metaDescription: 'Automatically create hover states for cards, buttons, and links in Figma. Apply consistent hover effects across your entire design system.',
    plugin: 'statebuilder',
    pluginName: 'StateBuilder',
    pluginUrl: '/figma-component-states',
    communityUrl: PLUGIN_DATA['statebuilder'].communityUrl,
    problem: 'Creating hover states one by one slows down design work',
    problemDetails: [
      'Every interactive element needs a hover state',
      'Hover effects must be consistent: same shadow, same color shift',
      'Forgetting hover states leads to incomplete prototypes',
      'Updating hover logic means editing dozens of components'
    ],
    solution: 'StateBuilder generates hover states by applying your defined transformations to any selected component. Set hover rules once, apply everywhere.',
    steps: [
      {
        title: 'Select components',
        description: 'Select the components that need hover states: cards, buttons, links, list items, or any interactive element.',
        tip: 'Select multiple components to generate hover states in batch.'
      },
      {
        title: 'Define hover transformation',
        description: 'Configure hover effects: background lightness, shadow elevation, border color, scale transform, or custom CSS-like rules.',
        tip: 'Common hover effects: +10% lightness, add shadow, or 1.02 scale.'
      },
      {
        title: 'Generate and review',
        description: 'Click Generate to create hover variants. StateBuilder names them correctly (e.g., State=Hover) for use in prototyping.',
        tip: 'Use the generated states in Figma prototype mode for instant hover interactions.'
      }
    ],
    benefits: [
      'Consistent hover effects everywhere',
      'Batch generate across components',
      'Prototype-ready variant naming',
      'Save hover presets for reuse',
      'Works with nested components'
    ],
    faqs: [
      {
        question: 'What hover effects can I apply?',
        answer: 'Fill lightness/darkness, shadow depth, border color, opacity, scale, and position offset. Combine multiple effects for rich hovers.'
      },
      {
        question: 'Does it create separate variants or frames?',
        answer: 'StateBuilder creates proper variants within your component set, making them usable in Figma prototyping.'
      },
      {
        question: 'Can I hover-enable non-components?',
        answer: 'Yes, but converting to components first is recommended so the hover state stays linked.'
      }
    ],
    relatedUseCases: [
      'create-button-states-figma',
      'build-component-variants-figma'
    ],
    keywords: [
      'hover state figma',
      'figma hover effect',
      'generate hover figma',
      'card hover state',
      'interactive states figma'
    ]
  },

  // -----------------------------------------------------------------------------
  // OrganizeFile Use Cases
  // -----------------------------------------------------------------------------
  {
    slug: 'organize-figma-file-structure',
    title: 'How to Organize Your Figma File Structure',
    metaTitle: 'Organize Figma File Structure in One Click | OrganizeFile',
    metaDescription: 'Create a clean, consistent Figma file structure with organized pages for components, screens, and documentation. Set up new projects in seconds.',
    plugin: 'organizefile',
    pluginName: 'OrganizeFile',
    pluginUrl: '/figma-organize-design-files-plugin',
    communityUrl: PLUGIN_DATA['organizefile'].communityUrl,
    problem: 'Figma files become disorganized chaos over time',
    problemDetails: [
      'New files start as a blank canvas with no structure',
      'Pages get added randomly: "Page 1", "Untitled", "test"',
      'Different designers use different organization systems',
      'Onboarding new team members takes forever'
    ],
    solution: 'OrganizeFile creates a standardized page structure for any Figma file. Choose from templates or define your own structure, then apply it with one click.',
    steps: [
      {
        title: 'Choose a template',
        description: 'Select from preset structures: Product Design (Flows, Components, Screens), Design System (Foundations, Components, Patterns), or Custom.',
        tip: 'Create custom templates for your team to ensure consistency across all projects.'
      },
      {
        title: 'Configure pages',
        description: 'Review the proposed page structure. Add, remove, or rename pages to fit your project needs.',
        tip: 'Include documentation pages like "Changelog" or "Decisions" for complex projects.'
      },
      {
        title: 'Apply structure',
        description: 'Click Apply to create all pages with proper naming and ordering. OrganizeFile also adds cover frames and section dividers.',
        tip: 'Existing content is preserved - OrganizeFile only adds new pages.'
      }
    ],
    benefits: [
      'Consistent file structure across projects',
      'Onboard team members faster',
      'Preset templates for common use cases',
      'Custom templates for your workflow',
      'Cover frames and section markers included'
    ],
    beforeAfter: {
      before: 'Page 1, Untitled, test, old stuff, FINAL',
      after: 'Cover, Flows, Components, Screens, Archive',
      beforeLabel: 'Chaotic pages',
      afterLabel: 'Organized structure'
    },
    faqs: [
      {
        question: 'Will this delete my existing pages?',
        answer: 'No. OrganizeFile only adds new pages and optionally renames existing ones. Your content is never deleted.'
      },
      {
        question: 'Can I save my own templates?',
        answer: 'Yes. Create your ideal page structure and save it as a team template for future projects.'
      },
      {
        question: 'Does it work with existing messy files?',
        answer: 'Yes. OrganizeFile can reorganize existing files by suggesting which pages should be renamed or merged.'
      }
    ],
    relatedUseCases: [
      'create-figma-file-template',
      'standardize-figma-page-naming'
    ],
    keywords: [
      'organize figma file',
      'figma file structure',
      'figma page organization',
      'figma project setup',
      'figma file template'
    ]
  },

  {
    slug: 'create-figma-file-template',
    title: 'How to Create a Figma File Template',
    metaTitle: 'Create Figma File Templates Quickly | OrganizeFile',
    metaDescription: 'Build reusable Figma file templates with pre-configured pages, components, and documentation. Start every project with best practices.',
    plugin: 'organizefile',
    pluginName: 'OrganizeFile',
    pluginUrl: '/figma-organize-design-files-plugin',
    communityUrl: PLUGIN_DATA['organizefile'].communityUrl,
    problem: 'Starting new projects from scratch wastes time and loses best practices',
    problemDetails: [
      'Every new file requires recreating the same page structure',
      'Standard documentation pages get forgotten',
      'Teams cannot enforce project setup standards',
      'Tribal knowledge about file organization gets lost'
    ],
    solution: 'OrganizeFile lets you create and save file templates that capture your team best practices. Apply templates to new files or existing projects instantly.',
    steps: [
      {
        title: 'Design your template',
        description: 'Create the ideal file structure: pages, cover frame, section markers, and placeholder content.',
        tip: 'Include a README page with project setup instructions.'
      },
      {
        title: 'Save as template',
        description: 'Open OrganizeFile and click "Save Current Structure." Name your template and add a description.',
        tip: 'Create separate templates for different project types: MVP, Marketing, Design System.'
      },
      {
        title: 'Apply to new files',
        description: 'In any new file, run OrganizeFile and select your saved template. The entire structure is created in seconds.',
        tip: 'Share templates with your team so everyone uses the same starting point.'
      }
    ],
    benefits: [
      'Capture and share team best practices',
      'Consistent project setup across files',
      'Include documentation templates',
      'Save hours on project kickoff',
      'Enforce organization standards'
    ],
    faqs: [
      {
        question: 'Can I share templates with my team?',
        answer: 'Yes. Templates can be exported and shared, or you can set them as team defaults in OrganizeFile settings.'
      },
      {
        question: 'What should I include in a template?',
        answer: 'Common elements: Cover page, Flows/Wireframes, Components, Screens, Documentation, Archive. Add what makes sense for your workflow.'
      },
      {
        question: 'Can templates include actual components?',
        answer: 'Templates focus on page structure. For reusable components, use Figma libraries linked to your templates.'
      }
    ],
    relatedUseCases: [
      'organize-figma-file-structure',
      'standardize-figma-page-naming'
    ],
    keywords: [
      'figma file template',
      'figma project template',
      'reusable figma template',
      'figma starter template',
      'figma team template'
    ]
  },

  // -----------------------------------------------------------------------------
  // ScaleResizer Use Cases
  // -----------------------------------------------------------------------------
  {
    slug: 'resize-marketing-assets-figma',
    title: 'How to Resize Marketing Assets in Figma',
    metaTitle: 'Resize Marketing Assets in Figma Instantly | ScaleResizer',
    metaDescription: 'Batch resize marketing frames to multiple dimensions at once. Create Facebook, Instagram, LinkedIn, and banner sizes from a single design.',
    plugin: 'scaleresizer',
    pluginName: 'ScaleResizer',
    pluginUrl: '/figma-marketing-resizer-plugin',
    communityUrl: PLUGIN_DATA['scaleresizer'].communityUrl,
    problem: 'Every marketing campaign requires dozens of asset sizes',
    problemDetails: [
      'Social platforms each need different dimensions',
      'Resizing manually breaks layouts and text scaling',
      'Campaign updates mean re-exporting 20+ sizes',
      'Designers spend more time resizing than designing'
    ],
    solution: 'ScaleResizer intelligently resizes your marketing frames to any dimension while preserving layout integrity. Select sizes from presets or define custom dimensions.',
    steps: [
      {
        title: 'Select your master design',
        description: 'Select the frame containing your marketing asset. ScaleResizer uses this as the source for all size variations.',
        tip: 'Design at the largest size first for better downscaling quality.'
      },
      {
        title: 'Choose target sizes',
        description: 'Select from preset social media sizes (Instagram Story, Facebook Post, LinkedIn Banner) or enter custom dimensions.',
        tip: 'Save frequently used size sets as presets for future campaigns.'
      },
      {
        title: 'Generate variations',
        description: 'Click Generate to create all size variations. ScaleResizer uses AI to reflow content and maintain visual balance.',
        tip: 'Review each variation and make minor adjustments if needed.'
      }
    ],
    benefits: [
      'Generate 10+ size variations in seconds',
      'AI-powered content reflow',
      'Preset social media dimensions',
      'Custom dimension support',
      'Batch export all sizes'
    ],
    beforeAfter: {
      before: '1 marketing frame (1200x628)',
      after: '8 size variations (Story, Square, Banner, etc.)',
      beforeLabel: 'Single size',
      afterLabel: 'All platforms covered'
    },
    faqs: [
      {
        question: 'Does it just scale or does it reflow content?',
        answer: 'ScaleResizer intelligently reflows content when aspect ratios change significantly, repositioning elements to maintain visual balance.'
      },
      {
        question: 'What social media presets are included?',
        answer: 'Facebook (Post, Story, Cover), Instagram (Post, Story, Reel), LinkedIn (Post, Banner), Twitter, YouTube thumbnails, and more.'
      },
      {
        question: 'Can I add custom size presets?',
        answer: 'Yes. Define any dimension and save it as a preset for your brand specific needs.'
      }
    ],
    relatedUseCases: [
      'create-social-media-sizes-figma',
      'batch-export-figma-assets'
    ],
    keywords: [
      'resize marketing assets figma',
      'figma resize plugin',
      'social media sizes figma',
      'batch resize figma',
      'marketing asset sizes'
    ]
  },

  {
    slug: 'create-social-media-sizes-figma',
    title: 'How to Create Social Media Sizes in Figma',
    metaTitle: 'Create All Social Media Sizes in Figma | ScaleResizer',
    metaDescription: 'Generate Instagram, Facebook, LinkedIn, and Twitter sizes from one Figma design. Export-ready social media assets in seconds.',
    plugin: 'scaleresizer',
    pluginName: 'ScaleResizer',
    pluginUrl: '/figma-marketing-resizer-plugin',
    communityUrl: PLUGIN_DATA['scaleresizer'].communityUrl,
    problem: 'Every social platform has different image size requirements',
    problemDetails: [
      'Instagram: 1080x1080 (Post), 1080x1920 (Story), 1080x1350 (Portrait)',
      'Facebook: 1200x628 (Link), 1200x1200 (Post), 1080x1920 (Story)',
      'LinkedIn: 1200x627 (Post), 1584x396 (Banner)',
      'Keeping track of all sizes is a nightmare'
    ],
    solution: 'ScaleResizer includes presets for every major social platform. Select your platforms and generate all required sizes with proper aspect ratios automatically.',
    steps: [
      {
        title: 'Design at base size',
        description: 'Create your social media graphic at any size. ScaleResizer works best when starting with square or landscape formats.',
        tip: 'Include bleed area for cropped formats like Instagram portrait.'
      },
      {
        title: 'Select platforms',
        description: 'Choose which platforms you need: Instagram, Facebook, LinkedIn, Twitter, YouTube, TikTok. Each platform expands to show all size options.',
        tip: 'Create a "Social Bundle" preset with your most-used platforms.'
      },
      {
        title: 'Generate and export',
        description: 'Click Generate to create all sizes. Each variation is properly named for easy export (e.g., "Campaign_Instagram_Story.png").',
        tip: 'Use Figma batch export to export all generated sizes at once.'
      }
    ],
    benefits: [
      'Presets for all major platforms',
      'Proper naming for exports',
      'Aspect ratio aware cropping',
      'Bundle presets for campaigns',
      'One-click generation'
    ],
    faqs: [
      {
        question: 'What platforms are supported?',
        answer: 'Instagram, Facebook, Twitter/X, LinkedIn, YouTube, TikTok, Pinterest, Snapchat, and custom dimensions.'
      },
      {
        question: 'Does it handle different aspect ratios?',
        answer: 'Yes. ScaleResizer intelligently crops and repositions content when converting between aspect ratios.'
      },
      {
        question: 'Can I exclude certain sizes?',
        answer: 'Yes. Toggle individual sizes on/off within each platform to generate only what you need.'
      }
    ],
    relatedUseCases: [
      'resize-marketing-assets-figma',
      'batch-export-figma-assets'
    ],
    keywords: [
      'social media sizes figma',
      'instagram size figma',
      'facebook image size figma',
      'social media template figma',
      'social media dimensions'
    ]
  },

  // -----------------------------------------------------------------------------
  // BiblioClean - Handoff
  // -----------------------------------------------------------------------------
  {
    slug: 'prepare-figma-handoff-developers',
    title: 'How to Prepare Figma Files for Developer Handoff',
    metaTitle: 'Prepare Figma for Developer Handoff | BiblioClean',
    metaDescription: 'Clean up your Figma file before developer handoff. Remove unused prototype links, hidden layers, and clutter for a professional delivery.',
    plugin: 'biblioclean',
    pluginName: 'BiblioClean',
    pluginUrl: '/figma-plugin-remove-prototype-links',
    communityUrl: PLUGIN_DATA['biblioclean'].communityUrl,
    problem: 'Messy Figma files waste developer time and cause confusion',
    problemDetails: [
      'Prototype links to deleted frames create dead ends',
      'Hidden layers clutter the layer panel',
      'Old iterations mixed with final designs',
      'Developers cannot tell what is production-ready'
    ],
    solution: 'BiblioClean scans your file for handoff issues: orphan prototype links, unused layers, and visual clutter. Clean everything in one pass for a professional delivery.',
    steps: [
      {
        title: 'Select handoff scope',
        description: 'Choose which pages or frames will be handed off. BiblioClean focuses cleanup on your selection.',
        tip: 'Create a dedicated "Handoff" page with only production-ready frames.'
      },
      {
        title: 'Run cleanup scan',
        description: 'BiblioClean identifies prototype links, hidden layers, locked elements, and other items that may cause confusion.',
        tip: 'Review the report before cleaning - some hidden layers may be intentional.'
      },
      {
        title: 'Clean and verify',
        description: 'Apply cleanup actions: remove dead links, delete hidden layers, unlock frames. Verify the result matches your intent.',
        tip: 'Run cleanup on a branch first if you want to preserve the original state.'
      }
    ],
    benefits: [
      'Professional handoff delivery',
      'No dead prototype links',
      'Clean layer panel',
      'Clear production intent',
      'Faster developer onboarding'
    ],
    faqs: [
      {
        question: 'What does BiblioClean check for?',
        answer: 'Prototype links to deleted frames, hidden layers, locked frames, external URL links, and scroll interactions that may cause confusion.'
      },
      {
        question: 'Will it delete my hidden states?',
        answer: 'BiblioClean warns you about hidden layers. You can choose to keep intentionally hidden items like hover states.'
      },
      {
        question: 'Should I clean before or after exporting?',
        answer: 'Clean before export. This ensures exported assets have proper names and no extra cruft is included.'
      }
    ],
    relatedUseCases: [
      'remove-prototype-links-figma',
      'rename-figma-layers-before-handoff'
    ],
    keywords: [
      'figma developer handoff',
      'prepare figma handoff',
      'clean figma file',
      'figma handoff checklist',
      'developer ready figma'
    ]
  },

  // -----------------------------------------------------------------------------
  // ComponentQA - Missing Components
  // -----------------------------------------------------------------------------
  {
    slug: 'find-missing-components-figma',
    title: 'How to Find Missing Components in Figma',
    metaTitle: 'Find Missing Components in Figma | ComponentQA',
    metaDescription: 'Locate instances of missing or deleted components in your Figma file. Fix broken references before they cause handoff problems.',
    plugin: 'componentqa',
    pluginName: 'ComponentQA',
    pluginUrl: '/figma-design-system-audit-plugin',
    communityUrl: PLUGIN_DATA['componentqa'].communityUrl,
    problem: 'Missing component references break your designs silently',
    problemDetails: [
      'Someone deletes a main component and instances show "Component missing"',
      'Library updates remove deprecated components',
      'Moving between files loses component connections',
      'Missing components only surface when it is too late'
    ],
    solution: 'ComponentQA scans for all instances referencing missing or deleted main components. Get a report showing exactly where broken references exist so you can fix them.',
    steps: [
      {
        title: 'Run component scan',
        description: 'Open ComponentQA and select "Missing Components" from the audit options. Scan the entire file or specific pages.',
        tip: 'Run this check after any library update to catch breaking changes.'
      },
      {
        title: 'Review missing references',
        description: 'The report shows each missing component instance with its location and the name of the deleted component.',
        tip: 'Click any item to navigate directly to the broken instance.'
      },
      {
        title: 'Fix or replace',
        description: 'For each missing instance, either restore the original component, swap to an alternative, or delete the broken instance.',
        tip: 'Use Figma "Swap Instance" to replace with a similar component.'
      }
    ],
    benefits: [
      'Find all missing components at once',
      'Navigate directly to broken instances',
      'Prevent handoff surprises',
      'Audit after library updates',
      'Track component health'
    ],
    faqs: [
      {
        question: 'Why do components go missing?',
        answer: 'Common causes: deleting main components, moving components between files, library version mismatches, or unpublishing library components.'
      },
      {
        question: 'Can I restore a missing component?',
        answer: 'If you have access to the original library, you can republish the component. Otherwise, you will need to swap instances to an alternative.'
      },
      {
        question: 'Does it check external libraries?',
        answer: 'Yes. ComponentQA detects missing components from any library, including external team libraries.'
      }
    ],
    relatedUseCases: [
      'find-detached-instances-figma',
      'audit-design-system-figma'
    ],
    keywords: [
      'missing component figma',
      'broken component figma',
      'figma component not found',
      'deleted component figma',
      'component missing error'
    ]
  },

  // -----------------------------------------------------------------------------
  // FixTable - Auto Layout
  // -----------------------------------------------------------------------------
  {
    slug: 'auto-layout-table-figma',
    title: 'How to Build Auto Layout Tables in Figma',
    metaTitle: 'Build Auto Layout Tables in Figma | FixTable',
    metaDescription: 'Create responsive, auto-layout tables in Figma that resize properly. Fix common table structure issues and maintain alignment automatically.',
    plugin: 'fixtable',
    pluginName: 'FixTable',
    pluginUrl: '/figma-table-builder',
    communityUrl: PLUGIN_DATA['fixtable'].communityUrl,
    problem: 'Figma tables break when content or container sizes change',
    problemDetails: [
      'Tables built with absolute positioning do not resize',
      'Auto-layout tables lose column alignment with variable content',
      'Responsive behavior requires complex constraint setup',
      'Copying data into tables misaligns cells'
    ],
    solution: 'FixTable analyzes your table structure and converts it to proper auto-layout with consistent column widths. Tables stay aligned even when content changes.',
    steps: [
      {
        title: 'Select your table',
        description: 'Select the frame containing your table data. FixTable works with existing tables or helps you build from scratch.',
        tip: 'Tables work best with rows as horizontal auto-layout and cells as fixed-width frames.'
      },
      {
        title: 'Analyze structure',
        description: 'FixTable detects your table structure: header row, data rows, column count. It identifies structural issues automatically.',
        tip: 'Use "Show Structure" to visualize how FixTable interprets your table.'
      },
      {
        title: 'Apply auto-layout fixes',
        description: 'Click "Fix Table" to convert to proper auto-layout with normalized column widths and consistent row heights.',
        tip: 'Enable "Responsive Mode" if the table needs to fill its container width.'
      }
    ],
    benefits: [
      'Responsive tables that resize properly',
      'Consistent column alignment',
      'Works with any table structure',
      'Preserves existing content',
      'Header row support'
    ],
    beforeAfter: {
      before: 'Absolute positioned cells, breaks on resize',
      after: 'Auto-layout rows, columns stay aligned',
      beforeLabel: 'Fragile table',
      afterLabel: 'Responsive table'
    },
    faqs: [
      {
        question: 'What table structures does FixTable support?',
        answer: 'FixTable works with tables using horizontal rows and any cell structure. It supports headers, merged cells, and nested content.'
      },
      {
        question: 'Does it convert absolute positioning to auto-layout?',
        answer: 'Yes. FixTable can convert absolute positioned tables to auto-layout while preserving visual appearance.'
      },
      {
        question: 'Can I make columns resizable?',
        answer: 'FixTable sets column widths for consistency. For interactive resizing, you would need prototyping or code implementation.'
      }
    ],
    relatedUseCases: [
      'fix-figma-table-alignment',
      'create-responsive-table-figma'
    ],
    keywords: [
      'auto layout table figma',
      'figma table component',
      'responsive table figma',
      'figma table plugin',
      'build table figma'
    ]
  },

  // -----------------------------------------------------------------------------
  // StateBuilder - Component Variants
  // -----------------------------------------------------------------------------
  {
    slug: 'build-component-variants-figma',
    title: 'How to Build Component Variants in Figma',
    metaTitle: 'Build Component Variants Quickly in Figma | StateBuilder',
    metaDescription: 'Auto-generate component variants for size, state, and style combinations. Build complete variant matrices without manual duplication.',
    plugin: 'statebuilder',
    pluginName: 'StateBuilder',
    pluginUrl: '/figma-component-states',
    communityUrl: PLUGIN_DATA['statebuilder'].communityUrl,
    problem: 'Creating all variant combinations manually is time-consuming',
    problemDetails: [
      '3 sizes × 4 states × 2 themes = 24 variants to create',
      'Each variant needs proper naming for design token mapping',
      'Forgetting one combination breaks the variant picker',
      'Updates require changing every variant individually'
    ],
    solution: 'StateBuilder generates variant matrices from your property definitions. Define Size (S, M, L), State (Default, Hover, Disabled), and Theme (Light, Dark), then generate all 18 combinations automatically.',
    steps: [
      {
        title: 'Define variant properties',
        description: 'Specify the properties your component needs: Size, State, Style, Theme, or custom properties.',
        tip: 'Start with the most important properties and expand later.'
      },
      {
        title: 'Configure property values',
        description: 'For each property, list the possible values. StateBuilder calculates the total variant count (e.g., 3 × 4 × 2 = 24).',
        tip: 'Use design token names for values to ensure code compatibility.'
      },
      {
        title: 'Generate variant matrix',
        description: 'Click Generate to create all variant combinations. Each variant is properly named and positioned in a grid for easy navigation.',
        tip: 'Review the matrix and delete any combinations that are not needed.'
      }
    ],
    benefits: [
      'Generate complete variant matrices',
      'Proper naming for all combinations',
      'Visual grid organization',
      'Token-friendly property names',
      'Skip invalid combinations'
    ],
    beforeAfter: {
      before: 'Base component only',
      after: '24 variants: Size (S/M/L) × State (Default/Hover/Active/Disabled) × Theme (Light/Dark)',
      beforeLabel: 'Single component',
      afterLabel: 'Complete variant set'
    },
    faqs: [
      {
        question: 'How many variants can StateBuilder generate?',
        answer: 'StateBuilder can generate hundreds of variants, though most components need 10-50. Very large matrices may need review for practicality.'
      },
      {
        question: 'Can I exclude certain combinations?',
        answer: 'Yes. After generation, delete combinations that do not make sense (e.g., Disabled + Hover might be redundant).'
      },
      {
        question: 'Does it update existing variants?',
        answer: 'StateBuilder can add new variants to existing component sets or regenerate everything from scratch.'
      }
    ],
    relatedUseCases: [
      'create-button-states-figma',
      'generate-hover-states-figma'
    ],
    keywords: [
      'figma component variants',
      'variant matrix figma',
      'generate variants figma',
      'component properties figma',
      'figma variant plugin'
    ]
  },

  // -----------------------------------------------------------------------------
  // RenameVariantsAI - Boolean Properties
  // -----------------------------------------------------------------------------
  {
    slug: 'rename-boolean-properties-figma',
    title: 'How to Rename Boolean Properties in Figma',
    metaTitle: 'Rename Boolean Properties in Figma | RenameVariantsAI',
    metaDescription: 'Batch rename component boolean properties from generic names like Show Icon to semantic names like hasIcon. Match your code conventions.',
    plugin: 'rename-variants',
    pluginName: 'RenameVariantsAI',
    pluginUrl: '/figma-component-variant-renamer',
    communityUrl: PLUGIN_DATA['rename-variants'].communityUrl,
    problem: 'Boolean property names in Figma do not match code conventions',
    problemDetails: [
      'Figma defaults to "Show Icon" while code uses "hasIcon"',
      'Inconsistent naming: "Show", "Has", "Is", "Enable" used randomly',
      'Design tokens cannot map when names do not match',
      'Renaming properties manually across components is tedious'
    ],
    solution: 'RenameVariantsAI batch renames boolean properties to match your code conventions. Apply camelCase (hasIcon), snake_case (has_icon), or custom patterns across all components.',
    steps: [
      {
        title: 'Select components',
        description: 'Select components with boolean properties. RenameVariantsAI finds all boolean props across your selection.',
        tip: 'Select your entire component library to standardize everything at once.'
      },
      {
        title: 'Configure naming rules',
        description: 'Set your target convention: camelCase hasIcon, PascalCase HasIcon, or define custom mappings.',
        tip: 'Import naming rules from your design token config for perfect alignment.'
      },
      {
        title: 'Apply and sync',
        description: 'Preview all changes and click Apply. All component instances update to reflect the new property names.',
        tip: 'Export the rename mapping for developers to update their code.'
      }
    ],
    benefits: [
      'Consistent boolean naming',
      'Match code conventions exactly',
      'Batch rename across components',
      'Export mapping for developers',
      'Supports all casing styles'
    ],
    beforeAfter: {
      before: 'Show Icon, Enable Badge, Has Border, Display Label',
      after: 'hasIcon, hasBadge, hasBorder, hasLabel',
      beforeLabel: 'Inconsistent names',
      afterLabel: 'Code-friendly names'
    },
    faqs: [
      {
        question: 'Will this break existing instances?',
        answer: 'No. Figma handles property renames gracefully. All instances preserve their boolean values.'
      },
      {
        question: 'Can I use prefixes other than "has"?',
        answer: 'Yes. Define custom prefixes like "is", "show", "enable", or no prefix at all.'
      },
      {
        question: 'Does it work with instance swap properties?',
        answer: 'RenameVariantsAI works with boolean, string, and instance swap properties.'
      }
    ],
    relatedUseCases: [
      'standardize-figma-variant-names',
      'batch-rename-figma-layers'
    ],
    keywords: [
      'boolean property figma',
      'rename component property figma',
      'figma property naming',
      'code friendly properties figma',
      'hasIcon figma'
    ]
  },

  // -----------------------------------------------------------------------------
  // ComponentQA - Color Contrast
  // -----------------------------------------------------------------------------
  {
    slug: 'check-color-contrast-figma',
    title: 'How to Check Color Contrast in Figma',
    metaTitle: 'Check Color Contrast in Figma | ComponentQA',
    metaDescription: 'Automatically check WCAG color contrast ratios across your Figma designs. Find accessibility issues before development handoff.',
    plugin: 'componentqa',
    pluginName: 'ComponentQA',
    pluginUrl: '/figma-design-system-audit-plugin',
    communityUrl: PLUGIN_DATA['componentqa'].communityUrl,
    problem: 'Poor color contrast makes designs inaccessible',
    problemDetails: [
      'WCAG requires 4.5:1 contrast for normal text, 3:1 for large text',
      'Manual checking with color pickers is slow and error-prone',
      'Designs look fine on your screen but fail accessibility audits',
      'Developers catch contrast issues late in the process'
    ],
    solution: 'ComponentQA scans text and background color combinations across your designs and flags any that fail WCAG AA or AAA standards.',
    steps: [
      {
        title: 'Select scope',
        description: 'Choose what to audit: current selection, page, or entire file. ComponentQA analyzes all text layers and their backgrounds.',
        tip: 'Start with critical screens like forms and navigation.'
      },
      {
        title: 'Run contrast check',
        description: 'Enable "Color Contrast" in the audit settings and click Run. ComponentQA calculates ratios for every text/background pair.',
        tip: 'Choose between WCAG AA (minimum) or AAA (enhanced) standards.'
      },
      {
        title: 'Fix failing colors',
        description: 'Click any failing item to navigate to it. ComponentQA suggests the minimum color adjustment needed to pass.',
        tip: 'Update your color tokens at the source to fix all instances at once.'
      }
    ],
    benefits: [
      'Automatic WCAG compliance checking',
      'Navigate directly to issues',
      'Suggested color fixes',
      'AA and AAA level support',
      'Exportable accessibility report'
    ],
    faqs: [
      {
        question: 'What contrast ratio is required?',
        answer: 'WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt bold). WCAG AAA requires 7:1 and 4.5:1 respectively.'
      },
      {
        question: 'Does it check images and icons?',
        answer: 'ComponentQA focuses on text contrast. For UI icons, ensure 3:1 contrast against backgrounds.'
      },
      {
        question: 'Can I export a compliance report?',
        answer: 'Yes. Export results as a PDF or CSV for stakeholder review or documentation.'
      }
    ],
    relatedUseCases: [
      'audit-design-system-figma',
      'validate-design-tokens-figma'
    ],
    keywords: [
      'color contrast figma',
      'wcag contrast checker',
      'accessibility figma',
      'color contrast ratio',
      'figma a11y audit'
    ]
  },

  // -----------------------------------------------------------------------------
  // ComponentQA - Unused Styles
  // -----------------------------------------------------------------------------
  {
    slug: 'clean-unused-styles-figma',
    title: 'How to Clean Unused Styles in Figma',
    metaTitle: 'Clean Unused Styles in Figma | ComponentQA',
    metaDescription: 'Find and remove unused color, text, and effect styles from your Figma file. Keep your design system lean and maintainable.',
    plugin: 'componentqa',
    pluginName: 'ComponentQA',
    pluginUrl: '/figma-design-system-audit-plugin',
    communityUrl: PLUGIN_DATA['componentqa'].communityUrl,
    problem: 'Unused styles clutter your design system',
    problemDetails: [
      'Old styles accumulate as designs evolve',
      'Designers cannot tell which styles are actually used',
      'Style picker becomes cluttered with abandoned options',
      'Library size grows unnecessarily'
    ],
    solution: 'ComponentQA scans your entire file to identify which styles are actually applied to layers. Unused styles are flagged for removal.',
    steps: [
      {
        title: 'Run style audit',
        description: 'Open ComponentQA and select "Unused Styles" from the audit options. The scan covers colors, text styles, and effects.',
        tip: 'Scan your library files separately from consumer files.'
      },
      {
        title: 'Review unused styles',
        description: 'ComponentQA lists all styles with zero usages. Review each to confirm it is truly unused and not reserved for future use.',
        tip: 'Mark intentionally reserved styles with a naming convention like "Reserved/".'
      },
      {
        title: 'Delete or archive',
        description: 'Select unused styles and delete them, or move them to an "Archive" section if you want to preserve them.',
        tip: 'Publish library changes to propagate cleanup to all consumers.'
      }
    ],
    benefits: [
      'Identify all unused styles',
      'Clean style picker',
      'Smaller library files',
      'Easier style maintenance',
      'Clear design system governance'
    ],
    faqs: [
      {
        question: 'Does it check across multiple files?',
        answer: 'ComponentQA scans one file at a time. For libraries, scan the library file to find styles unused within it.'
      },
      {
        question: 'What about styles used in other files?',
        answer: 'Library style usage is tracked across consumers. ComponentQA can identify styles that have no consumers.'
      },
      {
        question: 'Can I undo style deletion?',
        answer: 'Style deletion can be undone with Cmd/Ctrl+Z immediately after. For published libraries, version history preserves old states.'
      }
    ],
    relatedUseCases: [
      'audit-design-system-figma',
      'validate-design-tokens-figma'
    ],
    keywords: [
      'unused styles figma',
      'clean figma styles',
      'remove unused colors',
      'figma style cleanup',
      'design system maintenance'
    ]
  },

  // -----------------------------------------------------------------------------
  // ComponentQA - Design Tokens
  // -----------------------------------------------------------------------------
  {
    slug: 'validate-design-tokens-figma',
    title: 'How to Validate Design Tokens in Figma',
    metaTitle: 'Validate Design Tokens in Figma | ComponentQA',
    metaDescription: 'Check that your Figma designs use proper design tokens instead of hardcoded values. Ensure token compliance before handoff.',
    plugin: 'componentqa',
    pluginName: 'ComponentQA',
    pluginUrl: '/figma-design-system-audit-plugin',
    communityUrl: PLUGIN_DATA['componentqa'].communityUrl,
    problem: 'Hardcoded values bypass your design token system',
    problemDetails: [
      'Designers apply hex colors instead of using color styles',
      'Font sizes get typed manually instead of using text styles',
      'Token drift accumulates silently across the file',
      'Developers cannot map designs to code tokens'
    ],
    solution: 'ComponentQA validates that all colors, typography, spacing, and effects come from your defined styles/variables. Non-token values are flagged.',
    steps: [
      {
        title: 'Define token sources',
        description: 'Tell ComponentQA which styles and variables constitute your token system. It uses your published styles as the source of truth.',
        tip: 'Include all color, text, effect, and layout grid styles.'
      },
      {
        title: 'Run validation',
        description: 'Scan your file for any property values that do not reference a defined token. Results are categorized by type.',
        tip: 'Filter by severity to focus on critical issues like colors first.'
      },
      {
        title: 'Convert to tokens',
        description: 'For each flagged value, either apply an existing token or create a new one. ComponentQA can suggest the closest matching token.',
        tip: 'Use batch select to apply the same token to multiple similar violations.'
      }
    ],
    benefits: [
      'Ensure 100% token coverage',
      'Catch token drift early',
      'Suggest closest matching tokens',
      'Batch fix similar violations',
      'Export compliance reports'
    ],
    faqs: [
      {
        question: 'What counts as a token?',
        answer: 'Tokens are your published styles (color, text, effect, grid) and variables. Any direct value that bypasses these is flagged.'
      },
      {
        question: 'Can I allow some hardcoded values?',
        answer: 'Yes. Mark specific values as "allowed exceptions" in ComponentQA settings for intentional one-offs.'
      },
      {
        question: 'Does it validate spacing tokens?',
        answer: 'If you use spacing variables or auto-layout presets, ComponentQA can validate against those. Raw pixel values are flagged.'
      }
    ],
    relatedUseCases: [
      'audit-design-system-figma',
      'check-color-contrast-figma'
    ],
    keywords: [
      'design tokens figma',
      'validate tokens',
      'figma token compliance',
      'hardcoded values figma',
      'token drift'
    ]
  },

  // -----------------------------------------------------------------------------
  // StateBuilder - Loading States
  // -----------------------------------------------------------------------------
  {
    slug: 'create-loading-states-figma',
    title: 'How to Create Loading States in Figma',
    metaTitle: 'Create Loading States in Figma | StateBuilder',
    metaDescription: 'Auto-generate loading, skeleton, and spinner states for your Figma components. Build complete async UX without manual work.',
    plugin: 'statebuilder',
    pluginName: 'StateBuilder',
    pluginUrl: '/figma-component-states',
    communityUrl: PLUGIN_DATA['statebuilder'].communityUrl,
    problem: 'Loading states are often forgotten until late in design',
    problemDetails: [
      'Every data-driven component needs a loading state',
      'Skeleton screens require recreating layout with placeholder shapes',
      'Spinner placement and sizing needs consistency',
      'Developers implement loading states without design guidance'
    ],
    solution: 'StateBuilder generates loading state variants from your content-filled designs. It creates skeleton placeholders that match your component structure.',
    steps: [
      {
        title: 'Select component',
        description: 'Select the component in its default, content-filled state. StateBuilder analyzes the layout structure.',
        tip: 'Components with clear content areas work best for skeleton generation.'
      },
      {
        title: 'Choose loading style',
        description: 'Select loading type: skeleton (placeholder shapes), spinner overlay, shimmer effect, or custom combination.',
        tip: 'Skeletons work well for cards and lists. Spinners suit buttons and forms.'
      },
      {
        title: 'Generate and customize',
        description: 'StateBuilder creates the loading variant with proper structure. Adjust placeholder sizing or add animation hints as needed.',
        tip: 'Add "pulse" or "shimmer" notes for developers to implement animations.'
      }
    ],
    benefits: [
      'Consistent loading patterns',
      'Skeleton screens from content layouts',
      'Multiple loading styles',
      'Proper variant structure',
      'Animation documentation'
    ],
    beforeAfter: {
      before: 'Card component (content state only)',
      after: 'Card component with Loading variant (skeleton placeholders)',
      beforeLabel: 'Missing loading state',
      afterLabel: 'Complete async UX'
    },
    faqs: [
      {
        question: 'What loading styles are available?',
        answer: 'Skeleton (gray placeholder shapes), spinner overlay, shimmer effect, and dot loader. You can combine styles.'
      },
      {
        question: 'Does it animate the skeleton?',
        answer: 'Figma cannot animate fills. StateBuilder documents the intended animation for developers to implement.'
      },
      {
        question: 'How do I show partial loading?',
        answer: 'Create multiple loading variants: full skeleton, partial load, and loaded. Use component properties to control display.'
      }
    ],
    relatedUseCases: [
      'create-error-states-figma',
      'create-empty-states-figma'
    ],
    keywords: [
      'loading state figma',
      'skeleton screen figma',
      'figma loading spinner',
      'async state design',
      'placeholder loading figma'
    ]
  },

  // -----------------------------------------------------------------------------
  // StateBuilder - Error States
  // -----------------------------------------------------------------------------
  {
    slug: 'create-error-states-figma',
    title: 'How to Create Error States in Figma',
    metaTitle: 'Create Error States in Figma | StateBuilder',
    metaDescription: 'Design error states for forms, inputs, and API failures. Auto-generate error variants with proper messaging patterns.',
    plugin: 'statebuilder',
    pluginName: 'StateBuilder',
    pluginUrl: '/figma-component-states',
    communityUrl: PLUGIN_DATA['statebuilder'].communityUrl,
    problem: 'Error states are designed inconsistently or forgotten entirely',
    problemDetails: [
      'Each form field needs validation error styling',
      'API errors need user-friendly messaging',
      'Error patterns differ across components',
      'Developers improvise when error designs are missing'
    ],
    solution: 'StateBuilder generates error state variants with proper visual treatment: red borders, error icons, and message placement.',
    steps: [
      {
        title: 'Select input or component',
        description: 'Select the form field, card, or component that needs an error state. StateBuilder works with any component type.',
        tip: 'Apply to your base input component to propagate errors to all variants.'
      },
      {
        title: 'Configure error styling',
        description: 'Define error visual rules: border color, background tint, icon placement, and error message position.',
        tip: 'Use your design system error color token for consistency.'
      },
      {
        title: 'Generate variants',
        description: 'StateBuilder creates the Error variant with all visual changes applied. Add sample error messages for context.',
        tip: 'Create both field-level and form-level error patterns.'
      }
    ],
    benefits: [
      'Consistent error visual treatment',
      'Proper error message placement',
      'Works with any input type',
      'Matches design token colors',
      'Complete validation specs'
    ],
    faqs: [
      {
        question: 'What error styles can I apply?',
        answer: 'Border color, background tint, error icon (inline or adjacent), shake animation notation, and error message text styling.'
      },
      {
        question: 'Should error messages be inside the component?',
        answer: 'Best practice is to show error messages below the field. StateBuilder supports inline and external message placement.'
      },
      {
        question: 'How do I handle multiple errors?',
        answer: 'Create variants for single-error and multiple-error states. Use boolean properties to control error message visibility.'
      }
    ],
    relatedUseCases: [
      'create-loading-states-figma',
      'create-empty-states-figma'
    ],
    keywords: [
      'error state figma',
      'form validation design',
      'input error figma',
      'error message design',
      'form error styling'
    ]
  },

  // -----------------------------------------------------------------------------
  // StateBuilder - Empty States
  // -----------------------------------------------------------------------------
  {
    slug: 'create-empty-states-figma',
    title: 'How to Create Empty States in Figma',
    metaTitle: 'Create Empty States in Figma | StateBuilder',
    metaDescription: 'Design empty states for lists, tables, and data views. Create helpful zero-data experiences that guide users to action.',
    plugin: 'statebuilder',
    pluginName: 'StateBuilder',
    pluginUrl: '/figma-component-states',
    communityUrl: PLUGIN_DATA['statebuilder'].communityUrl,
    problem: 'Empty states are overlooked, leaving users confused',
    problemDetails: [
      'Empty lists show nothing, with no guidance',
      'First-time users see blank screens instead of onboarding',
      'Search results show "0 results" without helpful suggestions',
      'Empty states are designed ad-hoc without patterns'
    ],
    solution: 'StateBuilder generates empty state variants with placeholder illustrations, helpful copy, and calls-to-action based on your component context.',
    steps: [
      {
        title: 'Select data component',
        description: 'Select your list, table, grid, or data container in its populated state. StateBuilder uses this to understand the context.',
        tip: 'Empty states should match the dimensions of the populated component.'
      },
      {
        title: 'Configure empty state',
        description: 'Choose empty state elements: illustration, headline, description, and primary action. StateBuilder provides templates.',
        tip: 'Include a clear call-to-action that helps users add their first item.'
      },
      {
        title: 'Generate variant',
        description: 'StateBuilder creates the Empty variant with centered messaging. Adjust illustration and copy to match your brand voice.',
        tip: 'Create multiple empty states: first-time (onboarding) vs filtered (no results).'
      }
    ],
    benefits: [
      'Consistent empty state patterns',
      'Helpful onboarding moments',
      'Clear calls-to-action',
      'Illustration placeholders',
      'Multiple empty state types'
    ],
    beforeAfter: {
      before: 'Empty list showing blank space',
      after: 'Empty list with illustration, message, and "Add First Item" button',
      beforeLabel: 'Confusing blank',
      afterLabel: 'Helpful empty state'
    },
    faqs: [
      {
        question: 'What elements should an empty state have?',
        answer: 'Typically: illustration (optional), headline, description, and primary action button. Keep messaging encouraging, not negative.'
      },
      {
        question: 'Should I use different empty states for different scenarios?',
        answer: 'Yes. First-time/onboarding, no search results, and error-caused empty states should have different messaging.'
      },
      {
        question: 'Where can I get empty state illustrations?',
        answer: 'Use your brand illustration library, or source from free libraries like unDraw, Humaaans, or Blush.'
      }
    ],
    relatedUseCases: [
      'create-loading-states-figma',
      'create-error-states-figma'
    ],
    keywords: [
      'empty state figma',
      'zero data state',
      'no results design',
      'first-time user experience',
      'empty list design'
    ]
  },

  // -----------------------------------------------------------------------------
  // ScaleResizer - Batch Export
  // -----------------------------------------------------------------------------
  {
    slug: 'batch-export-figma-assets',
    title: 'How to Batch Export Assets from Figma',
    metaTitle: 'Batch Export Figma Assets to Multiple Sizes | ScaleResizer',
    metaDescription: 'Export Figma frames to multiple sizes at once. Generate @1x, @2x, @3x assets and all platform dimensions in a single export.',
    plugin: 'scaleresizer',
    pluginName: 'ScaleResizer',
    pluginUrl: '/figma-marketing-resizer-plugin',
    communityUrl: PLUGIN_DATA['scaleresizer'].communityUrl,
    problem: 'Exporting assets to multiple sizes is tedious and error-prone',
    problemDetails: [
      'iOS needs @1x, @2x, @3x for every asset',
      'Android needs mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi',
      'Web needs multiple sizes for responsive images',
      'Manually setting up export settings takes forever'
    ],
    solution: 'ScaleResizer batch exports your frames to all required sizes at once. Set up platform presets and export everything with proper naming.',
    steps: [
      {
        title: 'Select frames to export',
        description: 'Select the frames or components you want to export. ScaleResizer handles multiple selections.',
        tip: 'Use consistent frame naming for clean exported file names.'
      },
      {
        title: 'Choose export presets',
        description: 'Select platform presets: iOS (@1x-@3x), Android (density buckets), Web (responsive sizes), or custom multipliers.',
        tip: 'Create custom presets for your specific app requirements.'
      },
      {
        title: 'Export all sizes',
        description: 'Click Export to generate all size variations. Files are named with proper suffixes and organized in folders.',
        tip: 'Use PNG for graphics with transparency, JPG for photos, SVG for icons.'
      }
    ],
    benefits: [
      'All platform sizes in one export',
      'Proper file naming (@2x, _xxhdpi)',
      'Organized folder structure',
      'Custom export presets',
      'Multiple format support'
    ],
    faqs: [
      {
        question: 'What sizes do iOS apps need?',
        answer: 'iOS typically needs @1x, @2x, and @3x versions. App icons need additional sizes for different contexts.'
      },
      {
        question: 'What about Android density buckets?',
        answer: 'ScaleResizer exports to mdpi (1x), hdpi (1.5x), xhdpi (2x), xxhdpi (3x), and xxxhdpi (4x) with proper folder structure.'
      },
      {
        question: 'Can I export SVG and PNG together?',
        answer: 'Yes. ScaleResizer can export the same frame in multiple formats simultaneously.'
      }
    ],
    relatedUseCases: [
      'resize-marketing-assets-figma',
      'create-social-media-sizes-figma'
    ],
    keywords: [
      'batch export figma',
      'export multiple sizes figma',
      'figma @2x export',
      'ios asset export figma',
      'android export figma'
    ]
  },

  // -----------------------------------------------------------------------------
  // OrganizeFile - Icon Components
  // -----------------------------------------------------------------------------
  {
    slug: 'create-icon-component-figma',
    title: 'How to Create Icon Components in Figma',
    metaTitle: 'Create Scalable Icon Components in Figma | OrganizeFile',
    metaDescription: 'Build icon components that scale properly and support color customization. Set up your icon library with best practices.',
    plugin: 'organizefile',
    pluginName: 'OrganizeFile',
    pluginUrl: '/figma-organize-design-files-plugin',
    communityUrl: PLUGIN_DATA['organizefile'].communityUrl,
    problem: 'Icons break when resized or need color changes',
    problemDetails: [
      'Icon strokes scale incorrectly at different sizes',
      'Colors are hardcoded instead of using currentColor',
      'Icon naming is inconsistent across the library',
      'No clear organization for hundreds of icons'
    ],
    solution: 'OrganizeFile helps you set up a properly structured icon library with scalable components, consistent naming, and color token support.',
    steps: [
      {
        title: 'Prepare icon frames',
        description: 'Ensure icons are in consistent frame sizes (24x24, 20x20, etc.) with proper padding. Flatten complex shapes.',
        tip: 'Use a 24x24 base size with 2px padding for optimal scalability.'
      },
      {
        title: 'Convert to components',
        description: 'OrganizeFile batch converts icon frames to components with proper naming (icon/arrow-right, icon/check).',
        tip: 'Use slash notation for icon categories: icon/navigation/arrow-right.'
      },
      {
        title: 'Apply color tokens',
        description: 'Set icon fills to use color variables so they inherit color from parent components.',
        tip: 'Use a semantic token like "icon-color" that maps to your text color.'
      }
    ],
    benefits: [
      'Scalable icon components',
      'Consistent naming convention',
      'Color token support',
      'Organized icon categories',
      'Easy icon discovery'
    ],
    faqs: [
      {
        question: 'What size should icon components be?',
        answer: 'Common sizes are 16x16, 20x20, 24x24, and 32x32. Design at your most-used size and let Figma scale.'
      },
      {
        question: 'How do I make icons change color?',
        answer: 'Set icon fills to use a color variable. When placed in a component, the icon inherits the variable value.'
      },
      {
        question: 'Should I use component properties for sizes?',
        answer: 'For simple scaling, let consumers resize the component. For size-specific variations, use variant properties.'
      }
    ],
    relatedUseCases: [
      'organize-figma-file-structure',
      'batch-rename-figma-layers'
    ],
    keywords: [
      'icon component figma',
      'figma icon library',
      'scalable icons figma',
      'icon system figma',
      'create icon set'
    ]
  },

  // -----------------------------------------------------------------------------
  // OrganizeFile - Page Naming
  // -----------------------------------------------------------------------------
  {
    slug: 'standardize-figma-page-naming',
    title: 'How to Standardize Page Naming in Figma',
    metaTitle: 'Standardize Figma Page Names | OrganizeFile',
    metaDescription: 'Create consistent page naming conventions across your Figma files. Use emoji prefixes and clear hierarchies for better navigation.',
    plugin: 'organizefile',
    pluginName: 'OrganizeFile',
    pluginUrl: '/figma-organize-design-files-plugin',
    communityUrl: PLUGIN_DATA['organizefile'].communityUrl,
    problem: 'Inconsistent page names make files hard to navigate',
    problemDetails: [
      'Page names like "Page 1", "test", "old" provide no context',
      'Different designers use different naming conventions',
      'No visual hierarchy in the page list',
      'Finding specific pages requires clicking through everything'
    ],
    solution: 'OrganizeFile applies consistent page naming conventions with optional emoji prefixes, numbered ordering, and clear hierarchy.',
    steps: [
      {
        title: 'Choose naming convention',
        description: 'Select a naming pattern: emoji prefix (📐 Components), numbered (01. Components), or plain text hierarchy.',
        tip: 'Emoji prefixes create strong visual grouping in the page list.'
      },
      {
        title: 'Define page types',
        description: 'Categorize your pages: Cover, Flows, Components, Screens, Archive. OrganizeFile suggests appropriate names.',
        tip: 'Use divider pages like "─────" to create visual sections.'
      },
      {
        title: 'Apply to file',
        description: 'OrganizeFile renames existing pages to match your convention. Preview changes before applying.',
        tip: 'Save your naming convention as a team template for new files.'
      }
    ],
    benefits: [
      'Consistent naming across files',
      'Visual hierarchy with emojis',
      'Easy page navigation',
      'Team-wide conventions',
      'Professional file presentation'
    ],
    beforeAfter: {
      before: 'Page 1, Components v2, test, flows (2)',
      after: '📋 Cover, 🔄 Flows, 🧩 Components, 🖼️ Screens, 📦 Archive',
      beforeLabel: 'Messy names',
      afterLabel: 'Clear convention'
    },
    faqs: [
      {
        question: 'What emojis work well for page names?',
        answer: 'Common choices: 📋 Cover, 🔄 Flows, 🧩 Components, 🖼️ Screens, 📝 Specs, 📦 Archive, ⚙️ Settings.'
      },
      {
        question: 'Should I use numbers or emojis?',
        answer: 'Numbers (01, 02) provide strict ordering. Emojis provide visual grouping. Some teams use both: "01 📋 Cover".'
      },
      {
        question: 'How do I create section dividers?',
        answer: 'Create empty pages named with dashes "─────────" or category headers like "[ DESIGN ]".'
      }
    ],
    relatedUseCases: [
      'organize-figma-file-structure',
      'create-figma-file-template'
    ],
    keywords: [
      'figma page naming',
      'organize figma pages',
      'figma page convention',
      'emoji page names figma',
      'figma file organization'
    ]
  },

  // -----------------------------------------------------------------------------
  // FixTable - Responsive Tables
  // -----------------------------------------------------------------------------
  {
    slug: 'create-responsive-table-figma',
    title: 'How to Create Responsive Tables in Figma',
    metaTitle: 'Create Responsive Tables in Figma | FixTable',
    metaDescription: 'Build tables that adapt to different screen sizes. Design responsive data tables with proper mobile and desktop layouts.',
    plugin: 'fixtable',
    pluginName: 'FixTable',
    pluginUrl: '/figma-table-builder',
    communityUrl: PLUGIN_DATA['fixtable'].communityUrl,
    problem: 'Data tables break on mobile screens',
    problemDetails: [
      'Desktop tables do not fit on mobile viewports',
      'Horizontal scrolling creates poor UX',
      'Responsive table patterns need separate mobile designs',
      'Maintaining two table versions doubles the work'
    ],
    solution: 'FixTable helps you build responsive table components that adapt to viewport sizes using proper auto-layout and component properties.',
    steps: [
      {
        title: 'Build desktop table',
        description: 'Create your full-width table with all columns visible. Use auto-layout rows and fixed or fill column widths.',
        tip: 'Start with desktop as the base and derive mobile from it.'
      },
      {
        title: 'Create mobile variant',
        description: 'Use FixTable to generate a mobile-friendly version: stacked cards, priority columns, or horizontal scroll.',
        tip: 'Card layout works well for 3-5 columns. Scroll works for data-dense tables.'
      },
      {
        title: 'Connect with properties',
        description: 'Use component properties to switch between Desktop and Mobile layouts. Consumers choose the appropriate variant.',
        tip: 'Add a Viewport property with Desktop/Mobile options.'
      }
    ],
    benefits: [
      'Mobile-friendly table patterns',
      'Single component, multiple layouts',
      'Card and scroll alternatives',
      'Auto-layout based structure',
      'Consistent data presentation'
    ],
    faqs: [
      {
        question: 'What are the best responsive table patterns?',
        answer: 'Stacked cards (each row becomes a card), priority columns (hide non-essential columns), or horizontal scroll with frozen first column.'
      },
      {
        question: 'Should I use separate mobile and desktop components?',
        answer: 'Using variants in a single component is cleaner. Use a Viewport property to switch layouts.'
      },
      {
        question: 'How do I handle many columns on mobile?',
        answer: 'Show only essential columns with a "View Details" action that reveals full data in a modal or expanded row.'
      }
    ],
    relatedUseCases: [
      'fix-figma-table-alignment',
      'auto-layout-table-figma'
    ],
    keywords: [
      'responsive table figma',
      'mobile table design',
      'data table responsive',
      'figma table mobile',
      'adaptive table design'
    ]
  },

  // -----------------------------------------------------------------------------
  // BiblioClean - Before Export
  // -----------------------------------------------------------------------------
  {
    slug: 'clean-figma-file-before-export',
    title: 'How to Clean Figma Files Before Export',
    metaTitle: 'Clean Figma Files Before Export | BiblioClean',
    metaDescription: 'Prepare your Figma file for export by removing hidden layers, prototype links, and clutter. Export clean, optimized assets.',
    plugin: 'biblioclean',
    pluginName: 'BiblioClean',
    pluginUrl: '/figma-plugin-remove-prototype-links',
    communityUrl: PLUGIN_DATA['biblioclean'].communityUrl,
    problem: 'Exported files contain unnecessary cruft',
    problemDetails: [
      'Hidden layers get exported accidentally',
      'Prototype links add complexity to exported code',
      'Unused styles bloat exported file size',
      'Export preview looks different from design view'
    ],
    solution: 'BiblioClean scans and removes elements that should not be exported: hidden layers, prototype connections, external links, and visual clutter.',
    steps: [
      {
        title: 'Select export scope',
        description: 'Select frames that will be exported. BiblioClean focuses cleanup on your selection.',
        tip: 'Create a dedicated "Export" page with only production-ready frames.'
      },
      {
        title: 'Run pre-export cleanup',
        description: 'BiblioClean identifies hidden layers, prototype links, empty groups, and other export artifacts.',
        tip: 'Review hidden layers before deletion - some may be intentional state management.'
      },
      {
        title: 'Clean and export',
        description: 'Apply cleanup changes, then use standard Figma export. Your exported assets will be clean and optimized.',
        tip: 'Run cleanup immediately before export to catch last-minute additions.'
      }
    ],
    benefits: [
      'Clean exported assets',
      'No hidden layer accidents',
      'Smaller file sizes',
      'No prototype cruft in exports',
      'Professional delivery'
    ],
    faqs: [
      {
        question: 'Does cleanup affect my original file?',
        answer: 'Yes, changes are applied to your file. Use branches or duplicate pages if you want to preserve the original state.'
      },
      {
        question: 'What hidden layers should I keep?',
        answer: 'Keep hidden layers used for state management (hover states, modals). Delete truly unused hidden elements.'
      },
      {
        question: 'Will this reduce my file size?',
        answer: 'Removing unused elements can reduce file size, but the main benefit is cleaner exports, not storage savings.'
      }
    ],
    relatedUseCases: [
      'remove-prototype-links-figma',
      'prepare-figma-handoff-developers'
    ],
    keywords: [
      'clean figma export',
      'figma export optimization',
      'remove hidden layers figma',
      'figma export cleanup',
      'optimize figma file'
    ]
  },

  // -----------------------------------------------------------------------------
  // RenameVariantsAI - Clean Up Layers
  // -----------------------------------------------------------------------------
  {
    slug: 'clean-up-figma-layer-names',
    title: 'How to Clean Up Figma Layer Names',
    metaTitle: 'Clean Up Figma Layer Names in Bulk | RenameVariantsAI',
    metaDescription: 'Fix messy layer names like Frame 123 and Group copy copy. Batch rename to semantic, organized names automatically.',
    plugin: 'rename-variants',
    pluginName: 'RenameVariantsAI',
    pluginUrl: '/figma-component-variant-renamer',
    communityUrl: PLUGIN_DATA['rename-variants'].communityUrl,
    problem: 'Figma default names make files impossible to navigate',
    problemDetails: [
      'Figma creates names like "Frame 387", "Rectangle 12", "Group copy copy"',
      'Copy-paste compounds the problem with "copy" suffixes',
      'Searching for layers by name becomes useless',
      'Layer panel becomes an unreadable mess'
    ],
    solution: 'RenameVariantsAI analyzes layer content, position, and hierarchy to generate meaningful names automatically. Clean up hundreds of layers in seconds.',
    steps: [
      {
        title: 'Select messy layers',
        description: 'Select the frames, pages, or components with default Figma names. RenameVariantsAI works with any selection size.',
        tip: 'Use Cmd/Ctrl+A to select all layers on a page for comprehensive cleanup.'
      },
      {
        title: 'Run AI rename',
        description: 'RenameVariantsAI analyzes each layer and generates semantic names based on content, siblings, and component context.',
        tip: 'Enable "Content Analysis" to use text content as naming hints.'
      },
      {
        title: 'Review and apply',
        description: 'Preview all proposed names in the before/after view. Adjust any names manually, then apply all changes.',
        tip: 'Run regularly after heavy design sessions to keep files clean.'
      }
    ],
    benefits: [
      'Replace default names instantly',
      'AI understands layer context',
      'Remove "copy copy" suffixes',
      'Searchable layer names',
      'Organized layer panel'
    ],
    beforeAfter: {
      before: 'Frame 387, Rectangle 12, Group copy copy, Ellipse 3',
      after: 'Hero-Section, Hero-Background, CTA-Container, Avatar-Circle',
      beforeLabel: 'Default Figma names',
      afterLabel: 'Semantic names'
    },
    faqs: [
      {
        question: 'How does AI determine names?',
        answer: 'RenameVariantsAI analyzes layer position (header, footer, sidebar), content (text, images), hierarchy, and sibling patterns.'
      },
      {
        question: 'Can it remove "copy" suffixes?',
        answer: 'Yes. RenameVariantsAI automatically removes copy/copy copy suffixes and generates unique, meaningful names.'
      },
      {
        question: 'Will it rename my components?',
        answer: 'Component instances keep their component names. RenameVariantsAI renames frames, groups, shapes, and other layers.'
      }
    ],
    relatedUseCases: [
      'batch-rename-figma-layers',
      'rename-figma-layers-before-handoff'
    ],
    keywords: [
      'clean up layer names figma',
      'fix frame names figma',
      'remove copy suffix figma',
      'figma layer organization',
      'rename frames figma'
    ]
  },

  // -----------------------------------------------------------------------------
  // ComponentQA - Component Coverage
  // -----------------------------------------------------------------------------
  {
    slug: 'check-design-system-coverage',
    title: 'How to Check Design System Coverage in Figma',
    metaTitle: 'Check Design System Coverage in Figma | ComponentQA',
    metaDescription: 'Measure how much of your Figma design uses design system components vs custom elements. Track adoption and coverage metrics.',
    plugin: 'componentqa',
    pluginName: 'ComponentQA',
    pluginUrl: '/figma-design-system-audit-plugin',
    communityUrl: PLUGIN_DATA['componentqa'].communityUrl,
    problem: 'No visibility into design system adoption',
    problemDetails: [
      'Cannot measure what percentage of designs use the design system',
      'Custom one-off elements accumulate without tracking',
      'No way to prove ROI of design system investment',
      'Adoption varies across teams without visibility'
    ],
    solution: 'ComponentQA calculates design system coverage: the percentage of layers that use library components vs custom elements. Track adoption over time.',
    steps: [
      {
        title: 'Configure coverage metrics',
        description: 'Tell ComponentQA which libraries define your design system. It distinguishes library instances from custom layers.',
        tip: 'Include all relevant libraries: core components, icons, patterns.'
      },
      {
        title: 'Run coverage analysis',
        description: 'Scan your file to calculate coverage. Results show library usage vs custom elements, broken down by type.',
        tip: 'Run on production screens, not explorations, for accurate metrics.'
      },
      {
        title: 'Track and improve',
        description: 'Export coverage reports over time. Identify files or teams with low adoption for targeted education.',
        tip: 'Set team goals like "80% coverage" and track progress monthly.'
      }
    ],
    benefits: [
      'Measure design system ROI',
      'Identify low-adoption areas',
      'Track coverage trends',
      'Compare across teams',
      'Data-driven governance'
    ],
    faqs: [
      {
        question: 'What counts toward coverage?',
        answer: 'Component instances from published libraries count as "covered." Local components and custom shapes count as "custom."'
      },
      {
        question: 'What is a good coverage percentage?',
        answer: 'Mature design systems target 70-90% coverage. New systems might start at 30-50%. Track improvement over time.'
      },
      {
        question: 'Can I exclude certain elements?',
        answer: 'Yes. Exclude exploration pages, deprecated sections, or intentional custom elements from coverage calculations.'
      }
    ],
    relatedUseCases: [
      'audit-design-system-figma',
      'find-detached-instances-figma'
    ],
    keywords: [
      'design system coverage',
      'figma adoption metrics',
      'design system ROI',
      'component usage figma',
      'design system governance'
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

/**
 * Find a persona page by slug
 */
export const findPersonaBySlug = (slug: string): PersonaPage | undefined => {
  return PERSONA_PAGES.find(page => page.slug === slug);
};

/**
 * Get all persona slugs for sitemap generation
 */
export const getAllPersonaSlugs = (): string[] => {
  return PERSONA_PAGES.map(page => page.slug);
};

// =============================================================================
// Comparison Pages Data (Phase 2 - Placeholder)
// =============================================================================

export const COMPARISON_PAGES: ComparisonPage[] = [];

// =============================================================================
// Persona Pages Data (Phase 3)
// =============================================================================

export const PERSONA_PAGES: PersonaPage[] = [
  {
    slug: 'design-system-managers',
    persona: 'Design System Managers',
    title: 'Figma Plugins for Design System Managers',
    metaTitle: 'Best Figma Plugins for Design System Managers | BiblioKit',
    metaDescription: 'Essential Figma plugins for design system managers. Audit component usage, enforce governance, track token adoption, and maintain system health.',
    heroText: 'Maintain design system health, enforce governance, and prove ROI with powerful audit and management tools.',
    painPoints: [
      {
        title: 'Component Drift is Invisible',
        description: 'Teams use detached instances and hardcoded values without you knowing. By the time drift is visible, it is already a major problem.'
      },
      {
        title: 'No Way to Measure Adoption',
        description: 'Stakeholders ask for ROI metrics but you have no data on how much of the product actually uses your design system.'
      },
      {
        title: 'Governance Takes Too Much Time',
        description: 'Manually auditing files for compliance is impossible to do regularly. Issues pile up between quarterly reviews.'
      },
      {
        title: 'Naming Inconsistency Across Teams',
        description: 'Each team uses different naming conventions for variants and properties, making the system harder to maintain.'
      }
    ],
    recommendedPlugins: [
      {
        slug: 'componentqa',
        name: 'ComponentQA',
        reason: 'Run automated design system audits in seconds. Track detached instances, token drift, and component health across all files.',
        url: '/figma-design-system-audit-plugin'
      },
      {
        slug: 'rename-variants',
        name: 'RenameVariantsAI',
        reason: 'Standardize variant and property names across your entire component library. Enforce naming conventions automatically.',
        url: '/figma-component-variant-renamer'
      },
      {
        slug: 'statebuilder',
        name: 'StateBuilder',
        reason: 'Generate consistent component states (hover, disabled, loading) across all components. Ensure complete interaction specs.',
        url: '/figma-component-states'
      }
    ],
    workflow: [
      { step: 1, action: 'Run weekly audits on production files', plugin: 'ComponentQA' },
      { step: 2, action: 'Identify and fix detached instances', plugin: 'ComponentQA' },
      { step: 3, action: 'Standardize component naming', plugin: 'RenameVariantsAI' },
      { step: 4, action: 'Generate missing component states', plugin: 'StateBuilder' },
      { step: 5, action: 'Export compliance reports for stakeholders', plugin: 'ComponentQA' }
    ],
    faqs: [
      {
        question: 'How often should I audit my design system?',
        answer: 'We recommend weekly spot checks on active files and monthly comprehensive audits. ComponentQA makes this fast enough to do regularly.'
      },
      {
        question: 'Can I share audit results with stakeholders?',
        answer: 'Yes. ComponentQA exports reports showing adoption metrics, compliance scores, and improvement trends over time.'
      },
      {
        question: 'How do I enforce naming conventions?',
        answer: 'Use RenameVariantsAI to batch rename variants to your standard. Run it on new contributions before publishing to the library.'
      }
    ],
    keywords: [
      'design system manager figma',
      'design system governance',
      'figma design system audit',
      'design system metrics',
      'component library management'
    ]
  },

  {
    slug: 'freelance-designers',
    persona: 'Freelance Designers',
    title: 'Figma Plugins for Freelance Designers',
    metaTitle: 'Best Figma Plugins for Freelance Designers | BiblioKit',
    metaDescription: 'Save hours every week with Figma plugins built for freelancers. Organize files faster, clean up handoffs, and deliver professional work.',
    heroText: 'Work faster, deliver cleaner files, and impress clients with professional handoffs every time.',
    painPoints: [
      {
        title: 'File Cleanup Eats Into Billable Hours',
        description: 'You spend hours renaming layers and cleaning up prototypes before handoff. That is time you cannot bill for.'
      },
      {
        title: 'Inconsistent File Organization',
        description: 'Every project starts differently. You waste time setting up file structure instead of designing.'
      },
      {
        title: 'Clients See Messy Layer Names',
        description: 'When clients or developers inspect your files, they see "Frame 422" and "Group copy copy" everywhere.'
      },
      {
        title: 'Social Media Assets Take Forever',
        description: 'Creating 10+ size variations for each marketing graphic is tedious repetitive work.'
      }
    ],
    recommendedPlugins: [
      {
        slug: 'rename-variants',
        name: 'RenameVariantsAI',
        reason: 'Clean up layer names in seconds before handoff. Make your files look professional without manual renaming.',
        url: '/figma-component-variant-renamer'
      },
      {
        slug: 'organizefile',
        name: 'OrganizeFile',
        reason: 'Start every project with a consistent file structure. Save your templates for instant project setup.',
        url: '/figma-organize-design-files-plugin'
      },
      {
        slug: 'biblioclean',
        name: 'BiblioClean',
        reason: 'Remove prototype links and clean up files before client handoff. Deliver polished, professional files.',
        url: '/figma-plugin-remove-prototype-links'
      },
      {
        slug: 'scaleresizer',
        name: 'ScaleResizer',
        reason: 'Generate all social media sizes from one design. Export Instagram, Facebook, LinkedIn in one click.',
        url: '/figma-marketing-resizer-plugin'
      }
    ],
    workflow: [
      { step: 1, action: 'Start project with template structure', plugin: 'OrganizeFile' },
      { step: 2, action: 'Design and iterate with clients' },
      { step: 3, action: 'Clean up layer names before handoff', plugin: 'RenameVariantsAI' },
      { step: 4, action: 'Remove prototype cruft', plugin: 'BiblioClean' },
      { step: 5, action: 'Export marketing assets to all sizes', plugin: 'ScaleResizer' }
    ],
    faqs: [
      {
        question: 'How much time will these plugins save me?',
        answer: 'Most freelancers report saving 2-4 hours per project on file cleanup and asset export alone.'
      },
      {
        question: 'Do clients care about layer names?',
        answer: 'Developers definitely notice clean vs messy files. Professional layer names build trust and reduce questions.'
      },
      {
        question: 'Can I use these for marketing work?',
        answer: 'Absolutely. ScaleResizer is specifically designed for social media and marketing asset production.'
      }
    ],
    keywords: [
      'freelance designer figma',
      'figma plugins freelancer',
      'save time figma',
      'figma file organization',
      'freelance design tools'
    ]
  },

  {
    slug: 'design-leads',
    persona: 'Design Leads & Managers',
    title: 'Figma Plugins for Design Leads',
    metaTitle: 'Best Figma Plugins for Design Team Leads | BiblioKit',
    metaDescription: 'Figma plugins that help design leads maintain quality standards, streamline handoffs, and scale team processes efficiently.',
    heroText: 'Scale your team processes, maintain quality standards, and ship consistent designs across every project.',
    painPoints: [
      {
        title: 'Quality Varies Across Designers',
        description: 'Junior designers create inconsistent files. You spend review time on basics instead of design feedback.'
      },
      {
        title: 'Handoff Problems Slow Down Sprints',
        description: 'Developers come back with questions because designs are unclear or prototype links are broken.'
      },
      {
        title: 'No Standard File Structure',
        description: 'Every designer organizes files differently. Onboarding new team members takes longer than it should.'
      },
      {
        title: 'Component Inconsistency',
        description: 'Designers detach instances or create one-off components instead of using the design system.'
      }
    ],
    recommendedPlugins: [
      {
        slug: 'componentqa',
        name: 'ComponentQA',
        reason: 'Run QA checks before design reviews. Catch detached instances and non-standard components automatically.',
        url: '/figma-design-system-audit-plugin'
      },
      {
        slug: 'organizefile',
        name: 'OrganizeFile',
        reason: 'Create team file templates that enforce structure. Every project starts organized.',
        url: '/figma-organize-design-files-plugin'
      },
      {
        slug: 'biblioclean',
        name: 'BiblioClean',
        reason: 'Ensure clean handoffs with one-click prototype cleanup. No more broken links in production files.',
        url: '/figma-plugin-remove-prototype-links'
      },
      {
        slug: 'rename-variants',
        name: 'RenameVariantsAI',
        reason: 'Enforce layer naming standards across the team. Clean files become the norm, not the exception.',
        url: '/figma-component-variant-renamer'
      }
    ],
    workflow: [
      { step: 1, action: 'Set up team file templates', plugin: 'OrganizeFile' },
      { step: 2, action: 'Designers work on features' },
      { step: 3, action: 'Run pre-review QA check', plugin: 'ComponentQA' },
      { step: 4, action: 'Clean up before handoff', plugin: 'RenameVariantsAI + BiblioClean' },
      { step: 5, action: 'Hand off with confidence' }
    ],
    faqs: [
      {
        question: 'How do I get my team to use these consistently?',
        answer: 'Add plugin usage to your pre-handoff checklist. Running ComponentQA before reviews becomes habit quickly.'
      },
      {
        question: 'Can junior designers use these tools?',
        answer: 'Yes. The plugins are designed to be simple. They help juniors produce senior-quality file organization.'
      },
      {
        question: 'What is the ROI for my team?',
        answer: 'Teams typically see 20-30% reduction in handoff issues and faster onboarding for new designers.'
      }
    ],
    keywords: [
      'design lead figma',
      'design manager tools',
      'team design process',
      'design team efficiency',
      'figma team plugins'
    ]
  },

  {
    slug: 'product-designers',
    persona: 'Product Designers',
    title: 'Figma Plugins for Product Designers',
    metaTitle: 'Best Figma Plugins for Product Designers | BiblioKit',
    metaDescription: 'Speed up your product design workflow with plugins for component management, state generation, and professional developer handoff.',
    heroText: 'Move faster from exploration to production. Build consistent components and ship with confidence.',
    painPoints: [
      {
        title: 'Component States Take Forever',
        description: 'Creating hover, disabled, and loading states for every component is tedious manual work.'
      },
      {
        title: 'Handoff Specs Are Never Complete',
        description: 'Developers always need "one more state" or "this edge case" that you did not design.'
      },
      {
        title: 'Table Components Break Constantly',
        description: 'Data tables lose alignment when content changes. Fixing them manually eats into design time.'
      },
      {
        title: 'File Cleanup Before Reviews',
        description: 'You rush to clean up layer names and prototype links before stakeholder reviews.'
      }
    ],
    recommendedPlugins: [
      {
        slug: 'statebuilder',
        name: 'StateBuilder',
        reason: 'Generate all component states automatically. Default, Hover, Active, Disabled, Loading in one click.',
        url: '/figma-component-states'
      },
      {
        slug: 'fixtable',
        name: 'FixTable',
        reason: 'Fix table alignment instantly. No more manual column width adjustments when data changes.',
        url: '/figma-table-builder'
      },
      {
        slug: 'rename-variants',
        name: 'RenameVariantsAI',
        reason: 'Clean up layer names before handoff. Developers see semantic names that map to code.',
        url: '/figma-component-variant-renamer'
      },
      {
        slug: 'biblioclean',
        name: 'BiblioClean',
        reason: 'Remove old prototype links before shipping. Keep handoff files clean and professional.',
        url: '/figma-plugin-remove-prototype-links'
      }
    ],
    workflow: [
      { step: 1, action: 'Design base component' },
      { step: 2, action: 'Generate interaction states', plugin: 'StateBuilder' },
      { step: 3, action: 'Build data tables', plugin: 'FixTable' },
      { step: 4, action: 'Clean up before handoff', plugin: 'RenameVariantsAI + BiblioClean' },
      { step: 5, action: 'Ship complete specs to developers' }
    ],
    faqs: [
      {
        question: 'What states should I include in components?',
        answer: 'At minimum: Default, Hover, Active, Focused, Disabled. StateBuilder generates all of these from your base design.'
      },
      {
        question: 'How do I handle responsive tables?',
        answer: 'FixTable helps you build auto-layout tables that maintain alignment. Create mobile variants for different viewports.'
      },
      {
        question: 'When should I clean up files?',
        answer: 'Run cleanup before any handoff or review. It takes 30 seconds and makes a professional impression.'
      }
    ],
    keywords: [
      'product designer figma',
      'figma product design',
      'design to dev handoff',
      'component design figma',
      'product design workflow'
    ]
  },

  {
    slug: 'ui-engineers',
    persona: 'UI Engineers & Front-End Developers',
    title: 'Figma Plugins for UI Engineers',
    metaTitle: 'Best Figma Plugins for UI Engineers & Devs | BiblioKit',
    metaDescription: 'Figma plugins that improve design-to-code handoff. Get clean layer names, proper component states, and design tokens that map to code.',
    heroText: 'Get design files that are actually dev-ready. Clean naming, complete states, and consistent structure.',
    painPoints: [
      {
        title: 'Layer Names Do Not Map to Code',
        description: 'Designs have names like "Frame 392" instead of "hero-section" or "cta-button". You guess what things are.'
      },
      {
        title: 'Missing Component States',
        description: 'You need hover, focus, and disabled states. The design only shows the default state.'
      },
      {
        title: 'Inconsistent Spacing and Tokens',
        description: 'Designers use hardcoded pixel values instead of design tokens. Nothing maps to your CSS variables.'
      },
      {
        title: 'Prototype Links Add Confusion',
        description: 'Blue prototype lines everywhere make it hard to understand the actual layer structure.'
      }
    ],
    recommendedPlugins: [
      {
        slug: 'rename-variants',
        name: 'RenameVariantsAI',
        reason: 'Get semantic layer names that match code conventions. hero-section instead of Frame 392.',
        url: '/figma-component-variant-renamer'
      },
      {
        slug: 'componentqa',
        name: 'ComponentQA',
        reason: 'Verify designs use proper tokens before you start building. Flag hardcoded values early.',
        url: '/figma-design-system-audit-plugin'
      },
      {
        slug: 'statebuilder',
        name: 'StateBuilder',
        reason: 'Request designers generate all component states. Complete interaction specs from the start.',
        url: '/figma-component-states'
      },
      {
        slug: 'biblioclean',
        name: 'BiblioClean',
        reason: 'Ask designers to remove prototype clutter before handoff. Cleaner files, faster implementation.',
        url: '/figma-plugin-remove-prototype-links'
      }
    ],
    workflow: [
      { step: 1, action: 'Request clean layer names', plugin: 'RenameVariantsAI' },
      { step: 2, action: 'Verify token compliance', plugin: 'ComponentQA' },
      { step: 3, action: 'Request complete component states', plugin: 'StateBuilder' },
      { step: 4, action: 'Get cleaned handoff file', plugin: 'BiblioClean' },
      { step: 5, action: 'Implement with confidence' }
    ],
    faqs: [
      {
        question: 'Should I share these plugins with designers?',
        answer: 'Yes! These plugins help designers deliver dev-ready files. Share them to improve your handoff quality.'
      },
      {
        question: 'How do I verify token usage?',
        answer: 'ComponentQA audits designs for hardcoded values. Ask designers to run it before handoff.'
      },
      {
        question: 'What naming convention should I request?',
        answer: 'RenameVariantsAI supports kebab-case (hero-section), camelCase (heroSection), and custom patterns. Pick what matches your codebase.'
      }
    ],
    keywords: [
      'ui engineer figma',
      'front-end developer figma',
      'design to code',
      'figma dev handoff',
      'design developer workflow'
    ]
  }
];

// =============================================================================
// Glossary Pages Data (Phase 4 - Placeholder)
// =============================================================================

export const GLOSSARY_PAGES: GlossaryPage[] = [];
