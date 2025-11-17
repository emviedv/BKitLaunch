import { test } from 'node:test';
import assert from 'node:assert/strict';

test('resolveClientLogoSource returns inline token when logo matches registry', async () => {
  const { resolveClientLogoSource } = await import('../../src/components/clientsLogoResolver.ts');
  const result = resolveClientLogoSource({ name: 'Linear', logo: 'linear' });
  assert.equal(result.type, 'inline', 'expected inline token');
  assert.equal(result.token, 'linear');
});

test('resolveClientLogoSource flags remote URLs as images', async () => {
  const { resolveClientLogoSource } = await import('../../src/components/clientsLogoResolver.ts');
  const result = resolveClientLogoSource({ name: 'Acme Corp', logo: 'https://cdn.example.com/acme.svg' });
  assert.equal(result.type, 'image');
  assert.equal(result.src, 'https://cdn.example.com/acme.svg');
});

test('resolveClientLogoSource falls back to text when no logo provided', async () => {
  const { resolveClientLogoSource } = await import('../../src/components/clientsLogoResolver.ts');
  const result = resolveClientLogoSource({ name: 'NoLogo Inc.' });
  assert.equal(result.type, 'text');
  assert.equal(result.label, 'NoLogo Inc.');
});

test('resolveClientLogoSource matches inline token from extended name', async () => {
  const { resolveClientLogoSource } = await import('../../src/components/clientsLogoResolver.ts');
  const result = resolveClientLogoSource({ name: 'Superhuman (Product)' });
  assert.equal(result.type, 'inline');
  assert.equal(result.token, 'superhuman');
});
