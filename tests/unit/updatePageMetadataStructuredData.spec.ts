import { test } from 'node:test';
import assert from 'node:assert/strict';

class StubElement {
  tagName: string;
  attributes: Record<string, string> = {};
  children: StubElement[] = [];
  content = '';
  textContent = '';
  constructor(tagName: string) {
    this.tagName = tagName;
  }
  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
  }
  appendChild(child: StubElement) {
    this.children.push(child);
  }
  remove() {
    // no-op for stub
  }
}

class StubHead {
  children: StubElement[] = [];
  appendChild(child: StubElement) {
    this.children.push(child);
  }
}

class StubDocument {
  head = new StubHead();
  createElement(tagName: string) {
    return new StubElement(tagName);
  }
  querySelector() {
    return null;
  }
}

test('updatePageMetadata injects structured data JSON-LD when provided', async () => {
  const { updatePageMetadata } = await import('../../src/lib/seo.ts');

  const stubDocument = new StubDocument() as any;
  (global as any).document = stubDocument;

  updatePageMetadata({
    title: 'Test Page',
    description: 'Test Description',
    ogType: 'article',
    canonical: 'https://www.bibliokit.com/blog/test',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': 'https://www.bibliokit.com/blog/test#article',
        headline: 'Test Page'
      }
    ]
  } as any);

  const scripts = stubDocument.head.children.filter((child) => child.tagName === 'script');
  assert.ok(scripts.length > 0, 'structured data script should be injected');
  const ldScript = scripts.find((s) => s.attributes.type === 'application/ld+json');
  assert.ok(ldScript, 'structured data script should have proper type');
  assert.match(ldScript!.textContent, /"Article"/, 'structured data should serialize payload');
});
