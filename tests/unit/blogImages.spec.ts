import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';

const publicDir = path.join(process.cwd(), 'public');

test('blog hero images exist locally with descriptive alt text', async () => {
  const { BLOG_POSTS } = await import('../../src/data/blogPosts.ts');

  BLOG_POSTS.forEach((post) => {
    assert.ok(post.heroImage, `Blog post ${post.slug} should define a hero image`);
    assert.ok(
      post.heroImageAlt && post.heroImageAlt.trim().length > 0,
      `Blog post ${post.slug} should define hero image alt text`
    );

    if (post.heroImage.startsWith('/')) {
      const heroPath = path.join(publicDir, post.heroImage.replace(/^\//, ''));
      assert.ok(
        fs.existsSync(heroPath),
        `Hero image file should exist for ${post.slug} at ${heroPath}`
      );
    }
  });
});

test('blog content images are local assets with non-empty alt text', async () => {
  const { BLOG_POSTS } = await import('../../src/data/blogPosts.ts');

  BLOG_POSTS.forEach((post) => {
    const imageBlocks = post.content?.filter((block) => block.type === 'image') ?? [];

    imageBlocks.forEach((block, index) => {
      const label = `${post.slug} image[${index}]`;
      assert.ok(block.alt && block.alt.trim().length > 0, `${label} should include alt text`);
      assert.equal(
        block.src.startsWith('http'),
        false,
        `${label} should use a local /blog asset instead of external URL (${block.src})`
      );

      const imagePath = path.join(publicDir, block.src.replace(/^\//, ''));
      assert.ok(fs.existsSync(imagePath), `${label} should exist on disk at ${imagePath}`);
    });
  });
});
