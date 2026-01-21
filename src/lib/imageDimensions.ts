export type ImageDimensions = {
  width: number;
  height: number;
};

const IMAGE_DIMENSIONS: Record<string, ImageDimensions> = {
  '/blog/auto-layout-wrap/auto-layout-wrap-hero.png': { width: 1024, height: 1024 },
  '/blog/best-figma-plugins-organize-design-files-2026/hero.png': { width: 1024, height: 1024 },
  '/blog/complete-guide-design-systems-figma-2026/hero-design-systems-figma-2026.png': {
    width: 1024,
    height: 1024,
  },
  '/blog/design-dev-gap-2026/code-connect-dev-mode.png': { width: 1584, height: 1368 },
  '/blog/design-dev-gap-2026/design-system-workshop.png': { width: 1408, height: 768 },
  '/blog/design-dev-gap-2026/headless-component-slots.png': { width: 1408, height: 768 },
  '/blog/design-dev-gap-2026/hero-component-library.png': { width: 1024, height: 1024 },
  '/blog/design-dev-gap-2026/system-health-audit-warnings.png': { width: 1408, height: 1458 },
  '/blog/design-dev-gap-2026/variables-token-flow.png': { width: 1920, height: 1080 },
  '/blog/design-system-guidelines/hero-1.jpg': { width: 1408, height: 768 },
  '/blog/design-system-guidelines/hero-2.jpg': { width: 1408, height: 768 },
  '/blog/detached-instances/image-audit-panel-5_52.jpeg': { width: 816, height: 1312 },
  '/blog/detached-instances/image-buttons-crossed-8_23.jpeg': { width: 1408, height: 768 },
  '/blog/detached-instances/image-detach-menu-5_40.jpeg': { width: 1408, height: 768 },
  '/blog/detached-instances/image-hero-8_23-2.jpeg': { width: 1408, height: 768 },
  '/blog/detached-instances/image-side-by-side-8_23-1.jpeg': { width: 1408, height: 768 },
  '/blog/effortless-table-design-figma/table-cell-component-active.png': { width: 1408, height: 768 },
  '/blog/effortless-table-design-figma/table-component-grid.png': { width: 1408, height: 768 },
  '/blog/effortless-table-design-figma/table-row-component.png': { width: 1408, height: 768 },
  '/blog/effortless-table-design-figma/table-status-hero.png': { width: 1408, height: 768 },
  '/blog/effortless-table-design/bibliotable-auto-layout-fixer.png': { width: 2048, height: 1297 },
  '/blog/effortless-table-design/effortless-table-design-hero.png': { width: 1024, height: 1024 },
  '/blog/figma-workflow-automation-tools/figma-workflow-automation-hero.png': { width: 1408, height: 768 },
  '/blog/install-uninstall-figma-plugin/hero.jpg': { width: 1400, height: 933 },
  '/blog/install-uninstall-figma-plugin/designer-workspace.jpg': { width: 1200, height: 800 },
  '/blog/install-uninstall-figma-plugin/dual-monitors.jpg': { width: 1200, height: 800 },
  '/blog/install-uninstall-figma-plugin/figma-community.jpg': { width: 1200, height: 1500 },
  '/blog/what-is-design-ops-complete-guide/design-ops-pillars.png': { width: 1536, height: 1024 },
  '/blog/remove-prototype-links/creative-design-process.jpg': { width: 1080, height: 756 },
  '/blog/remove-prototype-links/design-project-plan.png': { width: 1024, height: 1024 },
  '/blog/remove-prototype-links/figma-design-interface.png': { width: 1024, height: 1024 },
  '/blog/remove-prototype-links/figma-plugins-interface.jpg': { width: 1080, height: 720 },
  '/blog/remove-prototype-links/hero-abstract.svg': { width: 1280, height: 484 },
  '/blog/ui-component-states/dashboard-dark.png': { width: 1024, height: 1024 },
  '/blog/ui-component-states/desk-ui-library.jpg': { width: 1638, height: 2048 },
  '/blog/ui-component-states/hero-watercolor.png': { width: 1024, height: 1024 },
  '/blog/ultimate-figma-plugin-stack/bibliostates-plugin.png': { width: 1908, height: 1516 },
  '/blog/ultimate-figma-plugin-stack/clean-document-plugin.png': { width: 1920, height: 1080 },
  '/blog/ultimate-figma-plugin-stack/content-reel-plugin.png': { width: 1280, height: 720 },
  '/blog/ultimate-figma-plugin-stack/eighthshapes-specs.png': { width: 1200, height: 611 },
  '/blog/ultimate-figma-plugin-stack/hero-figma-plugin-stack.png': { width: 1024, height: 1024 },
  '/blog/ultimate-figma-plugin-stack/rename-it-plugin.png': { width: 2048, height: 1024 },
  '/blog/ultimate-figma-plugin-stack/similayer-plugin.png': { width: 1228, height: 614 },
  '/blog/ultimate-figma-plugin-stack/stark-plugin.png': { width: 1920, height: 960 },
  '/blog/ultimate-figma-plugin-stack/unsplash-plugin.png': { width: 1200, height: 800 },
  '/media/component-qa-leak.png': { width: 800, height: 1182 },
  '/media/ComponentQA.png': { width: 1920, height: 1080 },
  '/media/BiblioClean.png': { width: 1920, height: 1080 },
  '/media/RenameVariantsAI.png': { width: 1920, height: 1080 },
  '/media/BiblioStart.png': { width: 1920, height: 1080 },
  '/media/StateBuilder.png': { width: 1908, height: 1516 },
  '/media/FixTable.png': { width: 1920, height: 1080 },
  '/media/OrganizeFile.png': { width: 1920, height: 1080 },
  '/media/biblio-rename/variant-chaos-example.png': { width: 1476, height: 1428 },
  '/media/table-fixer-figma.png': { width: 1920, height: 1080 },
  '/media/uxbiblio-cover.png': { width: 1279, height: 800 },
};

export const getImageDimensions = (src?: string | null): ImageDimensions | null => {
  if (!src) {
    return null;
  }

  if (IMAGE_DIMENSIONS[src]) {
    return IMAGE_DIMENSIONS[src];
  }

  if (src.startsWith('http')) {
    try {
      const url = new URL(src);
      return IMAGE_DIMENSIONS[url.pathname] ?? null;
    } catch {
      return null;
    }
  }

  return null;
};
