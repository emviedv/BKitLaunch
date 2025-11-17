import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildUnifiedContentFromDatabase } from '@/components/ContentEditor/__testables__/contentPersistence';

const headerSection = {
  section_type: 'header',
  section_data: {
    logoText: 'BiblioKit',
    navigation: [{ label: 'Home', href: '/' }],
    signInText: 'Sign in',
    signInHref: '/login',
    showSignIn: true,
  },
};

const heroSection = {
  section_type: 'hero',
  section_data: {
    title: 'Welcome',
    subtitle: 'Start here',
    description: 'All the things.',
    primary_button: 'Start',
    secondary_button: 'Learn',
  },
};

describe('buildUnifiedContentFromDatabase contract', () => {
  it('creates stable unified site content snapshot', () => {
    const unified = buildUnifiedContentFromDatabase(
      [headerSection as any, heroSection as any],
      { email: 'support@example.com' },
      null,
    );
    assert.equal(unified.header.logoText, 'BiblioKit');
    assert.deepEqual(unified.header.navigation, [{ label: 'Home', href: '/' }]);
    assert.equal(unified.hero.title, 'Welcome');
    assert.equal(unified.contact.email, 'support@example.com');
  });

  it('preserves ordering and handles missing optional fields gracefully', () => {
    const unified = buildUnifiedContentFromDatabase(
      [{ section_type: 'footer', section_data: { sections: [] } } as any],
      null,
      { header: { navigation: [] }, settings: { visibility: {} } },
    );
    assert.ok(unified.footer);
    assert.deepEqual(unified.footer.sections, []);
    assert.deepEqual(unified.header.navigation, []);
  });
});
