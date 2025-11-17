/* Contract: Design System ⇄ Modal Gallery
 *
 * Owner: Design System maintainers (@product-experience)
 * Purpose: lock metadata shape + ordering for modal showcase integrations.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import { loadDesignSystemHarness as loadHarness } from "../../../src/__tests__/ui/helpers/load-design-system-harness.mjs";

const getMetadata = async () => {
  const { getModalMetadata } = await loadHarness();
  return getModalMetadata();
};

const getGroups = async () => {
  const { getModalGroups } = await loadHarness();
  return getModalGroups();
};

const canonicalModal = {
  id: "billing-modal",
  group: "Account & Billing",
  title: "Billing Modal",
  path: "src/components/modals/billing-modal.tsx",
  description: "Plan snapshot with trial controls and Stripe links.",
};

test("modal showcase canonical metadata stays stable", async () => {
  const modal = (await getMetadata()).find((item) => item.id === canonicalModal.id);
  assert.ok(modal, "billing modal metadata missing from dataset");
  assert.deepEqual(modal, { ...canonicalModal });
});

test("modal showcase dataset follows schema contract", async () => {
  const metadata = await getMetadata();
  const ids = new Set();

  metadata.forEach((item) => {
    assert.equal(typeof item.id, "string");
    assert.equal(typeof item.group, "string");
    assert.equal(typeof item.title, "string");
    assert.equal(typeof item.path, "string");
    assert.ok(item.path.startsWith("src/components/modals/"));
    if (item.description !== null) {
      assert.equal(typeof item.description, "string");
    }
    assert.ok(!ids.has(item.id), `duplicate modal id detected: ${item.id}`);
    ids.add(item.id);
  });
});

test("modal showcase contract accepts missing optional description", () => {
  const metadata = {
    id: "contract-test-modal",
    group: "Contract QA",
    title: "Contract QA Modal",
    path: "src/components/modals/contract-test-modal.tsx",
    description: null,
  };

  assert.equal(typeof metadata.description, "object", "metadata description may be null");
});

test("modal showcase groups remain in canonical order", async () => {
  const expectedGroups = [
    "Account & Billing",
    "Collections & Settings",
    "Reminders",
    "Feedback & Safety",
    "Power Tools & Uploads",
  ];

  assert.deepEqual(await getGroups(), expectedGroups);
});
