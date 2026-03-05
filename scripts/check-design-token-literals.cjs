#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

const sharedTargetFiles = [
  'src/components/ui/button.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/badge.tsx',
  'src/lib/renderTextWithLinks.tsx',
  'src/components/design-system/data/forms.tsx',
  'src/components/design-system/data/modals.tsx',
];

const componentRoot = path.join(projectRoot, 'src/components');
const componentExcludePrefixes = [
  'src/components/ui/',
  'src/components/design-system/',
  'src/components/decor/',
];
const componentExcludeFiles = new Set([
  'src/components/AdminPage.tsx',
  'src/components/DevTools.tsx',
  'src/components/OrigamiIllustration.tsx',
  'src/components/AIRenameProgressPreview.tsx',
  'src/components/AIRenameVariantsHeroAnimation.tsx',
  'src/components/BlocksHeroBackground.tsx',
  'src/components/ClientsMarquee.tsx',
]);

const toRelativePath = (absolutePath) => path.relative(projectRoot, absolutePath).split(path.sep).join('/');

const listComponentFiles = (directoryPath) => {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listComponentFiles(entryPath));
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) {
      continue;
    }
    files.push(entryPath);
  }

  return files;
};

const productMarketingFiles = listComponentFiles(componentRoot)
  .map(toRelativePath)
  .filter((relativePath) => !componentExcludePrefixes.some((prefix) => relativePath.startsWith(prefix)))
  .filter((relativePath) => !componentExcludeFiles.has(relativePath));

const targetFiles = Array.from(new Set([...sharedTargetFiles, ...productMarketingFiles])).sort();

const hexRegex = /#[0-9A-Fa-f]{3,8}/g;
const allowedLinePatterns = [
  /value\s*=\s*"#[0-9A-Fa-f]{3,8}"/,
];

let hasViolation = false;

for (const relativePath of targetFiles) {
  const absolutePath = path.join(projectRoot, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    const hexMatches = line.match(hexRegex);
    if (!hexMatches) {
      return;
    }

    const isAllowed = allowedLinePatterns.some((pattern) => pattern.test(line));
    if (isAllowed) {
      return;
    }

    hasViolation = true;
    console.error(
      `[token-lint] ${relativePath}:${index + 1} contains hardcoded color literal(s): ${hexMatches.join(', ')}`
    );
  });
}

if (hasViolation) {
  console.error('\n[token-lint] Use design tokens or semantic Tailwind classes instead of hardcoded hex values.');
  process.exit(1);
}

console.log(
  `[token-lint] Passed: no forbidden hex color literals in ${targetFiles.length} shared + product/marketing files.`
);
