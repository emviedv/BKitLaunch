import { test } from 'node:test';
import assert from 'node:assert/strict';

class StubElement {
  tagName: string;
  attributes: Record<string, string> = {};
  children: StubElement[] = [];
  parent: { children: StubElement[] } | null = null;
  content = '';
  textContent = '';
  href = '';
  removed = false;

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
  }

  getAttribute(name: string) {
    return this.attributes[name];
  }

  appendChild(child: StubElement) {
    child.parent = this;
    this.children.push(child);
  }

  remove() {
    this.removed = true;
    if (this.parent) {
      this.parent.children = this.parent.children.filter((c) => c !== this);
    }
  }
}

class StubHead {
  children: StubElement[] = [];
  appendChild(child: StubElement) {
    child.parent = this;
    this.children.push(child);
  }
}

class StubDocument {
  head = new StubHead();
  title = '';

  createElement(tagName: string) {
    return new StubElement(tagName);
  }

  querySelector(selector: string) {
    if (selector.startsWith('meta[')) {
      const [, attr, value] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
      if (!attr || !value) return null;
      return (
        this.head.children.find((child) => {
          const byAttr = child.attributes?.[attr] === value;
          const byProp = (child as any)?.[attr] === value;
          return child.tagName === 'meta' && (byAttr || byProp);
        }) || null
      );
    }

    if (selector === 'link[rel="canonical"]') {
      return (
        this.head.children.find((child) => {
          const byAttr = child.attributes?.rel === 'canonical';
          const byProp = (child as any)?.rel === 'canonical';
          return child.tagName === 'link' && (byAttr || byProp);
        }) || null
      );
    }

    return null;
  }

  querySelectorAll(selector: string) {
    if (selector === 'script[type="application/ld+json"]') {
      return this.head.children.filter(
        (child) => child.tagName === 'script' && child.attributes?.type === 'application/ld+json'
      );
    }
    return [];
  }
}

test('applyClientMetadata refreshes canonical and title for /blog with current host', async () => {
  const { applyClientMetadata } = await import('../../src/hooks/useSEO.ts');

  const stubDocument = new StubDocument() as any;
  const historyCalls: Array<{ title: string; description: string }> = [];
  const stubWindow = {
    location: { protocol: 'https:', host: 'preview.bibliokit.test' },
    history: {
      replaceState: (_state: any, _title: string, _url: string) => {
        historyCalls.push(_state?.seo || {});
      },
    },
  } as any;

  (global as any).document = stubDocument;
  (global as any).window = stubWindow;

  const metadata = applyClientMetadata('/blog');

  const canonical = stubDocument.head.children.find(
    (child: any) =>
      child.tagName === 'link' &&
      (child.attributes.rel === 'canonical' || child.rel === 'canonical')
  );
  assert.ok(canonical, 'canonical link should be created');
  assert.equal(
    canonical!.href || canonical!.attributes.href,
    'https://preview.bibliokit.test/blog'
  );
  assert.equal(stubDocument.title, metadata.title);
  assert.ok(historyCalls.some((entry) => entry.title === metadata.title), 'history should store SEO state');
});

test('applyClientMetadata swaps JSON-LD scripts on route change', async () => {
  const { applyClientMetadata } = await import('../../src/hooks/useSEO.ts');

  const stubDocument = new StubDocument() as any;
  const stubWindow = {
    location: { protocol: 'https:', host: 'preview.bibliokit.test' },
    history: { replaceState: () => {} },
  } as any;

  const ssrScript = new StubElement('script');
  ssrScript.setAttribute('type', 'application/ld+json');
  ssrScript.textContent = '{"@context":"https://schema.org","@type":"WebPage"}';
  stubDocument.head.appendChild(ssrScript);

  (global as any).document = stubDocument;
  (global as any).window = stubWindow;

  applyClientMetadata('/blog', undefined, { updateHistory: false });
  let scripts = stubDocument.head.children.filter(
    (child: any) => child.tagName === 'script' && child.attributes.type === 'application/ld+json'
  );
  assert.ok(scripts.length > 0, 'blog navigation should inject JSON-LD');
  assert.ok(scripts.every((script: any) => script.attributes['data-structured-data'] === 'true'));

  applyClientMetadata('/resources/remove-prototype-link', undefined, { updateHistory: false });
  scripts = stubDocument.head.children.filter(
    (child: any) => child.tagName === 'script' && child.attributes.type === 'application/ld+json'
  );
  assert.ok(scripts.length > 0, 'resource route should inject JSON-LD');
  assert.ok(scripts.every((script: any) => script.attributes['data-structured-data'] === 'true'));
  assert.ok(
    scripts.some((script: any) =>
      (script.textContent || '').includes('/resources/remove-prototype-link')
    ),
    'structured data should reflect the current route'
  );
});
