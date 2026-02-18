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
