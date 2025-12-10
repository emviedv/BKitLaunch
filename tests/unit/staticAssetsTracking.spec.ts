import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

import productData from '../../src/data/products.json' with { type: 'json' };
import { CLIENT_LOGO_ASSET_MAP } from '../../src/components/clientsLogoAssets.ts';

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, 'public');

const toPosix = (value: string) => value.replace(/\\/g, '/');

const assertPublishableAsset = (assetPath: string, label: string) => {
  const normalized = assetPath.replace(/^\//, '');
  const diskPath = path.join(publicDir, normalized);
  assert.ok(fs.existsSync(diskPath), `${label} should exist at public/${normalized}`);

  const gitPath = `public/${toPosix(normalized)}`;
  try {
    execSync(`git check-ignore -q "${gitPath}"`, { stdio: 'ignore' });
    assert.fail(`${label} should not be ignored by git at ${gitPath}`);
  } catch (error: any) {
    // git check-ignore exits with code 1 when the path is NOT ignored, which is the expected state.
    if (error?.status && error.status !== 1) {
      throw error;
    }
  }
};

test('public assets referenced in content are present and tracked', async () => {
  const { BLOG_POSTS } = await import('../../src/data/blogPosts.ts');
  const collected = new Set<string>();

  BLOG_POSTS.forEach((post) => {
    if (post.heroImage?.startsWith('/')) {
      collected.add(post.heroImage);
    }
    (post.content ?? []).forEach((block) => {
      if (block.type === 'image' && typeof block.src === 'string' && block.src.startsWith('/')) {
        collected.add(block.src);
      }
    });
  });

  const features = Array.isArray((productData as any).features) ? (productData as any).features : [];
  features.forEach((feature: any) => {
    const src = feature?.media?.src;
    if (typeof src === 'string' && src.startsWith('/')) {
      collected.add(src);
    }
  });

  Object.values(CLIENT_LOGO_ASSET_MAP).forEach((src) => {
    if (src.startsWith('/')) {
      collected.add(src);
    }
  });

  assert.ok(collected.size > 0, 'Should collect at least one public asset path');

  Array.from(collected).forEach((assetPath) => {
    assertPublishableAsset(assetPath, `Asset ${assetPath}`);
  });
});

test('gitignore does not exclude public assets', () => {
  const gitignorePath = path.join(repoRoot, '.gitignore');
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const hasPublicRule = gitignoreContent
    .split(/\r?\n/)
    .some((line) => line.trim() === 'public');

  assert.equal(hasPublicRule, false, 'gitignore should not ignore the public directory');
});
