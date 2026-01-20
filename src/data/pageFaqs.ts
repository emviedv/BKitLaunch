export type FAQEntry = {
  question: string;
  answer: string;
};

export const defaultProductFaqs: FAQEntry[] = [
  {
    question: 'What is this product?',
    answer:
      'A professional tool crafted by BiblioKit to improve design system workflows and accelerate delivery.',
  },
  {
    question: 'How do I get started?',
    answer: 'Use the primary call-to-action to try the product or contact us for a demo.',
  },
];

export const componentQAFaqs: FAQEntry[] = [
  {
    question: "Does it work with any design system?",
    answer: "Yes. ComponentQA checks against your local styles and enabled libraries.",
  },
  {
    question: "Does it change my file?",
    answer: "No. ComponentQA surfaces issues and jumps you to the exact layers so you can decide what to update.",
  },
  {
    question: "Is it safe to run on large files?",
    answer: "Yes. ComponentQA is optimized for performance and handles large files by scanning on demand.",
  },
  {
    question: "Is ComponentQA free?",
    answer: "Yes, ComponentQA is currently free to use for all features.",
  },
];

export const renameVariantsFaqs: FAQEntry[] = [
  {
    question: "Will it change files without my approval?",
    answer: "No. All changes show as suggestions; you approve edits.",
  },
  {
    question: "Can I undo changes?",
    answer: "Yes. Single-click revert and full audit log export.",
  },
  {
    question: "Does it access files outside my selection?",
    answer: "No. You choose selection or file scope before any action.",
  },
  {
    question: "How many free credits do I get?",
    answer: "8 free credits. Each covers an audit of up to 50 components.",
  },
  {
    question: "Will it conflict with our naming conventions?",
    answer: "No. You set the rules (CamelCase, etc.) and token hints.",
  },
  {
    question: "Is it safe for prototypes?",
    answer: "Yes. We preserve prototype links and master components.",
  },
];

export const biblioCleanFaqs: FAQEntry[] = [
  {
    question: "Will this break my main components?",
    answer: "BiblioClean includes safety warnings when you attempt to clean main components or instances that shouldn't be touched.",
  },
  {
    question: "Can I undo the cleanup?",
    answer: "Yes. You can use Figma's native undo (Cmd+Z) to revert any changes made by the plugin instantly.",
  },
  {
    question: "Does it remove links from the whole file?",
    answer: "You can choose your scope: clean only the selected items or the entire current page.",
  },
  {
    question: "Is BiblioClean free?",
    answer: "Yes, BiblioClean is currently free to use for all features.",
  },
];

export const fixTableFaqs: FAQEntry[] = [
  {
    question: "Does this work with complex nested auto-layouts?",
    answer: "Yes. FixTable is designed to parse standard row/column auto-layout structures commonly used for tables.",
  },
  {
    question: "Does it break responsive resizing?",
    answer: "No. It applies fixed widths where necessary to ensure alignment, but respects 'Fill container' where appropriate for the table wrapper.",
  },
  {
    question: "Can I customize the zebra striping color?",
    answer: "Yes. You can select the fill color for alternating rows.",
  },
  {
    question: "When will it be released?",
    answer: "FixTable is live. Install it from our Figma Community profile.",
  },
];

export const organizeFileFaqs: FAQEntry[] = [
  {
    question: "When will OrganizeFile be available?",
    answer: "OrganizeFile is coming soon. We're putting the finishing touches on the plugin and will announce the launch date shortly.",
  },
  {
    question: "Does it work with existing files?",
    answer: "Yes. OrganizeFile detects existing scaffold elements and skips duplicates to avoid conflicts.",
  },
  {
    question: "Can I customize the presets?",
    answer: "V1 includes Product Handoff and Journey/Flow Maps presets. Custom preset builder is planned for future releases.",
  },
  {
    question: "Will it break my existing pages?",
    answer: "No. OrganizeFile adds new pages and scaffolding without modifying existing content. Rollback cleans up partial failures.",
  },
];

export const stateBuilderFaqs: FAQEntry[] = [
  {
    question: "What states does StateBuilder generate?",
    answer: "Generate hover, focus, pressed, error, and disabled states, plus optional success or selected states based on your component.",
  },
  {
    question: "Does it work with any design system?",
    answer: "Yes. StateBuilder works with any Figma components and is tuned for design system variants.",
  },
  {
    question: "Can I choose which states to include?",
    answer: "Yes. Pick the states you need before generation, then review the matrix before handoff.",
  },
  {
    question: "Is StateBuilder live?",
    answer: "Yes. Install it from Figma Community and generate your next state matrix.",
  },
];

export const scaleResizerFaqs: FAQEntry[] = [
  {
    question: "How does ScaleResizer preserve brand consistency?",
    answer: "ScaleResizer maintains your original assets, colors, and typography while adapting layout to each format's safe areas and aspect ratios. No content is regenerated or restyled.",
  },
  {
    question: "Does it work with auto-layout frames?",
    answer: "Yes. ScaleResizer captures auto-layout snapshots before scaling and intelligently restores layout settings post-transformation, handling nested layouts and constraints.",
  },
  {
    question: "Can I customize which formats to generate?",
    answer: "Yes. Select individual targets or batch-generate all 6 formats in a single run. Each format can be configured with custom safe-area presets (Tight, Balanced, Roomy).",
  },
  {
    question: "How are variants organized?",
    answer: "All variants are grouped in timestamped run containers on a dedicated staging page called \"ScaleResizer Variants\" for easy review and export.",
  },
  {
    question: "What are safe areas?",
    answer: "Format-specific content boundaries that prevent overlap with platform UI. For example, YouTube has mobile safe zones, TikTok has UI exclusion areas for comments and buttons.",
  },
];

export const PAGE_FAQS_BY_ROUTE: Record<string, FAQEntry[]> = {
  "/figma-design-system-audit-plugin": componentQAFaqs,
  "/figma-component-variant-renamer": renameVariantsFaqs,
  "/ai-rename-variants": renameVariantsFaqs,
  "/figma-plugin-remove-prototype-links": biblioCleanFaqs,
  "/figma-table-builder": fixTableFaqs,
  "/figma-organize-design-files-plugin": organizeFileFaqs,
  "/figma-component-states": stateBuilderFaqs,
  "/figma-marketing-resizer-plugin": scaleResizerFaqs,
};
