import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getManageButtonA11y } from '@/components/ContentEditor/__testables__/accessibilityContracts';

describe('ProductsManager accessibility contract', () => {
  it('provides aria attributes for manage toggle', () => {
    const config = getManageButtonA11y('product-1', true);
    assert.equal(config['aria-haspopup'], 'true');
    assert.equal(config['aria-expanded'], true);
    assert.equal(config['aria-controls'], 'product-actions-product-1');
  });

  it('updates aria-expanded flag when menu closed', () => {
    const config = getManageButtonA11y('product-1', false);
    assert.equal(config['aria-expanded'], false);
  });
});
